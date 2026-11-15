# AutismeID Web

Frontend AutismeID: edukasi autisme, skrining satu-pertanyaan-per-layar, demo klasifikasi wajah (skor persen + level risiko), chat RAG bersumber, model card, dan direktori layanan.

Stack: Vite, React 18, TypeScript, Tailwind CSS 3, react-router 6, Vitest. Deploy: Vercel.

## Menjalankan

```bash
npm install
cp .env.example .env     # isi VITE_API_URL bila API sudah ada
npm run dev
npm run typecheck && npm test && npm run build
```

## Mode contoh (mock)

Bila `VITE_API_URL` kosong, `/ai` dan `/chat` memakai simulasi di browser (`src/lib/api/mock.ts`) dan menampilkan banner "Mode contoh". Isi `VITE_API_URL` dengan alamat Space repo `autismeid-model-ai` untuk memakai model sungguhan.

## Kontrak API (repo model-ai)

- `POST /classify` (multipart: `file`, `tta`) -> `{ score, level, face_box, ... }`
- `POST /chat` (JSON: `message`, `history`) -> `{ status, answer, sources, actions, retrieval_match }`
- `GET /health`

Tipe ada di `src/types/api.ts`. Setelah API punya `openapi.json`, buat ulang dengan `openapi-typescript`.
Guardrail asli (darurat, di luar cakupan, tolak bila tanpa sumber) harus ada di API; mock hanya menirunya.

## Struktur

```
src/
  components/{ui,layout,chat}   komponen
  pages/                        Home, Screening, AIDemo, Chat, ModelCard, Directory, NotFound
  lib/                          scoring, levels, storage, api/{client,mock}
  hooks/                        useA11y (ukuran teks, mode tenang), useChat
  data/ content/ config/        konten, direktori, kontak
  styles/                       theme.css (token), globals.css
```

Tema: variabel CSS di `src/styles/theme.css` dipetakan ke Tailwind. `data-calm` dan `data-text-size` mengatur mode tenang dan ukuran teks.

## Harus diisi sebelum rilis publik

1. **Skrining**: `src/data/screening.ts` masih 5 butir CONTOH. Ganti dengan M-CHAT-R/F resmi (20 butir, cek lisensi, pakai algoritma resmi).
2. **Ambang level**: `SCORE_THRESHOLDS` di `src/lib/scoring.ts` (35% dan 65%) hanya placeholder. Tetapkan dari validasi model.
3. **Model card**: `src/content/modelCard.ts` (semua `[belum diisi]`): dataset, metrik + CI, subkelompok, privasi, dasar hukum.
4. **Direktori**: `src/data/directory.ts` kosong di produksi; isi hanya layanan yang sudah diverifikasi.
5. **Kontak dan peninjau**: `src/config/site.ts` (bagian disembunyikan bila kosong).
6. **Verifikasi rujukan** di model card dan sumber chat (DOI, tahun, penulis), serta nomor darurat dan rujukan UU PDP.
7. Suara individu autistik sebagai kontributor/peninjau konten.
