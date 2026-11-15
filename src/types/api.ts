/**
 * Kontrak dengan layanan model-ai (Flask, Hugging Face Space `Artz-03/autisme-ai-service`).
 *
 * Tipe *Wire = bentuk mentah dari API; client.ts mengubahnya ke tipe UI di bawahnya.
 */

export type Level = 'rendah' | 'sedang' | 'tinggi'

/** Kotak wajah ternormalisasi (0..1) terhadap lebar dan tinggi gambar. */
export interface FaceBox {
  x: number
  y: number
  w: number
  h: number
}

export interface ClassifyResponse {
  /** Skor model 0..1. Bukan peluang diagnosis. */
  score: number
  level: Level
  face_detected: boolean
  face_box?: FaceBox
  /** Wajah hasil pangkas MTCNN (data URI JPEG) dari API. */
  cropped_face?: string
  tta_used: boolean
  model_version: string
}

export type ChatStatus =
  | 'answered'
  | 'answered_with_caveat'
  | 'out_of_scope'
  | 'emergency'
  | 'no_source'

export type SourceKind = 'jurnal' | 'opini' | 'dokumen'

export interface ChatSource {
  id: string
  title: string
  meta: string
  kind: SourceKind
  /** Cuplikan dari sumber. Tandai bila diringkas. */
  snippet: string
  /** Tautan sumber (http/https) bila ada. */
  url?: string
  /** Halaman (PDF) tempat kutipan terverifikasi ditemukan. */
  pages?: number[]
}

export interface ChatAction {
  label: string
  /** Rute dalam aplikasi, mis. /skrining */
  route: string
  primary?: boolean
}

export type RetrievalMatch = 'tinggi' | 'sedang' | 'rendah' | 'tidak dipakai'

export interface ChatResponse {
  answer: string
  status: ChatStatus
  sources: ChatSource[]
  retrieval_match: RetrievalMatch
  actions: ChatAction[]
  knowledge_version: string
  /** Kutipan yang dicek server benar-benar ada di dokumen (mode baca-utuh). */
  grounding?: { verified: number; total: number }
  /** true bila dijawab dari arsip jawaban, bukan dibaca ulang. */
  cached?: boolean
}

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  message: string
  history: ChatTurn[]
}

export interface HealthResponse {
  status: 'ok'
  model_version?: string
  knowledge_version?: string
}

/** Respons mentah POST /api/predict. */
export interface PredictWire {
  prediction: string
  label: string
  confidence: number
  probability_autistic: number
  probability_non_autistic: number
  risk_level: 'low' | 'medium' | 'high'
  face_detected: boolean
  cropped_face_b64?: string
  use_tta: boolean
  model_version: string
}

/** Respons mentah POST /api/chat (mode JSON). Bentuk `sources` belum dikunci. */
export interface ChatWire {
  answer: string
  status?: string
  retrieval_match?: string
  actions?: unknown[]
  sources?: unknown[]
  has_relevant_context?: boolean
  is_crisis?: boolean
  grounding?: { verified?: number; total?: number }
  cached?: boolean
}

/** Respons POST /api/chat (202) dan GET /api/chat/jobs/<id>. */
export interface JobWire extends Partial<ChatWire> {
  state?: 'running' | 'done' | 'error'
  job_id?: string
  poll_after_ms?: number
  error?: string
}

export interface FaqItem {
  question: string
  answer: string
  sources: ChatSource[]
}
