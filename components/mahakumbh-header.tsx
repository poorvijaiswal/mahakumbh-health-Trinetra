"use client"

interface MahakumbhHeaderProps {
  title: string
  subtitle?: string
  showOm?: boolean
  className?: string
}

export default function MahakumbhHeader({ title, subtitle, showOm = true, className = "" }: MahakumbhHeaderProps) {
  return (
    <header className={`text-white ${className} bg-orange-400`}>
      <div className="container mx-auto px-4 py-1 bg-orange-400">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-0.5">
            {showOm && <span className="om-symbol floating-element text-2xl">🕉️</span>}
            <h1 className="text-2xl font-bold text-balance">TRINETRA त्रिनेत्र</h1>
            {showOm && <span className="om-symbol floating-element text-2xl">🕉️</span>}
          </div>

          <div className="bilingual-text">
            <p className="english text-base opacity-90 text-balance">{title}</p>
            {subtitle && <p className="hindi text-sm opacity-80 text-balance">{subtitle}</p>}
          </div>

          <div className="bilingual-text mt-1">
            <p className="english text-sm opacity-80">Mahakumbh Ujjain 2025</p>
          </div>

          {/* Flowing river animation */}
          <div className="relative mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="river-flow absolute inset-0 h-full rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  )
}
