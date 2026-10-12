import { RPPEvaluation, TeacherProfile, AppSettings } from '../types';
import {
  SAMPLE_EVALUATIONS,
  createDefaultScores,
  createDefaultObservasiScores,
  createDefaultPraObservasi,
  createDefaultPascaObservasi,
  calculateRPPScores,
  calculateObservasiScores,
  calculateCombinedSupervisionScore,
} from './instrumentData';

const STORAGE_KEY = 'supervisi_terpadu_pembelajaran_mendalam_v2';
const LEGACY_STORAGE_KEY = 'telaah_rpp_evaluations_v1';
const TEACHERS_STORAGE_KEY = 'supervisi_teachers_directory_v1';
const SETTINGS_STORAGE_KEY = 'supervisi_app_settings_v1';

export function getAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return {
        schoolName: 'SMP Islam Modern Al Fakhir',
        unitKerja: 'SMP Islam Modern Al Fakhir - Depok',
        pengawasName: 'Tati Maryati, S.Pd., M.Pd.',
        pengawasNip: '197811082006042014',
        pengawasJabatan: 'Pengawas Pembina SMP Kota Depok',
        kepalaSekolahName: 'Dr. H. Ahmad Fauzi, M.Pd.',
        kepalaSekolahNip: '197205121998031004',
        kepalaSekolahJabatan: 'Kepala SMP Islam Modern Al Fakhir',
        supervisorName: 'Deny Rahmat, S.Sos.I.',
        supervisorNuptk: '1856762663120002',
        supervisorJabatan: 'Supervisor SMP Islam Modern Al Fakhir',
      };
    }
    const parsed = JSON.parse(raw);
    return {
      schoolName: parsed.schoolName || 'SMP Islam Modern Al Fakhir',
      unitKerja: parsed.unitKerja || 'SMP Islam Modern Al Fakhir - Depok',
      pengawasName: parsed.pengawasName || parsed.penelaahName || 'Tati Maryati, S.Pd., M.Pd.',
      pengawasNip: parsed.pengawasNip || parsed.penelaahNip || '197811082006042014',
      pengawasJabatan: parsed.pengawasJabatan || parsed.penelaahJabatan || 'Pengawas Pembina SMP Kota Depok',
      kepalaSekolahName: parsed.kepalaSekolahName || 'Dr. H. Ahmad Fauzi, M.Pd.',
      kepalaSekolahNip: parsed.kepalaSekolahNip || '197205121998031004',
      kepalaSekolahJabatan: parsed.kepalaSekolahJabatan || 'Kepala SMP Islam Modern Al Fakhir',
      supervisorName: parsed.supervisorName || 'Deny Rahmat, S.Sos.I.',
      supervisorNuptk: parsed.supervisorNuptk || '1856762663120002',
      supervisorJabatan: parsed.supervisorJabatan || 'Supervisor SMP Islam Modern Al Fakhir',
      logoDataUrl: parsed.logoDataUrl || '',
    };
  } catch (e) {
    return {
      schoolName: 'SMP Islam Modern Al Fakhir',
      unitKerja: 'SMP Islam Modern Al Fakhir - Depok',
      pengawasName: 'Tati Maryati, S.Pd., M.Pd.',
      pengawasNip: '197811082006042014',
      pengawasJabatan: 'Pengawas Pembina SMP Kota Depok',
      kepalaSekolahName: 'Dr. H. Ahmad Fauzi, M.Pd.',
      kepalaSekolahNip: '197205121998031004',
      kepalaSekolahJabatan: 'Kepala SMP Islam Modern Al Fakhir',
      supervisorName: 'Deny Rahmat, S.Sos.I.',
      supervisorNuptk: '1856762663120002',
      supervisorJabatan: 'Supervisor SMP Islam Modern Al Fakhir',
    };
  }
}

