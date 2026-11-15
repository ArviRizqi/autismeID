import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Gulir ke atas atau ke #bagian saat rute berubah, dan pindahkan fokus ke konten utama. */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
    document.getElementById('konten')?.focus({ preventScroll: true })
  }, [pathname, hash])

  return null
}
