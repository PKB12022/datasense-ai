import { FileUpload } from "@/components/dashboard/FileUpload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Determine usage
  const email = user.email || ""
  const isOwner = email === 'pavanintern2023@gmail.com'
  
  const today = new Date().toISOString().split('T')[0]
  const metadata = user.user_metadata || {}
  
  let usageCount = 0
  if (metadata.last_usage_date === today) {
    usageCount = metadata.usage_count || 0
  }
  
  if (isOwner) {
    usageCount = 0 // Owner has unlimited usage
  }

  const recentReports = metadata.recent_reports || []

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome to DataSense AI</h1>
        <p className="text-muted-foreground text-lg">Upload your dataset to start generating insights instantly.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="h-full border-white/5 bg-card/40 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-4 border-b border-white/5 mb-6">
              <CardTitle className="text-2xl">New Analysis</CardTitle>
              <CardDescription className="text-base">Drag and drop a CSV or Excel file up to 10MB.</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload usageCount={usageCount} isOwner={isOwner} maxUsage={3} />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card className="border-white/5 bg-card/40 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-4 border-b border-white/5 mb-4">
              <CardTitle className="text-xl">Daily Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-medium">Analyses used</span>
                  <span className="font-bold text-foreground">{isOwner ? "0" : usageCount} / 3</span>
                </div>
                <div className="w-full bg-secondary h-3 rounded-full overflow-hidden shadow-inner border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-primary to-violet-500 h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(100, ((isOwner ? 0 : usageCount) / 3) * 100)}%` }}
                  />
                </div>
                {isOwner && (
                  <p className="text-sm text-primary mt-3 flex items-center gap-1 font-semibold bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                    ✨ Unlimited Owner Access
                  </p>
                )}
                {!isOwner && usageCount >= 3 && (
                  <p className="text-sm text-rose-500 mt-3 font-semibold bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                    Daily limit reached. Come back tomorrow!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card/40 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-4 border-b border-white/5 mb-4">
              <CardTitle className="text-xl">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {recentReports.length > 0 ? (
                <div className="space-y-3">
                  {recentReports.slice(0, 5).map((report: any, idx: number) => (
                    <Link key={idx} href={report.url} target="_blank" className="block p-4 rounded-xl bg-background/50 border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all shadow-sm">
                      <p className="text-sm font-semibold truncate text-foreground">{report.name}</p>
                      <p className="text-xs text-muted-foreground mt-1.5">{report.date}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-background/30 rounded-xl border border-white/5 border-dashed">
                    <p className="text-sm text-muted-foreground italic">No reports generated yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
