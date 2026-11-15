export interface ScreeningItem {
  id: string
  text: string
  /** true bila jawaban "Ya" adalah yang berisiko; false bila "Tidak" yang berisiko. */
  riskWhenYes: boolean
}

/**
 * CONTOH: 5 butir buatan untuk mockup, bukan butir resmi.
 * TODO: ganti dengan 20 butir M-CHAT-R/F versi Indonesia setelah memeriksa
 * ketentuan lisensinya, dan hitung hasil dengan algoritma resminya
 * (lihat screeningLevel di lib/scoring.ts).
 */
export const screeningItems: ScreeningItem[] = [
  {
    id: 'nama',
    text: 'Ketika Anda memanggil namanya dari belakang, apakah anak biasanya menoleh?',
    riskWhenYes: false,
  },
  {
    id: 'tunjuk',
    text: 'Apakah anak menunjuk dengan jarinya untuk menunjukkan sesuatu yang menarik baginya?',
    riskWhenYes: false,
  },
  {
    id: 'tiru',
    text: 'Apakah anak menirukan gerakan Anda, misalnya melambaikan tangan atau bertepuk tangan?',
    riskWhenYes: false,
  },
  {
    id: 'tatap',
    text: 'Apakah anak menatap wajah Anda ketika bermain atau ketika Anda berbicara kepadanya?',
    riskWhenYes: false,
  },
  {
    id: 'bawa',
    text: 'Apakah anak membawa benda kepada Anda untuk menunjukkannya?',
    riskWhenYes: false,
  },
]
