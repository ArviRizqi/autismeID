import { useA11y, type TextSize } from '../../hooks/useA11y'
import { cn } from '../../lib/cn'

const sizes: Array<{ key: TextSize; label: string; aria: string }> = [
  { key: 's', label: 'A', aria: 'Ukuran teks normal' },
  { key: 'm', label: 'A+', aria: 'Ukuran teks sedang' },
  { key: 'l', label: 'A++', aria: 'Ukuran teks besar' },
]

export function AccessibilityBar() {
  const { textSize, setTextSize, calm, toggleCalm } = useA11y()
  return (
    <div className="on-dark bg-primary-deep text-white print:hidden">
      <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-x-6 gap-y-2 px-gutter py-2">
        <p className="text-small">Informasi edukasi untuk orang tua dan keluarga di Indonesia</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex items-center gap-2" role="group" aria-label="Ukuran teks">
            <span className="text-small" aria-hidden="true">
              Ukuran teks
            </span>
            {sizes.map((s) => {
              const active = s.key === textSize
              return (
                <button
                  key={s.key}
                  type="button"
                  aria-label={s.aria}
                  aria-pressed={active}
                  onClick={() => setTextSize(s.key)}
                  className={cn(
                    'min-h-touch min-w-touch rounded-sm border border-white px-2.5 text-small font-semibold',
                    active ? 'bg-white text-primary-deep' : 'bg-transparent text-white',
                  )}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={calm}
            onClick={toggleCalm}
            className="flex min-h-touch items-center gap-2.5 bg-transparent px-1 text-small font-semibold text-white"
          >
            <span>Mode tenang</span>
            <span
              aria-hidden="true"
              className={cn(
                'relative inline-block h-[1.625rem] w-11 rounded-full border-2 border-white',
                calm ? 'bg-white' : 'bg-transparent',
              )}
            >
              <span
                className={cn(
                  'absolute top-1 h-3.5 w-3.5 rounded-full',
                  calm ? 'left-[1.375rem] bg-primary-deep' : 'left-1 bg-white',
                )}
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
