/**
 * Isi model card. Nilai `undefined` tampil sebagai "[belum diisi]".
 *
 * Sumber kebenaran ada di repo model-ai (docs/model-card.md dan ml/reports/).
 * Salin angkanya ke sini, atau otomatiskan lewat GitHub Action saat build.
 */

type Maybe<T> = T | undefined

export const modelCard = {
  version: undefined as Maybe<string>,
  updatedAt: undefined as Maybe<string>,

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
    classifier: undefined as Maybe<string>,
    tta: undefined as Maybe<string>,
    runtime: undefined as Maybe<string>,
  },

  metrics: [
    { label: 'AUC', value: undefined as Maybe<string>, ci: undefined as Maybe<string> },
    { label: 'Sensitivitas pada ambang level tinggi', value: undefined, ci: undefined },
    { label: 'Spesifisitas pada ambang level tinggi', value: undefined, ci: undefined },
    { label: 'Nilai prediksi positif (PPV)', value: undefined, ci: undefined },
    { label: 'Galat kalibrasi (ECE)', value: undefined, ci: undefined },
  ],

  thresholdMethod: undefined as Maybe<string>,

  subgroups: [
    { name: 'Usia', n: undefined as Maybe<string>, auc: undefined as Maybe<string>, sens: undefined as Maybe<string>, spec: undefined as Maybe<string> },
    { name: 'Jenis kelamin: laki-laki', n: undefined, auc: undefined, sens: undefined, spec: undefined },
    { name: 'Jenis kelamin: perempuan', n: undefined, auc: undefined, sens: undefined, spec: undefined },
    { name: 'Kelompok etnis', n: undefined, auc: undefined, sens: undefined, spec: undefined },
    { name: 'Kualitas foto (cahaya redup, pose miring)', n: undefined, auc: undefined, sens: undefined, spec: undefined },
  ],

  privacy: {
    stored: undefined as Maybe<string>,
    processedWhere: undefined as Maybe<string>,
    protection: undefined as Maybe<string>,
    access: undefined as Maybe<string>,
    deletion: undefined as Maybe<string>,
    legalBasis: undefined as Maybe<string>,
  },

  versions: [] as Array<{ version: string; date: string; change: string }>,
  reportEmail: undefined as Maybe<string>,
}

/** Rujukan. Periksa ulang terhadap sumber aslinya sebelum tayang. */
export const modelCardReferences = [
  'Lu A, Perkowski M. Deep Learning Approach for Screening Autism Spectrum Disorder in Children with Facial Images and Analysis of Ethnoracial Factors in Model Development and Application. Brain Sciences 2021;11(11):1446.',
  'Autism Answers Back. "When Machines Learn to See Autism, What They See Is a Problem." Blog komunitas autistik.',
  'Aledhari M, Rahouti M, Alfatemi A. Towards Equitable ASD Diagnostics: A Comparative Study of Machine and Deep Learning Models Using Behavioral and Facial Data. arXiv:2411.05880.',
  'Mitchell M dkk. Model Cards for Model Reporting. Proceedings of FAT*, 2019. Kerangka yang menjadi acuan format dokumen ini.',
]
