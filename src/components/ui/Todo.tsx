import type { ReactNode } from 'react'

/**
 * Penanda isian yang masih harus diisi dengan data nyata.
 * Cari semua dengan: grep -rn "<Todo" src
 */
export default function Todo({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-notice-bg px-1 text-ink-2 underline decoration-dotted decoration-line-dashed underline-offset-4">
      [{children}]
    </span>
  )
}
