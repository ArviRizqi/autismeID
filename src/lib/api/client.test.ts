import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function jsonRes(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

async function load() {
  vi.resetModules()
  return import('./client')
}

describe('adaptChat', () => {
  it('membaca grounding, halaman sumber, dan cached', async () => {
    const { adaptChat } = await load()
    const r = adaptChat({
      answer: 'a [1]', status: 'answered', grounding: { verified: 2, total: 3 }, cached: true,
      sources: [{ id: 'x', title: 'Paper', pages: [2, 'x', -1, 5] }],
    })
    expect(r.grounding).toEqual({ verified: 2, total: 3 })
    expect(r.cached).toBe(true)
    expect(r.sources[0].pages).toEqual([2, 5])
  })
  it('grounding tidak ada = undefined', async () => {
    const { adaptChat } = await load()
    expect(adaptChat({ answer: 'a' }).grounding).toBeUndefined()
  })
})

describe('sendChat polling', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('200 langsung dikembalikan tanpa polling', async () => {
    const { sendChat } = await load()
    const f = vi.fn().mockResolvedValue(jsonRes(200, { answer: 'dari arsip', status: 'answered', cached: true }))
    vi.stubGlobal('fetch', f)
    const r = await sendChat({ message: 'q', history: [] })
    expect(r.cached).toBe(true)
    expect(f).toHaveBeenCalledTimes(1)
  })

  it('202 lalu running lalu done', async () => {
    const { sendChat } = await load()
    const f = vi.fn()
      .mockResolvedValueOnce(jsonRes(202, { state: 'running', job_id: 'abc', poll_after_ms: 3000 }))
      .mockResolvedValueOnce(jsonRes(200, { state: 'running' }))
      .mockResolvedValueOnce(jsonRes(200, { state: 'done', answer: 'jadi', status: 'answered' }))
    vi.stubGlobal('fetch', f)
    const p = sendChat({ message: 'q', history: [] })
    await vi.advanceTimersByTimeAsync(20_000)
    expect((await p).answer).toBe('jadi')
    expect(f.mock.calls[1][0]).toBe('/api/chat/jobs/abc')
  })

  it('state error memakai pesan server', async () => {
    const { sendChat, describeApiError } = await load()
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(jsonRes(202, { state: 'running', job_id: 'abc' }))
      .mockResolvedValueOnce(jsonRes(200, { state: 'error', error: 'Kuota model sedang penuh.' })))
    const p = sendChat({ message: 'q', history: [] }).catch((e) => e)
    await vi.advanceTimersByTimeAsync(10_000)
    expect(describeApiError(await p)).toBe('Kuota model sedang penuh.')
  })

  it('429 memakai pesan server', async () => {
    const { sendChat, describeApiError } = await load()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonRes(429, { error: 'Batas harian tercapai.' })))
    expect(describeApiError(await sendChat({ message: 'q', history: [] }).catch((e) => e))).toBe('Batas harian tercapai.')
  })

  it('job_id aneh ditolak', async () => {
    const { sendChat } = await load()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonRes(202, { state: 'running', job_id: '../../x' })))
    await expect(sendChat({ message: 'q', history: [] })).rejects.toMatchObject({ kind: 'bad_response' })
  })
})

describe('getFaq', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })
  it('menyaring item rusak', async () => {
    const { getFaq } = await load()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonRes(200, { items: [{ question: 'Q', answer: 'A', sources: [{ title: 'T', pages: [1] }] }, { question: 5 }, null] })))
    const r = await getFaq()
    expect(r).toHaveLength(1)
    expect(r[0].sources[0].pages).toEqual([1])
  })
})
