"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { LogOut, LayoutDashboard } from "lucide-react"

export function AuthNav({ user }: { user: any }) {
  const router = useRouter()
  
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  const name = user.user_metadata?.full_name || "Data Analyst"
  const email = user.email || ""
  const phone = user.user_metadata?.phone || ""
  
  // Extract initials for the avatar
  let initials = "DA"
  if (name && name !== "Data Analyst") {
      const parts = name.split(" ")
      if (parts.length >= 2) {
          initials = (parts[0][0] + parts[1][0]).toUpperCase()
      } else {
          initials = name.substring(0, 2).toUpperCase()
      }
  }

  return (
    <div className="relative group">
      <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-full hover:bg-white/5 transition-colors">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-foreground leading-none">{name}</p>
          <p className="text-xs text-muted-foreground mt-1">{email}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-bold shadow-lg border border-white/20">
          {initials}
        </div>
      </div>
      
      {/* Custom Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-56 bg-background/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right translate-y-2 group-hover:translate-y-0 z-50">
        
        {/* Mobile Info view (visible only on small screens) */}
        <div className="p-4 border-b border-white/10 block sm:hidden">
            <p className="text-sm font-medium text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
            {phone && <p className="text-xs text-muted-foreground">{phone}</p>}
        </div>

        <div className="p-2 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-white/10 rounded-lg transition-colors">
            <LayoutDashboard className="w-4 h-4 text-primary" />
            Go to Dashboard
          </Link>
          <div className="h-px bg-white/10 my-1 mx-2" />
          <button onClick={handleSignOut} className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors text-left">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
