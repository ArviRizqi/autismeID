import { useEffect, useState } from 'react'
import { RichText } from '../components/chat/RichText'
import { Button } from '../components/ui/Button'
import { Page } from '../components/ui/Section'
import { describeApiError, getFaq, isMockApi } from '../lib/api/client'
import type { FaqItem } from '../types/api'

export default function Faq() {
  const [items, setItems] = useState<FaqItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    getFaq()
      .then((r) => alive && setItems(r))
      .catch((e) => alive && setError(describeApiError(e)))
    return () => {
      alive = false
    }
  }, [])

  return (
    <Page width="narrow">
      <h1 className="mb-3 text-h1 text-primary">Pertanyaan yang sering diajukan</h1>
      <p className="mb-8 max-w-[45rem] text-lead text-ink-2">
        Daftar ini disusun otomatis dari pertanyaan umum yang paling sering diajukan di Tanya AutismeID. Jawabannya
        disusun dari paper dan dokumen rujukan kami, dengan kutipan yang diperiksa terhadap isi dokumen.
      </p>

      {isMockApi && <p className="mb-6 text-caption text-ink-3" role="note">Layanan belum terhubung, sehingga FAQ belum bisa dimuat.</p>}
      {error && <p role="alert" className="mb-6 rounded-md bg-danger-bg px-4 py-3 text-danger-text">{error}</p>}
      {!items && !error && !isMockApi && <p role="status" className="text-ink-3">Memuat...</p>}
      {items && items.length === 0 && (
        <p className="mb-6 text-ink-2">Belum ada pertanyaan yang cukup sering diajukan. Coba tanyakan langsung.</p>
      )}

      <div className="mb-8 flex flex-col gap-3">
        {items?.map((it) => (
          <details key={it.question} className="rounded-lg border border-line bg-surface px-5 py-4">
            <summary className="cursor-pointer font-display text-[1.125rem] font-semibold text-primary">{it.question}</summary>
            <div className="mt-3">
              {it.answer.split(/\n{2,}/).filter(Boolean).map((p, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <RichText text={p} />
                </div>
              ))}
              {it.sources.length > 0 && (
                <ol className="mt-3 list-decimal pl-5 text-small text-ink-2">
                  {it.sources.map((s) => (
                    <li key={s.id}>
                      {s.title}
                      {s.pages && s.pages.length > 0 ? ` (hlm. ${s.pages.join(', ')})` : ''}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </details>
        ))}
      </div>

      <Button to="/chat">Tanyakan pertanyaan Anda</Button>
    </Page>
  )
}
