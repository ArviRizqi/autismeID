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

/** Teks hasil kuesioner skrining. */
export const screeningLevelCopy: Record<RiskLevel, LevelCopy> = {
  rendah: {
    title: 'Risiko rendah',
    tone: 'ok',
    body: 'Dari jawaban Anda, belum terlihat tanda yang perlu ditindaklanjuti sekarang. Tetap pantau perkembangan anak, ikuti jadwal kunjungan rutin, dan ulangi skrining bila muncul kekhawatiran baru.',
  },
  sedang: {
    title: 'Perlu tindak lanjut',
    tone: 'warn',
    body: 'Ada beberapa jawaban yang perlu ditelusuri lebih lanjut. Lanjutkan dengan wawancara tindak lanjut, dan konsultasikan ke Puskesmas atau dokter anak.',
  },
  tinggi: {
    title: 'Disarankan berkonsultasi',
    tone: 'danger',
    body: 'Beberapa jawaban Anda menunjukkan hal yang sebaiknya dinilai tenaga kesehatan. Kami menyarankan konsultasi ke dokter anak tumbuh kembang atau psikolog atau psikiater anak untuk asesmen lengkap.',
  },
}