export function saveAppSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export const SAMPLE_TEACHERS: TeacherProfile[] = [
  {
    id: 'teacher-1',
    teacherName: 'Dra. Hj. Siti Aminah, M.Pd.',
    nipNuptk: '198203152008012010',
    subject: 'IPA (Ilmu Pengetahuan Alam)',
    gradeFase: 'Kelas VII / Fase D',
    schoolName: 'SMP Negeri 1 Depok',
    unitKerja: 'SMP Negeri 1 Depok - Dinas Pendidikan Kota Depok',
    email: 'siti.aminah@smpn1depok.sch.id',
    phone: '081234567890',
    notes: 'Guru teladan, aktif di MGMP IPA dan pelopor pembelajaran berbasis lingkungan Ciliwung.',
    createdAt: '2026-08-01T08:00:00.000Z',
    updatedAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'teacher-2',
    teacherName: 'Budi Santoso, S.Pd.',
    nipNuptk: '198505202010011005',
    subject: 'Matematika',
    gradeFase: 'Kelas VIII / Fase D',
    schoolName: 'SMP Negeri 2 Depok',
    unitKerja: 'SMP Negeri 2 Depok - Dinas Pendidikan Kota Depok',
    email: 'budi.santoso@smpn2depok.sch.id',
    phone: '081398765432',
    notes: 'Fokus pada peningkatan kemampuan numerasi melalui permainan matematika interaktif.',
    createdAt: '2026-08-02T08:00:00.000Z',
    updatedAt: '2026-08-02T08:00:00.000Z',
  },
  {
    id: 'teacher-3',
    teacherName: 'Sri Wahyuni, M.Pd.',
    nipNuptk: '197912102005012003',
    subject: 'Bahasa Indonesia',
    gradeFase: 'Kelas IX / Fase D',
    schoolName: 'SMP Islam Al-Hidayah Depok',
    unitKerja: 'SMP Islam Al-Hidayah Depok',
    email: 'sri.wahyuni@alhidayah.sch.id',
    phone: '081876543210',
    notes: 'Aktif mengembangkan literasi membaca kritis dan mading digital sekolah.',
    createdAt: '2026-08-03T08:00:00.000Z',
    updatedAt: '2026-08-03T08:00:00.000Z',
  },
];

