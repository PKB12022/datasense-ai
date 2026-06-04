import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { AuthNav } from './AuthNav'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-violet-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <Link href="/" className="font-semibold text-xl tracking-tight text-foreground">
            DataSense AI
          </Link>
        </div>
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
              <Link href="/login" className="text-sm font-medium hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
