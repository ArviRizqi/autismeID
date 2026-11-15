import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Page } from '../components/ui/Section'
import { adminApi, AdminError, type AdminDoc, type AdminQa, type AdminStatus } from '../lib/api/admin'

const fmt = (n: number) => n.toLocaleString('id-ID')

export default function Admin() {
  const [token, setToken] = useState('')
  const [authed, setAuthed] = useState(false)
  const [status, setStatus] = useState<AdminStatus | null>(null)
  const [docs, setDocs] = useState<AdminDoc[]>([])
  const [qa, setQa] = useState<AdminQa[]>([])
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null)

  // Halaman ini tidak untuk umum: jangan diindeks mesin pencari.
  useEffect(() => {
    const m = document.createElement('meta')
    m.name = 'robots'
    m.content = 'noindex,nofollow'
    document.head.appendChild(m)
    return () => m.remove()
  }, [])

  const fail = (e: unknown) => {
    if (e instanceof AdminError && e.status === 401) setAuthed(false)
    setNote({ ok: false, text: e instanceof Error ? e.message : 'Terjadi kesalahan.' })
  }

  const refresh = useCallback(async (t: string) => {
    const [s, d, q] = await Promise.all([adminApi.status(t), adminApi.documents(t), adminApi.qa(t).catch(() => [] as AdminQa[])])
    setStatus(s)
    setDocs(d)
    setQa(q)
  }, [])

  const login = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setNote(null)
    try {
      await refresh(token.trim())
      setAuthed(true)
    } catch (err) {
      fail(err)
    } finally {
      setBusy(false)
    }
  }

  const act = async (fn: () => Promise<{ message: string }>) => {
    setBusy(true)
    setNote(null)
    try {
      const r = await fn()
      setNote({ ok: true, text: r.message })
      await refresh(token.trim())
    } catch (err) {
      fail(err)
    } finally {
      setBusy(false)
    }
  }

  const upload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const file = data.get('file')
    if (!(file instanceof File) || !file.name) return setNote({ ok: false, text: 'Pilih berkas dulu.' })
    for (const [k, v] of Array.from(data.entries())) if (typeof v === 'string' && !v.trim()) data.delete(k)
    data.set('replace', data.get('replace') ? 'true' : 'false')
    await act(() => adminApi.upload(token.trim(), data))
    form.reset()
  }

  if (!authed) {
    return (
      <Page width="narrow">
        <h1 className="mb-3 text-h1 text-primary">Admin pengetahuan</h1>
        <p className="mb-6 text-ink-2">Masukkan token admin (ADMIN_TOKEN yang diatur di Secrets server).</p>
        <form onSubmit={login} className="flex max-w-[28rem] flex-col gap-3">
          <label htmlFor="tok" className="text-small font-semibold">Token admin</label>
          <input id="tok" type="password" className="field" value={token} onChange={(e) => setToken(e.target.value)} autoComplete="off" />
          <Button type="submit" disabled={busy || !token.trim()}>{busy ? 'Memeriksa...' : 'Masuk'}</Button>
        </form>
        {note && <p role="alert" className="mt-4 text-danger-text">{note.text}</p>}
      </Page>
    )
  }

  const overCap = status ? status.tokens > status.max_tokens * 0.9 : false

  return (
    <Page>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-h1 text-primary">Admin pengetahuan</h1>
        <Button variant="ghost" onClick={() => { setAuthed(false); setToken('') }}>Keluar</Button>
      </div>

      {note && (
        <p role={note.ok ? 'status' : 'alert'} className={`mb-6 rounded-md px-4 py-3 ${note.ok ? 'bg-ok-bg text-ok-text' : 'bg-danger-bg text-danger-text'}`}>
          {note.text}
        </p>
      )}

      {status && (
        <Card className="mb-6">
          <h2 className="mb-3 text-h4">Ringkasan</h2>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-3 p-0 text-ink-2">
            <li>Mode: <strong>{status.mode === 'fullcontext' ? 'baca-utuh' : 'potongan (lama)'}</strong></li>
            <li>Dokumen siap baca: <strong>{status.documents_ready}</strong> dari maks. {status.max_docs}</li>
            <li className={overCap ? 'text-danger-text' : ''}>Ukuran: <strong>{fmt(status.tokens)}</strong> dari {fmt(status.max_tokens)} token (perkiraan)</li>
            <li>Pertanyaan baru hari ini: <strong>{status.new_questions_today}</strong> dari {status.daily_limit}</li>
          </ul>
          {status.documents_need_reupload > 0 && (
            <p className="mt-3 rounded-md bg-warn-bg px-3 py-2 text-warn-text">
              {status.documents_need_reupload} dokumen lama belum punya teks per halaman dan tidak dibaca. Unggah ulang PDF-nya, lalu hapus yang lama.
            </p>
          )}
        </Card>
      )}

      <div className="flex flex-wrap items-start gap-6">
        <section aria-labelledby="h-up" className="min-w-0 flex-[1_1_22rem]">
          <Card>
            <h2 id="h-up" className="mb-3 text-h4">Tambah dokumen</h2>
            <form onSubmit={upload} className="flex flex-col gap-3">
              <label className="text-small font-semibold" htmlFor="f-file">Berkas (PDF, DOCX, TXT, MD, HTML)</label>
              <input id="f-file" name="file" type="file" accept=".pdf,.docx,.txt,.md,.html,.htm" className="field" />
              <label className="text-small font-semibold" htmlFor="f-title">Judul (opsional)</label>
              <input id="f-title" name="title" className="field" />
              <label className="text-small font-semibold" htmlFor="f-auth">Penulis</label>
              <input id="f-auth" name="authors" className="field" />
              <div className="flex flex-wrap gap-3">
                <div className="min-w-[min(8rem,100%)] flex-1">
                  <label className="text-small font-semibold" htmlFor="f-year">Tahun</label>
                  <input id="f-year" name="year" inputMode="numeric" maxLength={4} className="field w-full" />
                </div>
                <div className="min-w-[min(10rem,100%)] flex-[2]">
                  <label className="text-small font-semibold" htmlFor="f-kind">Jenis</label>
                  <select id="f-kind" name="kind" className="field w-full" defaultValue="jurnal">
                    <option value="jurnal">Jurnal</option>
                    <option value="dokumen">Dokumen / panduan</option>
                    <option value="opini">Opini komunitas</option>
                  </select>
                </div>
              </div>
              <label className="text-small font-semibold" htmlFor="f-doi">DOI</label>
              <input id="f-doi" name="doi" className="field" />
              <label className="text-small font-semibold" htmlFor="f-url">Tautan sumber (http/https)</label>
              <input id="f-url" name="source_url" type="url" className="field" />
              <label className="flex items-center gap-2 text-small">
                <input type="checkbox" name="replace" /> Ganti bila isinya sama dengan dokumen yang sudah ada
              </label>
              <Button type="submit" disabled={busy}>{busy ? 'Memproses...' : 'Unggah'}</Button>
              <p className="text-caption text-ink-3">PDF hasil scan (tanpa teks) ditolak. Daftar pustaka dibuang otomatis.</p>
            </form>
          </Card>
        </section>

        <section aria-labelledby="h-docs" className="min-w-0 flex-[2_1_28rem]">
          <Card>
            <h2 id="h-docs" className="mb-3 text-h4">Daftar dokumen ({docs.length})</h2>
            {docs.length === 0 && <p className="text-ink-3">Belum ada dokumen.</p>}
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {docs.map((d) => {
                const ready = Boolean(d.page_count)
                return (
                  <li key={d.id} className="flex flex-wrap items-start justify-between gap-3 rounded-md border border-line bg-bg px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="break-words font-semibold">{d.title}</p>
                      <p className="text-caption text-ink-3">
                        {[d.metadata?.authors, d.metadata?.year, d.metadata?.kind].filter(Boolean).join(' · ')}
                        {ready ? ` · ${d.page_count} hlm · ~${fmt(d.token_estimate ?? 0)} token` : ''}
                      </p>
                      <Badge tone={ready ? 'ok' : 'warn'} className="mt-1">{ready ? 'Siap dibaca' : 'Perlu diunggah ulang'}</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={busy}
                      onClick={() => { if (window.confirm(`Hapus "${d.title}"? Arsip jawaban akan dibersihkan.`)) void act(() => adminApi.removeDoc(token.trim(), d.id)) }}
                    >
                      Hapus
                    </Button>
                  </li>
                )
              })}
            </ul>
          </Card>
        </section>
      </div>

      <section aria-labelledby="h-qa" className="mt-6">
        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 id="h-qa" className="text-h4">Arsip jawaban ({qa.length})</h2>
            <Button
              size="sm"
              variant="secondary"
              disabled={busy || qa.length === 0}
              onClick={() => { if (window.confirm('Kosongkan seluruh arsip jawaban? Pertanyaan akan dibaca ulang dari dokumen.')) void act(() => adminApi.purgeQa(token.trim())) }}
            >
              Kosongkan arsip
            </Button>
          </div>
          <p className="mb-3 text-caption text-ink-3">
            Hanya pertanyaan umum yang disimpan. Yang ditanyakan minimal {status?.faq_min_hits ?? 2} kali tampil di halaman FAQ publik. Hapus
            jawaban yang keliru supaya dibuat ulang saat ditanyakan lagi.
          </p>
          {qa.length === 0 && <p className="text-ink-3">Belum ada jawaban tersimpan.</p>}
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {qa.map((r) => (
              <li key={r.id} className="rounded-md border border-line bg-bg px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-semibold">{r.question}</p>
                    <p className="text-caption text-ink-3">
                      ditanya {r.hits}× · {r.status}
                      {r.grounding ? ` · kutipan ${r.grounding.verified}/${r.grounding.total}` : ''}
                      {r.current ? '' : ' · versi dokumen lama'}
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" disabled={busy} onClick={() => void act(() => adminApi.removeQa(token.trim(), r.id))}>
                    Hapus
                  </Button>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-small text-primary">Lihat jawaban</summary>
                  <p className="mt-2 whitespace-pre-wrap text-small text-ink-2">{r.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </Page>
  )
}
