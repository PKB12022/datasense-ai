"use client"

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, File, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { DatasetChat } from './DatasetChat'

interface FileUploadProps {
  usageCount?: number;
  isOwner?: boolean;
  maxUsage?: number;
}

export function FileUpload({ usageCount = 0, isOwner = false, maxUsage = 3 }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const router = useRouter()

  const limitReached = !isOwner && usageCount >= maxUsage

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (limitReached) return;
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setUploadStatus('idle')
      setErrorMessage('')
    }
  }, [limitReached])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: limitReached
  })

  const handleUpload = async () => {
    if (!file || limitReached) return

    setUploadStatus('uploading')
    
    const formData = new FormData()
    formData.append('file', file)

    // Helper: safely parse JSON — returns null if the response is HTML/non-JSON
    async function safeJson(res: Response): Promise<any> {
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        const text = await res.text()
        console.error('Non-JSON response from backend:', res.status, text.slice(0, 200))
        return null
      }
      return res.json()
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

      // Sanity check: catch the common mistake of setting this to the Vercel frontend URL
      if (backendUrl.includes('vercel.app') && !backendUrl.includes('render')) {
        throw new Error(
          'Configuration error: NEXT_PUBLIC_BACKEND_URL appears to be set to your Vercel frontend URL. ' +
          'It should be your Render backend URL (e.g. https://your-app.onrender.com). ' +
          'Please update this in your Vercel environment variables.'
        )
      }

      let response: Response
      try {
        response = await fetch(`${backendUrl}/api/v1/upload/`, {
          method: 'POST',
          body: formData,
        })
      } catch (networkError) {
        throw new Error(
          `Cannot reach the analysis server at ${backendUrl}. ` +
          'Check that your Render backend is running and that NEXT_PUBLIC_BACKEND_URL is set correctly in Vercel.'
        )
      }

      if (!response.ok) {
        const errorData = await safeJson(response)
        throw new Error(
          errorData?.detail ||
          `Upload failed (HTTP ${response.status}). The backend may be starting up — wait 30 seconds and try again.`
        )
      }

      const result = await safeJson(response)
      if (!result?.unique_filename) {
        throw new Error('Upload succeeded but the server returned an unexpected response. Please try again.')
      }

      setUploadStatus('analyzing')

      let analysisResponse: Response
      try {
        analysisResponse = await fetch(`${backendUrl}/api/v1/analysis/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            unique_filename: result.unique_filename,
            original_filename: result.filename
          })
        })
      } catch (networkError) {
        throw new Error('Upload succeeded but the analysis server became unreachable. Please try again.')
      }

      if (!analysisResponse.ok) {
        const errorData = await safeJson(analysisResponse)
        throw new Error(
          errorData?.detail ||
          `Analysis failed (HTTP ${analysisResponse.status}). Please try again or contact support.`
        )
      }

      const analysisResult = await analysisResponse.json()
      const generatedPdfUrl = analysisResult.pdf_url
      setPdfUrl(generatedPdfUrl)
      setAnalysisData(analysisResult.results)
      
      // Update Supabase Usage and Recent Reports
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
          const today = new Date().toISOString().split('T')[0]
          const metadata = user.user_metadata || {}
          
          let newUsage = metadata.usage_count || 0
          if (metadata.last_usage_date !== today) {
              newUsage = 0
          }
          newUsage += 1
          
          const newReport = {
              name: file.name,
              url: generatedPdfUrl,
              date: new Date().toLocaleString()
          }
          
          const recentReports = metadata.recent_reports || []
          const updatedReports = [newReport, ...recentReports]

          await supabase.auth.updateUser({
              data: {
                  usage_count: newUsage,
                  last_usage_date: today,
                  recent_reports: updatedReports
              }
          })
      }
      
      setUploadStatus('success')
      router.refresh() // Refresh page to update dashboard stats
      
    } catch (error: any) {
      console.error('Upload/Analysis error:', error)
      setUploadStatus('error')
      setErrorMessage(error.message || 'An unexpected error occurred.')
    }
  }

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
    setUploadStatus('idle')
  }

  if (uploadStatus === 'success') {
    return (
      <div className="flex flex-col w-full">
        <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
          <CheckCircle2 className="w-16 h-16 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Analysis Complete!</h3>
          <p className="text-muted-foreground mb-6">Your dataset was analyzed and your PDF dashboard is ready.</p>
          <div className="flex gap-4">
            <Button onClick={() => window.open(pdfUrl || '', '_blank')} className="bg-primary hover:bg-primary/90">View PDF Dashboard</Button>
            <Button variant="outline" onClick={() => {
              setUploadStatus('idle')
              setFile(null)
              setAnalysisData(null)
            }}>Analyze Another Dataset</Button>
          </div>
        </div>
        {analysisData && (
          <DatasetChat contextData={analysisData} />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:bg-white/5'}
          ${isDragReject ? 'border-rose-500 bg-rose-500/5' : ''}
          ${(uploadStatus === 'uploading' || uploadStatus === 'analyzing' || limitReached) ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {file ? (
          <div className="flex flex-col items-center z-10 w-full">
            <div className="flex items-center gap-3 bg-background/50 backdrop-blur p-4 rounded-lg border border-white/10 w-full max-w-sm shadow-sm relative">
              <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center shrink-0 border border-primary/30">
                <File className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <button 
                onClick={clearFile}
                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center hover:opacity-90 shadow-md"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-background/50 rounded-full flex items-center justify-center border border-white/5">
              <UploadCloud className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Click or drag dataset here</h3>
            <p className="text-sm text-muted-foreground">CSV or Excel (max 10MB)</p>
          </div>
        )}
      </div>

      {uploadStatus === 'error' && (
        <div className="flex items-center gap-2 text-rose-500 text-sm bg-rose-500/10 border border-rose-500/20 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleUpload} 
          disabled={!file || uploadStatus === 'uploading' || uploadStatus === 'analyzing' || limitReached}
          className="w-full sm:w-auto min-w-[120px] rounded-lg"
        >
          {uploadStatus === 'uploading' ? (
             <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
          ) : uploadStatus === 'analyzing' ? (
             <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
          ) : 'Start Analysis'}
        </Button>
      </div>
    </div>
  )
}
