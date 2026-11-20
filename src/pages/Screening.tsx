import { useState, type FormEvent } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Eyebrow, Page } from '../components/ui/Section'
import { MCHAT_SOURCE, OFFICIAL_ITEMS, SCREENING_READY } from '../data/screening'
import { screeningLevelCopy } from '../lib/levels'
import { MCHAT_ITEM_COUNT, mchatLevel, mchatScore, type Answer } from '../lib/scoring'
import { cn } from '../lib/cn'

function Credit() {
  return <p className="mt-6 text-caption text-ink-3">{MCHAT_SOURCE.credit}</p>
}

function Result({ score, onRestart }: { score: number; onRestart: () => void }) {
  const level = mchatLevel(score)
  const copy = screeningLevelCopy[level]
  return (
    <>
      <Eyebrow>Hasil skrining M-CHAT-R/F</Eyebrow>
      <Badge tone={copy.tone} className="mb-3 !px-4 !py-2 !text-body">
        {copy.title}
      </Badge>
      <p className="mb-5 text-lead">
        <strong>{score}</strong> dari {MCHAT_ITEM_COUNT} butir berisiko <span className="text-ink-3">({copy.range})</span>
      </p>
      <h1 className="mb-4 text-h1 text-primary">Ini bukan diagnosis.</h1>
      <p className="mb-6 text-lead">{copy.body}</p>
      <p className="mb-6 text-lead">
        Anda tidak perlu menunggu diagnosis resmi untuk mulai mencari dukungan dan stimulasi. Skrining ini bisa
        menghasilkan hasil positif pada anak yang ternyata tidak autistik, tetapi sering menandai kebutuhan perkembangan
        lain yang juga layak dinilai.
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
      <Button variant="ghost" onClick={onRestart}>
        Ulangi skrining
      </Button>
      <Credit />
    </>
  )
}

/** Alur interaktif. Hanya dipakai bila ke-20 butir resmi sudah dipasang di data/screening.ts. */
function Questionnaire() {
  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])
  const total = OFFICIAL_ITEMS.length
  const index = answers.length
  const finished = started && index >= total

  const restart = () => {
    setAnswers([])
    setStarted(false)
  }
  const back = () => (answers.length === 0 ? setStarted(false) : setAnswers((p) => p.slice(0, -1)))

  if (finished) return <Result score={mchatScore(answers)} onRestart={restart} />

  if (!started)
    return (
      <>
        <Eyebrow>Skrining perkembangan</Eyebrow>
        <h1 className="mb-4 text-h1 text-primary">Sebelum mulai</h1>
        <ul className="mb-6 list-disc space-y-2 pl-5 text-lead">
          <li>
            Untuk anak usia <strong>16 sampai 30 bulan</strong>
          </li>
          <li>Dijawab oleh orang tua atau pengasuh yang sehari-hari bersama anak</li>
          <li>Ada {total} pertanyaan, sekitar 2 menit</li>
          <li>
            Hasilnya adalah <strong>tingkat risiko</strong>, bukan diagnosis
          </li>
        </ul>
        <p className="mb-7 text-small text-ink-3">Jawaban Anda diproses di perangkat ini dan tidak dikirim ke server.</p>
        <Button onClick={() => setStarted(true)} className="min-h-14 px-8 text-lead">
          Mulai menjawab
        </Button>
        <Credit />
      </>
    )

  return (
    <>
      <div className="mb-3 flex gap-1" aria-hidden="true">
        {OFFICIAL_ITEMS.map((_, i) => (
          <div key={i} className={cn('h-2 flex-1 rounded', i < index ? 'bg-primary' : i === index ? 'bg-accent' : 'bg-line')} />
        ))}
      </div>
      <p className="mb-8 text-small text-ink-3" aria-live="polite">
        Pertanyaan {index + 1} dari {total}
      </p>
      <h1 className="mb-4 text-[clamp(1.5rem,4vw,2rem)] leading-[1.3] text-ink">{OFFICIAL_ITEMS[index]}</h1>
      <p className="mb-8 text-ink-3">
        Pikirkan bagaimana anak biasanya berperilaku. Bila perilaku itu jarang terlihat (misalnya baru sekali atau dua
        kali), jawab seolah-olah anak belum melakukannya.
      </p>
      <div className="mb-7 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setAnswers((p) => [...p, 'ya'])} className="min-h-16 flex-[1_1_12.5rem] bg-surface text-[1.25rem]">
          Ya
        </Button>
        <Button variant="secondary" onClick={() => setAnswers((p) => [...p, 'tidak'])} className="min-h-16 flex-[1_1_12.5rem] bg-surface text-[1.25rem]">
          Tidak
        </Button>
      </div>
      <Button variant="ghost" onClick={back}>
        ← Kembali
      </Button>
      <Credit />
    </>
  )
}

