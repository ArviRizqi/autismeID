import type { Province } from './provinces'

export type ServiceType = 'puskesmas' | 'dokter' | 'psikolog' | 'terapi' | 'sekolah'

export const serviceTypes: Array<{ key: ServiceType; label: string; desc: string }> = [
  { key: 'puskesmas', label: 'Puskesmas dan posyandu', desc: 'Pintu awal untuk pemeriksaan tumbuh kembang dan rujukan.' },
  { key: 'dokter', label: 'Dokter anak tumbuh kembang', desc: 'Dokter spesialis anak, idealnya konsultan tumbuh kembang, untuk penilaian dan rujukan.' },
  { key: 'psikolog', label: 'Psikolog dan psikiater anak', desc: 'Asesmen perkembangan dan perilaku anak.' },
  { key: 'terapi', label: 'Terapi', desc: 'Terapi wicara, okupasi, atau perilaku sesuai kebutuhan anak.' },
  { key: 'sekolah', label: 'Sekolah inklusif', desc: 'Sekolah inklusif atau layanan pendidikan khusus.' },
]

export interface Service {
  id: string
  type: ServiceType
  name: string
  province: Province
  city: string
  address: string
  phone?: string
  hours?: string
  bpjs?: 'ya' | 'tidak' | 'tidak diketahui'
  /** Tanggal verifikasi terakhir (YYYY-MM-DD). Wajib: tanpa ini entri tidak boleh tayang. */
  verifiedAt: string
  /** Hanya untuk pengembangan. Entri contoh tidak ditampilkan di produksi. */
  isSample?: boolean
}

/**
 * Isi dengan layanan yang benar-benar sudah Anda verifikasi.
 * Jangan mengarang nama, alamat, atau kontak.
 */
export const services: Service[] = []

/** Entri contoh, hanya tampil saat `npm run dev`. */
export const sampleServices: Service[] = serviceTypes.map((t, i) => ({
  id: `contoh-${t.key}`,
  type: t.key,
  name: `[Nama layanan contoh ${i + 1}]`,
  province: 'Jawa Tengah',
  city: '[Kota atau kabupaten]',
  address: '[Alamat lengkap]',
  phone: '[Nomor telepon]',
  hours: '[Jam layanan]',
  bpjs: 'tidak diketahui',
  verifiedAt: '1970-01-01',
  isSample: true,
}))
