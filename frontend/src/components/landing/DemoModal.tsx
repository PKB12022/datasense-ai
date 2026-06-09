"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, CheckCircle, BarChart2, BrainCircuit, ArrowRight, Sparkles, FileSpreadsheet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

interface DemoModalProps {
  open: boolean
  onClose: () => void
}

const steps = ['upload', 'analyzing', 'results'] as const
type Step = typeof steps[number]

const insights = [
  "🔍 Sales revenue is strongly correlated with marketing spend (r = 0.87). Increasing the ad budget by 10% predicts a 7.4% revenue uplift.",
  "⚠️ 4.2% of rows contained missing values in the 'Customer Age' column. These were imputed using the column median (32 years).",
  "📈 A Random Forest Classifier is recommended for your target variable 'Churn'. Expected accuracy: ~91% based on feature distribution.",
]

export function DemoModal({ open, onClose }: DemoModalProps) {
  const [step, setStep] = useState<Step>('upload')
  const [progress, setProgress] = useState(0)
  const [insightIdx, setInsightIdx] = useState(0)

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setStep('upload')
      setProgress(0)
      setInsightIdx(0)
    }
  }, [open])

  // Lock scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function startDemo() {
    setStep('analyzing')
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 12 + 3
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(() => setStep('results'), 400)
      }
      setProgress(Math.min(p, 100))
    }, 180)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-violet-500 to-primary" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors z-10"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              <div className="p-8">
                {/* STEP 1: Upload */}
                {step === 'upload' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight mb-1">See it in action</h3>
                      <p className="text-muted-foreground">Watch DataSense AI analyze a real e-commerce dataset in ~30 seconds.</p>
                    </div>

                    {/* Fake file drop zone */}
                    <div
                      className="relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
                      onClick={startDemo}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <FileSpreadsheet className="w-12 h-12 text-primary/60 mx-auto mb-4 group-hover:text-primary transition-colors" />
                      <div className="font-semibold text-lg mb-1">ecommerce_sales_2024.csv</div>
                      <div className="text-sm text-muted-foreground mb-4">8,432 rows · 14 columns · 2.3 MB</div>
                      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                        <Upload className="w-4 h-4" />
                        Click to Analyze This Dataset
                      </div>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">This is a demo — no real data is uploaded or stored.</p>
                  </motion.div>
                )}

                {/* STEP 2: Analyzing */}
                {step === 'analyzing' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 py-4">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 rounded-full border-2 border-white/10 border-t-primary mx-auto mb-6"
                      />
                      <h3 className="text-xl font-bold mb-2">Analyzing your dataset…</h3>
                      <p className="text-muted-foreground text-sm">Cleaning data · Running EDA · Generating AI insights</p>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Processing</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full"
                          style={{ width: `${progress}%` }}
                          transition={{ ease: 'linear' }}
                        />
                      </div>
                    </div>

                    {/* Scrolling analysis steps */}
                    <div className="space-y-2">
                      {[
                        { label: "Detected 4 numeric + 10 categorical columns", done: progress > 15 },
                        { label: "Imputed 362 missing values (median strategy)", done: progress > 35 },
                        { label: "Generated correlation matrix & visualizations", done: progress > 55 },
                        { label: "Running ML model selection engine…", done: progress > 75 },
                        { label: "Generating Gemini AI narrative insights", done: progress > 90 },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: item.done ? 1 : 0.3, x: 0 }}
                          className="flex items-center gap-3 text-sm"
                        >
                          <CheckCircle className={cn("w-4 h-4 shrink-0", item.done ? "text-primary" : "text-white/10")} />
                          <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Results */}
                {step === 'results' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Report Ready</h3>
                        <p className="text-xs text-muted-foreground">ecommerce_sales_2024.csv · 8,432 rows analyzed in 28s</p>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: "Rows", value: "8,432" },
                        { label: "Columns", value: "14" },
                        { label: "Cleaned", value: "362" },
                        { label: "Insights", value: "11" },
                      ].map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.08 }}
                          className="text-center p-3 rounded-xl bg-card/40 border border-white/5"
                        >
                          <div className="text-xl font-bold text-primary">{s.value}</div>
                          <div className="text-xs text-muted-foreground">{s.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* AI Insight Card */}
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        Gemini AI Insight {insightIdx + 1} of {insights.length}
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={insightIdx}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-sm text-foreground leading-relaxed"
                        >
                          {insights[insightIdx]}
                        </motion.p>
                      </AnimatePresence>
                      <button
                        onClick={() => setInsightIdx((i) => (i + 1) % insights.length)}
                        className="text-xs text-primary/70 hover:text-primary transition-colors underline underline-offset-2"
                      >
                        Next insight →
                      </button>
                    </div>

                    {/* Chart preview placeholder */}
                    <div className="rounded-xl border border-white/5 bg-card/20 p-4">
                      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        <BarChart2 className="w-3.5 h-3.5" />
                        Correlation Heatmap Preview
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 49 }).map((_, i) => {
                          const intensity = Math.random()
                          const r = Math.round(intensity * 139)
                          const g = Math.round(intensity * 92)
                          const b = Math.round(intensity * 246)
                          return (
                            <div
                              key={i}
                              className="aspect-square rounded-sm"
                              style={{ backgroundColor: `rgba(${r},${g},${b},${0.2 + intensity * 0.8})` }}
                            />
                          )
                        })}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/signup"
                        onClick={onClose}
                        className={cn(buttonVariants({ size: "lg" }), "flex-1 gap-2 rounded-xl")}
                      >
                        Analyze Your Own Data
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => { setStep('upload'); setProgress(0); setInsightIdx(0) }}
                        className="flex-1 px-6 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                      >
                        Run demo again
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
