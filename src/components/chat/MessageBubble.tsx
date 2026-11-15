import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { RichText } from './RichText'
import type { Tone } from '../../lib/levels'
import { cn } from '../../lib/cn'
import type { ChatResponse, ChatStatus } from '../../types/api'

const statusMeta: Record<ChatStatus, { label: string; tone: Tone; box: string }> = {
  answered: { label: 'Dijawab dari sumber', tone: 'ok', box: 'border border-line bg-surface' },
  answered_with_caveat: { label: 'Dijawab, dengan catatan', tone: 'warn', box: 'border border-line bg-surface' },
  out_of_scope: { label: 'Di luar cakupan chat', tone: 'warn', box: 'border border-notice-border bg-notice-bg' },
  emergency: { label: 'Darurat', tone: 'danger', box: 'border-[3px] border-emergency-border bg-emergency-bg' },
  no_source: { label: 'Sumber tidak cukup', tone: 'neutral', box: 'border border-line bg-surface' },
}

export function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[80%] whitespace-pre-wrap rounded-[1.125rem] rounded-br bg-ok-bg px-[1.125rem] py-3.5 text-primary-deep">
        {text}
      </p>
    </div>
  )
}

export function AssistantMessage({ response }: { response: ChatResponse }) {
  const meta = statusMeta[response.status]
  const paragraphs = response.answer.split(/\n{2,}/).filter(Boolean)
  const emergency = response.status === 'emergency'

  return (
    <div>
      <div className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-display text-[1.125rem] font-semibold text-primary">AutismeID</span>
        <Badge tone={meta.tone}>{meta.label}</Badge>
        {response.retrieval_match !== 'tidak dipakai' && (
          <span className="text-caption text-ink-3">Kecocokan sumber: {response.retrieval_match}</span>
        )}
        {response.grounding && response.grounding.total > 0 && (
          <span className="text-caption text-ink-3">
            Kutipan terverifikasi: {response.grounding.verified} dari {response.grounding.total}
          </span>
        )}
        {response.cached && <span className="text-caption text-ink-3">Dari arsip jawaban</span>}
      </div>

      <div className={cn('rounded-lg px-[1.375rem] py-5', meta.box)}>
        {paragraphs.map((p, i) =>
          emergency && i < 2 ? (
            <p
              key={i}
              className={cn(
                'mb-3 whitespace-pre-wrap',
                i === 0 && 'font-display text-[1.625rem] font-semibold leading-tight text-danger-text',
                i === 1 && 'text-[1.25rem] font-bold',
              )}
            >
              {p}
            </p>
          ) : (
            <div key={i} className="mb-3 last:mb-0">
              <RichText text={p} />
            </div>
          ),
        )}
        {response.actions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {response.actions.map((a) => (
              <Button key={a.route + a.label} to={a.route} size="sm" variant={a.primary ? 'primary' : 'secondary'} className="min-h-12">
                {a.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {response.sources.length > 0 ? (
        <div className="mt-5">
          <h3 className="mb-3 text-h4">Sumber yang dipakai</h3>
          <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
            {response.sources.map((s, i) => (
              <li key={s.id} className="flex gap-3.5 rounded-md border border-line bg-bg px-4 py-3.5">
                <span
                  aria-hidden="true"
                  className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary text-small font-bold text-white"
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold">
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.title}
                        <span className="sr-only"> (buka di tab baru)</span>
                      </a>
                    ) : (
                      s.title
                    )}
                  </p>
                  {(s.meta || (s.pages && s.pages.length > 0)) && (
                    <p className="mb-1.5 text-caption text-ink-3">
                      {[s.meta, s.pages && s.pages.length > 0 ? `hlm. ${s.pages.join(', ')}` : ''].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <p className="mb-1.5">
                    <span
                      className={cn(
                        'inline-block rounded-full px-2.5 py-0.5 text-[0.8125rem] font-bold',
                        s.kind === 'opini' ? 'bg-tint text-danger-text' : 'bg-ok-bg text-ok-text',
                      )}
                    >
                      {s.kind === 'jurnal' ? 'Jurnal' : s.kind === 'opini' ? 'Opini komunitas' : 'Dokumen'}
                    </span>
                  </p>
                  {s.snippet && (
                    <p className="text-small text-ink-2">
                      <span className="font-bold">Cuplikan:</span> {s.snippet}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <p className="mt-4 text-caption text-ink-3">
          {emergency
            ? 'Pada situasi darurat, chat berhenti memberi penjelasan dan hanya mengarahkan ke bantuan langsung.'
            : response.status === 'no_source'
              ? 'Tidak ada kutipan dari dokumen yang bisa diverifikasi untuk pertanyaan ini, sehingga chat memilih tidak menjawab.'
              : 'Tidak ada sumber yang dikutip untuk jawaban ini.'}
        </p>
      )}
    </div>
  )
}
