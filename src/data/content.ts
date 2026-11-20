/**
 * Konten beranda. Setiap angka harus punya sumber yang bisa diperiksa.
 * Periksa ulang semua klaim terhadap sumber aslinya sebelum tayang.
 */

export const stats = [
  {
    value: '1 dari 127',
    text: 'orang di dunia diperkirakan autistik pada 2021. Angka ini rata-rata, dan di banyak negara berpenghasilan rendah dan menengah angka sebenarnya belum diketahui.',
    source: 'WHO, lembar fakta autisme (September 2025)',
  },
  {
    value: 'Di atas 4 tahun',
    text: 'usia ketika, menurut IDAI, banyak anak baru dikenali sebagai autistik, karena akses ke skrining dan terapi masih terbatas dan stigma masih kuat. Skrining sejak 16 bulan membuka peluang dukungan yang lebih awal.',
    source: 'IDAI, dikutip Investortrust',
  },
  {
    value: '82,35% · 89,68%',
    text: 'sensitivitas dan spesifisitas M-CHAT versi Indonesia (versi awal, bukan M-CHAT-R/F) pada anak usia 18 sampai 48 bulan di RS Sanglah, Bali. Artinya skrining bisa terlewat atau keliru, jadi hasilnya selalu perlu dikonfirmasi tenaga kesehatan.',
    source: 'Paediatrica Indonesiana, studi diagnostik di RS Sanglah, Denpasar',
  },
]

export const ageSigns = [
  {
    title: '0 sampai 12 bulan',
    items: ['Jarang tersenyum atau membalas senyum', 'Tidak menoleh saat namanya dipanggil', 'Jarang mengoceh'],
  },
  {
    title: '12 sampai 24 bulan',
    items: ['Belum menunjuk atau melambaikan tangan', 'Belum mengucapkan kata yang bermakna', 'Jarang menirukan gerakan'],
  },
  {
    title: '2 sampai 5 tahun',
    items: [
      'Bermain berulang dengan cara yang sama',
      'Sulit bermain bersama anak lain',
      'Sangat tidak nyaman pada suara, tekstur, atau perubahan rutinitas',
    ],
  },
  {
    title: 'Usia sekolah',
    items: [
      'Sulit memahami bahasa kiasan',
      'Kesulitan menjalin pertemanan',
      'Minat yang sangat mendalam pada topik tertentu, yang juga bisa menjadi kekuatan',
    ],
  },
]

export const steps = [
  {
    title: 'Skrining',
    text: 'Isi kuesioner di sini atau ikuti pemeriksaan tumbuh kembang di posyandu dan Puskesmas. Hasilnya berupa tingkat risiko, bukan diagnosis.',
  },
  {
    title: 'Konsultasi',
    text: 'Bawa hasil skrining ke Puskesmas atau dokter anak, lebih baik bila dokter tumbuh kembang.',
  },
  {
    title: 'Asesmen lengkap',
    text: 'Dokter, psikolog, atau psikiater anak menilai perkembangan anak secara menyeluruh, mengacu pada kriteria DSM-5.',
  },
  {
    title: 'Dukungan dan intervensi',
    text: 'Terapi sesuai kebutuhan anak, pendidikan inklusif, dan dukungan untuk keluarga. Anda tidak perlu menunggu diagnosis resmi untuk mulai mencari dukungan.',
  },
]

export const myths = [
  {
    myth: 'Vaksin menyebabkan autisme.',
    fact: 'Ada bukti kuat bahwa vaksinasi tidak menyebabkan autisme.',
    source: 'MSD Manual',
  },
  {
    myth: 'Autisme akibat pola asuh yang salah.',
    fact: 'Autisme bukan disebabkan oleh pola asuh yang buruk atau kondisi masa kecil yang buruk.',
    source: 'MSD Manual',
  },
  {
    myth: 'Autisme bisa disembuhkan dengan terapi tertentu.',
    fact: 'Autisme tidak bisa disembuhkan, tetapi dukungan yang tepat dan dini membantu anak menjalani kehidupan sehari-hari.',
    source: 'Alodokter',
  },
]

export const aiSteps = [
  { title: 'Foto dan persetujuan', text: 'Orang tua atau wali mengunggah foto dan menyetujui pemrosesannya.' },
  { title: 'Deteksi wajah', text: 'MTCNN menemukan dan memotong area wajah.' },
  { title: 'Klasifikasi', text: 'CNN memberi skor, dengan pilihan Test-Time Augmentation.' },
  { title: 'Skor dan level risiko', text: 'Hasil berupa persentase skor dan level risiko (rendah, sedang, tinggi), bukan label diagnosis.' },
]
