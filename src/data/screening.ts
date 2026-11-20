/**
 * M-CHAT-R/F (Modified Checklist for Autism in Toddlers, Revised with Follow-Up)
 * Hak cipta 2009 Diana Robins, Deborah Fein, dan Marianne Barton. Terjemahan Indonesia (2014): Soetjiningsih,
 * Trisna Windiani, Sugitha Adnyana, dan Apik Lestari.
 *
 * KETENTUAN PEMAKAIAN (dari berkas resmi di mchatscreen.com): gratis untuk keperluan klinis, riset, dan pendidikan;
 * pertanyaan, petunjuk, dan urutan butir TIDAK boleh diubah; harus dipakai utuh; pencantuman hak cipta wajib;
 * memasukkannya ke perangkat lunak/situs membutuhkan izin tertulis dari penulis (Diana Robins).
 *
 * Karena itu 20 butir resmi TIDAK disertakan di sini. Setelah izin diperoleh, tempel ke-20 butir versi Indonesia
 * PERSIS seperti di berkas resminya ke OFFICIAL_ITEMS (urutan 1 sampai 20, tanpa diubah). Selama array ini belum
 * berisi 20 teks, halaman /skrining otomatis memakai tampilan "formulir resmi + penghitung skor".
 */
export const OFFICIAL_ITEMS: readonly string[] = []

export const SCREENING_READY =
  OFFICIAL_ITEMS.length === 20 && OFFICIAL_ITEMS.every((t) => typeof t === 'string' && t.trim().length > 0)

export const MCHAT_SOURCE = {
  officialSite: 'https://www.mchatscreen.com',
  indonesianForm: 'https://www.mchatscreen.com/wp-content/uploads/2015/05/M-CHAT-R_F_Indonesian.pdf',
  credit:
    'M-CHAT-R/F © 2009 Diana Robins, Deborah Fein, dan Marianne Barton. Terjemahan Indonesia © 2014 Soetjiningsih, Trisna Windiani, Sugitha Adnyana, dan Apik Lestari. Gratis untuk keperluan klinis, riset, dan pendidikan.',
} as const
