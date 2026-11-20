/**
 * Klien endpoint admin. Token (ADMIN_TOKEN di server) hanya disimpan di memori halaman dan dikirim lewat header
 * Authorization. JANGAN menaruh token ini di variabel VITE_ atau di kode (akan masuk ke bundel publik).
 */

const API_URL = '' // lewat proxy /api/* di domain situs (lihat api/gateway.ts)

export class AdminError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

export interface AdminDoc {
  id: string
  title: string
  file_type?: string
  created_at?: string
  page_count?: number | null
  token_estimate?: number | null
  status?: string
  error?: string | null
  metadata?: { kind?: string; authors?: string; year?: string }
}

export interface AdminStatus {
  mode: string
  documents_total: number
  documents_ready: number
  documents_need_reupload: number
  tokens: number
  max_tokens: number
  max_docs: number
  new_questions_today: number
  daily_limit: number
  faq_min_hits: number
}

export interface AdminQa {
  id: string
  question: string
  answer: string
  status: string
  hits: number
  sources: number
  grounding?: { verified: number; total: number } | null
  current: boolean
}

async function call<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}` },
    })
  } catch {
    throw new AdminError('Tidak bisa terhubung ke layanan.')
  }
  let body: unknown = null
  try {
    body = await res.json()
  } catch {
    /* tubuh kosong */
  }
  const o = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
  if (!res.ok) {
    if (res.status === 401) throw new AdminError('Token salah.', 401)
    if (res.status === 503) throw new AdminError(String(o.error ?? 'Layanan admin dinonaktifkan di server.'), 503)
    throw new AdminError(String(o.message ?? o.error ?? `Gagal (HTTP ${res.status})`), res.status)
  }
  return body as T
}

export const adminApi = {
  status: (t: string) => call<AdminStatus>(t, '/api/admin/status'),
  documents: async (t: string) => (await call<{ documents: AdminDoc[] }>(t, '/api/documents')).documents,
  upload: (t: string, form: FormData) => call<{ message: string }>(t, '/api/documents/upload', { method: 'POST', body: form }),
  removeDoc: (t: string, id: string) => call<{ message: string }>(t, `/api/documents/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  qa: async (t: string) => (await call<{ items: AdminQa[] }>(t, '/api/qa')).items,
  removeQa: (t: string, id: string) => call<{ message: string }>(t, `/api/qa/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  purgeQa: (t: string) => call<{ message: string }>(t, '/api/qa/purge', { method: 'POST' }),
}
