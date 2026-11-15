export type ButtonVariant = 'primary' | 'secondary' | 'link'
export type ButtonSize = 'md' | 'sm'

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = ''): string {
  const base =
    'inline-flex items-center justify-center font-semibold no-underline cursor-pointer box-border transition-colors disabled:opacity-45 disabled:cursor-not-allowed'
  const sizes: Record<ButtonSize, string> = {
    md: 'min-h-btn px-7 rounded-btn text-body',
    sm: 'min-h-touch px-4 rounded-[0.625rem] text-small',
  }
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-on-primary border-0 hover:bg-primary-deep hover:text-on-primary',
    secondary: 'bg-transparent text-primary border-2 border-primary hover:bg-ok-bg hover:text-primary',
    link: 'bg-transparent text-primary border-0 px-0 min-h-touch hover:text-primary-deep',
  }
  return [base, sizes[size], variants[variant], extra].filter(Boolean).join(' ')
}
