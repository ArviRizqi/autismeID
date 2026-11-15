import type { ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'sm'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  /** Rute dalam aplikasi (render sebagai Link). */
  to?: string
  /** Tautan luar (render sebagai a). */
  href?: string
}

const base =
  'inline-flex items-center justify-center rounded-md font-semibold no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-45'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-deep hover:text-white',
  secondary:
    'border-2 border-primary bg-transparent text-primary hover:bg-ok-bg hover:text-primary-deep',
  ghost: 'min-h-touch px-1 text-primary hover:underline',
}

const sizes: Record<Size, string> = {
  md: 'min-h-[3.25rem] px-7 text-body',
  sm: 'min-h-touch px-4 text-small',
}

export function Button({ variant = 'primary', size = 'md', to, href, className, children, ...rest }: ButtonProps) {
  const cls = cn(base, variants[variant], variant === 'ghost' ? '' : sizes[size], className)
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  )
}
