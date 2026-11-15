import { Link, NavLink } from 'react-router-dom'
import { Button } from '../ui/Button'
import { AccessibilityBar } from './AccessibilityBar'
import { LogoMark } from './Logo'

interface NavItem {
  to: string
  label: string
  /** tautan ke bagian di beranda (bukan halaman) */
  anchor?: boolean
}

const nav: NavItem[] = [
  { to: '/#tanda', label: 'Kenali tanda', anchor: true },
  { to: '/#langkah', label: 'Langkah setelah skrining', anchor: true },
  { to: '/#mitos', label: 'Mitos dan fakta', anchor: true },
  { to: '/ai', label: 'Eksperimen AI' },
  { to: '/chat', label: 'Tanya AI' },
  { to: '/direktori', label: 'Direktori layanan' },
]

const linkBase = 'inline-flex min-h-touch items-center text-[0.9375rem] font-medium text-ink no-underline hover:text-primary'

export function Header() {
  return (
    <header className="print:hidden">
      <AccessibilityBar />
      <div className="border-b border-line-soft">
        <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-x-4 gap-y-2 px-gutter py-3">
          <Link to="/" className="inline-flex min-h-touch items-center gap-2.5 text-primary no-underline">
            <LogoMark />
            <span className="font-display text-[1.625rem] font-semibold tracking-[-0.01em]">AutismeID</span>
          </Link>
          <nav aria-label="Navigasi utama" className="flex flex-wrap gap-x-3.5">
            {nav.map((item) =>
              item.anchor ? (
                <Link key={item.to} to={item.to} className={linkBase}>
                  {item.label}
                </Link>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? 'font-semibold underline decoration-accent decoration-2 underline-offset-8' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>
          <Button to="/skrining" size="sm">
            Mulai skrining
          </Button>
        </div>
      </div>
    </header>
  )
}
