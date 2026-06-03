"use client"

import { motion } from 'framer-motion'
import { FileUp, Cpu, BarChart4 } from 'lucide-react'

const steps = [
  {
    icon: <FileUp className="w-12 h-12 text-primary" />,
    title: "1. Upload Your Data",
    description: "Drag and drop your raw CSV or Excel file. DataSense instantly detects your variables and structure."
  },
  {
    icon: <Cpu className="w-12 h-12 text-violet-500" />,
    title: "2. AI Engine Analyzes",
    description: "Our Python-powered Insight Engine cleans the data, runs statistical tests, and trains a Random Forest model on the fly."
  },
  {
    icon: <BarChart4 className="w-12 h-12 text-blue-500" />,
    title: "3. Get Executive Dashboard",
    description: "Download a premium, highly-visual PDF dashboard summarizing the data story and business impact."
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-background relative overflow-hidden">
      {/* Subtle background grid or glow can go here */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-32">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            The Process
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your raw data into a premium executive dashboard.
          </p>
        </div>

        <div className="space-y-32">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className={`flex flex-col md:flex-row items-center gap-16 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 w-full">
                <div className="relative w-full aspect-[4/3] md:aspect-video bg-card/30 rounded-3xl border border-white/5 backdrop-blur-md overflow-hidden flex items-center justify-center shadow-2xl">
                  {/* Decorative Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/5 to-violet-500/10 opacity-70" />
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                    viewport={{ once: true }}
                    className="p-8 bg-background/80 backdrop-blur-xl rounded-2xl border border-border shadow-[0_0_50px_-12px_rgba(139,92,246,0.25)] relative z-10"
                  >
                    {step.icon}
                  </motion.div>
                </div>
              </div>
              <div className="flex-1 space-y-6 text-center md:text-left">
                <h3 className="text-3xl font-extrabold tracking-tight">{step.title}</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
