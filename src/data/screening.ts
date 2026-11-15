/**
 * BUTIR CONTOH, bukan M-CHAT-R/F resmi.
 *
 * Sebelum tayang: ganti dengan butir resmi versi Indonesia (20 butir), periksa ketentuan
 * lisensinya, dan ganti aturan skor di lib/scoring.ts dengan algoritma resminya.
 * Lalu ubah SCREENING_IS_SAMPLE menjadi false.
 */
export const SCREENING_IS_SAMPLE = true

export interface ScreeningItem {
  id: number
  text: string
  /** Jawaban yang dihitung sebagai tanda risiko. */
  riskAnswer: 'ya' | 'tidak'
}

export const screeningItems: ScreeningItem[] = [
  { id: 1, riskAnswer: 'tidak', text: 'Ketika Anda memanggil namanya dari belakang, apakah anak biasanya menoleh?' },
  { id: 2, riskAnswer: 'tidak', text: 'Apakah anak menunjuk dengan jarinya untuk menunjukkan sesuatu yang menarik baginya?' },
  { id: 3, riskAnswer: 'tidak', text: 'Apakah anak menirukan gerakan Anda, misalnya melambaikan tangan atau bertepuk tangan?' },
  { id: 4, riskAnswer: 'tidak', text: 'Apakah anak menatap wajah Anda ketika bermain atau ketika Anda berbicara kepadanya?' },
  { id: 5, riskAnswer: 'tidak', text: 'Apakah anak membawa benda kepada Anda untuk menunjukkannya?' },
]
