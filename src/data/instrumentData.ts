import {
  IndicatorDefinition,
  ObservasiIndicatorDefinition,
  RPPEvaluation,
  ScoreValue,
  PraObservasiData,
  PascaObservasiData,
  ProgramTindakLanjutItem,
} from '../types';

export const CREATOR_INFO = {
  name: 'Tati Maryati, S.Pd., M.Pd.',
  nip: '197811082006042014',
  title: 'Pengawas SMP Dinas Pendidikan Kota Depok',
  institution: 'Dinas Pendidikan Kota Depok',
  appTitle: 'Aplikasi Supervisi Terpadu Pembelajaran Mendalam',
  appSubtitle: 'Instrumen Terintegrasi: Telaah RPP, Pra-Observasi, Observasi Kelas (14 Indikator), & Pasca Observasi Berbasis Penguatan Literasi dan Numerasi',
};

// 1. TAHAP 1: 42 INDIKATOR TELAAH RPP / PERENCANAAN
export const INDICATORS: IndicatorDefinition[] = [
  // Bagian A. KESELARASAN PERENCANAAN PEMBELAJARAN (1-5)
  { id: 1, text: 'Tujuan, langkah pembelajaran, dan asesmen selaras dengan Capaian Pembelajaran dan Profil Lulusan', section: 'A', sectionTitle: 'A. Keselarasan Perencanaan Pembelajaran' },
  { id: 2, text: 'Tujuan pembelajaran dirumuskan menggunakan kata kerja operasional yang jelas', section: 'A', sectionTitle: 'A. Keselarasan Perencanaan Pembelajaran' },
  { id: 3, text: 'Tujuan pembelajaran memuat kompetensi literasi dan/atau numerasi', section: 'A', sectionTitle: 'A. Keselarasan Perencanaan Pembelajaran' },
  { id: 4, text: 'Tujuan pembelajaran menggunakan konteks kehidupan nyata', section: 'A', sectionTitle: 'A. Keselarasan Perencanaan Pembelajaran' },
  { id: 5, text: 'Tujuan pembelajaran mendorong berpikir kritis, kreatif, dan pemecahan masalah', section: 'A', sectionTitle: 'A. Keselarasan Perencanaan Pembelajaran' },

  // Bagian B. KERANGKA PEMBELAJARAN (6-9)
  { id: 6, text: 'Lingkungan belajar mendukung pembelajaran mendalam', section: 'B', sectionTitle: 'B. Kerangka Pembelajaran' },
  { id: 7, text: 'Kemitraan pembelajaran tergambar dalam aktivitas belajar', section: 'B', sectionTitle: 'B. Kerangka Pembelajaran' },
  { id: 8, text: 'Pemanfaatan teknologi/digital mendukung pembelajaran', section: 'B', sectionTitle: 'B. Kerangka Pembelajaran' },
  { id: 9, text: 'Praktik Pedagogis bertujuan untuk pembelajaran berpusat pada murid', section: 'B', sectionTitle: 'B. Kerangka Pembelajaran' },

  // Bagian C. PENGALAMAN BELAJAR (10-28)
  // C1. Memahami (10-15)
  { id: 10, text: 'Menghubungkan pengetahuan awal dengan materi baru', section: 'C1', sectionTitle: 'C1. Memahami (Pengalaman Belajar)' },
  { id: 11, text: 'Menstimulasi berpikir tingkat tinggi', section: 'C1', sectionTitle: 'C1. Memahami (Pengalaman Belajar)' },
  { id: 12, text: 'Mengintegrasikan aktivitas literasi (membaca, mengidentifikasi, menganalisis, menyimpulkan)', section: 'C1', sectionTitle: 'C1. Memahami (Pengalaman Belajar)' },
  { id: 13, text: 'Mengintegrasikan aktivitas numerasi (menghitung, membaca data, grafik, tabel, diagram)', section: 'C1', sectionTitle: 'C1. Memahami (Pengalaman Belajar)' },
  { id: 14, text: 'Menghubungkan konsep dengan kehidupan nyata', section: 'C1', sectionTitle: 'C1. Memahami (Pengalaman Belajar)' },
  { id: 15, text: 'Menanamkan karakter, etika, dan nilai positif', section: 'C1', sectionTitle: 'C1. Memahami (Pengalaman Belajar)' },

  // C2. Mengaplikasi (16-20)
  { id: 16, text: 'Memberikan kesempatan menerapkan konsep dalam konteks nyata untuk memecahkan permasalahan', section: 'C2', sectionTitle: 'C2. Mengaplikasi (Pengalaman Belajar)' },
  { id: 17, text: 'Mengembangkan kolaborasi dan eksplorasi', section: 'C2', sectionTitle: 'C2. Mengaplikasi (Pengalaman Belajar)' },
  { id: 18, text: 'Menggunakan data/informasi untuk menyelesaikan masalah', section: 'C2', sectionTitle: 'C2. Mengaplikasi (Pengalaman Belajar)' },
  { id: 19, text: 'Mengembangkan kreativitas dan inovasi', section: 'C2', sectionTitle: 'C2. Mengaplikasi (Pengalaman Belajar)' },
  { id: 20, text: 'Menggunakan literasi dan numerasi sebagai alat pemecahan masalah', section: 'C2', sectionTitle: 'C2. Mengaplikasi (Pengalaman Belajar)' },

  // C3. Merefleksi (21-25)
  { id: 21, text: 'Murid melakukan refleksi terhadap proses belajar', section: 'C3', sectionTitle: 'C3. Merefleksi (Pengalaman Belajar)' },
  { id: 22, text: 'Murid melakukan evaluasi diri terhadap hasil belajar', section: 'C3', sectionTitle: 'C3. Merefleksi (Pengalaman Belajar)' },
  { id: 23, text: 'Mendorong metakognisi (belajar bagaimana belajar)', section: 'C3', sectionTitle: 'C3. Merefleksi (Pengalaman Belajar)' },
  { id: 24, text: 'Mendorong regulasi emosi dan motivasi belajar', section: 'C3', sectionTitle: 'C3. Merefleksi (Pengalaman Belajar)' },
  { id: 25, text: 'Menentukan tindak lanjut pembelajaran', section: 'C3', sectionTitle: 'C3. Merefleksi (Pengalaman Belajar)' },

  // C4. Prinsip Pembelajaran Mendalam (26-28)
  { id: 26, text: 'Pembelajaran berkesadaran (guru menyampaikan tujuan pembelajaran)', section: 'C4', sectionTitle: 'C4. Prinsip Pembelajaran Mendalam' },
  { id: 27, text: 'Pembelajaran bermakna (pembelajaran dikaitkan dengan kehidupan nyata)', section: 'C4', sectionTitle: 'C4. Prinsip Pembelajaran Mendalam' },
  { id: 28, text: 'Pembelajaran menggembirakan (pembelajaran memotivasi suasana positif)', section: 'C4', sectionTitle: 'C4. Prinsip Pembelajaran Mendalam' },

  // Bagian D. PENGUATAN LITERASI DAN NUMERASI (29-36)
  { id: 29, text: 'Aktivitas membaca berbagai sumber informasi dirancang secara sistematis', section: 'D', sectionTitle: 'D. Penguatan Literasi dan Numerasi' },
  { id: 30, text: 'Aktivitas analisis teks/informasi dilakukan secara kritis', section: 'D', sectionTitle: 'D. Penguatan Literasi dan Numerasi' },
  { id: 31, text: 'Aktivitas interpretasi data/grafik/tabel dirancang', section: 'D', sectionTitle: 'D. Penguatan Literasi dan Numerasi' },
  { id: 32, text: 'Pertanyaan pemantik mendorong berpikir kritis', section: 'D', sectionTitle: 'D. Penguatan Literasi dan Numerasi' },
  { id: 33, text: 'Media pembelajaran mendukung literasi', section: 'D', sectionTitle: 'D. Penguatan Literasi dan Numerasi' },
  { id: 34, text: 'Media pembelajaran mendukung numerasi', section: 'D', sectionTitle: 'D. Penguatan Literasi dan Numerasi' },
  { id: 35, text: 'Variasi sumber informasi memperkaya pengalaman belajar (teks, artikel, grafik, video, infografik, data, tabel, media digital)', section: 'D', sectionTitle: 'D. Penguatan Literasi dan Numerasi' },
  { id: 36, text: 'Sumber belajar relevan dengan karakteristik murid', section: 'D', sectionTitle: 'D. Penguatan Literasi dan Numerasi' },

  // Bagian E. ASESMEN PEMBELAJARAN (37-42)
  { id: 37, text: 'Asesmen awal mengidentifikasi kesiapan belajar murid', section: 'E', sectionTitle: 'E. Asesmen Pembelajaran' },
  { id: 38, text: 'Asesmen formatif dilaksanakan selama proses belajar', section: 'E', sectionTitle: 'E. Asesmen Pembelajaran' },
  { id: 39, text: 'Asesmen sumatif mengukur ketercapaian tujuan pembelajaran', section: 'E', sectionTitle: 'E. Asesmen Pembelajaran' },
  { id: 40, text: 'Instrumen mengukur kemampuan literasi', section: 'E', sectionTitle: 'E. Asesmen Pembelajaran' },
  { id: 41, text: 'Instrumen mengukur kemampuan numerasi', section: 'E', sectionTitle: 'E. Asesmen Pembelajaran' },
  { id: 42, text: 'Rubrik penilaian jelas dan sesuai indikator', section: 'E', sectionTitle: 'E. Asesmen Pembelajaran' },
];

