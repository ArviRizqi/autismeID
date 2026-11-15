import { describe, expect, it } from 'vitest'
import { SCORE_THRESHOLDS, levelFromScore, screeningLevel, toPercent } from './scoring'

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

describe('screeningLevel (aturan contoh)', () => {
  it('0 jawaban berisiko = rendah, 1-2 = sedang, 3+ = tinggi', () => {
    expect(screeningLevel(0)).toBe('rendah')
    expect(screeningLevel(2)).toBe('sedang')
    expect(screeningLevel(3)).toBe('tinggi')
  })
})