export function getAllTeachers(): TeacherProfile[] {
  try {
    const raw = localStorage.getItem(TEACHERS_STORAGE_KEY);
    if (!raw) {
      const evaluations = getAllEvaluations();
      const extractedMap = new Map<string, TeacherProfile>();
      
      SAMPLE_TEACHERS.forEach(t => extractedMap.set(t.teacherName.toLowerCase().trim(), t));

      evaluations.forEach(ev => {
        const key = ev.identity.teacherName.toLowerCase().trim();
        if (!extractedMap.has(key)) {
          extractedMap.set(key, {
            id: `teacher-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            teacherName: ev.identity.teacherName,
            nipNuptk: ev.identity.nipNuptk || '',
            subject: ev.identity.subject,
            gradeFase: ev.identity.gradeFase,
            schoolName: ev.identity.schoolName,
            unitKerja: ev.identity.unitKerja,
            createdAt: ev.createdAt,
            updatedAt: ev.updatedAt,
          });
        }
      });

      const list = Array.from(extractedMap.values());
      localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(list));
      return list;
    }
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : SAMPLE_TEACHERS;
  } catch (err) {
    console.error('Error reading teachers:', err);
    return SAMPLE_TEACHERS;
  }
}

export function saveTeacher(teacher: TeacherProfile): TeacherProfile[] {
  const current = getAllTeachers();
  const existingIdx = current.findIndex(t => t.id === teacher.id);
  let updated: TeacherProfile[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = {
      ...teacher,
      updatedAt: new Date().toISOString(),
    };
  } else {
    updated = [
      {
        ...teacher,
        id: teacher.id || `teacher-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...current,
    ];
  }
  localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteTeacher(id: string): TeacherProfile[] {
  const current = getAllTeachers();
  const filtered = current.filter(t => t.id !== id);
  localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

export function getTeacherById(id: string): TeacherProfile | undefined {
  const all = getAllTeachers();
  return all.find(t => t.id === id);
}


// Normalize any item to ensure all 4-phase properties exist
export function normalizeEvaluation(item: any): RPPEvaluation {
  const scores = item.scores || createDefaultScores(3);
  const rppCalc = calculateRPPScores(scores);

  const observasiScores = item.observasiScores || createDefaultObservasiScores(3);
  const obsCalc = calculateObservasiScores(observasiScores);

  const combined = calculateCombinedSupervisionScore(
    item.finalScore !== undefined ? item.finalScore : rppCalc.finalScore,
    item.observasiFinalScore !== undefined ? item.observasiFinalScore : obsCalc.observasiFinalScore
  );

  return {
    id: item.id || `eval-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    identity: {
      teacherName: item.identity?.teacherName || 'Guru Mata Pelajaran',
      nipNuptk: item.identity?.nipNuptk || '',
      subject: item.identity?.subject || 'IPA',
      gradeFase: item.identity?.gradeFase || 'Kelas VII / Fase D',
      schoolName: item.identity?.schoolName || 'SMP Negeri 1 Depok',
      unitKerja: item.identity?.unitKerja || 'SMP Negeri 1 Depok - Dinas Pendidikan Kota Depok',
      penelaahName: item.identity?.penelaahName || 'Tati Maryati, S.Pd., M.Pd.',
      penelaahNip: item.identity?.penelaahNip || '197811082006042014',
      penelaahJabatan: item.identity?.penelaahJabatan || 'Pengawas SMP Dinas Pendidikan Kota Depok',
      assessmentDate: item.identity?.assessmentDate || new Date().toISOString().split('T')[0],
      rppTitle: item.identity?.rppTitle || 'Modul Ajar Pembelajaran Mendalam',
      observationDate: item.identity?.observationDate || '',
      observationClassTime: item.identity?.observationClassTime || '',
    },

    // Tahap 1: Telaah RPP
    scores,
    sectionComments: item.sectionComments || {},
    feedback: item.feedback || {
      kelebihan: '',
      halDitingkatkan: '',
      rekomendasi: '',
      tindakLanjut: '',
    },
    scoreA: item.scoreA !== undefined ? item.scoreA : rppCalc.scoreA,
    scoreB: item.scoreB !== undefined ? item.scoreB : rppCalc.scoreB,
    scoreC: item.scoreC !== undefined ? item.scoreC : rppCalc.scoreC,
    scoreD: item.scoreD !== undefined ? item.scoreD : rppCalc.scoreD,
    scoreE: item.scoreE !== undefined ? item.scoreE : rppCalc.scoreE,
    totalScore: item.totalScore !== undefined ? item.totalScore : rppCalc.totalScore,
    finalScore: item.finalScore !== undefined ? item.finalScore : rppCalc.finalScore,
    predicate: item.predicate || rppCalc.predicate,
    predicateLabel: item.predicateLabel || rppCalc.predicateLabel,

    // Tahap 2: Pra Observasi
    praObservasi: item.praObservasi || createDefaultPraObservasi(),

    // Tahap 3: Observasi Kelas
    observasiScores,
    observasiComments: item.observasiComments || {},
    observasiScoreA: item.observasiScoreA !== undefined ? item.observasiScoreA : obsCalc.observasiScoreA,
    observasiScoreB: item.observasiScoreB !== undefined ? item.observasiScoreB : obsCalc.observasiScoreB,
    observasiScoreC: item.observasiScoreC !== undefined ? item.observasiScoreC : obsCalc.observasiScoreC,
    observasiTotalScore: item.observasiTotalScore !== undefined ? item.observasiTotalScore : obsCalc.observasiTotalScore,
    observasiFinalScore: item.observasiFinalScore !== undefined ? item.observasiFinalScore : obsCalc.observasiFinalScore,
    observasiPredicate: item.observasiPredicate || obsCalc.observasiPredicate,
    observasiPredicateLabel: item.observasiPredicateLabel || obsCalc.observasiPredicateLabel,

    // Tahap 4: Pasca Observasi & Tindak Lanjut
    pascaObservasi: item.pascaObservasi || createDefaultPascaObservasi(),

    // Hasil Akhir Gabungan
    combinedFinalScore: item.combinedFinalScore !== undefined ? item.combinedFinalScore : combined.combinedFinalScore,
    combinedPredicate: item.combinedPredicate || combined.combinedPredicate,
    combinedPredicateLabel: item.combinedPredicateLabel || combined.combinedPredicateLabel,
  };
}

export function getAllEvaluations(): RPPEvaluation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy storage first
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const parsedLegacy = JSON.parse(legacyRaw);
          if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
            const normalized = parsedLegacy.map(normalizeEvaluation);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
            return normalized;
          }
        } catch (e) {
          // ignore
        }
      }
      // Initialize with sample evaluation
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_EVALUATIONS));
      return SAMPLE_EVALUATIONS;
    }
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_EVALUATIONS));
      return SAMPLE_EVALUATIONS;
    }
    return data.map(normalizeEvaluation);
  } catch (err) {
    console.error('Error reading evaluations from localStorage:', err);
    return SAMPLE_EVALUATIONS;
  }
}

export function saveEvaluation(evaluation: RPPEvaluation): RPPEvaluation[] {
  const current = getAllEvaluations();
  const normalized = normalizeEvaluation(evaluation);
  const existingIndex = current.findIndex((item) => item.id === normalized.id);

  let updatedList: RPPEvaluation[];
  if (existingIndex >= 0) {
    updatedList = [...current];
    updatedList[existingIndex] = {
      ...normalized,
      updatedAt: new Date().toISOString(),
    };
  } else {
    updatedList = [normalized, ...current];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  return updatedList;
}

export function deleteEvaluation(id: string): RPPEvaluation[] {
  const current = getAllEvaluations();
  const filtered = current.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

export function clearAllEvaluations(): RPPEvaluation[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
}

export function resetToSampleData(): RPPEvaluation[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_EVALUATIONS));
  return SAMPLE_EVALUATIONS;
}

export function getEvaluationById(id: string): RPPEvaluation | undefined {
  const all = getAllEvaluations();
  return all.find((item) => item.id === id);
}
