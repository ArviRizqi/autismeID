import { useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Page } from '../components/ui/Section'
import { sampleServices, serviceTypes, services, type Service, type ServiceType } from '../data/directory'
import { provinces } from '../data/provinces'
import { siteConfig } from '../config/site'
import { cn } from '../lib/cn'

const typeLabel = Object.fromEntries(serviceTypes.map((t) => [t.key, t.label])) as Record<ServiceType, string>
const typeDesc = Object.fromEntries(serviceTypes.map((t) => [t.key, t.desc])) as Record<ServiceType, string>

function formatDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

function ServiceCard({ s }: { s: Service }) {
  const bpjs = s.bpjs === 'ya' ? 'Menerima' : s.bpjs === 'tidak' ? 'Tidak menerima' : 'Belum diketahui'
  return (
    <article className="min-w-0 flex-[1_1_21.25rem] rounded-lg border border-line bg-surface px-[1.375rem] py-5">
      <p className="mb-2.5 inline-block rounded-full bg-ok-bg px-3 py-0.5 text-[0.8125rem] font-bold text-ok-text">
        {typeLabel[s.type]}
      </p>
      <h2 className="mb-1.5 text-h4">{s.name}</h2>
      <p className="mb-3 text-small text-ink-3">{typeDesc[s.type]}</p>
      <dl className="mb-3 text-small leading-normal">
        <dt className="font-bold">Alamat</dt>
        <dd className="mb-1.5 ml-0">
          {s.address}, {s.city}, {s.province}
        </dd>
        {s.hours && (
          <>
            <dt className="font-bold">Jam layanan</dt>
            <dd className="mb-1.5 ml-0">{s.hours}</dd>
          </>
        )}
        {s.phone && (
          <>
            <dt className="font-bold">Telepon</dt>
            <dd className="mb-1.5 ml-0">
              {s.isSample ? s.phone : <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}>{s.phone}</a>}
            </dd>
          </>
        )}
        <dt className="font-bold">BPJS/JKN</dt>
        <dd className="mb-1.5 ml-0">{bpjs}</dd>
        <dt className="font-bold">Terakhir diverifikasi</dt>
        <dd className="ml-0">{s.isSample ? '[tanggal]' : formatDate(s.verifiedAt)}</dd>
      </dl>
      {siteConfig.contact.email && !s.isSample && (
        <a
          className="inline-flex min-h-touch items-center text-small font-semibold"
          href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(`Koreksi info layanan: ${s.name}`)}`}
        >
          Laporkan info keliru
        </a>
      )}
    </article>
  )
}

export default function Directory() {
  const [province, setProvince] = useState<string>('Jawa Tengah')
  const [city, setCity] = useState('')
  const [type, setType] = useState<ServiceType | 'semua'>('semua')

  const all = import.meta.env.DEV ? [...services, ...sampleServices] : services
  const showingSamples = import.meta.env.DEV && services.length === 0

  const list = useMemo(() => {
    const q = city.trim().toLowerCase()
    return all.filter(
      (s) =>
        (s.isSample || s.province === province) &&
        (type === 'semua' || s.type === type) &&
        (q === '' || s.city.toLowerCase().includes(q)),
    )
  }, [all, province, city, type])

  return (
    <Page>
      <h1 className="mb-3 text-h1 text-primary">Direktori layanan</h1>
      <p className="mb-6 max-w-[47.5rem] text-lead text-ink-2">
        Temukan layanan pemeriksaan tumbuh kembang, konsultasi, terapi, dan pendidikan di wilayah Anda.
      </p>

      <div className="mb-7 rounded-md bg-tint px-5 py-4">
        <p>
          <strong>Dalam keadaan darurat</strong>, hubungi <strong>112</strong> atau segera ke IGD terdekat.
        </p>
      </div>

      {showingSamples && (
        <p className="mb-6 rounded-md border-2 border-dashed border-line-dashed p-4 text-caption text-ink-3" role="note">
          Mode pengembangan: entri di bawah adalah contoh kosong dan tidak tampil di produksi. Isi{' '}
          <code>src/data/directory.ts</code> dengan layanan yang sudah Anda verifikasi.
        </p>
      )}

      <Card className="mb-6 !p-[clamp(1.25rem,3vw,1.75rem)]">
        <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-4">
          <div className="min-w-[min(17.5rem,100%)] flex-[1_1_17.5rem]">
            <label htmlFor="prov" className="mb-1.5 block text-small font-semibold">
              Provinsi
            </label>
            <select id="prov" value={province} onChange={(e) => setProvince(e.target.value)} className="field w-full">
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[min(17.5rem,100%)] flex-[1_1_17.5rem]">
            <label htmlFor="kota" className="mb-1.5 block text-small font-semibold">
              Kota atau kabupaten
            </label>
            <input
              id="kota"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ketik nama kota atau kabupaten"
              className="field w-full"
            />
          </div>
        </div>
        <p className="mb-1.5 text-small font-semibold" id="jenis-label">
          Jenis layanan
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="jenis-label">
          {[{ key: 'semua' as const, label: 'Semua' }, ...serviceTypes].map((t) => {
            const active = t.key === type
            return (
              <button
                key={t.key}
                type="button"
                aria-pressed={active}
                onClick={() => setType(t.key)}
                className={cn(
                  'min-h-touch rounded-full border-2 border-primary px-4 text-small font-semibold',
                  active ? 'bg-primary text-white' : 'bg-transparent text-primary',
                )}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </Card>

      <p className="mb-4 text-ink-2" aria-live="polite">
        Menampilkan {list.length} layanan di {province}
        {city.trim() ? `, kata kunci "${city.trim()}"` : ''}.
      </p>

      {list.length > 0 ? (
        <div className="mb-12 flex flex-wrap gap-4">
          {list.map((s) => (
            <ServiceCard key={s.id} s={s} />
          ))}
        </div>
      ) : (
        <Card tone="tint" className="mb-12">
          <h2 className="mb-2 text-h3">Belum ada layanan terdaftar untuk pilihan ini</h2>
          <p className="mb-3 text-ink-2">
            Kami hanya menampilkan layanan yang sudah diverifikasi. Sementara itu, mulai dari Puskesmas terdekat atau
            dokter anak Anda, lalu minta rujukan.
          </p>
          <Button to="/#langkah" variant="ghost">
            Lihat langkah setelah skrining →
          </Button>
        </Card>
      )}

      <div className="mb-8 flex flex-wrap gap-6">
        <Card className="min-w-[min(22.5rem,100%)] flex-[1_1_22.5rem] !px-7 !py-6">
          <h2 className="mb-3 text-h3">Sebelum menghubungi</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Siapkan buku KIA, riwayat imunisasi, dan hasil skrining bila ada.</li>
            <li>Catat perilaku yang membuat Anda khawatir, dengan contoh dan waktunya.</li>
            <li>Tanyakan rentang usia yang dilayani dan perkiraan waktu antrean.</li>
            <li>Tanyakan apakah memerlukan surat rujukan dan apakah menerima BPJS/JKN.</li>
          </ul>
        </Card>
        <Card tone="tint" className="min-w-[min(22.5rem,100%)] flex-[1_1_22.5rem] !px-7 !py-6">
          <h2 className="mb-3 text-h3">Tentang data ini</h2>
          <p className="mb-2.5">
            Kami tidak merekomendasikan layanan tertentu, dan tidak menjamin mutu terapi. Tanyakan kualifikasi terapis
            sebelum memulai.
          </p>
          <p>Setiap entri mencantumkan tanggal verifikasi terakhir. Bila informasinya sudah berubah, mohon beri tahu kami.</p>
        </Card>
      </div>
    </Page>
  )
}