export const SECTION_INFO = {
  A: { title: 'A. Keselarasan Perencanaan Pembelajaran', max: 20, indicatorsCount: 5 },
  B: { title: 'B. Kerangka Pembelajaran', max: 16, indicatorsCount: 4 },
  C: { title: 'C. Pengalaman Belajar (Langkah PM)', max: 76, indicatorsCount: 19 },
  D: { title: 'D. Penguatan Literasi dan Numerasi', max: 32, indicatorsCount: 8 },
  E: { title: 'E. Asesmen Pembelajaran', max: 24, indicatorsCount: 6 },
};

// 2. TAHAP 3: 14 INDIKATOR OBSERVASI KELAS (PELAKSANAAN PEMBELAJARAN)
export const OBSERVASI_INDICATORS: ObservasiIndicatorDefinition[] = [
  // A. KEGIATAN PENDAHULUAN (1-5)
  {
    id: 1,
    section: 'A',
    sectionTitle: 'A. KEGIATAN PENDAHULUAN',
    title: 'Kesiapan Fisik & Psikis serta Menyampaikan Tujuan Belajar',
    description: 'Menyiapkan fisik dan psikis murid (memeriksa kehadiran, kesiapan belajar, kelengkapan media/alat) serta menyampaikan tujuan belajar.',
  },
  {
    id: 2,
    section: 'A',
    sectionTitle: 'A. KEGIATAN PENDAHULUAN',
    title: 'Motivasi Kontekstual & Manfaat Belajar',
    description: 'Memotivasi belajar secara kontekstual dengan menampilkan isu atau permasalahan agar murid memahami manfaat belajar.',
  },
  {
    id: 3,
    section: 'A',
    sectionTitle: 'A. KEGIATAN PENDAHULUAN',
    title: 'Pertanyaan Reflektif & Esensial',
    description: 'Mengajukan pertanyaan reflektif dan esensial untuk memicu rasa ingin tahu murid.',
  },
  {
    id: 4,
    section: 'A',
    sectionTitle: 'A. KEGIATAN PENDAHULUAN',
    title: 'Penyampaian Tujuan & Literasi/Numerasi',
    description: 'Menyampaikan tujuan pembelajaran sesuai kebutuhan murid, termasuk tujuan yang memuat aktivitas literasi dan/atau numerasi dalam konteks kehidupan sehari-hari.',
  },
  {
    id: 5,
    section: 'A',
    sectionTitle: 'A. KEGIATAN PENDAHULUAN',
    title: 'Penyampaian Rencana Kegiatan Pembelajaran',
    description: 'Menyampaikan rencana kegiatan pembelajaran (kerja kelompok atau kerja individual, dsb.).',
  },

  // B. KEGIATAN INTI (6-11)
  {
    id: 6,
    section: 'B',
    sectionTitle: 'B. KEGIATAN INTI',
    title: 'Stimulasi Pertanyaan Eksploratif',
    description: 'Menstimulasi murid untuk bertanya dan mengajukan pertanyaan eksploratif tentang materi melalui berbagai sumber (membaca/praktik/simulasi/demonstrasi, dsb.).',
  },
  {
    id: 7,
    section: 'B',
    sectionTitle: 'B. KEGIATAN INTI',
    title: 'Lingkungan Belajar & Teks Multimoda',
    description: 'Menciptakan lingkungan belajar yang melibatkan murid aktif menggali informasi dari berbagai sumber teks multimoda (buku, artikel, infografik, grafik, atau media digital) yang relevan dan sesuai kemampuan murid, di dalam maupun di luar kelas.',
  },
  {
    id: 8,
    section: 'B',
    sectionTitle: 'B. KEGIATAN INTI',
    title: 'MEMAHAMI: Konstruksi Pemahaman & Konteks Nyata',
    description: 'MEMAHAMI: Memfasilitasi murid mengonstruksi pemahaman mendalam dengan menghubungkan pengetahuan baru-lama serta konteks nyata/kehidupan sehari-hari.',
  },
  {
    id: 9,
    section: 'B',
    sectionTitle: 'B. KEGIATAN INTI',
    title: 'MEMAHAMI: Eksploratif-Kolaboratif & Karakter',
    description: 'MEMAHAMI: Menstimulasi proses berpikir, memberi kebebasan eksploratif-kolaboratif, serta menanamkan nilai moral, etika, dan karakter murid.',
  },
  {
    id: 10,
    section: 'B',
    sectionTitle: 'B. KEGIATAN INTI',
    title: 'MENGAPLIKASI: Penerapan Konseptual Bidang Nyata',
    description: 'MENGAPLIKASI: Memfasilitasi murid mengaplikasikan pemahaman secara kontekstual dengan menghubungkan dan menerapkan konsep ke situasi/bidang nyata.',
  },
  {
    id: 11,
    section: 'B',
    sectionTitle: 'B. KEGIATAN INTI',
    title: 'MENGAPLIKASI: Berpikir Kritis & Solusi Inovatif',
    description: 'MENGAPLIKASI: Mengembangkan pemahaman melalui eksplorasi lebih lanjut serta berpikir kritis mencari solusi inovatif.',
  },

  // C. KEGIATAN PENUTUP (12-14)
  {
    id: 12,
    section: 'C',
    sectionTitle: 'C. KEGIATAN PENUTUP',
    title: 'REFLEKSI: Kesimpulan Mandiri & Kolaboratif',
    description: 'REFLEKSI: Memfasilitasi murid menyimpulkan dan merefleksikan proses serta hasil pembelajaran yang telah dicapai secara mandiri dan kolaboratif.',
  },
  {
    id: 13,
    section: 'C',
    sectionTitle: 'C. KEGIATAN PENUTUP',
    title: 'UMPAN BALIK: Konstruktif & Penguatan Karakter',
    description: 'UMPAN BALIK: Memberikan umpan balik konstruktif, apresiasi, serta penguatan atas pencapaian kompetensi dan karakter murid.',
  },
  {
    id: 14,
    section: 'C',
    sectionTitle: 'C. KEGIATAN PENUTUP',
    title: 'TINDAK LANJUT: Rencana Lanjutan & Penguatan LitNum',
    description: 'TINDAK LANJUT: Menyampaikan informasi rencana pembelajaran berikutnya atau tugas pengembangan mandiri berbasis penguatan literasi/numerasi.',
  },
];

