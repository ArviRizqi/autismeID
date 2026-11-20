import { describe, expect, it } from 'vitest'
import { buildTarget, isValidBackend } from './_target'

const B = 'https://x.hf.space/'
const q = (s = '') => new URLSearchParams(s)

describe('buildTarget', () => {
  it('meneruskan jalur yang diizinkan dan query selain path', () => {
    expect(buildTarget(B, 'chat', q('path=chat'))).toBe('https://x.hf.space/api/chat')
    expect(buildTarget(B, 'chat/jobs/abc_1-2', q('path=chat/jobs/abc_1-2'))).toBe('https://x.hf.space/api/chat/jobs/abc_1-2')
    expect(buildTarget(B, 'faq', q('path=faq&a=1'))).toBe('https://x.hf.space/api/faq?a=1')
  })
  it('menolak jalur di luar daftar', () => {
    expect(buildTarget(B, 'secret', q())).toBeNull()
    expect(buildTarget(B, '', q())).toBeNull()
  })
  it('menolak path traversal dan karakter aneh', () => {
    expect(buildTarget(B, 'chat/../admin', q())).toBeNull()
    expect(buildTarget(B, 'chat/%2e%2e', q())).toBeNull()
    expect(buildTarget(B, 'chat?x=1', q())).toBeNull()
    expect(buildTarget(B, 'chat//evil.com', q())).toBeNull()
  })
  it('membatasi kedalaman', () => {
    expect(buildTarget(B, 'chat/a/b/c/d', q())).toBeNull()
  })
})

describe('isValidBackend', () => {
  it('hanya https (atau localhost)', () => {
    expect(isValidBackend('https://x.hf.space')).toBe(true)
    expect(isValidBackend('http://localhost:7860')).toBe(true)
    expect(isValidBackend('http://example.com')).toBe(false)
    expect(isValidBackend('')).toBe(false)
    expect(isValidBackend(undefined)).toBe(false)
  })
})
