/**
 * Isi model card. Nilai `undefined` tampil sebagai "Belum dipublikasikan". Isi hanya dengan fakta yang bisa diperiksa.
 *
 * Sumber kebenaran ada di repo model-ai (docs/model-card.md dan ml/reports/).
 * Salin angkanya ke sini, atau otomatiskan lewat GitHub Action saat build.
 */

type Maybe<T> = T | undefined

export const modelCard = {
  version: 'mobilevitv2_100_fusion_v1' as Maybe<string>,
  updatedAt: '19 November 2026' as Maybe<string>,

  data: {
    dataset: undefined as Maybe<string>,
    counts: undefined as Maybe<string>,
    labeling: undefined as Maybe<string>,
    demographics: undefined as Maybe<string>,
    ethnicity: undefined as Maybe<string>,
    license: undefined as Maybe<string>,
    splitNote: undefined as Maybe<string>,
  },

  pipeline: {
    detector: 'MTCNN' as Maybe<string>,
    classifier:
      'MobileViTV2-100 (pustaka timm) dengan penggabungan fitur dari tiga tingkat jaringan, dua kelas keluaran (autistik dan non-autistik). Bobot diunduh dari Hugging Face Hub.' as Maybe<string>,
    tta:
      'Opsional, aktif secara bawaan. Empat tampilan gambar dirata-rata berbobot: asli (bobot 1,5), cermin horizontal, perbesaran lalu pangkas, dan rotasi acak sampai 10 derajat. Karena rotasinya acak, skor bisa berbeda tipis antar pemanggilan.' as Maybe<string>,
    runtime:
      'Layanan Flask di Hugging Face Space (Docker). Wajah dipangkas MTCNN lalu diperkecil ke 224 × 224 piksel sebelum masuk model.' as Maybe<string>,
  },

  metrics: [
    { label: 'AUC', value: undefined as Maybe<string>, ci: undefined as Maybe<string> },
    { label: 'Sensitivitas pada ambang level tinggi', value: undefined, ci: undefined },
    { label: 'Spesifisitas pada ambang level tinggi', value: undefined, ci: undefined },
    { label: 'Nilai prediksi positif (PPV)', value: undefined, ci: undefined },
    { label: 'Galat kalibrasi (ECE)', value: undefined, ci: undefined },
  ],

  thresholdMethod:
    'batas 40% dan 70% adalah nilai sementara yang ditetapkan manual dan belum diturunkan dari kurva ROC pada data validasi' as Maybe<string>,

  subgroups: [
    { name: 'Usia', n: undefined as Maybe<string>, auc: undefined as Maybe<string>, sens: undefined as Maybe<string>, spec: undefined as Maybe<string> },
    { name: 'Jenis kelamin: laki-laki', n: undefined, auc: undefined, sens: undefined, spec: undefined },
    { name: 'Jenis kelamin: perempuan', n: undefined, auc: undefined, sens: undefined, spec: undefined },
    { name: 'Kelompok etnis', n: undefined, auc: undefined, sens: undefined, spec: undefined },
    { name: 'Kualitas foto (cahaya redup, pose miring)', n: undefined, auc: undefined, sens: undefined, spec: undefined },
  ],

  privacy: {
    stored:
      'Tidak. Foto diproses di memori dan dibuang setelah hasil dikirim. Log server hanya mencatat ukuran gambar dan apakah wajah terdeteksi, bukan isinya.' as Maybe<string>,
    processedWhere:
      'Di layanan model (Hugging Face Space). Permintaan melewati server situs ini (Vercel) sebagai perantara; aplikasi tidak menyimpan isi foto di sana.' as Maybe<string>,
    protection:
      'Koneksi terenkripsi (HTTPS). Layanan model hanya menerima permintaan dari server situs ini, dan ukuran unggahan dibatasi.' as Maybe<string>,
    access: 'Tidak ada salinan foto yang bisa diakses, karena foto tidak disimpan.' as Maybe<string>,
    deletion: 'Tidak ada data foto yang tersimpan untuk dihapus.' as Maybe<string>,
    legalBasis:
      'Persetujuan orang tua atau wali yang dicentang sebelum foto diunggah (mengacu pada UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi).' as Maybe<string>,
  },

  versions: [
    { version: 'mobilevitv2_100_fusion_v1', date: '2026-11', change: 'Versi yang saat ini dipakai di demo /ai.' },
  ] as Array<{ version: string; date: string; change: string }>,
  reportEmail: undefined as Maybe<string>,
}

/** Rujukan. Periksa ulang terhadap sumber aslinya sebelum tayang. */
export const modelCardReferences = [
  'Lu A, Perkowski M. Deep Learning Approach for Screening Autism Spectrum Disorder in Children with Facial Images and Analysis of Ethnoracial Factors in Model Development and Application. Brain Sciences 2021;11(11):1446.',
  'Autism Answers Back. "When Machines Learn to See Autism, What They See Is a Problem." Blog komunitas autistik.',
  'Aledhari M, Rahouti M, Alfatemi A. Towards Equitable ASD Diagnostics: A Comparative Study of Machine and Deep Learning Models Using Behavioral and Facial Data. arXiv:2411.05880.',
  'Mitchell M dkk. Model Cards for Model Reporting. Proceedings of FAT*, 2019. Kerangka yang menjadi acuan format dokumen ini.',
]