export const OBSERVASI_SECTION_INFO = {
  A: { title: 'A. KEGIATAN PENDAHULUAN', max: 20, count: 5 },
  B: { title: 'B. KEGIATAN INTI', max: 24, count: 6 },
  C: { title: 'C. KEGIATAN PENUTUP', max: 12, count: 3 },
};

// Hitung Skor Telaah RPP (42 Indikator)
export function calculateRPPScores(scores: Record<number, ScoreValue>) {
  let scoreA = 0; // 1-5
  let scoreB = 0; // 6-9
  let scoreC = 0; // 10-28
  let scoreD = 0; // 29-36
  let scoreE = 0; // 37-42

  for (let i = 1; i <= 5; i++) {
    scoreA += scores[i] || 0;
  }
  for (let i = 6; i <= 9; i++) {
    scoreB += scores[i] || 0;
  }
  for (let i = 10; i <= 28; i++) {
    scoreC += scores[i] || 0;
  }
  for (let i = 29; i <= 36; i++) {
    scoreD += scores[i] || 0;
  }
  for (let i = 37; i <= 42; i++) {
    scoreE += scores[i] || 0;
  }

  const totalScore = scoreA + scoreB + scoreC + scoreD + scoreE; // max 168
  const finalScore = Number(((totalScore / 168) * 100).toFixed(2));

  let predicate: 'A' | 'B' | 'C' | 'D' = 'D';
  let predicateLabel = 'Kurang';

  if (finalScore >= 91) {
    predicate = 'A';
    predicateLabel = 'Amat Baik (Sangat Layak)';
  } else if (finalScore >= 81) {
    predicate = 'B';
    predicateLabel = 'Baik (Lulus Telaah)';
  } else if (finalScore >= 71) {
    predicate = 'C';
    predicateLabel = 'Cukup (Perlu Perbaikan)';
  } else {
    predicate = 'D';
    predicateLabel = 'Kurang (Revisi Total)';
  }

  return {
    scoreA,
    scoreB,
    scoreC,
    scoreD,
    scoreE,
    totalScore,
    finalScore,
    predicate,
    predicateLabel,
  };
}

