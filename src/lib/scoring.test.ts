import { describe, expect, it } from 'vitest'
import { MCHAT_ITEM_COUNT, SCORE_THRESHOLDS, isRiskAnswer, levelFromScore, mchatLevel, mchatScore, toPercent, type Answer } from './scoring'

describe('levelFromScore', () => {
  it('memetakan skor ke level di sekitar batas', () => {
    expect(levelFromScore(0)).toBe('rendah')
    expect(levelFromScore(SCORE_THRESHOLDS.sedang - 0.001)).toBe('rendah')
    expect(levelFromScore(SCORE_THRESHOLDS.sedang)).toBe('sedang')
    expect(levelFromScore(SCORE_THRESHOLDS.tinggi - 0.001)).toBe('sedang')
    expect(levelFromScore(SCORE_THRESHOLDS.tinggi)).toBe('tinggi')
    expect(levelFromScore(1)).toBe('tinggi')
  })
})

describe('toPercent', () => {
  it('membulatkan dan membatasi ke 0..100', () => {
    expect(toPercent(0.524)).toBe(52)
    expect(toPercent(-1)).toBe(0)
    expect(toPercent(3)).toBe(100)
  })
})

describe('M-CHAT-R/F: butir berisiko', () => {
  it('butir 2, 5, 12: "Ya" berisiko; lainnya: "Tidak" berisiko', () => {
    for (const n of [2, 5, 12]) {
      expect(isRiskAnswer(n, 'ya')).toBe(true)
      expect(isRiskAnswer(n, 'tidak')).toBe(false)
    }
    for (const n of [1, 3, 4, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20]) {
      expect(isRiskAnswer(n, 'tidak')).toBe(true)
      expect(isRiskAnswer(n, 'ya')).toBe(false)
    }
  })
  it('jawaban tanpa risiko di semua butir = skor 0', () => {
    const safe: Answer[] = Array.from({ length: MCHAT_ITEM_COUNT }, (_, i) => ([2, 5, 12].includes(i + 1) ? 'tidak' : 'ya'))
    expect(mchatScore(safe)).toBe(0)
  })
  it('semua jawaban berisiko = skor 20', () => {
    const risky: Answer[] = Array.from({ length: MCHAT_ITEM_COUNT }, (_, i) => ([2, 5, 12].includes(i + 1) ? 'ya' : 'tidak'))
    expect(mchatScore(risky)).toBe(20)
  })
  it('jawab "Tidak" di semua butir = 17', () => {
    expect(mchatScore(Array<Answer>(20).fill('tidak'))).toBe(17)
  })
})

describe('M-CHAT-R/F: tingkat risiko resmi', () => {
  it('0-2 rendah, 3-7 sedang, 8-20 tinggi', () => {
    expect([0, 2].map(mchatLevel)).toEqual(['rendah', 'rendah'])
    expect([3, 7].map(mchatLevel)).toEqual(['sedang', 'sedang'])
    expect([8, 20].map(mchatLevel)).toEqual(['tinggi', 'tinggi'])
  })
})
