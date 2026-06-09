import Link from "next/link"

function LogoMark({ size = 24 }: { size?: number }) {
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
        <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#footerLogoGrad)" />
      <rect x="7" y="18" width="4" height="7" rx="1" fill="white" fillOpacity="0.9" />
      <rect x="14" y="12" width="4" height="13" rx="1" fill="white" />
      <rect x="21" y="7" width="4" height="18" rx="1" fill="white" fillOpacity="0.75" />
      <circle cx="24" cy="6" r="2" fill="#fbbf24" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="DataSense AI Home">
              <LogoMark size={24} />
              <span className="font-semibold text-lg tracking-tight">DataSense AI</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Turn raw data into intelligent insights instantly. The premier AI data analysis platform for modern teams.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><a href="mailto:customercare_datasense@gmail.com" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DataSense AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built with ❤️ · GDPR Compliant · TLS 1.3 Encrypted
          </p>
        </div>
      </div>
    </footer>
  )
}
