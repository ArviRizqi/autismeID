import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Page, Val } from '../components/ui/Section'
import { modelCard as mc, modelCardReferences } from '../content/modelCard'
import { SCORE_THRESHOLDS } from '../lib/scoring'

const toc = [
  ['tujuan', 'Tujuan'],
  ['data', 'Data'],
  ['arsitektur', 'Arsitektur'],
  ['evaluasi', 'Evaluasi'],
  ['level', 'Level risiko'],
  ['subkelompok', 'Subkelompok'],
  ['batasan', 'Keterbatasan'],
  ['privasi', 'Privasi'],
  ['rujukan', 'Rujukan'],
]

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mb-4 scroll-mt-4 text-[clamp(1.625rem,3vw,2rem)] text-primary">
      {children}
    </h2>
  )
}

function KV({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface">
      <table>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b border-line last:border-b-0">
              <th scope="row" className="w-1/3 bg-tint px-3.5 py-3 text-left align-top font-bold">{k}</th>
              <td className="px-3.5 py-3 align-top">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface">
      <table>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="bg-tint px-3.5 py-3 text-left font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line">
              {r.map((c, j) => (
                <td key={j} className="px-3.5 py-3 align-top">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ModelCard() {
  const lowPct = Math.round(SCORE_THRESHOLDS.sedang * 100)
  const highPct = Math.round(SCORE_THRESHOLDS.tinggi * 100)

  return (
    <Page width="narrow">
      <p className="mb-4 inline-block rounded-full border-[1.5px] border-accent px-3.5 py-1 text-caption font-bold uppercase tracking-[0.06em] text-accent">
        Eksperimen riset · versi <Val>{mc.version}</Val> · diperbarui <Val>{mc.updatedAt}</Val>
      </p>
      <h1 className="mb-4 text-h1 text-primary">Model card: klasifikasi wajah AutismeID</h1>
      <p className="mb-7 max-w-[47.5rem] text-lead text-ink-2">
        Dokumen ini menjelaskan apa yang dilakukan model, dengan data apa ia dilatih, seberapa baik ia diuji, dan di mana
        ia bisa salah. Bagian yang bertanda <span className="placeholder-chip">Belum dipublikasikan</span> berarti informasinya belum kami terbitkan. Kami tidak mengisinya dengan perkiraan.
      </p>

      <Card tone="tint" className="mb-8 !p-7">
        <h2 className="mb-3 text-h3">Ringkasan singkat</h2>
        <ul className="list-disc space-y-2 pl-5 text-lead">
          <li>
            <strong>Apa yang dilakukan:</strong> menghitung skor (dalam persen) dari foto wajah anak, lalu memetakannya ke
            level risiko rendah, sedang, atau tinggi.
          </li>
          <li>
            <strong>Apa yang tidak dilakukan:</strong> tidak mendiagnosis dan tidak menggantikan skrining tervalidasi
            seperti M-CHAT-R/F.
          </li>
          <li>
            <strong>Tidak boleh dipakai untuk:</strong> keputusan klinis, penerimaan sekolah, asuransi, pekerjaan, atau
            penilaian anak orang lain tanpa persetujuan wali.
          </li>
        </ul>
      </Card>

      <nav aria-label="Daftar isi" className="mb-10 flex flex-wrap gap-x-2 gap-y-1">
        {toc.map(([id, label]) => (
          <Link
            key={id}
            to={`/model-card#${id}`}
            className="inline-flex min-h-touch items-center rounded-full border border-line bg-surface px-3.5 text-small font-semibold no-underline"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-14">
        <section aria-labelledby="tujuan">
          <H2 id="tujuan">1. Tujuan dan batas penggunaan</H2>
          <div className="flex flex-wrap gap-4">
            <Card className="min-w-[min(18.75rem,100%)] flex-[1_1_18.75rem]">
              <h3 className="mb-2.5 text-h4">Penggunaan yang dimaksud</h3>
              <ul className="list-disc space-y-1.5 pl-5 text-ink-2">
                <li>Demonstrasi teknis dan edukasi tentang cara kerja model.</li>
                <li>Bahan riset dan diskusi tentang keterbatasan AI pada skrining.</li>
                <li>Pengguna: orang tua atau wali yang memberi persetujuan, serta peneliti.</li>
              </ul>
            </Card>
            <Card className="min-w-[min(18.75rem,100%)] flex-[1_1_18.75rem]">
              <h3 className="mb-2.5 text-h4">Di luar cakupan</h3>
              <ul className="list-disc space-y-1.5 pl-5 text-ink-2">
                <li>Diagnosis atau keputusan klinis.</li>
                <li>Penyaringan anak oleh sekolah, perusahaan, atau asuransi.</li>
                <li>Foto tanpa persetujuan wali sah.</li>
                <li>Usia di luar rentang data latih.</li>
              </ul>
            </Card>
          </div>
        </section>

        <section aria-labelledby="data">
          <H2 id="data">2. Data</H2>
          <KV
            rows={[
              ['Dataset latih', <Val>{mc.data.dataset}</Val>],
              ['Jumlah gambar dan anak', <Val>{mc.data.counts}</Val>],
              ['Cara pelabelan', <Val>{mc.data.labeling}</Val>],
              ['Sebaran usia dan jenis kelamin', <Val>{mc.data.demographics}</Val>],
              ['Sebaran etnis atau asal', <Val>{mc.data.ethnicity}</Val>],
              ['Lisensi dan persetujuan', <Val>{mc.data.license}</Val>],
              ['Pembagian latih, validasi, uji', <Val>{mc.data.splitNote}</Val>],
            ]}
          />
        </section>

        <section aria-labelledby="arsitektur">
          <H2 id="arsitektur">3. Arsitektur dan alur pemrosesan</H2>
          <ol className="mb-4 flex list-none flex-wrap items-stretch gap-3 p-0">
            {[
              ['Foto', 'Unggahan atau kamera, dengan persetujuan wali'],
              ['Deteksi wajah', 'MTCNN, lalu pangkas dan ratakan'],
              ['Klasifikasi', 'CNN, opsi TTA'],
              ['Skor dan level', 'Persen, lalu rendah, sedang, tinggi'],
            ].map(([t, d], i) => (
              <li key={t} className="flex min-w-[min(9.375rem,100%)] flex-[1_1_9.375rem] items-stretch gap-3">
                <div className="flex-1 rounded-md border border-line bg-surface p-4">
                  <p className="mb-1 font-bold">{t}</p>
                  <p className="text-small text-ink-2">{d}</p>
                </div>
                {i < 3 && (
                  <span aria-hidden="true" className="flex items-center font-bold text-accent">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
          <KV
            rows={[
              ['Detektor wajah', <Val>{mc.pipeline.detector}</Val>],
              ['Model klasifikasi', <Val>{mc.pipeline.classifier}</Val>],
              ['Test-Time Augmentation', <Val>{mc.pipeline.tta}</Val>],
              ['Lingkungan', <Val>{mc.pipeline.runtime}</Val>],
            ]}
          />
        </section>

        <section aria-labelledby="evaluasi">
          <H2 id="evaluasi">4. Evaluasi</H2>
          <p className="mb-4 text-lead text-ink-2">
            Semua angka berasal dari <strong>data uji terpisah</strong> yang tidak dipakai saat pelatihan. Kami melaporkan
            interval kepercayaan, bukan hanya akurasi.
          </p>
          <Table
            head={['Metrik', 'Nilai', 'Interval kepercayaan 95%']}
            rows={mc.metrics.map((m) => [m.label, <Val>{m.value}</Val>, <Val>{m.ci}</Val>])}
          />
          <p className="mt-4 text-small text-ink-3">
            Catatan: PPV bergantung pada prevalensi. Di populasi umum, yang prevalensinya jauh lebih rendah daripada di data
            uji yang seimbang, PPV bisa turun tajam walau sensitivitas dan spesifisitas tampak tinggi.
          </p>
        </section>

        <section aria-labelledby="level">
          <H2 id="level">5. Cara membaca skor dan level risiko</H2>
          <p className="mb-4 text-lead text-ink-2">
            Persentase adalah <strong>skor keluaran model</strong>. Ia belum tentu sama dengan peluang bahwa anak autistik,
            kecuali kalibrasinya terbukti baik. Cara penentuan batas level: <Val>{mc.thresholdMethod}</Val>.
          </p>
          <Table
            head={['Level', 'Rentang skor', 'Artinya', 'Saran']}
            rows={[
              [<strong key="a">Rendah</strong>, `di bawah ${lowPct}%`, 'Model tidak menemukan pola yang mirip data kelompok risiko.', 'Tidak berarti anak pasti tidak autistik. Tetap pantau perkembangan.'],
              [<strong key="b">Sedang</strong>, `${lowPct}% sampai ${highPct}%`, 'Zona kurang informatif, model tidak yakin.', 'Lanjutkan skrining M-CHAT-R/F dan konsultasi bila ragu.'],
              [<strong key="c">Tinggi</strong>, `di atas ${highPct}%`, 'Pola mirip kelompok risiko pada data latih.', 'Bukan diagnosis. Lakukan M-CHAT-R/F dan temui dokter atau psikolog anak.'],
            ]}
          />
        </section>

        <section aria-labelledby="subkelompok">
          <H2 id="subkelompok">6. Kinerja per subkelompok</H2>
          <p className="mb-4 text-lead text-ink-2">
            Penelitian sebelumnya menemukan bahwa faktor ras dan etnis sangat memengaruhi akurasi model berbasis wajah [1].
            Karena itu kami menguji per kelompok. Kelompok yang belum diuji ditulis “belum diuji”, tidak dikosongkan.
          </p>
          <Table
            head={['Subkelompok', 'Anak di data uji', 'AUC', 'Sensitivitas', 'Spesifisitas']}
            rows={mc.subgroups.map((s) => [s.name, <Val>{s.n}</Val>, <Val>{s.auc}</Val>, <Val>{s.sens}</Val>, <Val>{s.spec}</Val>])}
          />
        </section>

        <section aria-labelledby="batasan">
          <H2 id="batasan">7. Keterbatasan dan risiko</H2>
          <div className="flex flex-col gap-3">
            {[
              ['Kualitas dan asal data', 'Dataset foto yang banyak dipakai di penelitian sebelumnya dikumpulkan dari pencarian internet dan berkualitas rendah [1]. Model yang unggul pada data seperti itu belum tentu bekerja pada foto orang tua di Indonesia.'],
              ['Bias kelompok', 'Faktor ras dan etnis krusial bagi akurasi [1]. Perempuan juga lebih sering tidak terdiagnosis, sehingga label pada data bisa timpang [3].'],
              ['Salah positif dan salah negatif', 'Salah positif dapat menimbulkan kecemasan dan stigma. Salah negatif dapat memberi rasa aman palsu dan menunda konsultasi. Karena itu hasil selalu disertai arahan ke skrining tervalidasi.'],
              ['Premis yang diperdebatkan', 'Komunitas autistik mempertanyakan gagasan bahwa autisme dapat “dilihat” dari wajah dan memperingatkan risiko penyalahgunaan oleh institusi [2]. Kami menanggapinya dengan membatasi penggunaan model dan tidak menjadikannya alat skrining.'],
            ].map(([t, d]) => (
              <Card key={t} className="!px-5 !py-4">
                <p className="mb-1 font-bold">{t}</p>
                <p className="text-ink-2">{d}</p>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="privasi">
          <H2 id="privasi">8. Privasi dan penanganan foto</H2>
          <KV
            rows={[
              ['Apakah foto disimpan?', <Val>{mc.privacy.stored}</Val>],
              ['Di mana foto diproses', <Val>{mc.privacy.processedWhere}</Val>],
              ['Perlindungan data', <Val>{mc.privacy.protection}</Val>],
              ['Siapa yang bisa mengakses', <Val>{mc.privacy.access}</Val>],
              ['Hak penghapusan', <Val>{mc.privacy.deletion}</Val>],
              ['Dasar hukum', <Val>{mc.privacy.legalBasis}</Val>],
            ]}
          />
        </section>

        <section aria-labelledby="versi">
          <H2 id="versi">9. Riwayat versi dan pelaporan masalah</H2>
          {mc.versions.length > 0 ? (
            <Table head={['Versi', 'Tanggal', 'Perubahan']} rows={mc.versions.map((v) => [v.version, v.date, v.change])} />
          ) : (
            <p className="text-ink-2">Belum ada riwayat versi.</p>
          )}
          {mc.reportEmail && (
            <p className="mt-3">
              Menemukan kesalahan atau dampak yang merugikan? Laporkan ke <a href={`mailto:${mc.reportEmail}`}>{mc.reportEmail}</a>.
            </p>
          )}
        </section>

        <section aria-labelledby="rujukan">
          <H2 id="rujukan">Rujukan</H2>
          <ol className="m-0 flex list-decimal flex-col gap-2 pl-6 text-ink-2">
            {modelCardReferences.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </section>
      </div>
    </Page>
  )
}
