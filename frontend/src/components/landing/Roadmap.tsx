"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Image as ImageIcon, Database, Sparkles } from 'lucide-react'

export function Roadmap() {
  const features = [
    {
      title: "Image & HSI Analysis",
      description: "Advanced computer vision capabilities. Upload standard images or Hyperspectral Imaging (HSI) datasets for automated pixel-level analysis and feature extraction.",
      icon: <ImageIcon className="w-6 h-6 text-primary" />
    },
    {
      title: "GB-Scale Uploads",
      description: "Breaking the 10MB barrier. Our upcoming distributed processing engine will allow you to drag and drop multi-gigabyte datasets without crashing your browser.",
      icon: <Database className="w-6 h-6 text-violet-400" />
    }
  ]

  return (
    <section className="py-24 relative overflow-hidden bg-black/20">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Future Updates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are constantly pushing the boundaries of automated data science. Sign up today to be the first to access these upcoming features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="h-full border-white/10 bg-background/40 backdrop-blur-md hover:bg-background/60 transition-all hover:-translate-y-1 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-4 h-4 text-primary/50" />
                </div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
