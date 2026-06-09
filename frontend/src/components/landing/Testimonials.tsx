"use client"

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Priya Nair",
    role: "Data Analyst · Startup Founder",
    avatar: "PN",
    avatarColor: "from-violet-500 to-purple-600",
    quote: "I used to spend 3 hours just cleaning a dataset before I could even start the analysis. DataSense AI does the entire thing in under 30 seconds. It's genuinely magical.",
    stars: 5,
  },
  {
    name: "Marcus Cole",
    role: "MBA Student · University of Chicago",
    avatar: "MC",
    avatarColor: "from-blue-500 to-cyan-500",
    quote: "My professor asked how I built such a detailed EDA report. I told him AI. He was floored. DataSense turns anyone into a data scientist — no Jupyter, no Pandas, no pain.",
    stars: 5,
  },
  {
    name: "Aisha Okoye",
    role: "Product Manager · FinTech",
    avatar: "AO",
    avatarColor: "from-rose-500 to-orange-500",
    quote: "The AI insights are surprisingly readable. I can share the report directly with executives without them needing to understand statistics. That's the real value here.",
    stars: 5,
  },
]

const stats = [
  { value: "500+", label: "Analyses run in beta" },
  { value: "4.9★", label: "Average rating" },
  { value: "0", label: "Lines of code required" },
  { value: "~30s", label: "Avg. report time" },
]

export function Testimonials() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/40 border border-white/10 text-sm font-medium mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Trusted by early beta users
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Analysts love it.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">
              Students swear by it.
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Real feedback from people who replaced hours of scripting with one file upload.
          </p>
        </motion.div>

        {/* Stat Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-6 rounded-2xl border border-white/5 bg-card/20 backdrop-blur-md"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="relative flex flex-col gap-4 p-8 rounded-2xl border border-white/5 bg-card/20 backdrop-blur-md hover:bg-card/40 hover:border-white/10 transition-all duration-300 group"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-primary/30 absolute top-6 right-6 group-hover:text-primary/50 transition-colors" />

              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base text-muted-foreground leading-relaxed flex-grow">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
