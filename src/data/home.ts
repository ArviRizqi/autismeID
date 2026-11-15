// Konten beranda. Tinjau semuanya bersama tenaga klinis sebelum tayang.

export interface AgeSigns {
  range: string
  items: string[]
}

export const ageSigns: AgeSigns[] = [
  {
    range: '0 sampai 12 bulan',
    items: ['Jarang tersenyum atau membalas senyum', 'Tidak menoleh saat namanya dipanggil', 'Jarang mengoceh'],
  },
  {
    range: '12 sampai 24 bulan',
    items: ['Belum menunjuk atau melambaikan tangan', 'Belum mengucapkan kata yang bermakna', 'Jarang menirukan gerakan'],
  },
  {
    range: '2 sampai 5 tahun',
    items: [
      'Bermain berulang dengan cara yang sama',
      'Sulit bermain bersama anak lain',
      'Sangat tidak nyaman pada suara, tekstur, atau perubahan rutinitas',
    ],
  },
  {
    range: 'Usia sekolah',
    items: [
      'Sulit memahami bahasa kiasan',
      'Kesulitan menjalin pertemanan',
      'Minat yang sangat mendalam pada topik tertentu, yang juga bisa menjadi kekuatan',
    ],
  },
]

export const careSteps = [
  {
    title: 'Skrining',
    body: 'Isi kuesioner di sini atau ikuti pemeriksaan tumbuh kembang di posyandu dan Puskesmas. Hasilnya berupa tingkat risiko, bukan diagnosis.',
  },
  {
    title: 'Konsultasi',
    body: 'Bawa hasil skrining ke Puskesmas atau dokter anak, lebih baik bila dokter tumbuh kembang.',
  },
  {
    title: 'Asesmen lengkap',
    body: 'Dokter, psikolog, atau psikiater anak menilai perkembangan anak secara menyeluruh, mengacu pada kriteria DSM-5.',
  },
  {
    title: 'Dukungan dan intervensi',
    body: 'Terapi sesuai kebutuhan anak, pendidikan inklusif, dan dukungan untuk keluarga. Anda tidak perlu menunggu diagnosis resmi untuk mulai mencari dukungan.',
  },
]

export const keyFigures = [
  {
    value: '1 dari 127',
    text: 'orang di dunia diperkirakan autistik pada 2021. Angka ini rata-rata, dan di banyak negara berpenghasilan rendah dan menengah angka sebenarnya belum diketahui.',
    source: 'Sumber: WHO, lembar fakta autisme (September 2025)',
  },
  {
    value: 'Di atas 4 tahun',
    text: 'usia ketika banyak anak baru dikenali, karena akses ke skrining dan terapi masih terbatas dan stigma masih kuat.',
    source: 'Sumber: Ketua IDAI, media briefing April 2025',
  },
  {
    value: '88,9% · 94,6%',
    text: 'sensitivitas dan spesifisitas M-CHAT-R/F versi Indonesia dalam studi di RS Sanglah, Bali, bila dipakai dua tahap.',
    source: 'Sumber: studi validasi M-CHAT-R/F, Sanglah Hospital',
  },
]

export const mythsFacts = [
  {
    myth: '“Vaksin menyebabkan autisme.”',
    fact: 'Ada bukti kuat bahwa vaksinasi tidak menyebabkan autisme.',
    source: 'Sumber: MSD Manual',
  },
  {
    myth: '“Autisme akibat pola asuh yang salah.”',
    fact: 'Autisme bukan disebabkan oleh pola asuh yang buruk atau kondisi masa kecil yang buruk.',
    source: 'Sumber: MSD Manual',
  },
  {
    myth: '“Autisme bisa disembuhkan dengan terapi tertentu.”',
    fact: 'Autisme tidak bisa disembuhkan, tetapi dukungan yang tepat dan dini membantu anak menjalani kehidupan sehari-hari.',
    source: 'Sumber: Alodokter',
  },
]
