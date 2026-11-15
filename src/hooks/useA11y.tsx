import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { readStorage, writeStorage } from '../lib/storage'

export type TextSize = 's' | 'm' | 'l'

interface Prefs {
  textSize: TextSize
  calm: boolean
}

interface A11yContextValue extends Prefs {
  setTextSize: (size: TextSize) => void
  toggleCalm: () => void
}

const KEY = 'autismeid:prefs'
const DEFAULTS: Prefs = { textSize: 's', calm: false }

function load(): Prefs {
  const raw = readStorage(KEY)
  if (!raw) return DEFAULTS
  try {
    const parsed = JSON.parse(raw) as Partial<Prefs>
    const textSize: TextSize = parsed.textSize === 'm' || parsed.textSize === 'l' ? parsed.textSize : 's'
    return { textSize, calm: parsed.calm === true }
  } catch {
    return DEFAULTS
  }
}

const A11yContext = createContext<A11yContextValue | null>(null)

export function A11yProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(load)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.calm = String(prefs.calm)
    root.dataset.textSize = prefs.textSize
    writeStorage(KEY, JSON.stringify(prefs))
  }, [prefs])

  const setTextSize = useCallback((textSize: TextSize) => setPrefs((p) => ({ ...p, textSize })), [])
  const toggleCalm = useCallback(() => setPrefs((p) => ({ ...p, calm: !p.calm })), [])

  const value = useMemo(() => ({ ...prefs, setTextSize, toggleCalm }), [prefs, setTextSize, toggleCalm])
  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>
}

export function useA11y(): A11yContextValue {
  const ctx = useContext(A11yContext)
  if (!ctx) throw new Error('useA11y harus dipakai di dalam A11yProvider')
  return ctx
}
