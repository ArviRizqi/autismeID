import type { ChatResponse, ClassifyResponse } from '../../types/api'
import { levelFromScore } from '../scoring'

/**
 * MODE CONTOH. Dipakai hanya pada `npm run dev` bila BACKEND_URL kosong; tidak pernah aktif di produksi.
 * Isi di sini adalah simulasi untuk pengembangan antarmuka, BUKAN keluaran model.
 * Guardrail sungguhan (darurat, di luar cakupan, abstain) harus berjalan di API.
 * Metadata sumber di sini adalah contoh. Jangan dipakai sebagai kutipan.
 */

const KNOWLEDGE_VERSION = 'contoh'

const EMERGENCY =
  /kejang|tidak sadar|pingsan|tidak bernapas|sesak napas|tersedak|bibir (jadi )?biru|berdarah/i
const DIAGNOSIS = /\b(apakah|apa)\b.*\b(anak|dia|anaknya)\b.*\bautis/i
const ASKS_SCREENING = /m-?chat|skrining|screening/i
const ASKS_FACE = /wajah|foto/i

export function routeMockChat(message: string): ChatResponse {
  const text = message.trim()

  if (EMERGENCY.test(text)) {
    return {
      status: 'emergency',
      retrieval_match: 'tidak dipakai',
      knowledge_version: KNOWLEDGE_VERSION,
      sources: [],
      actions: [],
      answer: [
        'Ini bisa menjadi keadaan darurat medis.',
        'Hubungi 112 atau segera bawa anak ke IGD terdekat sekarang. Jangan menunggu jawaban dari chat ini.',
        'Jika ada orang lain di dekat Anda, minta mereka membantu menelepon sementara Anda menemani anak.',
      ].join('\n\n'),
    }
  }

  if (DIAGNOSIS.test(text)) {
    return {
      status: 'out_of_scope',
      retrieval_match: 'tidak dipakai',
      knowledge_version: KNOWLEDGE_VERSION,
      sources: [],
      actions: [
        { label: 'Isi skrining', route: '/skrining', primary: true },
        { label: 'Cari layanan di wilayah saya', route: '/direktori' },
      ],
      answer: [
        'Kami tidak bisa menentukan apakah seorang anak autistik, dan chat ini tidak boleh dipakai untuk itu. Hanya tenaga kesehatan yang bisa menilai secara langsung.',
        'Kekhawatiran Anda layak ditanggapi. Yang bisa Anda lakukan sekarang:',
        '1. Isi skrining untuk gambaran awal. 2. Bawa hasilnya ke dokter anak atau Puskesmas. 3. Catat perilaku yang Anda lihat, dengan contoh dan waktunya.',
      ].join('\n\n'),
    }
  }

  if (ASKS_FACE.test(text)) {
    return {
      status: 'answered_with_caveat',
      retrieval_match: 'sedang',
      knowledge_version: KNOWLEDGE_VERSION,
      actions: [{ label: 'Baca model card', route: '/model-card', primary: true }],
      sources: [
        {
          id: 'contoh-1',
          title: 'Contoh sumber: studi skrining ASD dengan foto wajah dan faktor etnoras',
          meta: '[contoh] ganti dengan data dari knowledge/sources.yaml',
          kind: 'jurnal',
          snippet: '[contoh] cuplikan dari paper akan tampil di sini.',
        },
      ],
      answer: [
        'Ada penelitian yang mencobanya, tetapi buktinya terbatas dan ini belum menjadi alat skrining. [1]',
        'Untuk skrining, gunakan kuesioner tervalidasi seperti M-CHAT-R/F.',
      ].join('\n\n'),
    }
  }

  if (ASKS_SCREENING.test(text)) {
    return {
      status: 'answered',
      retrieval_match: 'tinggi',
      knowledge_version: KNOWLEDGE_VERSION,
      actions: [{ label: 'Mulai skrining', route: '/skrining', primary: true }],
      sources: [
        {
          id: 'contoh-2',
          title: 'Contoh sumber: validasi M-CHAT-R/F versi Indonesia',
          meta: '[contoh] ganti dengan data dari knowledge/sources.yaml',
          kind: 'jurnal',
          snippet: '[contoh] cuplikan dari paper akan tampil di sini.',
        },
      ],
      answer: [
        'M-CHAT-R/F adalah kuesioner skrining dua tahap yang diisi orang tua untuk menilai risiko autisme. [1]',
        'Hasilnya adalah tingkat risiko, bukan diagnosis. Bila risikonya sedang atau tinggi, langkah berikutnya adalah berkonsultasi dengan dokter atau psikolog anak.',
      ].join('\n\n'),
    }
  }

  return {
    status: 'no_source',
    retrieval_match: 'rendah',
    knowledge_version: KNOWLEDGE_VERSION,
    sources: [],
    actions: [],
    answer: [
      'Kami tidak menemukan bukti yang cukup di sumber kami untuk menjawab ini, jadi kami tidak akan menebak.',
      'Diskusikan dengan dokter anak atau tenaga kesehatan. Pertanyaan ini kami catat untuk ditinjau tim.',
    ].join('\n\n'),
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function mockChat(message: string): Promise<ChatResponse> {
  await sleep(700)
  return routeMockChat(message)
}

export async function mockClassify(file: File, tta: boolean): Promise<ClassifyResponse> {
  await sleep(1600)
  // Skor deterministik dari ukuran berkas, hanya agar tiap unggahan terlihat berbeda.
  const score = (file.size % 97) / 100
  return {
    score,
    level: levelFromScore(score),
    face_detected: true,
    face_box: { x: 0.24, y: 0.17, w: 0.52, h: 0.5 },
    tta_used: tta,
    model_version: 'contoh',
  }
}
