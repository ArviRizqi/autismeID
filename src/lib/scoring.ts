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

/** Jumlah butir M-CHAT-R/F. */
export const MCHAT_ITEM_COUNT = 20

/**
 * Algoritma penilaian resmi M-CHAT-R/F (Robins, Fein & Barton, 2009).
 * Untuk butir 2, 5, dan 12, jawaban "Ya" menunjukkan risiko; untuk 17 butir lainnya, jawaban "Tidak".
 * Total butir berisiko: 0-2 rendah, 3-7 sedang (perlu wawancara tindak lanjut), 8-20 tinggi.
 */
export const MCHAT_RISK_WHEN_YES = [2, 5, 12] as const
export const MCHAT_CUTOFFS = { sedang: 3, tinggi: 8 } as const

export type Answer = 'ya' | 'tidak'

export function isRiskAnswer(itemNumber: number, answer: Answer): boolean {
  const riskWhenYes = (MCHAT_RISK_WHEN_YES as readonly number[]).includes(itemNumber)
  return riskWhenYes ? answer === 'ya' : answer === 'tidak'
}

export function mchatScore(answers: readonly Answer[]): number {
  return answers.reduce((n, a, i) => n + (isRiskAnswer(i + 1, a) ? 1 : 0), 0)
}

export function mchatLevel(score: number): RiskLevel {
  if (score >= MCHAT_CUTOFFS.tinggi) return 'tinggi'
  if (score >= MCHAT_CUTOFFS.sedang) return 'sedang'
  return 'rendah'
}
