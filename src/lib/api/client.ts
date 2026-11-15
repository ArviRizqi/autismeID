import type {
  ChatAction,
  ChatRequest,
  ChatResponse,
  ChatSource,
  ChatStatus,
  ChatWire,
  ClassifyResponse,
  FaqItem,
  HealthResponse,
  JobWire,
  Level,
  PredictWire,
  RetrievalMatch,
  SourceKind,
} from '../../types/api'
import { mockChat, mockClassify } from './mock'

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

/** true bila VITE_API_URL kosong: jawaban disimulasikan di browser. */
export const isMockApi = API_URL === ''

export type ApiErrorKind = 'network' | 'timeout' | 'http' | 'bad_response'

export class ApiError extends Error {
  kind: ApiErrorKind
  status?: number
  /** Pesan dari server (bahasa Indonesia, aman ditampilkan). Hanya dipakai untuk 429/503 dan kegagalan pekerjaan. */
  serverMessage?: string
  constructor(kind: ApiErrorKind, message: string, status?: number, serverMessage?: string) {
    super(message)
    this.kind = kind
    this.status = status
    this.serverMessage = serverMessage
  }
}

/** Pesan untuk pengguna, bahasa awam. */
export function describeApiError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.serverMessage && (err.status === 429 || err.status === 503 || err.status === 502)) return err.serverMessage
    if (err.kind === 'timeout')
      return 'Layanan butuh waktu lebih lama dari biasanya. Layanan gratis kadang perlu "bangun" dulu, coba lagi sebentar.'
    if (err.kind === 'network')
      return 'Tidak bisa terhubung ke layanan. Periksa koneksi internet Anda, lalu coba lagi.'
    if (err.kind === 'http' && err.status === 413)
      return 'Berkas terlalu besar. Gunakan foto yang lebih kecil.'
    if (err.kind === 'http' && err.status === 415)
      return 'Format foto tidak didukung. Gunakan JPG, PNG, WebP, atau BMP.'
    if (err.kind === 'http' && err.status === 422)
      return 'Foto tidak dapat diproses. Pastikan wajah terlihat jelas.'
    return 'Terjadi kesalahan di layanan. Coba lagi nanti.'
  }
  return 'Terjadi kesalahan. Coba lagi nanti.'
}

