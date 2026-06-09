"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BrainCircuit, FileSpreadsheet, LineChart, ShieldCheck, Sparkles, Zap, Lock, Server, Globe } from 'lucide-react'

const features = [
  {
    title: "Instant Data Cleaning",
    description: "Automatically detects and handles missing values, outliers, and duplicates in seconds.",
    icon: <Sparkles className="w-6 h-6 text-primary" />,
  },
  {
    title: "Automated EDA",
    description: "Generates correlation heatmaps, distributions, and scatterplots without writing a single line of code.",
    icon: <LineChart className="w-6 h-6 text-violet-500" />,
  },
  {
    title: "AI Model Recommendations",
    description: "Our engine suggests the best machine learning models for your dataset — Regression or Classification, ranked by fit score.",
    icon: <BrainCircuit className="w-6 h-6 text-blue-500" />,
  },
  {
    title: "Natural Language Insights",
    description: "Complex statistical findings translated into simple, beginner-friendly explanations powered by Gemini.",
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
  },
  {
    title: "CSV & Excel Support",
    description: "Drag and drop your raw .csv or .xlsx files up to 10MB to instantly begin the analysis process.",
    icon: <FileSpreadsheet className="w-6 h-6 text-green-500" />,
  },
  {
    title: "Enterprise-Grade Security",
    description: "Your datasets are processed securely and deleted automatically after analysis. Never stored without your consent.",
    icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
  },
]

const trustPoints = [
  {
    icon: <Lock className="w-5 h-5 text-primary" />,
    title: "Encrypted in Transit",
    desc: "TLS 1.3 on every request. Your data never travels unprotected.",
  },
  {
    icon: <Server className="w-5 h-5 text-violet-400" />,
    title: "Processed in Memory",
    desc: "Datasets are analyzed in-session and auto-deleted after your report is generated.",
  },
  {
    icon: <Globe className="w-5 h-5 text-blue-400" />,
    title: "GDPR Compliant",
    desc: "You own your data. Delete it any time with one click, no questions asked.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-32 bg-background relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 -translate-y-1/4 -translate-x-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Everything you need for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">
              intelligent data analysis.
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            DataSense AI replaces complex Jupyter Notebooks and Pandas scripts with a beautiful, automated dashboard.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="bg-card/30 backdrop-blur-lg border-white/5 hover:border-primary/50 hover:bg-card/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-background/50 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust & Privacy Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/5 bg-card/20 backdrop-blur-md p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-400 mb-4">
              <ShieldCheck className="w-4 h-4" />
              Your data is always safe
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Privacy you can actually trust</h3>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              We built DataSense AI with a strict &quot;data minimization&quot; approach. Here&apos;s exactly what happens to your files:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustPoints.map((point, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-5 rounded-xl bg-background/30 border border-white/5">
                <div className="flex items-center gap-2.5">
                  {point.icon}
                  <span className="font-semibold text-sm">{point.title}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
