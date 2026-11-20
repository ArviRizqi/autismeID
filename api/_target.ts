/**
 * Menyusun alamat tujuan proxy. Murni (tanpa I/O) supaya bisa diuji.
 * Hanya jalur yang memang dipakai frontend yang diteruskan; selain itu ditolak.
 */

const ALLOWED_PREFIXES = ['predict', 'chat', 'faq', 'health', 'documents', 'admin', 'qa']
const SEGMENT = /^[A-Za-z0-9_-]{1,80}$/

export function buildTarget(backend: string, rawPath: string, search: URLSearchParams): string | null {
  const segments = rawPath.split('/').filter((s) => s !== '')
  if (segments.length === 0 || segments.length > 4) return null
  if (!segments.every((s) => SEGMENT.test(s))) return null
  if (!ALLOWED_PREFIXES.includes(segments[0])) return null

  const forwarded = new URLSearchParams(search)
  forwarded.delete('path')
  const qs = forwarded.toString()
  return `${backend.replace(/\/+$/, '')}/api/${segments.join('/')}${qs ? `?${qs}` : ''}`
}

export function isValidBackend(value: string | undefined): value is string {
  if (!value) return false
  try {
    const u = new URL(value)
    return u.protocol === 'https:' || u.hostname === 'localhost'
  } catch {
    return false
  }
}
