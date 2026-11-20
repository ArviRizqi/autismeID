import type { RiskLevel } from './scoring'

export type Tone = 'ok' | 'warn' | 'danger' | 'neutral'

interface LevelCopy {
  title: string
  tone: Tone
  body: string
}

/** Teks hasil klasifikasi foto (demo AI). */
export const photoLevelCopy: Record<RiskLevel, LevelCopy> = {
  rendah: {
    title: 'Risiko rendah',
    tone: 'ok',
    body: 'Skor model rendah. Ini tidak berarti anak tidak perlu dipantau. Tetap ikuti jadwal tumbuh kembang, dan lakukan skrining M-CHAT-R/F bila ada kekhawatiran.',
  },
  sedang: {
    title: 'Risiko sedang',
    tone: 'warn',
    body: 'Skor model berada di zona menengah, sehingga hasilnya kurang informatif. Lanjutkan dengan skrining M-CHAT-R/F dan konsultasikan ke dokter anak bila ragu.',
  },
  tinggi: {
    title: 'Risiko tinggi',
    tone: 'danger',
    body: 'Skor model tinggi. Ini bukan diagnosis. Lakukan skrining M-CHAT-R/F dan konsultasikan ke dokter anak tumbuh kembang atau psikolog anak untuk penilaian lengkap.',
  },
}

/**
 * Teks hasil skrining M-CHAT-R/F. Isinya mengikuti algoritma resmi: 0-2 rendah, 3-7 sedang, 8-20 tinggi.
 * Skor, bukan persentase.
 */
export const screeningLevelCopy: Record<RiskLevel, LevelCopy & { range: string }> = {
  rendah: {
    title: 'Risiko rendah',
    range: 'Skor 0 sampai 2',
    tone: 'ok',
    body: 'Dari jawaban ini belum ada tindakan khusus selain pemantauan tumbuh kembang rutin. Bila anak berusia di bawah 24 bulan, ulangi skrining setelah ulang tahunnya yang kedua. Bila Anda atau tenaga kesehatan tetap khawatir, konsultasikan, berapa pun skornya.',
  },
  sedang: {
    title: 'Risiko sedang: perlu wawancara tindak lanjut',
    range: 'Skor 3 sampai 7',
    tone: 'warn',
    body: 'Hasil ini belum final. Pada skor ini, M-CHAT-R/F meminta wawancara tindak lanjut (bagian Follow-Up) untuk butir yang berisiko, yang dilakukan tenaga kesehatan. Bawa hasil ini ke Puskesmas atau dokter anak. Bila tindak lanjut menunjukkan dua butir atau lebih berisiko, anak dirujuk untuk evaluasi diagnostik.',
  },
  tinggi: {
    title: 'Risiko tinggi: disarankan segera dirujuk',
    range: 'Skor 8 sampai 20',
    tone: 'danger',
    body: 'Pada skor ini, M-CHAT-R/F menyarankan anak segera dirujuk untuk evaluasi diagnostik dan penilaian kelayakan intervensi dini, tanpa menunggu wawancara tindak lanjut. Hubungi dokter anak tumbuh kembang, psikolog anak, atau Puskesmas. Ini bukan diagnosis.',
  },
}
