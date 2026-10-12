export interface TeacherIdentity {
  teacherName: string;
  nipNuptk?: string;
  subject: string;
  gradeFase: string;
  schoolName: string; // Satuan Pendidikan
  unitKerja: string;
  penelaahName: string;
  penelaahNip?: string;
  penelaahJabatan: string;
  assessmentDate: string;
  rppTitle: string;
  observationDate?: string;
  observationClassTime?: string;
}

export type ScoreValue = 1 | 2 | 3 | 4;

export interface SectionComments {
  sectionA?: string;
  sectionB?: string;
  sectionC?: string;
  sectionD?: string;
  sectionE?: string;
}

export interface QualitativeFeedback {
  kelebihan: string;
  halDitingkatkan: string;
  rekomendasi: string;
  tindakLanjut: string;
}

// Tahap 2: Pra Observasi
export interface PraObservasiData {
  topic: string; // Materi Pokok / Topik
  learningGoals: string; // Tujuan Pembelajaran yang ingin dicapai
  fokusPengembangan: string; // Fokus Observasi (Diferensiasi, Literasi/Numerasi, dsb.)
  strategiMedia: string; // Model/Strategi & Media yang dipersiapkan
  kesiapanSiswa: string; // Kesiapan peserta didik
  potensiKendala: string; // Potensi kendala & alternatif solusi
  catatanPraObservasi: string; // Catatan Kesepakatan Wawancara Pra-Observasi
  interviewDate?: string;
}

// Tahap 3: Observasi Kelas (14 Indikator)
export interface ObservasiIndicatorDefinition {
  id: number;
  section: 'A' | 'B' | 'C';
  sectionTitle: string;
  title: string;
  description: string;
}

// Tahap 4: Program Tindak Lanjut Item
export interface ProgramTindakLanjutItem {
  id: string;
  namaProgram: string; // Nama Kegiatan / Program Pembinaan
  tujuan: string; // Tujuan / Target Capaian
  waktuPelaksanaan: string; // Waktu / Periode Pelaksanaan
  penanggungJawab: string; // Penanggung Jawab / Mitra (Pengawas, KS, MGMP, dll.)
  keterangan: string; // Keterangan / Luaran yang Diharapkan
}

// Tahap 4: Pasca Observasi, Evaluasi & Tindak Lanjut
export interface PascaObservasiData {
  refleksiGuru: string; // Refleksi Guru setelah pelaksanaan pembelajaran
  kelebihanUtama: string; // Hal-hal Positif / Kelebihan Utama
  halDitingkatkan: string; // Hal yang Perlu Ditingkatkan
  kesimpulanSupervisi: string; // Catatan Umum Pengawas / Kesimpulan Supervisi
  programTindakLanjut: ProgramTindakLanjutItem[];
  postInterviewDate?: string;
}

// Full Integrated Supervision Record
export interface RPPEvaluation {
  id: string;
  createdAt: string;
  updatedAt: string;
  identity: TeacherIdentity;

  // --- TAHAP 1: TELAAH RPP (42 Indikator) ---
  scores: Record<number, ScoreValue>;
  sectionComments: SectionComments;
  feedback: QualitativeFeedback;
  scoreA: number; // max 20
  scoreB: number; // max 16
  scoreC: number; // max 76
  scoreD: number; // max 32
  scoreE: number; // max 24
  totalScore: number; // max 168
  finalScore: number; // 0 to 100
  predicate: 'A' | 'B' | 'C' | 'D';
  predicateLabel: string;

  // --- TAHAP 2: PRA OBSERVASI ---
  praObservasi: PraObservasiData;

  // --- TAHAP 3: OBSERVASI KELAS (14 Indikator) ---
  observasiScores: Record<number, ScoreValue>; // 1 to 14
  observasiComments: Record<number, string>; // Catatan per indikator 1 to 14
  observasiScoreA: number; // Indikator 1-5 (max 20)
  observasiScoreB: number; // Indikator 6-11 (max 24)
  observasiScoreC: number; // Indikator 12-14 (max 12)
  observasiTotalScore: number; // max 56
  observasiFinalScore: number; // 0 to 100
  observasiPredicate: 'A' | 'B' | 'C' | 'D';
  observasiPredicateLabel: string;

  // --- TAHAP 4: PASCA OBSERVASI & TINDAK LANJUT ---
  pascaObservasi: PascaObservasiData;

  // --- HASIL AKHIR GABUNGAN TERINTEGRASI ---
  combinedFinalScore: number; // 30% RPP + 70% Observasi Kelas
  combinedPredicate: 'A' | 'B' | 'C' | 'D';
  combinedPredicateLabel: string;
}

export interface IndicatorDefinition {
  id: number;
  text: string;
  section: 'A' | 'B' | 'C1' | 'C2' | 'C3' | 'C4' | 'D' | 'E';
  sectionTitle: string;
}

export interface FilterOptions {
  searchQuery: string;
  schoolFilter: string;
  subjectFilter: string;
  predicateFilter: string;
  gradeFilter: string;
}

export interface TeacherProfile {
  id: string;
  teacherName: string;
  nipNuptk: string;
  subject: string;
  gradeFase: string;
  schoolName: string;
  unitKerja: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  schoolName: string;
  unitKerja: string;
  pengawasName: string;
  pengawasNip: string;
  pengawasJabatan: string;
  kepalaSekolahName: string;
  kepalaSekolahNip: string;
  kepalaSekolahJabatan: string;
  supervisorName: string;
  supervisorNuptk: string;
  supervisorJabatan: string;
  logoDataUrl?: string;
}


