"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Image as ImageIcon, Database, Sparkles, Bell, CheckCircle, Loader2 } from 'lucide-react'

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

export function Roadmap() {
  const [emails, setEmails] = useState<Record<number, string>>({})
  const [states, setStates] = useState<Record<number, SubmitState>>({})
  const [errors, setErrors] = useState<Record<number, string>>({})

  async function handleSubmit(idx: number, featureTitle: string, e: React.FormEvent) {
    e.preventDefault()
    const email = emails[idx]
    if (!email) return

    setStates((s) => ({ ...s, [idx]: 'loading' }))
    setErrors((s) => ({ ...s, [idx]: '' }))

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, feature: featureTitle }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong.')
      }

      setStates((s) => ({ ...s, [idx]: 'success' }))
    } catch (err: any) {
      setStates((s) => ({ ...s, [idx]: 'error' }))
      setErrors((s) => ({ ...s, [idx]: err.message || 'Failed to subscribe. Try again.' }))
    }
  }

  const features = [
    {
      title: "Image & HSI Analysis",
      description:
        "Advanced computer vision capabilities. Upload standard images or Hyperspectral Imaging (HSI) datasets for automated pixel-level analysis and feature extraction.",
      icon: <ImageIcon className="w-6 h-6 text-primary" />,
      eta: "Q3 2025",
      etaColor: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    },
    {
      title: "GB-Scale Uploads",
      description:
        "Breaking the 10MB barrier. Our upcoming distributed processing engine will allow you to drag and drop multi-gigabyte datasets without crashing your browser.",
      icon: <Database className="w-6 h-6 text-violet-400" />,
      eta: "Q4 2025",
      etaColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden bg-black/20">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/40 border border-white/10 text-sm font-medium mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            What&apos;s coming next
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Future Updates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are constantly pushing the boundaries of automated data science. Get notified the moment these ship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => {
            const state = states[idx] ?? 'idle'

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="h-full border-white/10 bg-background/40 backdrop-blur-md hover:bg-background/60 transition-all hover:-translate-y-1 overflow-hidden relative group flex flex-col">
                  <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-4 h-4 text-primary/50" />
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${feature.etaColor} mt-1`}>
                        {feature.eta}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow gap-4">
                    <p className="text-muted-foreground leading-relaxed flex-grow">
                      {feature.description}
                    </p>

                    {/* Waitlist form */}
                    {state === 'success' ? (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm text-primary font-medium"
                      >
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        You&apos;re on the list! Check your inbox for a confirmation.
                      </motion.div>
                    ) : (
                      <form onSubmit={(e) => handleSubmit(idx, feature.title, e)} className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={emails[idx] ?? ''}
                            onChange={(e) => setEmails((prev) => ({ ...prev, [idx]: e.target.value }))}
                            disabled={state === 'loading'}
                            className="flex-1 min-w-0 text-sm px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-colors disabled:opacity-50"
                          />
                          <button
                            type="submit"
                            disabled={state === 'loading'}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {state === 'loading' ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Bell className="w-3.5 h-3.5" />
                            )}
                            {state === 'loading' ? 'Sending…' : 'Notify me'}
                          </button>
                        </div>
                        {state === 'error' && (
                          <p className="text-xs text-rose-400">{errors[idx]}</p>
                        )}
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
