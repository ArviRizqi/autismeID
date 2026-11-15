/**
 * Konfigurasi situs. Kosongkan nilai yang belum ada: komponen akan menyembunyikan
 * bagian terkait, bukan menampilkan placeholder di produksi.
 */
export const siteConfig = {
  name: 'AutismeID',
  year: new Date().getFullYear(),

  /** Kontak resmi. Isi bila sudah ada. */
  contact: {
    email: '' as string,
    whatsapp: '' as string,
  },

  /**
   * Peninjau klinis. Isi hanya bila benar ada, lengkap dengan nama dan gelar.
   * Selama kosong, situs tidak mengklaim ada tinjauan klinis.
   */
  reviewers: [] as Array<{ name: string; title: string; reviewedAt: string }>,
}
