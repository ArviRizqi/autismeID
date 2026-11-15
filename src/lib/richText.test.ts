import { describe, expect, it } from 'vitest'
import { parseRichText } from './richText'

describe('parseRichText', () => {
  it('memisahkan paragraf dan daftar bertanda', () => {
    const b = parseRichText('Layanan:\n- satu\n- dua\n\nPenutup.')
    expect(b.map((x) => x.type)).toEqual(['p', 'ul', 'p'])
    expect(b[1].type === 'ul' && b[1].items).toHaveLength(2)
  })

  it('mengenali daftar bernomor dan bintang', () => {
    expect(parseRichText('1. a\n2) b')[0].type).toBe('ol')
    expect(parseRichText('* a\n* b')[0].type).toBe('ul')
  })

  it('mengubah **tebal** menjadi segmen, tanpa memakai HTML', () => {
    const b = parseRichText('Ini **penting** sekali <script>alert(1)</script>')
    const p = b[0]
    expect(p.type === 'p' && p.lines[0].map((s) => s.bold)).toEqual([false, true, false])
    expect(p.type === 'p' && p.lines[0].map((s) => s.text).join('')).toContain('<script>alert(1)</script>')
  })

  it('mempertahankan nomor sumber [n] sebagai teks biasa', () => {
    const p = parseRichText('Klaim [1][2].')[0]
    expect(p.type === 'p' && p.lines[0][0].text).toBe('Klaim [1][2].')
  })

  it('teks kosong tidak menghasilkan blok', () => {
    expect(parseRichText('  \n\n ')).toEqual([])
  })
})
