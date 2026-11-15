import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { RiskBar } from '../components/ui/RiskBar'
import { Eyebrow, Page } from '../components/ui/Section'
import { classifyImage, describeApiError, isMockApi } from '../lib/api/client'
import { cn } from '../lib/cn'
import { photoLevelCopy } from '../lib/levels'
import { toPercent } from '../lib/scoring'
import type { ClassifyResponse } from '../types/api'

type InfoKey = 'alur' | 'batasan'

function InfoButton({
  id, label, open, onToggle,
}: { id: string; label: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={id}
      onClick={onToggle}
      className={cn(
        'inline-flex min-h-touch items-center gap-1.5 rounded-full border-[1.5px] px-3.5 text-small font-semibold',
        open ? 'border-primary bg-primary text-white' : 'border-line-input bg-transparent text-primary',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex h-5 w-5 items-center justify-center rounded-full text-[0.75rem] font-bold',
          open ? 'bg-white text-primary' : 'bg-primary text-white',
        )}
      >
        i
      </span>
      {label}
    </button>
  )
}

type Phase = 'upload' | 'ready' | 'processing' | 'result'

const MAX_BYTES = 8 * 1024 * 1024

export default function AIDemo() {
  const [phase, setPhase] = useState<Phase>('upload')
  const [consent, setConsent] = useState(false)
  const [tta, setTta] = useState(true)
  const [info, setInfo] = useState<InfoKey | null>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [result, setResult] = useState<ClassifyResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  // Bebaskan URL pratinjau agar foto tidak tertinggal di memori
  useEffect(() => {
    if (!info) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setInfo(null)
    const onDown = (e: PointerEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) setInfo(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [info])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onFile = (f: File | undefined) => {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Berkas harus berupa gambar (JPG, PNG, atau WebP).')
      return
    }
    if (f.size > MAX_BYTES) {
      setError('Berkas terlalu besar. Gunakan foto di bawah 8 MB.')
      return
    }
    setError(null)
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setResult(null)
    setPhase('ready')
  }

  const reset = () => {
    setPreviewUrl(null)
    setFile(null)
    setResult(null)
    setError(null)
    setPhase('upload')
    if (inputRef.current) inputRef.current.value = ''
    if (cameraRef.current) cameraRef.current.value = ''
  }

  const analyze = async () => {
    if (!file) return
    setPhase('processing')
    setError(null)
    try {
      setResult(await classifyImage(file, tta))
      setPhase('result')
    } catch (err) {
      setError(describeApiError(err))
      setPhase('ready')
    }
  }

  const stepDone = phase === 'result' ? 4 : phase === 'processing' ? 2 : phase === 'ready' ? 1 : 0
  const steps = [
    'Unggah foto dan persetujuan orang tua',
    'Deteksi wajah (MTCNN)',
    tta ? 'Klasifikasi (CNN dengan TTA)' : 'Klasifikasi (CNN)',
    'Skor (%) dan level risiko',
  ]

  const copy = result ? photoLevelCopy[result.level] : null

  return (
    <Page>
      <Eyebrow>Eksperimen riset</Eyebrow>
      <h1 className="mb-4 text-h1 text-primary">Demo klasifikasi wajah dengan AI</h1>
      <p className="mb-6 max-w-[45rem] text-lead text-ink-2">
        Lihat bagaimana model bekerja, langkah demi langkah. Ini demonstrasi teknis, bukan skrining dan bukan diagnosis.
      </p>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-md bg-tint px-5 py-4">
        <p className="min-w-[min(26rem,100%)] flex-[1_1_26rem]">
          <strong>Jangan gunakan hasil ini untuk keputusan klinis.</strong> Untuk skrining yang tervalidasi, gunakan
          kuesioner M-CHAT-R/F.
        </p>
        <Button to="/skrining" variant="ghost">
          Ke skrining →
        </Button>
      </div>

      {isMockApi && (
        <p className="mb-6 rounded-md border-2 border-dashed border-line-dashed p-4 text-caption text-ink-3" role="note">
          Mode contoh: layanan model-ai belum terhubung (<code>VITE_API_URL</code> kosong). Skor di bawah disimulasikan
          di browser dan bukan keluaran model.
        </p>
      )}

      <div className="flex flex-wrap items-start gap-6">
        <section aria-label="Unggah dan hasil" className="min-w-0 flex-1 basis-full rounded-xl border border-line bg-surface p-[clamp(1.25rem,4vw,2.25rem)]">
          <div ref={infoRef} className="relative mb-6 border-b border-line-soft pb-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <h2 className="text-h4">Pengaturan model</h2>
              <div className="flex flex-wrap gap-2">
                <InfoButton id="info-alur" label="Alur pemrosesan" open={info === 'alur'} onToggle={() => setInfo((v) => (v === 'alur' ? null : 'alur'))} />
                <InfoButton id="info-batasan" label="Batasan" open={info === 'batasan'} onToggle={() => setInfo((v) => (v === 'batasan' ? null : 'batasan'))} />
              </div>
            </div>
            {info && (
              <div
                id={info === 'alur' ? 'info-alur' : 'info-batasan'}
                role="dialog"
                aria-label={info === 'alur' ? 'Alur pemrosesan' : 'Batasan yang perlu Anda tahu'}
                className="absolute right-0 top-[3.75rem] z-20 w-[min(26rem,100%)] rounded-lg border border-line bg-surface p-5 text-small shadow-[0_12px_32px_rgba(30,40,38,0.18)]"
              >
                <h3 className="mb-3 text-h4">{info === 'alur' ? 'Alur pemrosesan' : 'Batasan yang perlu Anda tahu'}</h3>
                {info === 'alur' ? (
              <ol className="m-0 flex list-none flex-col gap-3.5 p-0">
                {steps.map((title, i) => {
                  const done = i < stepDone
                  const running = i === stepDone && phase === 'processing'
                  return (
                    <li key={title} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className={cn('mt-2 h-3 w-3 flex-none rounded-full', done ? 'bg-primary' : running ? 'bg-accent' : 'bg-line-dashed')}
                      />
                      <span>
                        <span className="block font-semibold">{title}</span>
                        <span className="block text-caption text-ink-3">{done ? 'Selesai' : running ? 'Berjalan' : 'Menunggu'}</span>
                      </span>
                    </li>
                  )
                })}
              </ol>
                ) : (
                  <>
              <ul className="mb-3 list-disc space-y-1.5 pl-5 text-small">
                <li>Penelitian serupa menunjukkan faktor ras dan etnis sangat memengaruhi akurasi.</li>
                <li>Komunitas autistik mempertanyakan premis bahwa autisme bisa "dilihat" dari wajah.</li>
              </ul>
              <Link to="/model-card" className="inline-flex min-h-touch items-center font-semibold">
                Baca model card lengkap →
              </Link>
                  </>
                )}
              </div>
            )}
            <button
              type="button"
              role="switch"
              aria-checked={tta}
              disabled={phase === 'processing'}
              onClick={() => setTta((v) => !v)}
              className="flex min-h-touch w-full items-center justify-between gap-4 bg-transparent p-0 text-left"
            >
              <span>
                <span className="block font-semibold">Test-Time Augmentation (TTA)</span>
                <span className="block text-caption text-ink-3">
                  Menggabungkan beberapa versi gambar agar prediksi lebih stabil. Lebih lambat.
                </span>
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'relative inline-block h-7 w-12 flex-none rounded-full border-2',
                  tta ? 'border-primary bg-primary' : 'border-line-input bg-line-input',
                )}
              >
                <span className={cn('absolute top-1 h-4 w-4 rounded-full bg-white', tta ? 'left-6' : 'left-1')} />
              </span>
            </button>
          </div>
          {phase === 'upload' && (
            <>
              <div className="mb-5 rounded-lg border-2 border-dashed border-line-dashed px-6 py-10 text-center">
                <h2 className="mb-1.5 text-[1.5rem]">Unggah foto anak</h2>
                <p className="mb-5 text-ink-3">Wajah menghadap depan, cahaya cukup terang, ekspresi natural.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button disabled={!consent} onClick={() => inputRef.current?.click()}>
                    Pilih foto
                  </Button>
                  <Button variant="secondary" disabled={!consent} onClick={() => cameraRef.current?.click()}>
                    Buka kamera
                  </Button>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-label="Pilih foto dari perangkat"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
                <input
                  ref={cameraRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  aria-label="Ambil foto dengan kamera"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
              </div>
              <div className="flex items-start gap-3">
                <input
                  id="izin"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-6 w-6 flex-none accent-primary"
                />
                <label htmlFor="izin" className="cursor-pointer text-small">
                  Saya orang tua atau wali sah dari anak ini dan menyetujui pemrosesan foto untuk demo riset. Foto
                  dikirim ke layanan model-ai untuk dianalisis.
                </label>
              </div>
            </>
          )}

          {phase !== 'upload' && previewUrl && (
            <div className="flex flex-wrap items-start gap-7">
              <div className="flex-none">
                <div className="relative h-[17.5rem] w-[15rem] overflow-hidden rounded-lg bg-tint">
                  <img src={previewUrl} alt="Foto yang Anda unggah, hanya tampil di perangkat ini" className="h-full w-full object-cover" />
                  {phase === 'result' && result?.face_box && (
                    <div
                      className="absolute rounded-sm border-[3px] border-accent"
                      style={{
                        left: `${result.face_box.x * 100}%`,
                        top: `${result.face_box.y * 100}%`,
                        width: `${result.face_box.w * 100}%`,
                        height: `${result.face_box.h * 100}%`,
                      }}
                      aria-hidden="true"
                    />
                  )}
                </div>
                {phase === 'result' && result?.face_detected && result.cropped_face && (
                  <figure className="mt-3 text-caption text-ink-3">
                    <img src={result.cropped_face} alt="Wajah hasil pangkas yang dianalisis model" className="h-24 w-24 rounded-md object-cover" />
                    <figcaption className="mt-1">Bagian foto yang dianalisis</figcaption>
                  </figure>
                )}
              </div>

              <div className="min-w-[min(16rem,100%)] flex-[1_1_16rem]">
                {phase === 'ready' && (
                  <>
                    <h2 className="mb-2 text-[1.5rem]">Foto siap dianalisis</h2>
                    <p className="mb-5 text-ink-2">
                      Model akan mendeteksi wajah lebih dulu, lalu memberi skor dalam persen beserta level risikonya.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={analyze}>Mulai analisis</Button>
                      <Button variant="secondary" onClick={reset}>
                        Ganti foto
                      </Button>
                    </div>
                  </>
                )}

                {phase === 'processing' && (
                  <div role="status">
                    <h2 className="mb-2 text-[1.5rem]">Menganalisis...</h2>
                    <p className="text-ink-2">Model sedang bekerja. Ini bisa memakan waktu sampai satu menit.</p>
                  </div>
                )}

                {phase === 'result' && result && copy && (
                  <div aria-live="polite">
                    <p className="mb-2 text-caption font-bold uppercase tracking-[0.06em] text-accent">Hasil eksperimen</p>
                    {!result.face_detected ? (
                      <>
                        <h2 className="mb-3 text-[1.625rem] text-primary">Wajah tidak terdeteksi</h2>
                        <p className="mb-5 text-ink-2">
                          Coba foto lain dengan wajah menghadap depan dan cahaya lebih terang.
                        </p>
                      </>
                    ) : (
                      <>
                        <Badge tone={copy.tone} className="mb-3 !px-4 !py-1.5 !text-body">
                          {copy.title}
                        </Badge>
                        <p className="font-display text-[3.5rem] font-semibold leading-none">{toPercent(result.score)}%</p>
                        <p className="mb-4 text-small text-ink-3">Skor model, bukan peluang diagnosis</p>
                        <div className="mb-4">
                          <RiskBar score={result.score} />
                        </div>
                        <p className="mb-4">{copy.body}</p>
                        <ul className="mb-5 list-disc space-y-1.5 pl-5 text-small text-ink-2">
                          <li>Persentase adalah skor keluaran model, bukan peluang bahwa anak autistik.</li>
                          <li>Model hanya mengenali pola pada foto yang mirip data latihnya.</li>
                          <li>
                            Pratinjau foto hanya tampil di perangkat Anda. Cara layanan menangani foto dijelaskan di{' '}
                            <Link to="/model-card#privasi">model card</Link>.
                          </li>
                        </ul>
                      </>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <Button to="/skrining">Lanjut ke skrining</Button>
                      <Button variant="secondary" onClick={reset}>
                        Hapus foto dan ulangi
                      </Button>
                    </div>
                    <p className="mt-3 text-caption text-ink-3">Versi model: {result.model_version}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-5 rounded-md bg-danger-bg px-4 py-3 text-danger-text">
              {error}
            </p>
          )}
        </section>

      </div>
    </Page>
  )
}
