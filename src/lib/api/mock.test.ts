import { describe, expect, it } from 'vitest'
import { routeMockChat } from './mock'

describe('routeMockChat (simulasi guardrail)', () => {
  it('darurat didahulukan dan tanpa sumber', () => {
    const r = routeMockChat('Anak saya kejang dan tidak sadar sejak 5 menit lalu')
    expect(r.status).toBe('emergency')
    expect(r.sources).toHaveLength(0)
    expect(r.answer).toContain('112')
  })

  it('menolak diagnosis', () => {
    const r = routeMockChat('Anak saya 2 tahun, apakah dia autis?')
    expect(r.status).toBe('out_of_scope')
    expect(r.actions.map((a) => a.route)).toContain('/skrining')
  })

  it('abstain bila tidak ada sumber', () => {
    const r = routeMockChat('Apakah diet bebas gluten efektif?')
    expect(r.status).toBe('no_source')
    expect(r.sources).toHaveLength(0)
  })

  it('jawaban bersumber menyertakan sumber', () => {
    const r = routeMockChat('Apa itu M-CHAT-R/F?')
    expect(r.status).toBe('answered')
    expect(r.sources.length).toBeGreaterThan(0)
  })
})