/** Tampilan bawaan: formulir resmi dikerjakan di sumbernya, di sini hanya penghitung skor dan penjelasan hasil. */
function OfficialFormFlow() {
  const [raw, setRaw] = useState('')
  const [score, setScore] = useState<number | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n = Number(raw)
    if (raw.trim() !== '' && Number.isInteger(n) && n >= 0 && n <= MCHAT_ITEM_COUNT) setScore(n)
  }
  const valid = raw.trim() !== '' && Number.isInteger(Number(raw)) && Number(raw) >= 0 && Number(raw) <= MCHAT_ITEM_COUNT

  if (score !== null)
    return (
      <Result
        score={score}
        onRestart={() => {
          setScore(null)
          setRaw('')
        }}
      />
    )

  return (
    <>
      <Eyebrow>Skrining perkembangan</Eyebrow>
      <h1 className="mb-4 text-h1 text-primary">Skrining M-CHAT-R/F</h1>
      <p className="mb-6 text-lead text-ink-2">
        M-CHAT-R/F adalah kuesioner skrining autisme yang paling banyak dipakai untuk anak usia{' '}
        <strong>16 sampai 30 bulan</strong>. Pertanyaannya dijawab orang tua atau pengasuh, dan hasilnya adalah tingkat
        risiko, bukan diagnosis.
      </p>

      <ol className="mb-8 flex list-none flex-col gap-7 p-0">
        <li>
          <h2 className="mb-2 text-h3">1. Siapkan diri</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-ink-2">
            <li>
              Yang mengisi: orang tua atau pengasuh yang sehari-hari bersama anak. Anak berusia{' '}
              <strong>16 sampai 30 bulan</strong>.
            </li>
            <li>Waktu: sekitar 2 menit. Cari tempat tenang, dan ingat perilaku anak seminggu terakhir.</li>
            <li>Siapkan pena bila mencetak formulirnya. Bisa juga diisi langsung di layar.</li>
          </ul>
        </li>
        <li>
          <h2 className="mb-2 text-h3">2. Isi formulir resminya</h2>
          <p className="mb-3 text-ink-2">
            Pemilik kuesioner mewajibkan 20 pertanyaannya dipakai utuh dan tidak diubah, jadi formulir diisi dari sumber
            resminya, versi bahasa Indonesia. Gratis.
          </p>
          <Button href={MCHAT_SOURCE.indonesianForm}>
            Buka formulir resmi (PDF)
            <span className="sr-only"> (tab baru)</span>
          </Button>
          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-ink-2">
            <li>Jawab semua pertanyaan dengan “Ya” atau “Tidak”. Jangan ada yang dikosongkan.</li>
            <li>
              Jawab berdasarkan perilaku yang <strong>biasanya</strong> terlihat. Bila perilaku itu baru sekali dua kali
              muncul dan bukan kebiasaan anak, jawab seolah-olah anak belum melakukannya.
            </li>
            <li>
              Bila ragu, perhatikan anak beberapa hari, atau tanyakan kepada orang lain yang sering bersamanya (misalnya
              pengasuh atau kakek-nenek), lalu jawab.
            </li>
            <li>Jangan melatih anak lebih dulu supaya “lulus”. Tujuannya melihat kebiasaannya sehari-hari.</li>
          </ul>
        </li>
        <li>
          <h2 className="mb-2 text-h3">3. Hitung butir yang berisiko</h2>
          <p className="mb-2 text-ink-2">
            Satu butir dihitung <strong>1 poin</strong> bila jawabannya berisiko:
          </p>
          <ul className="mb-2 list-disc space-y-1.5 pl-5 text-ink-2">
            <li>
              Butir <strong>2, 5, dan 12</strong>: jawaban <strong>“Ya”</strong> berisiko.
            </li>
            <li>
              17 butir lainnya (1, 3, 4, 6 sampai 11, 13 sampai 20): jawaban <strong>“Tidak”</strong> berisiko.
            </li>
          </ul>
          <p className="text-ink-2">Jumlahkan seluruh poin. Hasilnya angka antara 0 dan 20. Formulir resmi juga memuat petunjuk penilaian yang sama.</p>
        </li>
        <li>
          <h2 className="mb-2 text-h3">4. Masukkan jumlahnya di sini</h2>
          <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="skor" className="mb-1.5 block text-small font-semibold">
                Jumlah butir berisiko (0 sampai {MCHAT_ITEM_COUNT})
              </label>
              <input
                id="skor"
                type="number"
                inputMode="numeric"
                min={0}
                max={MCHAT_ITEM_COUNT}
                step={1}
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                className="field w-40"
              />
            </div>
            <Button type="submit" disabled={!valid}>
              Lihat arti hasilnya
            </Button>
          </form>
          <p className="mt-3 text-small text-ink-3">Angka ini tidak dikirim ke server.</p>
        </li>
        <li>
          <h2 className="mb-2 text-h3">5. Tindak lanjut sesuai skor</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-ink-2">
            <li>
              <strong>0 sampai 2 (rendah):</strong> lanjutkan pemantauan rutin. Bila anak belum berusia 24 bulan, isi
              ulang setelah ulang tahun keduanya.
            </li>
            <li>
              <strong>3 sampai 7 (sedang):</strong> bawa formulir yang sudah diisi ke Puskesmas atau dokter anak untuk
              wawancara tindak lanjut.
            </li>
            <li>
              <strong>8 sampai 20 (tinggi):</strong> segera minta rujukan evaluasi ke dokter anak tumbuh kembang atau
              psikolog anak.
            </li>
            <li>Berapa pun skornya, bila Anda khawatir, tetap konsultasikan. Catat contoh perilaku dan kapan terjadinya.</li>
          </ul>
        </li>
      </ol>

      <p className="rounded-md bg-tint px-4 py-3 text-small text-ink-2">
        Skor 0 sampai 2 berarti risiko rendah, 3 sampai 7 sedang (perlu wawancara tindak lanjut oleh tenaga kesehatan),
        dan 8 sampai 20 tinggi. Berapa pun skornya, bila Anda atau tenaga kesehatan khawatir pada perkembangan anak,
        konsultasikan.
      </p>
      <Credit />
    </>
  )
}

export default function Screening() {
  return (
    <Page width="narrow">
      <div className="mx-auto max-w-[47.5rem]">
        <div className="rounded-xl border border-line bg-surface p-[clamp(1.5rem,5vw,3rem)]">
          {SCREENING_READY ? <Questionnaire /> : <OfficialFormFlow />}
        </div>
      </div>
    </Page>
  )
}