import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Eyebrow, Section } from '../components/ui/Section'
import { aiSteps, ageSigns, myths, stats, steps } from '../data/content'

const pathCard =
  'block rounded-lg p-6 no-underline'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Section>
        <div className="flex flex-wrap items-center gap-12 !py-0">
          <div className="min-w-0 flex-[1_1_30rem]">
            <Eyebrow>Pusat informasi tumbuh kembang anak</Eyebrow>
            <h1 className="mb-6 text-hero text-primary">Khawatir dengan perkembangan anak Anda? Mulai dari sini.</h1>
            <p className="mb-8 max-w-[35rem] text-lead text-ink-2">
              Pelajari tanda-tanda perkembangan, isi kuesioner skrining, dan ketahui langkah berikutnya, dalam bahasa
              yang mudah dipahami.
            </p>
            <div className="mb-6 flex flex-wrap gap-3">
              <Button to="/skrining">Mulai skrining perkembangan</Button>
              <Button to="/#tanda" variant="secondary">
                Baca tanda per usia dulu
              </Button>
            </div>
            <p className="max-w-[32.5rem] text-small text-ink-3">
              Skrining bukan diagnosis. Hasilnya membantu Anda memutuskan apakah perlu berkonsultasi dengan dokter atau
              psikolog anak.
            </p>
          </div>

          <div className="flex min-w-0 flex-[1_1_25rem] flex-col gap-3">
            <h2 className="mb-1 text-[1.375rem]">Saya ingin...</h2>
            <Link to="/skrining" className={`${pathCard} bg-primary text-white hover:bg-primary-deep hover:text-white`}>
              <span className="mb-1.5 block font-display text-h3 font-semibold">Memeriksa perkembangan anak saya</span>
              <span className="block text-on-deep">
                Kuesioner skrining untuk anak usia 16 sampai 30 bulan. Diisi orang tua atau pengasuh.
              </span>
              <span className="mt-3 block font-semibold">Mulai skrining →</span>
            </Link>
            <Link to="/#langkah" className={`${pathCard} border border-line bg-surface text-ink hover:text-ink`}>
              <span className="mb-1.5 block font-display text-h3 font-semibold">Anak saya sudah didiagnosis. Apa selanjutnya?</span>
              <span className="block text-ink-2">Terapi, sekolah inklusif, dan dukungan untuk keluarga.</span>
              <span className="mt-3 block font-semibold text-accent">Lihat panduan →</span>
            </Link>
            <Link to="/#mitos" className={`${pathCard} border border-line bg-surface text-ink hover:text-ink`}>
              <span className="mb-1.5 block font-display text-h3 font-semibold">Memahami autisme dan neurodiversitas</span>
              <span className="block text-ink-2">Penjelasan yang akurat, dengan sumber yang bisa diperiksa.</span>
              <span className="mt-3 block font-semibold text-accent">Mulai belajar →</span>
            </Link>
          </div>
        </div>
      </Section>

      {/* Eksperimen AI */}
      <Section id="eksperimen" labelledBy="h-ai" tone="surface">
        <Eyebrow>Eksperimen riset · bukan alat skrining</Eyebrow>
        <h2 id="h-ai" className="mb-3 max-w-[50rem] text-h2 text-primary">
          Klasifikasi wajah dengan AI: cara kerjanya dan batasannya
        </h2>
        <p className="mb-9 max-w-[45rem] text-lead text-ink-2">
          Kami mengembangkan model pengenalan pola pada foto wajah anak sebagai eksperimen teknis. Kami menampilkannya apa
          adanya, termasuk ketidakpastian dan keterbatasannya.
        </p>
        <ol className="mb-8 flex list-none flex-wrap gap-4 p-0">
          {aiSteps.map((s, i) => (
            <li key={s.title} className="min-w-[min(13.75rem,100%)] flex-[1_1_13.75rem] rounded-lg border border-line bg-bg p-5">
              <p className="mb-2 font-display text-[1.75rem] font-semibold leading-none text-accent" aria-hidden="true">
                {i + 1}
              </p>
              <h3 className="mb-1.5 text-h4">{s.title}</h3>
              <p className="text-small text-ink-2">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mb-5 flex flex-wrap gap-3">
          <Button to="/ai">Coba demo riset</Button>
          <Button to="/model-card" variant="secondary">
            Baca model card
          </Button>
        </div>
        <p className="max-w-[45rem] text-small text-ink-3">
          Hasil demo tidak boleh dipakai untuk keputusan klinis. Untuk skrining yang tervalidasi, gunakan kuesioner
          M-CHAT-R/F.
        </p>
      </Section>

      {/* Angka */}
      <Section labelledBy="h-angka" tone="tint">
        <h2 id="h-angka" className="mb-3 text-h2 text-primary">Mengapa mengenali lebih awal itu penting</h2>
        <p className="mb-10 max-w-[42.5rem] text-lead text-ink-2">Angka di bawah ini berasal dari sumber yang bisa Anda periksa sendiri.</p>
        <div className="flex flex-wrap gap-6">
          {stats.map((s) => (
            <div key={s.value} className="min-w-[min(17.5rem,100%)] flex-[1_1_17.5rem] border-t-[3px] border-accent pt-5">
              <p className="mb-2 font-display text-stat font-semibold text-accent">{s.value}</p>
              <p>{s.text}</p>
              <p className="mt-3 text-caption text-ink-3">Sumber: {s.source}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Tanda per usia */}
      <Section id="tanda" labelledBy="h-tanda">
        <h2 id="h-tanda" className="mb-3 text-h2 text-primary">Kenali tanda per usia</h2>
        <p className="mb-9 max-w-[42.5rem] text-lead text-ink-2">
          Setiap anak berkembang dengan kecepatan berbeda. Daftar ini ringkas dan bukan pengganti penilaian dokter.
        </p>
        <div className="mb-6 flex flex-wrap gap-4">
          {ageSigns.map((a) => (
            <Card key={a.title} className="min-w-[min(15rem,100%)] flex-[1_1_15rem]">
              <h3 className="mb-3 text-h3">{a.title}</h3>
              <ul className="list-disc space-y-2 pl-5 text-ink-2">
                {a.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <Card tone="tint" className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 !py-5">
          <p className="min-w-[min(22rem,100%)] flex-[1_1_22rem]">
            <strong>Pada usia berapa pun</strong>, bila anak kehilangan kemampuan bicara atau sosial yang sebelumnya sudah
            dimiliki, segera konsultasikan ke dokter anak.
          </p>
          <Button to="/#langkah" variant="ghost">
            Apa langkah berikutnya →
          </Button>
        </Card>
      </Section>

      {/* Langkah */}
      <Section id="langkah" labelledBy="h-langkah" tone="surface">
        <h2 id="h-langkah" className="mb-3 text-h2 text-primary">Setelah skrining, apa langkahnya?</h2>
        <p className="mb-10 max-w-[42.5rem] text-lead text-ink-2">Skrining hanyalah langkah pertama. Berikut jalur yang umum ditempuh keluarga.</p>
        <ol className="mb-8 flex list-none flex-wrap gap-6 p-0">
          {steps.map((s, i) => (
            <li key={s.title} className="min-w-[min(15rem,100%)] flex-[1_1_15rem]">
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border-2 border-accent font-display text-[1.25rem] font-semibold text-accent"
                aria-hidden="true"
              >
                {i + 1}
              </div>
              <h3 className="mb-2 text-h3">{s.title}</h3>
              <p className="text-ink-2">{s.text}</p>
            </li>
          ))}
        </ol>
        <Card tone="tint" className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 !py-5">
          <p className="min-w-[min(22rem,100%)] flex-[1_1_22rem]">
            <strong>Cari layanan di wilayah Anda:</strong> Puskesmas, dokter tumbuh kembang, psikolog anak, terapi, dan
            sekolah inklusif.
          </p>
          <Button to="/direktori" size="sm">
            Buka direktori layanan
          </Button>
        </Card>
      </Section>

      {/* Mitos dan fakta */}
      <Section id="mitos" labelledBy="h-mitos">
        <h2 id="h-mitos" className="mb-9 text-h2 text-primary">Mitos dan fakta</h2>
        <div className="border-t border-line">
          {myths.map((m) => (
            <div key={m.myth} className="flex flex-wrap gap-x-10 gap-y-3 border-b border-line py-6">
              <p className="min-w-[min(17.5rem,100%)] flex-[1_1_17.5rem] font-display text-h3 font-medium text-ink-3">“{m.myth}”</p>
              <div className="min-w-[min(23.75rem,100%)] flex-[1_1_23.75rem]">
                <p className="mb-1 text-caption font-bold uppercase tracking-[0.06em] text-accent">Fakta</p>
                <p>{m.fact}</p>
                <p className="mt-2 text-caption text-ink-3">Sumber: {m.source}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Transparansi */}
      <Section id="transparansi" labelledBy="h-trans" tone="tint">
        <h2 id="h-trans" className="mb-9 text-h2 text-primary">Transparansi dan kepercayaan</h2>
        <div className="flex flex-wrap gap-8">
          <div className="min-w-[min(17.5rem,100%)] flex-[1_1_17.5rem]">
            <h3 className="mb-2 text-h3">Kami tidak mendiagnosis</h3>
            <p className="text-ink-2">
              AutismeID menyediakan informasi dan skrining awal. Diagnosis hanya dapat ditegakkan oleh tenaga kesehatan
              yang berwenang.
            </p>
          </div>
          <div className="min-w-[min(17.5rem,100%)] flex-[1_1_17.5rem]">
            <h3 className="mb-2 text-h3">Tentang eksperimen AI kami</h3>
            <p className="mb-2 text-ink-2">Analisis foto wajah adalah eksperimen riset, bukan alat skrining.</p>
            <Button to="/model-card" variant="ghost">
              Baca model card →
            </Button>
          </div>
          <div className="min-w-[min(17.5rem,100%)] flex-[1_1_17.5rem]">
            <h3 className="mb-2 text-h3">Chat yang menyebut sumbernya</h3>
            <p className="mb-2 text-ink-2">
              Asisten kami menjawab dari paper rujukan, lengkap dengan sumbernya, dan menolak menebak bila sumber tidak
              cukup.
            </p>
            <Button to="/chat" variant="ghost">
              Tanya AutismeID →
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
