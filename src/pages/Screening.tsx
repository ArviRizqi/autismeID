import { useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Eyebrow, Page } from '../components/ui/Section'
import { SCREENING_IS_SAMPLE, screeningItems } from '../data/screening'
import { screeningLevelCopy } from '../lib/levels'
import { screeningLevel } from '../lib/scoring'
import { cn } from '../lib/cn'

type Answer = 'ya' | 'tidak'

export default function Screening() {
  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])

  const total = screeningItems.length
  const index = answers.length
  const finished = started && index >= total
  const item = screeningItems[Math.min(index, total - 1)]

  const answer = (a: Answer) => setAnswers((prev) => [...prev, a])
  const back = () => {
    if (answers.length === 0) setStarted(false)
    else setAnswers((prev) => prev.slice(0, -1))
  }
  const restart = () => {
    setAnswers([])
    setStarted(false)
  }

  const riskCount = answers.filter((a, i) => a === screeningItems[i].riskAnswer).length
  const level = screeningLevel(riskCount)
  const copy = screeningLevelCopy[level]

  return (
    <Page width="narrow">
      <div className="mx-auto max-w-[47.5rem]">
        <div className="rounded-xl border border-line bg-surface p-[clamp(1.5rem,5vw,3rem)]">
          {!started && (
            <>
              <Eyebrow>Skrining perkembangan</Eyebrow>
              <h1 className="mb-4 text-h1 text-primary">Sebelum mulai</h1>
              <ul className="mb-6 list-disc space-y-2 pl-5 text-lead">
                <li>
                  Untuk anak usia <strong>16 sampai 30 bulan</strong>
                </li>
                <li>Dijawab oleh orang tua atau pengasuh yang sehari-hari bersama anak</li>
                <li>
                  Hasilnya adalah <strong>tingkat risiko</strong>, bukan diagnosis
                </li>
              </ul>
              <p className="mb-7 text-small text-ink-3">
                Jawaban Anda diproses di perangkat ini dan tidak dikirim ke server.
              </p>
              <Button onClick={() => setStarted(true)} className="min-h-14 px-8 text-lead">
                Mulai menjawab
              </Button>
            </>
          )}

          {started && !finished && (
            <>
              <div className="mb-3 flex gap-1.5" aria-hidden="true">
                {screeningItems.map((_, i) => (
                  <div
                    key={i}
                    className={cn('h-2 flex-1 rounded', i < index ? 'bg-primary' : i === index ? 'bg-accent' : 'bg-line')}
                  />
                ))}
              </div>
              <p className="mb-8 text-small text-ink-3" aria-live="polite">
                Pertanyaan {index + 1} dari {total}
              </p>
              <h1 className="mb-4 text-[clamp(1.625rem,4vw,2.25rem)] leading-[1.25] text-ink">{item.text}</h1>
              <p className="mb-8 text-ink-3">
                Pikirkan perilaku yang paling sering Anda lihat. Jika perilaku itu jarang muncul, jawab “Tidak”.
              </p>
              <div className="mb-7 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => answer('ya')} className="min-h-16 flex-[1_1_12.5rem] bg-surface text-[1.25rem]">
                  Ya
                </Button>
                <Button variant="secondary" onClick={() => answer('tidak')} className="min-h-16 flex-[1_1_12.5rem] bg-surface text-[1.25rem]">
                  Tidak
                </Button>
              </div>
              <Button variant="ghost" onClick={back}>
                ← Kembali
              </Button>
            </>
          )}

          {finished && (
            <>
              <Eyebrow>Hasil skrining</Eyebrow>
              <Badge tone={copy.tone} className="mb-5 !px-4 !py-2 !text-body">
                {copy.title}
              </Badge>
              <h1 className="mb-4 text-h1 text-primary">Ini bukan diagnosis.</h1>
              <p className="mb-6 text-lead">{copy.body}</p>
              <p className="mb-6 text-lead">
                Anda tidak perlu menunggu diagnosis resmi untuk mulai mencari dukungan dan stimulasi.
              </p>
              <div className="mb-6 flex flex-wrap gap-3">
                <Button to="/#langkah">Lihat langkah berikutnya</Button>
                <Button to="/direktori" variant="secondary">
                  Cari layanan
                </Button>
                <Button variant="secondary" onClick={() => window.print()}>
                  Cetak ringkasan
                </Button>
              </div>
              <Button variant="ghost" onClick={restart}>
                Ulangi skrining
              </Button>
            </>
          )}
        </div>

        {SCREENING_IS_SAMPLE && (
          <p className="mt-6 rounded-md border-2 border-dashed border-line-dashed p-4 text-caption text-ink-3">
            Catatan pengembang: lima pertanyaan ini hanya contoh dari 20 butir M-CHAT-R/F. Ganti dengan butir resmi
            versi Indonesia setelah memeriksa ketentuan lisensinya, dan hitung hasil dengan algoritma resminya.
            Ubah <code>SCREENING_IS_SAMPLE</code> di <code>src/data/screening.ts</code> untuk menghilangkan catatan ini.
          </p>
        )}
      </div>
    </Page>
  )
}
