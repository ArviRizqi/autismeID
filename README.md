# AutismeID Web

Frontend AutismeID: edukasi autisme, skrining M-CHAT-R/F, demo klasifikasi wajah (skor persen + level risiko), chat RAG bersumber, model card, dan direktori layanan.

Stack: Vite, React 18, TypeScript, Tailwind CSS 3, react-router 6, Vitest. Deploy: Vercel.

## Menjalankan

```bash
npm install
cp .env.example .env     # isi BACKEND_URL (dan PROXY_SECRET) bila layanan sudah ada
npm run dev
npm run typecheck && npm test && npm run build
```

## Keamanan alamat API (tanpa VITE_)

Browser **tidak pernah** tahu alamat layanan model-ai. Semua panggilan memakai `/api/*` di domain situs sendiri:

- **Produksi (Vercel):** `api/gateway.ts` meneruskan permintaan ke `BACKEND_URL` dan menambahkan `X-Proxy-Secret` dari `PROXY_SECRET`. Atur keduanya di Vercel > Project > Settings > Environment Variables (Production dan Preview). Jangan memakai awalan `VITE_`: variabel ber-awalan itu ikut dikirim ke browser.
- **Pengembangan:** server dev Vite meneruskan `/api/*` ke `BACKEND_URL` dari `.env` (lihat `vite.config.ts`). Bila kosong, aplikasi masuk mode contoh (simulasi di browser, hanya pada `npm run dev`).
- **Backend:** isi `PROXY_SECRET` yang sama di Secrets Space. Selama terisi, semua `/api/*` kecuali `/api/health` menolak permintaan tanpa rahasia itu (HTTP 403), sehingga alamat Space tidak bisa dipakai langsung untuk menghabiskan kuota.
- Setelah build, cek bundel: `grep -r "hf.space" dist` tidak boleh menghasilkan apa pun.

Batas yang berlaku lewat proxy Vercel: isi permintaan sekitar 4,5 MB (foto di atas 3,5 MB diperkecil otomatis di browser; PDF untuk halaman `/admin` maksimal sekitar 4 MB, untuk yang lebih besar unggah langsung ke Space dengan `curl` memakai `ADMIN_TOKEN` dan `X-Proxy-Secret`) dan waktu eksekusi 60 detik per permintaan (Space gratis yang sedang tidur bisa melewatinya pada permintaan pertama; coba lagi). Jawaban chat untuk pertanyaan baru memakai pekerjaan latar belakang + polling, jadi tidak terkena batas waktu ini.

Rahasia lain (`GEMINI_API_KEY`, `ADMIN_TOKEN`, kunci Supabase) hanya ada di Secrets Space, tidak pernah di repo ini.

## Skrining M-CHAT-R/F

Skor dihitung dengan algoritma resmi (`src/lib/scoring.ts`): butir 2, 5, 12 berisiko bila "Ya", 17 butir lain bila "Tidak"; 0-2 rendah, 3-7 sedang (perlu wawancara tindak lanjut), 8-20 tinggi.

Pemilik instrumen mewajibkan butir dipakai utuh dan tidak diubah, dan memasukkannya ke perangkat lunak butuh izin penulis (lihat `src/data/screening.ts`). Karena itu 20 butir resmi **belum** dipasang. Selama itu `/skrining` menampilkan tautan ke formulir resmi (PDF bahasa Indonesia di mchatscreen.com) + penghitung skor + penjelasan hasil. Setelah izin didapat, tempel ke-20 butir persis ke `OFFICIAL_ITEMS` dan alur satu-pertanyaan-per-layar menyala otomatis. Kontak izin ada di berkas resmi.

## Kontrak API (repo model-ai)

- `POST /api/predict` (multipart: `image`, `use_tta`)
- `POST /api/chat` (JSON: `message`, `history`) -> 200 dari arsip atau 202 `{job_id}`; `GET /api/chat/jobs/<id>`; `GET /api/faq`
- `GET /api/health`; admin: `/api/documents*`, `/api/admin/status`, `/api/qa*`

Tipe ada di `src/types/api.ts`. Guardrail asli (darurat, di luar cakupan, tolak bila tanpa sumber) ada di API; mock hanya menirunya.

## Struktur

```
src/
  components/{ui,layout,chat}   komponen
  pages/                        Home, Screening, AIDemo, Chat, Faq, Admin (/admin, tak ditautkan), ModelCard, Directory, NotFound
  api/                          proxy Vercel (gateway.ts)
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