// Hitung Skor Observasi Kelas (14 Indikator)
export function calculateObservasiScores(scores: Record<number, ScoreValue>) {
  let observasiScoreA = 0; // 1-5
  let observasiScoreB = 0; // 6-11
  let observasiScoreC = 0; // 12-14

  for (let i = 1; i <= 5; i++) {
    observasiScoreA += scores[i] || 0;
  }
  for (let i = 6; i <= 11; i++) {
    observasiScoreB += scores[i] || 0;
  }
  for (let i = 12; i <= 14; i++) {
    observasiScoreC += scores[i] || 0;
  }

  const observasiTotalScore = observasiScoreA + observasiScoreB + observasiScoreC; // max 56
  const observasiFinalScore = Number(((observasiTotalScore / 56) * 100).toFixed(2));

  let observasiPredicate: 'A' | 'B' | 'C' | 'D' = 'D';
  let observasiPredicateLabel = 'Kurang';

  if (observasiFinalScore >= 91) {
    observasiPredicate = 'A';
    observasiPredicateLabel = 'Amat Baik (Sangat Efektif)';
  } else if (observasiFinalScore >= 81) {
    observasiPredicate = 'B';
    observasiPredicateLabel = 'Baik (Efektif)';
  } else if (observasiFinalScore >= 71) {
    observasiPredicate = 'C';
    observasiPredicateLabel = 'Cukup (Cukup Efektif)';
  } else {
    observasiPredicate = 'D';
    observasiPredicateLabel = 'Kurang (Perlu Pembinaan Khusus)';
  }

  return {
    observasiScoreA,
    observasiScoreB,
    observasiScoreC,
    observasiTotalScore,
    observasiFinalScore,
    observasiPredicate,
    observasiPredicateLabel,
  };
}

