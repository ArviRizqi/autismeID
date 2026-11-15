import type { ReactNode } from 'react'
import type { Tone } from '../../lib/levels'
import { cn } from '../../lib/cn'

const tones: Record<Tone, string> = {
  ok: 'bg-ok-bg text-ok-text',
  warn: 'bg-warn-bg text-warn-text',
  danger: 'bg-danger-bg text-danger-text',
  neutral: 'bg-neutral-bg text-neutral-text',
}

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-block rounded-full px-3 py-0.5 text-caption font-bold', tones[tone], className)}>
      {children}
    </span>
  )
}
