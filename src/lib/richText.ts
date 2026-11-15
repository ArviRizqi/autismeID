/**
 * Parser teks jawaban chat ke blok sederhana: paragraf, daftar bertanda, daftar bernomor, dan **tebal**.
 * Sengaja kecil dan tanpa HTML mentah: hasilnya dirender sebagai node React, jadi isi dari model atau
 * dokumen tidak bisa menyuntikkan markup.
 */
export type Inline = { text: string; bold: boolean }
export type Block =
  | { type: 'p'; lines: Inline[][] }
  | { type: 'ul'; items: Inline[][] }
  | { type: 'ol'; items: Inline[][] }

export function parseInline(text: string): Inline[] {
  const out: Inline[] = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), bold: false })
    out.push({ text: m[1], bold: true })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ text: text.slice(last), bold: false })
  return out.length ? out : [{ text: '', bold: false }]
}

const UL = /^\s*[-*•]\s+(.*)$/
const OL = /^\s*\d+[.)]\s+(.*)$/

export function parseRichText(text: string): Block[] {
  const blocks: Block[] = []

  for (const raw of text.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      blocks.push({ type: 'p', lines: [] }) // pemisah; dibuang di akhir
      continue
    }
    const last: Block | undefined = blocks[blocks.length - 1]
    const ul = UL.exec(line)
    const ol = ul ? null : OL.exec(line)
    if (ul) {
      if (last?.type === 'ul') last.items.push(parseInline(ul[1]))
      else blocks.push({ type: 'ul', items: [parseInline(ul[1])] })
    } else if (ol) {
      if (last?.type === 'ol') last.items.push(parseInline(ol[1]))
      else blocks.push({ type: 'ol', items: [parseInline(ol[1])] })
    } else if (last?.type === 'p' && last.lines.length > 0) {
      last.lines.push(parseInline(line.trim()))
    } else if (last?.type === 'p') {
      last.lines.push(parseInline(line.trim())) // mengisi pemisah kosong menjadi paragraf baru
    } else {
      blocks.push({ type: 'p', lines: [parseInline(line.trim())] })
    }
  }
  return blocks.filter((b) => (b.type === 'p' ? b.lines.length > 0 : b.items.length > 0))
}