// Hitung Nilai Akhir Gabungan (30% RPP + 70% Observasi Kelas)
export function calculateCombinedSupervisionScore(rppFinalScore: number, observasiFinalScore: number) {
  const combinedFinalScore = Number((rppFinalScore * 0.3 + observasiFinalScore * 0.7).toFixed(2));

  let combinedPredicate: 'A' | 'B' | 'C' | 'D' = 'D';
  let combinedPredicateLabel = 'Kurang';

  if (combinedFinalScore >= 91) {
    combinedPredicate = 'A';
    combinedPredicateLabel = 'Amat Baik (Unggul)';
  } else if (combinedFinalScore >= 81) {
    combinedPredicate = 'B';
    combinedPredicateLabel = 'Baik (Memenuhi Standar)';
  } else if (combinedFinalScore >= 71) {
    combinedPredicate = 'C';
    combinedPredicateLabel = 'Cukup (Perlu Pendampingan)';
  } else {
    combinedPredicate = 'D';
    combinedPredicateLabel = 'Kurang (Perlu Tindak Lanjut Intensif)';
  }

  return {
    combinedFinalScore,
    combinedPredicate,
    combinedPredicateLabel,
  };
}

// Generate default scores map for RPP (1-42)
export function createDefaultScores(defaultValue: ScoreValue = 3): Record<number, ScoreValue> {
  const scores: Record<number, ScoreValue> = {};
  for (let i = 1; i <= 42; i++) {
    scores[i] = defaultValue;
  }
  return scores;
}

