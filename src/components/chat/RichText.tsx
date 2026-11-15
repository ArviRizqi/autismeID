import { Fragment } from 'react'
import { parseRichText, type Inline } from '../../lib/richText'

function Inlines({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((p, i) => (p.bold ? <strong key={i}>{p.text}</strong> : <Fragment key={i}>{p.text}</Fragment>))}
    </>
  )
}

/** Merender jawaban chat (paragraf, daftar, tebal) tanpa HTML mentah. */
export function RichText({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-3">
      {parseRichText(text).map((b, i) => {
        if (b.type === 'ul')
          return (
            <ul key={i} className="m-0 list-disc space-y-1.5 pl-5">
              {b.items.map((it, j) => (
                <li key={j}>
                  <Inlines parts={it} />
                </li>
              ))}
            </ul>
          )
        if (b.type === 'ol')
          return (
            <ol key={i} className="m-0 list-decimal space-y-1.5 pl-5">
              {b.items.map((it, j) => (
                <li key={j}>
                  <Inlines parts={it} />
                </li>
              ))}
            </ol>
          )
        return (
          <p key={i} className="m-0">
            {b.lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                <Inlines parts={l} />
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
