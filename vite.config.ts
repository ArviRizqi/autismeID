import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/**
 * Alamat layanan model-ai TIDAK dimasukkan ke bundel. Browser selalu memanggil /api/* di domain sendiri:
 *  - produksi (Vercel): api/gateway.ts meneruskannya memakai BACKEND_URL dan PROXY_SECRET dari environment server;
 *  - pengembangan: server dev Vite meneruskannya memakai nilai yang sama dari berkas .env (tanpa awalan VITE_,
 *    jadi tidak terbaca oleh kode browser).
 * Bila BACKEND_URL kosong saat `npm run dev`, aplikasi memakai MODE CONTOH (jawaban disimulasikan di browser).
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backend = (env.BACKEND_URL ?? '').trim().replace(/\/+$/, '')
  const dev = mode === 'development'

  return {
    plugins: [react()],
    define: { __MOCK_API__: JSON.stringify(dev && !backend) },
    server: {
      proxy: backend
        ? {
            '/api': {
              target: backend,
              changeOrigin: true,
              headers: env.PROXY_SECRET ? { 'X-Proxy-Secret': env.PROXY_SECRET } : {},
            },
          }
        : undefined,
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts', 'api/**/*.test.ts'],
    },
  }
})
