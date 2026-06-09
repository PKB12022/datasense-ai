import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { AuthNav } from './AuthNav'

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
      {/* Bar chart icon */}
      <rect x="7" y="18" width="4" height="7" rx="1" fill="white" fillOpacity="0.9" />
      <rect x="14" y="12" width="4" height="13" rx="1" fill="white" />
      <rect x="21" y="7" width="4" height="18" rx="1" fill="white" fillOpacity="0.75" />
      {/* Sparkle dot */}
      <circle cx="24" cy="6" r="2" fill="#fbbf24" />
    </svg>
  )
}

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="DataSense AI Home">
          <LogoMark size={32} />
          <span className="font-semibold text-xl tracking-tight text-foreground">
            DataSense AI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
          <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <AuthNav user={user} />
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)]">
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
