"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BrainCircuit, FileSpreadsheet, LineChart, ShieldCheck, Sparkles, Zap } from 'lucide-react'

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
    description: "Our engine suggests the best machine learning models for your dataset (Regression vs Classification).",
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
    title: "Enterprise Grade Security",
    description: "Your datasets are processed securely and deleted automatically or stored safely based on your preferences.",
    icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
  },
]

export function Features() {
  return (
    <section id="features" className="py-32 bg-background relative overflow-hidden">
      {/* Decorative blurred circle */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </div>
    </section>
  )
}
