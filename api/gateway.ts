/**
 * Proxy ke layanan model-ai. Browser hanya memanggil /api/* di domain situs ini; alamat layanan asli
 * (BACKEND_URL) dan kunci proxy (PROXY_SECRET) hanya ada di environment server Vercel dan tidak pernah
 * masuk ke bundel JavaScript. Atur keduanya di Vercel > Project > Settings > Environment Variables
 * (JANGAN memakai awalan VITE_).
 *
 * Batas platform Vercel yang berlaku di sini: isi permintaan maksimal sekitar 4,5 MB dan waktu eksekusi
 * mengikuti maxDuration di vercel.json.
 */
import { buildTarget, isValidBackend } from './_target'

const FORWARD_REQUEST_HEADERS = ['content-type', 'accept', 'authorization']
const FORWARD_RESPONSE_HEADERS = ['content-type', 'cache-control', 'retry-after']
const UPSTREAM_TIMEOUT_MS = 55_000

const json = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), { status, headers: { 'Content-Type': 'application/json' } })

export default {
  async fetch(request: Request): Promise<Response> {
    const backend = process.env.BACKEND_URL?.trim()
    if (!isValidBackend(backend)) return json(503, 'Layanan belum dikonfigurasi di server.')

    if (!['GET', 'POST', 'DELETE'].includes(request.method)) return json(405, 'Metode tidak didukung.')

    const url = new URL(request.url)
    const target = buildTarget(backend, url.searchParams.get('path') ?? '', url.searchParams)
    if (!target) return json(404, 'Jalur tidak ditemukan.')

    const headers = new Headers()
    for (const name of FORWARD_REQUEST_HEADERS) {
      const v = request.headers.get(name)
      if (v) headers.set(name, v)
    }
    const secret = process.env.PROXY_SECRET?.trim()
    if (secret) headers.set('X-Proxy-Secret', secret)
    // Alamat pengunjung sebenarnya, untuk pembatasan laju di backend (dipercaya backend hanya bersama PROXY_SECRET).
    const ip = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    if (ip) headers.set('X-Client-IP', ip)

    let body: ArrayBuffer | undefined
    if (request.method !== 'GET') {
      body = await request.arrayBuffer()
      if (body.byteLength > 4_400_000) return json(413, 'Berkas terlalu besar.')
    }

    try {
      const upstream = await fetch(target, {
        method: request.method,
        headers,
        body,
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      })
      const out = new Headers()
      for (const name of FORWARD_RESPONSE_HEADERS) {
        const v = upstream.headers.get(name)
        if (v) out.set(name, v)
      }
      return new Response(upstream.body, { status: upstream.status, headers: out })
    } catch (err) {
      const timedOut = err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError')
      return json(timedOut ? 504 : 502, timedOut ? 'Layanan terlalu lama merespons.' : 'Layanan tidak dapat dijangkau.')
    }
  },
}
