import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: 'surface' | 'tint' | 'dashed'
}

const tones = {
  surface: 'border border-line bg-surface',
  tint: 'bg-tint',
  dashed: 'border-2 border-dashed border-line-dashed',
}

export function Card({ tone = 'surface', className, ...rest }: CardProps) {
  return <div className={cn('rounded-lg p-6', tones[tone], className)} {...rest} />
}
