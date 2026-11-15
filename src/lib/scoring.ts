export type RiskLevel = 'rendah' | 'sedang' | 'tinggi'

/**
 * Batas level untuk skor model foto (0..1).
 * HARUS sama dengan `_probs_to_risk` di app.py (40% dan 70%). Nilai ini belum ditetapkan dari
 * data validasi (kurva ROC, target sensitivitas): tetapkan, lalu ubah di KEDUA tempat dan di model card.
 */
export const SCORE_THRESHOLDS = { sedang: 0.4, tinggi: 0.7 } as const

export function levelFromScore(score: number): RiskLevel {
  if (score >= SCORE_THRESHOLDS.tinggi) return 'tinggi'
  if (score >= SCORE_THRESHOLDS.sedang) return 'sedang'
  return 'rendah'
}

export function toPercent(score: number): number {
  return Math.round(Math.min(1, Math.max(0, score)) * 100)
}

/**
 * Aturan skor untuk 5 butir CONTOH.
 *
 * Untuk M-CHAT-R/F resmi (20 butir), pakai algoritma resminya, bukan aturan ini.
 * Cek ketentuan lisensi dan versi bahasa Indonesia sebelum dipakai.
 */
export function screeningLevel(riskCount: number): RiskLevel {
  if (riskCount >= 3) return 'tinggi'
  if (riskCount >= 1) return 'sedang'
  return 'rendah'
}