// Generate default scores map for Observasi (1-14)
export function createDefaultObservasiScores(defaultValue: ScoreValue = 3): Record<number, ScoreValue> {
  const scores: Record<number, ScoreValue> = {};
  for (let i = 1; i <= 14; i++) {
    scores[i] = defaultValue;
  }
  return scores;
}

// Default Pra Observasi Template
export function createDefaultPraObservasi(): PraObservasiData {
  return {
    topic: '',
    learningGoals: '',
    fokusPengembangan: 'Penguatan Literasi & Numerasi, Pembelajaran Mendalam (Memahami-Mengaplikasi-Merefleksi), dan Keterlibatan Aktif Murid',
    strategiMedia: 'Model Problem-Based Learning (PBL), Teks Multimoda, LKPD Berbasis Data, Media Digital Interaktif',
    kesiapanSiswa: 'Siswa heterogen dengan minat beragam; beberapa siswa memerlukan pendampingan membaca grafik',
    potensiKendala: 'Manajemen waktu pada saat diskusi kelompok dan presentasi hasil kerja',
    catatanPraObservasi: 'Guru siap diobservasi. Fokus supervisi pada bagaimana guru memfasilitasi pemahaman mendalam dan integrasi numerasi dalam LKPD.',
    interviewDate: new Date().toISOString().split('T')[0],
  };
}

// Default Pasca Observasi Template
export function createDefaultPascaObservasi(): PascaObservasiData {
  return {
    refleksiGuru: 'Pembelajaran berjalan lancar dan murid antusias berdiskusi. Namun pengalokasian waktu untuk tahap refleksi mandiri di akhir pelajaran masih terasa kurang.',
    kelebihanUtama: '',
    halDitingkatkan: '',
    kesimpulanSupervisi: '',
    programTindakLanjut: [],
    postInterviewDate: new Date().toISOString().split('T')[0],
  };
}