async function requestFull<T>(path: string, init: RequestInit, timeoutMs = 60_000): Promise<{ status: number; data: T }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${API_URL}${path}`, { ...init, signal: controller.signal })
    if (!res.ok) {
      let serverMessage: string | undefined
      try {
        const body = (await res.json()) as { error?: unknown }
        if (typeof body?.error === 'string') serverMessage = body.error
      } catch {
        /* tubuh bukan JSON */
      }
      throw new ApiError('http', `HTTP ${res.status}`, res.status, serverMessage)
    }
    try {
      return { status: res.status, data: (await res.json()) as T }
    } catch {
      throw new ApiError('bad_response', 'Respons bukan JSON yang valid')
    }
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err instanceof DOMException && err.name === 'AbortError')
      throw new ApiError('timeout', 'Permintaan melewati batas waktu')
    if (import.meta.env.DEV) console.error(`[api] gagal memanggil ${API_URL}${path}`, err)
    throw new ApiError('network', 'Gagal terhubung')
  } finally {
    clearTimeout(timer)
  }
}

async function request<T>(path: string, init: RequestInit, timeoutMs = 60_000): Promise<T> {
  return (await requestFull<T>(path, init, timeoutMs)).data
}

const bad = () => new ApiError('bad_response', 'Bentuk respons tidak dikenali')

const RISK_MAP: Record<string, Level> = { low: 'rendah', medium: 'sedang', high: 'tinggi' }

/**
 * Adapter /api/predict (Flask) -> bentuk yang dipakai UI.
 * Sengaja TIDAK memakai `prediction` dan `label` biner dari API: UI hanya menampilkan skor dan level.
 */
function adaptPredict(r: PredictWire): ClassifyResponse {
  const level = RISK_MAP[String(r?.risk_level)]
  if (typeof r?.probability_autistic !== 'number' || !level) throw bad()
  return {
    score: r.probability_autistic,
    level,
    face_detected: r.face_detected === true,
    cropped_face: typeof r.cropped_face_b64 === 'string' && r.cropped_face_b64.startsWith('data:image/') ? r.cropped_face_b64 : undefined,
    tta_used: r.use_tta === true,
    model_version: String(r.model_version ?? 'tidak diketahui'),
  }
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

const STATUSES: ChatStatus[] = ['answered', 'answered_with_caveat', 'out_of_scope', 'emergency', 'no_source']
const MATCHES: RetrievalMatch[] = ['tinggi', 'sedang', 'rendah', 'tidak dipakai']
const KINDS: SourceKind[] = ['jurnal', 'opini', 'dokumen']
const isHttpUrl = (v: string) => /^https?:\/\//i.test(v)

/** Membaca satu sumber dari API. Field yang tidak ada dilewati; tautan hanya http(s). */
export function adaptSource(raw: unknown, i: number): ChatSource {
  const s = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const title = str(s.title) || str(s.document_title) || str(s.name) || str(s.filename) || `Sumber ${i + 1}`
  const url = str(s.source_url) || str(s.url)
  const doi = str(s.doi)
  const meta = [str(s.authors) || str(s.author), str(s.year), doi && `DOI ${doi}`].filter(Boolean).join(' · ')
  const kind = KINDS.find((k) => k === s.kind) ?? 'dokumen'
  return {
    id: String(s.id ?? s.document_id ?? i),
    title,
    meta,
    kind,
    snippet: str(s.snippet) || str(s.content) || str(s.text) || str(s.chunk),
    url: isHttpUrl(url) ? url : undefined,
    pages: Array.isArray(s.pages) ? s.pages.filter((n): n is number => Number.isInteger(n) && n > 0) : undefined,
  }
}

function adaptActions(raw: unknown): ChatAction[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((a) => {
    const o = (a && typeof a === 'object' ? a : {}) as Record<string, unknown>
    const label = str(o.label)
    const route = str(o.route)
    // Hanya rute di dalam aplikasi: cegah tautan keluar dari respons yang tidak tepercaya.
    return label && route.startsWith('/') && !route.startsWith('//')
      ? [{ label, route, primary: o.primary === true }]
      : []
  })
}

/** Backend adalah sumber kebenaran status. Bila field `status` tidak ada (API lama), disimpulkan dari field lama. */
export function adaptChat(r: ChatWire): ChatResponse {
  if (typeof r?.answer !== 'string') throw bad()
  const legacy: ChatStatus = r.is_crisis === true ? 'emergency' : r.has_relevant_context === true ? 'answered' : 'answered_with_caveat'
  return {
    answer: r.answer,
    status: STATUSES.find((s) => s === r.status) ?? legacy,
    sources: Array.isArray(r.sources) ? r.sources.map(adaptSource) : [],
    retrieval_match: MATCHES.find((m) => m === r.retrieval_match) ?? 'tidak dipakai',
    actions: adaptActions(r.actions),
    knowledge_version: '',
    grounding:
      typeof r.grounding?.verified === 'number' && typeof r.grounding?.total === 'number'
        ? { verified: r.grounding.verified, total: r.grounding.total }
        : undefined,
    cached: r.cached === true ? true : undefined,
  }
}

export async function classifyImage(file: File, tta: boolean): Promise<ClassifyResponse> {
  if (isMockApi) return mockClassify(file, tta)
  const body = new FormData()
  body.append('image', file)
  body.append('use_tta', String(tta))
  return adaptPredict(await request<PredictWire>('/api/predict', { method: 'POST', body }))
}

const POLL_MIN_MS = 2_000
const POLL_MAX_MS = 6_000
const POLL_DEADLINE_MS = 6 * 60_000

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/**
 * Kirim pertanyaan. Pertanyaan yang sudah pernah ditanyakan dijawab langsung (200). Pertanyaan baru dibaca ulang
 * dari seluruh dokumen oleh server dan bisa memakan 1-2 menit: server membalas 202 dengan job_id, lalu kita
 * memeriksa statusnya berkala.
 */
export async function sendChat(req: ChatRequest): Promise<ChatResponse> {
  if (isMockApi) return mockChat(req.message)
  const first = await requestFull<JobWire>('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: req.message, history: req.history.slice(-4) }),
  })
  if (first.status !== 202) return adaptChat(first.data as ChatWire)

  const jobId = first.data.job_id
  if (!jobId || !/^[A-Za-z0-9_-]{1,64}$/.test(jobId)) throw bad()
  const deadline = Date.now() + POLL_DEADLINE_MS
  let wait = first.data.poll_after_ms ?? 3_000
  for (;;) {
    await sleep(Math.min(POLL_MAX_MS, Math.max(POLL_MIN_MS, wait)))
    if (Date.now() > deadline) throw new ApiError('timeout', 'Menunggu jawaban terlalu lama')
    const job = await request<JobWire>(`/api/chat/jobs/${jobId}`, { method: 'GET' }, 15_000)
    if (job.state === 'done') return adaptChat(job as ChatWire)
    if (job.state === 'error') throw new ApiError('http', 'Pekerjaan gagal', 502, typeof job.error === 'string' ? job.error : undefined)
    if (job.state !== 'running') throw bad()
    wait = job.poll_after_ms ?? wait
  }
}

/** FAQ publik: pertanyaan yang paling sering ditanyakan beserta jawabannya. */
export async function getFaq(): Promise<FaqItem[]> {
  if (isMockApi) return []
  const data = await request<{ items?: unknown[] }>('/api/faq', { method: 'GET' }, 15_000)
  if (!Array.isArray(data.items)) throw bad()
  return data.items.flatMap((raw) => {
    const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
    if (typeof o.question !== 'string' || typeof o.answer !== 'string') return []
    return [{ question: o.question, answer: o.answer, sources: Array.isArray(o.sources) ? o.sources.map(adaptSource) : [] }]
  })
}

export async function getHealth(): Promise<HealthResponse | null> {
  if (isMockApi) return null
  try {
    return await request<HealthResponse>('/api/health', { method: 'GET' }, 10_000)
  } catch {
    return null
  }
}
