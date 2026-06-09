"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, Upload, Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { DemoModal } from './DemoModal'

export function Hero() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex flex-col justify-center">
        {/* Premium Background gradients */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-70 -z-10" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] opacity-60 -z-10" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay -z-10" />
        
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/40 border border-white/10 text-sm font-medium mb-8 backdrop-blur-md shadow-lg"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            DataSense AI is now in Beta
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]"
          >
            Turn raw data into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-400 to-primary bg-300% animate-gradient">
              intelligent insights instantly.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-medium"
          >
            Upload your CSV or Excel files and let our AI automatically clean, analyze, and generate professional data science reports in seconds. No coding required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full sm:w-auto gap-2 text-lg h-14 px-10 rounded-xl shadow-[0_0_40px_-10px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_-15px_rgba(139,92,246,0.6)] transition-all"
              )}
            >
              <Upload className="w-5 h-5" />
              Start Analyzing Free
            </Link>

            <button
              onClick={() => setDemoOpen(true)}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "w-full sm:w-auto gap-2 text-lg h-14 px-10 rounded-xl border-white/10 bg-background/20 backdrop-blur-md hover:bg-background/40 transition-all"
              )}
            >
              <Play className="w-5 h-5 fill-current" />
              See a Live Demo
            </button>
          </motion.div>

          {/* Trust micro-copy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-5 text-sm text-muted-foreground"
          >
            Free forever · No credit card · Results in ~30 seconds
          </motion.p>

          {/* Dashboard Preview Image/Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-24 relative mx-auto max-w-5xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-violet-600 rounded-2xl blur opacity-30 animate-pulse" />
            <div className="relative rounded-2xl border border-white/10 bg-background/50 backdrop-blur-xl p-3 shadow-2xl">
              <div className="rounded-xl overflow-hidden border border-white/5 bg-card relative aspect-[16/9] shadow-inner">
                <Image 
                  src="/dashboard_preview.png"
                  alt="DataSense AI Dashboard Preview — automated data analysis report"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
