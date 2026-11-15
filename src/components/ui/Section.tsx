import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface SectionProps {
  id?: string
  /** id elemen heading di dalam section, untuk aria-labelledby */
  labelledBy?: string
  tone?: 'plain' | 'tint' | 'surface'
  className?: string
  children: ReactNode
}

const tones = {
  plain: '',
  tint: 'bg-tint',
  surface: 'border-y border-line-soft bg-surface',
}

export function Section({ id, labelledBy, tone = 'plain', className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(tones[tone], 'scroll-mt-4')}>
      <div className={cn('mx-auto max-w-site px-gutter py-section', className)}>{children}</div>
    </section>
  )
}

/** Pembungkus halaman dalam (non-beranda). */
export function Page({ children, width = 'site' }: { children: ReactNode; width?: 'site' | 'narrow' }) {
  return (
    <div className={cn('mx-auto px-gutter pb-20 pt-12', width === 'site' ? 'max-w-site' : 'max-w-[62.5rem]')}>
      {children}
    </div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-caption font-bold uppercase tracking-[0.08em] text-accent">{children}</p>
}

/** Penanda teks yang belum diisi (dipakai di model card). */
export function Val({ children }: { children?: ReactNode }) {
  if (children === undefined || children === null || children === '') {
    return <span className="placeholder-chip">[belum diisi]</span>
  }
  return <>{children}</>
}