// Pre-populated Sample Data across Kota Depok SMPs for instant testing
export const SAMPLE_EVALUATIONS: RPPEvaluation[] = [
  {
    id: 'sample-eval-1',
    createdAt: '2026-08-10T08:00:00.000Z',
    updatedAt: '2026-08-10T11:30:00.000Z',
    identity: {
      teacherName: 'Dra. Hj. Siti Aminah, M.Pd.',
      nipNuptk: '198203152008012010',
      subject: 'IPA (Ilmu Pengetahuan Alam)',
      gradeFase: 'Kelas VII / Fase D',
      schoolName: 'SMP Negeri 1 Depok',
      unitKerja: 'SMP Negeri 1 Depok - Dinas Pendidikan Kota Depok',
      penelaahName: CREATOR_INFO.name,
      penelaahNip: CREATOR_INFO.nip,
      penelaahJabatan: CREATOR_INFO.title,
      assessmentDate: '2026-08-10',
      rppTitle: 'Modul Ajar Ekosistem, Jaring Makanan & Mitigasi Sampah Sungai Ciliwung Depok',
      observationDate: '2026-08-12',
      observationClassTime: '08.00 - 09.20 WIB (Kelas VII-A)',
    },
    scores: createDefaultScores(4),
    sectionComments: {
      sectionA: 'Tujuan pembelajaran dirumuskan jelas dengan KKO menganalisis dan mengaitkan konteks nyata Sungai Ciliwung.',
      sectionB: 'Kerangka pembelajaran interaktif, memanfaatkan video digital pemantik dan LKPD berbasis studi kasus.',
      sectionC: 'Alur Memahami-Mengaplikasi-Merefleksi berjalan terpadu dan menumbuhkan etika peduli lingkungan.',
      sectionD: 'Integrasi literasi membaca infografik dan data volume timbulan sampah Kota Depok tampak nyata.',
      sectionE: 'Asesmen formatif dilengkapi rubrik kinerja presentasi dan evaluasi diri murid.',
    },
    feedback: {
      kelebihan: '1. Mengangkat isu kontekstual lingkungan lokal Sungai Ciliwung Kota Depok secara bermakna.\n2. Alur Pembelajaran Mendalam (PM) sangat hidup dan memicu keterlibatan aktif murid.\n3. Integrasi literasi sains dan numerasi data tersaji runtut.',
      halDitingkatkan: '1. Penguatan scaffolding bagi kelompok peserta didik yang kemampuan membaca datanya masih lambat.\n2. Penambahan variasi rubrik asesmen antar-teman sebaya (peer assessment).',
      rekomendasi: '1. Pertahankan praktik baik ini sebagai materi berbagi di Komunitas Belajar (Kombel) SMPN 1 Depok.\n2. Kembangkan lembar kerja berdiferensiasi untuk mengakomodasi ragam kesiapan belajar murid.',
      tindakLanjut: 'Guru membagikan perangkat pembelajaran ini pada forum MGMP IPA Kota Depok pada pertemuan bulan depan.',
    },
    scoreA: 20,
    scoreB: 16,
    scoreC: 76,
    scoreD: 32,
    scoreE: 24,
    totalScore: 168,
    finalScore: 100,
    predicate: 'A',
    predicateLabel: 'Amat Baik (Sangat Layak)',

    // Tahap 2: Pra Observasi
    praObservasi: {
      topic: 'Ekosistem dan Interaksi Makhluk Hidup',
      learningGoals: 'Peserta didik mampu menganalisis pengaruh pencemaran sampah plastik terhadap ekosistem Sungai Ciliwung menggunakan data tabel uji mutu air.',
      fokusPengembangan: 'Penerapan Pembelajaran Mendalam (PM), Penguatan Numerasi Data Tabel, dan Manajemen Diskusi Kolaboratif.',
      strategiMedia: 'Problem-Based Learning (PBL), Tayangan Video Sungai Ciliwung, LKPD Uji Kualitas Air, Infografik Canva.',
      kesiapanSiswa: 'Sebagian besar murid memiliki minat tinggi, 4 murid memerlukan bimbingan khusus dalam interpretasi tabel data.',
      potensiKendala: 'Waktu analisis data tabel kelompok memerlukan pemantauan ketat agar tidak molor.',
      catatanPraObservasi: 'Guru sangat siap. Disepakati fokus observasi pada keaktifan bertanya murid dan scaffolding numerasi.',
      interviewDate: '2026-08-11',
    },

    // Tahap 3: Observasi Kelas (14 Indikator)
    observasiScores: {
      1: 4, 2: 4, 3: 4, 4: 4, 5: 4,
      6: 4, 7: 4, 8: 4, 9: 4, 10: 4, 11: 3,
      12: 4, 13: 4, 14: 3,
    },
    observasiComments: {
      1: 'Apersepsi dan pengkondisian awal belajar berlangsung tertib serta guru menyampaikan tujuan belajar dengan sangat jelas dan komunikatif.',
      2: 'Video masalah sampah Sungai Ciliwung sangat kontekstual dan memotivasi murid memahami manfaat materi.',
      3: 'Pertanyaan pemantik "Apa yang terjadi jika mikroplastik masuk ke rantai makanan manusia?" memicu rasa ingin tahu tinggi.',
      4: 'Tujuan pembelajaran dan target analisis data numerasi disampaikan dengan sangat gamblang.',
      5: 'Rencana kerja kelompok dan rubrik unjuk kerja dipahami seluruh murid.',
      6: 'Murid berebut bertanya dan mengemukakan hipotesis awal saat menelaah artikel.',
      7: 'Lingkungan kelas kondusif dengan poster infografik dan akses media digital interaktif.',
      8: 'Guru fasilitatif menghubungkan konsep biologi dengan gaya hidup minim sampah di rumah murid.',
      9: 'Diskusi kelompok hangat, saling menghargai pendapat, dan nilai integritas kejujuran data terjaga.',
      10: 'Murid mampu menghitung persentase pencemaran berdasarkan data sampel air buatan.',
      11: 'Sebagian besar kelompok menemukan solusi inovatif daur ulang, namun perlu diperdalam aspek efisiensi biaya.',
      12: 'Refleksi mandiri berjalan mendalam, murid menuliskan komitmen pribadi di papan refleksi jamboard/sticky note.',
      13: 'Guru memberikan umpan balik spesifik dan apresiasi bintang kelompok teraktif.',
      14: 'Tindak lanjut tugas rumah mengamati jenis sampah rumah tangga selama 3 hari tersampaikan jelas.',
    },
    observasiScoreA: 20,
    observasiScoreB: 23,
    observasiScoreC: 11,
    observasiTotalScore: 54,
    observasiFinalScore: 96.43,
    observasiPredicate: 'A',
    observasiPredicateLabel: 'Amat Baik (Sangat Efektif)',

    // Tahap 4: Pasca Observasi & Tindak Lanjut
    pascaObservasi: {
      refleksiGuru: 'Saya merasa sangat puas melihat murid aktif berdiskusi menganalisis data tabel. Ke depan saya ingin lebih banyak menyediakan bahan bacaan teks dengan tingkat kesulitan berjenjang (diferensiasi konten).',
      kelebihanUtama: '1. Penguasaan kelas dan pedagogik sangat prima, memfasilitasi murid berpikir kritis tingkat tinggi (HOTS).\n2. Integrasi isu kontekstual lingkungan lokal Kota Depok berhasil meningkatkan kepedulian murid.\n3. Pemanfaatan teks multimoda dan data numerasi LKPD sangat aplikatif.',
      halDitingkatkan: '1. Penguatan pendampingan bagi kelompok dengan kecepatan belajar rendah agar tidak didominasi oleh satu ketua kelompok saja.\n2. Optimalisasi waktu presentasi agar seluruh kelompok mendapat porsi tanya-jawab yang seimbang.',
      kesimpulanSupervisi: 'Proses pembelajaran telah memenuhi standar Pembelajaran Mendalam (PM) yang sangat berkualitas dan berpusat pada murid. Sangat layak menjadi percontohan (model teacher) di lingkungan Sub Rayon / MGMP Kota Depok.',
      programTindakLanjut: [
        {
          id: 'prog-1',
          namaProgram: 'Diseminasi Praktik Baik Pembelajaran Mendalam',
          tujuan: 'Menyebarkan model pembelajaran terintegrasi literasi-numerasi kepada guru IPA SMP Kota Depok',
          waktuPelaksanaan: 'September 2026',
          penanggungJawab: 'Pengawas Sekolah & Ketua MGMP IPA',
          keterangan: 'Pemaparan best practice dalam pertemuan MGMP Sub Rayon 1',
        },
        {
          id: 'prog-2',
          namaProgram: 'Penyusunan Modul Ajar Berdiferensiasi Berbasis Digital',
          tujuan: 'Mengembangkan instrumen asesmen formatif adaptif digital',
          waktuPelaksanaan: 'Oktober 2026',
          penanggungJawab: 'Guru & Tim Kombel Sekolah',
          keterangan: 'Luaran berupa Bank Soal Literasi Numerasi Kontekstual',
        },
      ],
      postInterviewDate: '2026-08-12',
    },

    combinedFinalScore: 97.5,
    combinedPredicate: 'A',
    combinedPredicateLabel: 'Amat Baik (Unggul)',
  },
];
