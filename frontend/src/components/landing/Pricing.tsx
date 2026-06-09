"use client"

import { useState } from 'react'
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles, Play } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { DemoModal } from "./DemoModal"

const features = [
  "Unlimited dataset analyses",
  "Advanced ML model recommendations (Regression & Classification)",
  "Professional PDF report exports",
  "Gemini AI plain-language data insights",
  "Enterprise-grade security & auto-deletion",
  "Priority community support",
  "Interactive AI chat with your dataset",
]

export function Pricing() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <section id="pricing" className="py-32 bg-background relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-70" />

        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Enterprise Intelligence, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">
                Zero Cost.
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              We believe advanced data science should be accessible to everyone. Enjoy full premium access forever.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="relative flex flex-col border-primary/30 shadow-2xl shadow-primary/20 bg-background/40 backdrop-blur-xl overflow-hidden">
                {/* Premium Top Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-violet-500 to-primary" />

                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Sparkles className="w-32 h-32 text-primary" />
                </div>

                <CardHeader className="pt-10 pb-4 text-center">
                  <CardTitle className="text-3xl font-bold tracking-tight">Premium Access</CardTitle>
                  <CardDescription className="text-lg mt-2">Everything you need to analyze data like a pro.</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow px-10">
                  <div className="text-center mb-10">
                    <span className="text-7xl font-extrabold tracking-tighter">$0</span>
                    <span className="text-xl text-muted-foreground font-medium ml-2">/ forever</span>
                  </div>
                  <div className="space-y-4">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 mt-0.5">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-base text-foreground font-medium leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-10 pt-6 flex flex-col gap-3">
                  <Link
                    href="/signup"
                    className={cn(
                      buttonVariants({ size: "lg", variant: "default" }),
                      "w-full text-lg h-14 rounded-xl shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_-15px_rgba(139,92,246,0.5)] transition-all"
                    )}
                  >
                    Start Analyzing Now — Free
                  </Link>
                  <button
                    onClick={() => setDemoOpen(true)}
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Or see a live demo first →
                  </button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
