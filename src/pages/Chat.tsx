import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AssistantMessage, UserBubble } from '../components/chat/MessageBubble'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Page } from '../components/ui/Section'
import { useChat } from '../hooks/useChat'
import { isMockApi } from '../lib/api/client'

const suggestions = [
  'Apa itu M-CHAT-R/F, dan untuk anak usia berapa?',
  'Apakah autisme bisa dideteksi dari foto wajah?',
  'Apa bedanya skrining dan diagnosis?',
]

const rules = [
  ['Hanya dari sumber.', 'Jawaban disusun dari paper dan dokumen yang sudah kami pilih, dan setiap klaim diberi nomor sumber.'],
  ['Berani bilang tidak tahu.', 'Bila sumber tidak cukup, chat menolak menebak dan menyarankan Anda bertanya kepada tenaga kesehatan.'],
  ['Tidak mendiagnosis.', 'Chat tidak menyatakan seorang anak autistik dan tidak menafsirkan hasil skrining anak tertentu.'],
  ['Darurat didahulukan.', 'Bila ada tanda kegawatan, chat langsung mengarahkan ke 112 atau IGD, tanpa penjelasan panjang.'],
  ['Rujukan ke manusia.', 'Jawaban selalu mengarahkan ke tenaga kesehatan untuk keputusan klinis.'],
]

export default function Chat() {
  const { messages, loading, error, send, retry, reset } = useChat()
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [messages.length, loading, error])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = draft
    if (!text.trim() || loading) return
    setDraft('')
    void send(text)
  }

  return (
    <Page>
      <h1 className="mb-3 text-h1 text-primary">Tanya AutismeID</h1>
      <p className="mb-8 max-w-[45rem] text-lead text-ink-2">
        Asisten ini menjawab dari paper dan dokumen rujukan kami, lengkap dengan sumbernya. Ia tidak mendiagnosis dan tidak
        menggantikan dokter.
      </p>

      {isMockApi && (
        <p className="mb-6 rounded-md border-2 border-dashed border-line-dashed p-4 text-caption text-ink-3" role="note">
          Mode contoh: layanan model-ai belum terhubung (<code>VITE_API_URL</code> kosong). Jawaban di bawah disimulasikan
          di browser dan bukan keluaran model. Coba: pertanyaan tentang M-CHAT-R/F, foto wajah, "apakah anak saya autis",
          atau "anak saya kejang".
        </p>
      )}

      <div className="flex flex-wrap items-start gap-6">
        <section aria-label="Percakapan" className="min-w-0 flex-[1_1_40rem] rounded-xl border border-line bg-surface p-[clamp(1.25rem,4vw,2rem)]">
          <div className="mb-6 min-h-[12rem]" aria-live="polite" aria-relevant="additions">
            {messages.length === 0 && !loading && (
              <div>
                <p className="mb-3 text-ink-2">Mulai dengan salah satu pertanyaan ini, atau tulis sendiri:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <Button key={s} variant="secondary" size="sm" onClick={() => void send(s)} className="text-left">
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-6">
              {messages.map((m) =>
                m.role === 'user' ? (
                  <UserBubble key={m.id} text={m.text} />
                ) : (
                  <AssistantMessage key={m.id} response={m.response} />
                ),
              )}
            </div>

            {loading && (
              <p role="status" className="mt-6 text-ink-3">
                AutismeID sedang membaca seluruh dokumen rujukan. Pertanyaan baru bisa memakan satu sampai dua menit; pertanyaan yang pernah diajukan dijawab lebih cepat.
              </p>
            )}
            {error && (
              <div role="alert" className="mt-6 rounded-md bg-danger-bg px-4 py-3 text-danger-text">
                <p className="mb-2">{error}</p>
                <Button size="sm" variant="secondary" onClick={() => void retry()}>
                  Coba lagi
                </Button>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={submit} className="border-t border-line-soft pt-5">
            <label htmlFor="tanya" className="mb-2 block text-small font-semibold">
              Tulis pertanyaan Anda
            </label>
            <div className="flex flex-wrap gap-2.5">
              <input
                id="tanya"
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={500}
                placeholder="Contoh: Apa bedanya skrining dan diagnosis?"
                className="field min-w-0 flex-[1_1_20rem]"
                autoComplete="off"
              />
              <Button type="submit" disabled={loading || !draft.trim()}>
                Kirim
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-caption text-ink-3">
                Jangan memasukkan nama lengkap, alamat, atau data pribadi anak. Pertanyaan umum disimpan dan bisa tampil di{' '}
                <Link to="/faq">halaman FAQ</Link>; pertanyaan yang tampak pribadi tidak disimpan.
              </p>
              {messages.length > 0 && (
                <Button variant="ghost" onClick={reset}>
                  Mulai percakapan baru
                </Button>
              )}
            </div>
          </form>
        </section>

        <aside className="flex min-w-0 flex-[1_1_20rem] flex-col gap-4">
          <Card>
            <h2 className="mb-3.5 text-h4">Aturan chat ini</h2>
            <ol className="m-0 flex list-decimal flex-col gap-2.5 pl-5">
              {rules.map(([title, body]) => (
                <li key={title}>
                  <strong>{title}</strong> {body}
                </li>
              ))}
            </ol>
          </Card>
          <Card>
            <h2 className="mb-2 text-h4">Butuh orang, bukan chatbot?</h2>
            <p className="mb-3 text-ink-2">Cari layanan kesehatan dan dukungan di wilayah Anda.</p>
            <Button to="/direktori" variant="ghost">
              Buka direktori layanan →
            </Button>
          </Card>
        </aside>
      </div>
    </Page>
  )
}
