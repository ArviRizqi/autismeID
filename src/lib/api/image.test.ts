import { describe, expect, it } from 'vitest'
import { targetSize } from './image'

describe('targetSize', () => {
  it('tidak membesarkan gambar kecil', () => expect(targetSize(800, 600)).toEqual({ w: 800, h: 600 }))
  it('memperkecil sisi terpanjang ke 2000 dengan rasio tetap', () => {
    expect(targetSize(4000, 3000)).toEqual({ w: 2000, h: 1500 })
    expect(targetSize(3000, 6000)).toEqual({ w: 1000, h: 2000 })
  })
})
