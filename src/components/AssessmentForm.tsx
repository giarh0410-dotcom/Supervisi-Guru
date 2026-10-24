import React, { useState, useMemo, useRef } from 'react';
import {
  RPPEvaluation,
  TeacherIdentity,
  ScoreValue,
  SectionComments,
  QualitativeFeedback,
  PraObservasiData,
  PascaObservasiData,
} from '../types';
import { getAllTeachers } from '../data/storage';
import { safeApiCall } from '../utils/apiUtils';
import {
  INDICATORS,
  SECTION_INFO,
  calculateRPPScores,
  createDefaultScores,
  OBSERVASI_INDICATORS,
  OBSERVASI_SECTION_INFO,
  calculateObservasiScores,
  createDefaultObservasiScores,
  calculateCombinedSupervisionScore,
  createDefaultPraObservasi,
  createDefaultPascaObservasi,
  CREATOR_INFO,
} from '../data/instrumentData';
import { Stage2PraObservasi } from './form/Stage2PraObservasi';
import { Stage3ObservasiKelas } from './form/Stage3ObservasiKelas';
import { Stage4PascaObservasi } from './form/Stage4PascaObservasi';
import mammoth from 'mammoth';
import {
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  FileText,
  User,
  Users,
  School,
  Calendar,
  BookOpen,
  Award,
  Loader2,
  AlertCircle,
  Upload,
  Link as LinkIcon,
  FileUp,
  FileCode,
  Edit3,
  Sliders,
  Check,
  Eye,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Wand2,
  MessageSquare,
  ListOrdered,
  TrendingUp,
} from 'lucide-react';

const SAMPLE_RPP_DRAFTS = [
  {
    label: 'Contoh 1: Modul Ajar IPA - Ekosistem & Perubahan Lingkungan (Fase D)',
    subject: 'IPA (Ilmu Pengetahuan Alam)',
    grade: 'Kelas VII / Fase D',
    school: 'SMP Negeri 1 Depok',
    teacher: 'Dra. Hj. Siti Aminah, M.Pd.',
    title: 'Modul Ajar Ekosistem, Rantai Makanan & Mitigasi Sampah Sungai Ciliwung Depok',
    text: `MODUL AJAR PEMBELAJARAN MENDALAM TERINTEGRASI LITERASI DAN NUMERASI
Satuan Pendidikan: SMP Negeri 1 Depok
Penyusun: Dra. Hj. Siti Aminah, M.Pd.
NIP: 198203152008012010
Mata Pelajaran: IPA (Ilmu Pengetahuan Alam)
Kelas / Fase: Kelas VII / Fase D
Alokasi Waktu: 3 JP (3 x 40 Menit)
Topik: Ekosistem, Jaring-Jaring Makanan, dan Mitigasi Sampah Sungai Ciliwung Depok

A. CAPAIAN PEMBELAJARAN & TUJUAN PEMBELAJARAN
1. Peserta didik mampu menganalisis interaksi antar komponen ekosistem serta pengaruh aktivitas manusia terhadap keseimbangan lingkungan hidup di sekitarnya.
2. Melalui telaah artikel ilmiah dan grafik data volume timbulan sampah Kota Depok (Literasi & Numerasi), murid mampu merumuskan gagasan solutif pengelolaan limbah ramah lingkungan.

B. PENGALAMAN BELAJAR (LANGKAH-LANGKAH PEMBELAJARAN MENDALAM)
1. Tahap Memahami:
   - Guru memulai dengan pertanyaan pemantik dan apersepsi video kondisi Sungai Ciliwung di Depok.
   - Murid membaca artikel ilmiah mini dan menelaah infografik jaring-jaring makanan (Aktivitas Literasi).
   - Menghubungkan konsep sains dengan kehidupan nyata peserta didik.
2. Tahap Mengaplikasi:
   - Diskusi kelompok memecahkan studi kasus pencemaran air menggunakan tabel uji kualitas air (Aktivitas Numerasi).
   - Peserta didik berkolaborasi menyusun bagan alur daur ulang dan poster digital kampanye peduli lingkungan.
3. Tahap Merefleksi:
   - Murid mengisi lembar refleksi diri: "Apa yang saya pelajari hari ini dan bagaimana aksi nyata saya di rumah?"
   - Mendorong metakognisi dan komitmen etika menjaga kelestarian alam.

C. ASESMEN PEMBELAJARAN
1. Asesmen Awal: Kuis diagnostik pemahaman rantai makanan.
2. Asesmen Formatif: Lembar Kerja Peserta Didik (LKPD) berbasis data dan observasi diskusi kolaboratif.
3. Asesmen Sumatif: Penilaian produk poster infografik & rubrik presentasi ilmiah.`,
  },
  {
    label: 'Contoh 2: Modul Ajar Matematika - Statistika & Analisis Data (Fase D)',
    subject: 'Matematika',
    grade: 'Kelas VIII / Fase D',
    school: 'SMP Negeri 2 Depok',
    teacher: 'Budi Santoso, S.Pd., M.Si.',
    title: 'Modul Ajar Analisis Data, Mean-Median-Modus & Literasi Finansial Remaja',
    text: `MODUL AJAR PEMBELAJARAN MENDALAM TERINTEGRASI LITERASI DAN NUMERASI
Satuan Pendidikan: SMP Negeri 2 Depok
Penyusun: Budi Santoso, S.Pd., M.Si.
NIP: 198506142010011015
Mata Pelajaran: Matematika
Kelas / Fase: Kelas VIII / Fase D
Alokasi Waktu: 2 x 40 Menit
Topik: Pengolahan dan Penyajian Data Statistik Berbasis Kasus Pengeluaran Uang Saku

A. TUJUAN PEMBELAJARAN
1. Peserta didik dapat mengumpulkan, menyajikan, dan menganalisis data dalam bentuk tabel frekuensi dan diagram batang/lingkaran.
2. Peserta didik dapat menentukan nilai ukuran pemusatan data (mean, median, modus) serta menginterpretasikannya untuk pengambilan keputusan finansial sederhana.

B. LANGKAH PEMBELAJARAN BERBASIS PM
1. Memahami: Mengamati grafik inflasi dan membaca teks narasi penganggaran keluarga (Literasi Membaca).
2. Mengaplikasi: Simulasi menghitung rata-rata pengeluaran kelompok dan memvisualisasikan dalam diagram (Numerasi Terapan).
3. Merefleksi: Menilai efektivitas alur penyelesaian soal dan merefleksikan kebiasaan menabung.

C. ASESMEN
- Asesmen formatif unjuk kerja LKPD kelompok
- Rubrik penalaran kritis dan ketepatan perhitungan data.`,
  },
  {
    label: 'Contoh 3: Modul Ajar Bahasa Indonesia - Teks LHO (Fase D)',
    subject: 'Bahasa Indonesia',
    grade: 'Kelas VII / Fase D',
    school: 'SMP Negeri 4 Depok',
    teacher: 'Nurul Hidayati, S.Pd.',
    title: 'Modul Ajar Menulis Teks Laporan Hasil Observasi (LHO) Flora Taman Alun-Alun Depok',
    text: `MODUL AJAR KURIKULUM NASIONAL & PEMBELAJARAN MENDALAM
Satuan Pendidikan: SMP Negeri 4 Depok
Penyusun: Nurul Hidayati, S.Pd.
Mata Pelajaran: Bahasa Indonesia
Kelas / Fase: Kelas VII / Fase D
Topik: Menelaah Struktur & Menulis Teks Laporan Hasil Observasi Lingkungan Sekitar

A. TUJUAN PEMBELAJARAN
1. Menganalisis struktur teks LHO (pernyataan umum, deskripsi bagian, simpulan/manfaat) dan kaidah kebahasaan.
2. Menyajikan laporan hasil observasi langsung terhadap keanekaragaman tanaman lokal Kota Depok yang diperkaya data kuantitatif pengukuran tinggi & usia pohon.

B. LANGKAH-LANGKAH (MEMAHAMI - MENGAPLIKASI - MEREFLEKSI)
- Memahami: Membaca kritis contoh teks LHO dan mengidentifikasi fakta vs opini.
- Mengaplikasi: Observasi lapangan ke taman sekolah, mencatat data faktual, dan menyusun draf teks LHO.
- Merefleksi: Menilai karya teman sebaya (peer assessment) dan menyimpulkan nilai konservasi lingkungan.`,
  },
];

interface AssessmentFormProps {
  initialData?: RPPEvaluation;
  onSave: (evaluation: RPPEvaluation) => void;
  onCancel: () => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  // Active Stage Navigation: 1 | 2 | 3 | 4
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4>(1);

  // Generator Mode for Stage 1: 'generate' (AI Generator) vs 'manual' (Manual Scoring)
  const [generatorMode, setGeneratorMode] = useState<'generate' | 'manual'>(
    initialData ? 'manual' : 'generate'
  );

  // Upload/Input Source Mode for Generator: 'word' | 'pdf' | 'link' | 'text'
  const [inputSource, setInputSource] = useState<'word' | 'pdf' | 'link' | 'text'>('word');

  // File & Input states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedDocText, setExtractedDocText] = useState<string>('');
  const [docBase64, setDocBase64] = useState<string | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  const [isFileReading, setIsFileReading] = useState(false);
  const [fileReadError, setFileReadError] = useState<string | null>(null);

  // Identity state
  const [identity, setIdentity] = useState<TeacherIdentity>(
    initialData?.identity || {
      teacherName: '',
      nipNuptk: '',
      subject: '',
      gradeFase: '',
      schoolName: '',
      unitKerja: '',
      penelaahName: CREATOR_INFO.name,
      penelaahNip: CREATOR_INFO.nip,
      penelaahJabatan: CREATOR_INFO.title,
      assessmentDate: new Date().toISOString().split('T')[0],
      rppTitle: '',
      observationDate: '',
      observationClassTime: '',
    }
  );

  // Stage 1: Scores state (1-42)
  const [scores, setScores] = useState<Record<number, ScoreValue>>(
    initialData?.scores || createDefaultScores(3)
  );

  // Stage 1: Section comments state
  const [sectionComments, setSectionComments] = useState<SectionComments>(
    initialData?.sectionComments || {
      sectionA: '',
      sectionB: '',
      sectionC: '',
      sectionD: '',
      sectionE: '',
    }
  );

  // Stage 1: Qualitative feedback state
  const [feedback, setFeedback] = useState<QualitativeFeedback>(
    initialData?.feedback || {
      kelebihan: '',
      halDitingkatkan: '',
      rekomendasi: '',
      tindakLanjut: '',
    }
  );

  // Stage 2: Pra Observasi state
  const [praObservasi, setPraObservasi] = useState<PraObservasiData>(
    initialData?.praObservasi || createDefaultPraObservasi()
  );

  // Stage 3: Observasi Kelas state (1-14)
  const [observasiScores, setObservasiScores] = useState<Record<number, ScoreValue>>(
    initialData?.observasiScores || createDefaultObservasiScores(3)
  );
  const [observasiComments, setObservasiComments] = useState<Record<number, string>>(
    initialData?.observasiComments || {}
  );

  // Stage 4: Pasca Observasi state
  const [pascaObservasi, setPascaObservasi] = useState<PascaObservasiData>(
    initialData?.pascaObservasi || createDefaultPascaObservasi()
  );

  // AI Generation States for Stage 1
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStep, setAiStep] = useState<string>('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  // Calculate scores on the fly
  const rppCalculated = useMemo(() => calculateRPPScores(scores), [scores]);
  const obsCalculated = useMemo(
    () => calculateObservasiScores(observasiScores),
    [observasiScores]
  );
  const combinedCalculated = useMemo(
    () =>
      calculateCombinedSupervisionScore(
        rppCalculated.finalScore,
        obsCalculated.observasiFinalScore
      ),
    [rppCalculated.finalScore, obsCalculated.observasiFinalScore]
  );

  // Handle score change for Stage 1 single indicator
  const handleScoreChange = (indicatorId: number, val: ScoreValue) => {
    setScores((prev) => ({
      ...prev,
      [indicatorId]: val,
    }));
  };

  const setAllRPPScores = (val: ScoreValue) => {
    setScores(createDefaultScores(val));
  };

  // Handle Word file upload
  const handleWordFileUpload = async (file: File) => {
    setUploadedFile(file);
    setFileReadError(null);
    setIsFileReading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      let extracted = '';
      try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        extracted = result.value || '';
      } catch (clientMammothErr) {
        console.warn('Client mammoth extract warning:', clientMammothErr);
      }

      setExtractedDocText(extracted);

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const b64 = dataUrl.split(',')[1];
        setDocBase64(b64);
        setIsFileReading(false);
      };
      reader.onerror = () => {
        setIsFileReading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Word parse error:', err);
      setFileReadError('Gagal membaca file Word: ' + (err.message || 'Format tidak didukung'));
      setIsFileReading(false);
    }
  };

  // Handle PDF file upload
  const handlePdfFileUpload = async (file: File) => {
    setUploadedFile(file);
    setFileReadError(null);
    setIsFileReading(true);

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        setPdfBase64(base64);
        setIsFileReading(false);
      };
      reader.onerror = () => {
        setFileReadError('Gagal membaca file PDF.');
        setIsFileReading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('PDF read error:', err);
      setFileReadError('Gagal memproses file PDF.');
      setIsFileReading(false);
    }
  };

  // Handle Link Fetch
  const handleFetchLinkContent = async () => {
    if (!linkUrl || !linkUrl.trim().startsWith('http')) {
      setFileReadError('Mohon masukkan URL tautan yang valid (dimulai dengan https:// atau http://).');
      return;
    }

    setIsFileReading(true);
    setFileReadError(null);

    try {
      const json = await safeApiCall('/api/fetch-url-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: linkUrl.trim() }),
      });

      setExtractedDocText(json.text);
    } catch (err: any) {
      console.error('Fetch Link Error:', err);
      setFileReadError(
        err.message ||
          'Gagal mengambil isi tautan. Pastikan dokumen bersifat publik atau gunakan metode Salin Teks / Upload File.'
      );
    } finally {
      setIsFileReading(false);
    }
  };

  // Apply Sample Draft to form
  const handleApplySampleDraft = (sample: (typeof SAMPLE_RPP_DRAFTS)[0]) => {
    setInputSource('text');
    setRawText(sample.text);
    setIdentity((prev) => ({
      ...prev,
      teacherName: sample.teacher,
      subject: sample.subject,
      gradeFase: sample.grade,
      schoolName: sample.school,
      unitKerja: `${sample.school} - Dinas Pendidikan Kota Depok`,
      rppTitle: sample.title,
    }));
    setPraObservasi((prev) => ({
      ...prev,
      topic: sample.title,
      learningGoals: 'Peserta didik mampu memahami konsep ' + sample.subject + ' dan memecahkan permasalahan nyata.',
    }));
    setAiSuccessMessage(`Contoh draf "${sample.label}" telah dimuat! Klik "⚡ Mulai Generate Telaah RPP Otomatis" di bawah.`);
  };

  // Run AI Generator Analysis for Stage 1
  const handleRunAIGenerator = async () => {
    setAiError(null);
    setAiSuccessMessage(null);

    let textToSend = '';
    let pdfToSend: string | null = null;
    let docB64ToSend: string | null = null;
    let fileTypeSent = inputSource;

    if (inputSource === 'word') {
      if (!docBase64 && (!extractedDocText || extractedDocText.trim().length < 10)) {
        setAiError('Mohon pilih file Word (.docx / .doc) RPP terlebih dahulu.');
        return;
      }
      textToSend = extractedDocText;
      docB64ToSend = docBase64;
    } else if (inputSource === 'pdf') {
      if (!pdfBase64) {
        setAiError('Mohon pilih file PDF (.pdf) RPP terlebih dahulu.');
        return;
      }
      pdfToSend = pdfBase64;
    } else if (inputSource === 'link') {
      if (!linkUrl.trim()) {
        setAiError('Mohon masukkan URL tautan dokumen RPP.');
        return;
      }
      textToSend = extractedDocText || `Tautan RPP: ${linkUrl}`;
    } else if (inputSource === 'text') {
      if (!rawText || rawText.trim().length < 15) {
        setAiError('Mohon tempelkan draf teks RPP/Modul Ajar atau pilih salah satu contoh draf di atas.');
        return;
      }
      textToSend = rawText;
    }

    setIsAiLoading(true);
    setAiStep('1/3: Membaca & memproses dokumen RPP...');

    try {
      setTimeout(() => setAiStep('2/3: Mengekstrak identitas & menilai 42 indikator instrumen PM...'), 1800);
      setTimeout(() => setAiStep('3/3: Menyusun telaah literasi, numerasi & umpan balik pengawas...'), 3800);

      const json = await safeApiCall('/api/analyze-rpp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherName: identity.teacherName,
          subject: identity.subject,
          grade: identity.gradeFase,
          school: identity.schoolName,
          rppTitle: identity.rppTitle,
          rppText: textToSend,
          pdfBase64: pdfToSend,
          docBase64: docB64ToSend,
          fileType: fileTypeSent,
          fileName: uploadedFile?.name,
          linkUrl: linkUrl,
        }),
      });

      const { data } = json;

      // 1. Update Identity
      if (data.identity) {
        setIdentity((prev) => ({
          ...prev,
          teacherName: data.identity.teacherName || prev.teacherName || 'Guru Mata Pelajaran',
          nipNuptk: data.identity.nipNuptk || prev.nipNuptk || '198203152008012010',
          subject: data.identity.subject || prev.subject || 'IPA',
          gradeFase: data.identity.gradeFase || prev.gradeFase || 'Kelas VII / Fase D',
          schoolName: data.identity.schoolName || prev.schoolName || 'SMP Negeri Kota Depok',
          unitKerja:
            data.identity.unitKerja ||
            prev.unitKerja ||
            `${data.identity.schoolName || prev.schoolName || 'SMP'} - Dinas Pendidikan Kota Depok`,
          rppTitle: data.identity.rppTitle || prev.rppTitle || 'Modul Ajar Pembelajaran Mendalam',
        }));

        setPraObservasi((prev) => ({
          ...prev,
          topic: data.identity.rppTitle || prev.topic,
        }));
      }

      // 2. Update scores for all 42 indicators
      if (data.scores) {
        const newScores: Record<number, ScoreValue> = { ...scores };
        for (let i = 1; i <= 42; i++) {
          const val = Number(data.scores[i] || data.scores[i.toString()]);
          if (val >= 1 && val <= 4) {
            newScores[i] = val as ScoreValue;
          }
        }
        setScores(newScores);
      }

      // 3. Update Section Comments
      if (data.sectionComments) {
        setSectionComments({
          sectionA: data.sectionComments.sectionA || '',
          sectionB: data.sectionComments.sectionB || '',
          sectionC: data.sectionComments.sectionC || '',
          sectionD: data.sectionComments.sectionD || '',
          sectionE: data.sectionComments.sectionE || '',
        });
      }

      // 4. Update Qualitative Feedback
      setFeedback({
        kelebihan: data.kelebihan || '',
        halDitingkatkan: data.halDitingkatkan || '',
        rekomendasi: data.rekomendasi || '',
        tindakLanjut: data.tindakLanjut || '',
      });

      setAiSuccessMessage(
        '✨ Berhasil meng-generate telaah RPP secara otomatis! Seluruh identitas, 42 indikator, catatan per bagian, dan rekomendasi pengawas telah terisi lengkap. Anda dapat meninjau atau melanjutkan ke Tahap 2: Pra-Observasi.'
      );

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err: any) {
      console.error('AI Generator Error:', err);
      setAiError(err.message || 'Terjadi kesalahan saat memproses telaah dokumen RPP.');
    } finally {
      setIsAiLoading(false);
      setAiStep('');
    }
  };

  // Submit complete 4-stage evaluation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity.teacherName.trim()) {
      alert('Mohon lengkapi Nama Guru pada Identitas.');
      setActiveStage(1);
      return;
    }

    if (!identity.rppTitle.trim()) {
      alert('Mohon lengkapi Judul Modul Ajar / RPP pada Identitas.');
      setActiveStage(1);
      return;
    }

    const evaluationToSave: RPPEvaluation = {
      id: initialData?.id || `eval-${Date.now()}`,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      identity,

      // Tahap 1: Telaah RPP
      scores,
      sectionComments,
      feedback,
      ...rppCalculated,

      // Tahap 2: Pra Observasi
      praObservasi,

      // Tahap 3: Observasi Kelas
      observasiScores,
      observasiComments,
      ...obsCalculated,

      // Tahap 4: Pasca Observasi & Tindak Lanjut
      pascaObservasi,

      // Combined Final Result
      ...combinedCalculated,
    };

    onSave(evaluationToSave);
  };

  const getPredicateBadgeClass = (pred: 'A' | 'B' | 'C' | 'D') => {
    switch (pred) {
      case 'A':
        return 'bg-emerald-600 text-white font-extrabold';
      case 'B':
        return 'bg-blue-600 text-white font-extrabold';
      case 'C':
        return 'bg-amber-600 text-white font-extrabold';
      case 'D':
        return 'bg-rose-600 text-white font-extrabold';
    }
  };

  // Helper to render Stage 1 indicators
  const renderStage1RPPIndicators = () => {
    const sectionList = [
      { key: 'A' as const, ...SECTION_INFO.A, subtitle: 'Tujuan, CP, Profil Lulusan & Literasi-Numerasi' },
      { key: 'B' as const, ...SECTION_INFO.B, subtitle: 'Lingkungan Belajar, Kemitraan & Pedagogis' },
      { key: 'C' as const, ...SECTION_INFO.C, subtitle: 'Memahami, Mengaplikasi, Merefleksi & Prinsip PM' },
      { key: 'D' as const, ...SECTION_INFO.D, subtitle: 'Strategi Teks, Data, Media & Pertanyaan Kritis' },
      { key: 'E' as const, ...SECTION_INFO.E, subtitle: 'Asesmen Awal, Formatif, Sumatif & Rubrik' },
    ];

    return (
      <div className="space-y-6">
        {sectionList.map((sec) => {
          const sectionIndicators = INDICATORS.filter((ind) =>
            sec.key === 'C' ? ind.section.startsWith('C') : ind.section === sec.key
          );
          const currentComment =
            sec.key === 'A'
              ? sectionComments.sectionA
              : sec.key === 'B'
              ? sectionComments.sectionB
              : sec.key === 'C'
              ? sectionComments.sectionC
              : sec.key === 'D'
              ? sectionComments.sectionD
              : sectionComments.sectionE;

          const handleCommentChange = (val: string) => {
            setSectionComments((prev) => ({
              ...prev,
              [sec.key === 'A'
                ? 'sectionA'
                : sec.key === 'B'
                ? 'sectionB'
                : sec.key === 'C'
                ? 'sectionC'
                : sec.key === 'D'
                ? 'sectionD'
                : 'sectionE']: val,
            }));
          };

          const subScore =
            sec.key === 'A'
              ? rppCalculated.scoreA
              : sec.key === 'B'
              ? rppCalculated.scoreB
              : sec.key === 'C'
              ? rppCalculated.scoreC
              : sec.key === 'D'
              ? rppCalculated.scoreD
              : rppCalculated.scoreE;

          return (
            <div
              key={sec.key}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold tracking-wide text-white">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">{sec.subtitle}</p>
                </div>
                <div className="bg-slate-800 px-4 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {subScore} / {sec.max}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ({((subScore / sec.max) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 divide-y divide-slate-100 space-y-4">
                {sectionIndicators.map((ind) => {
                  const currentVal = scores[ind.id] || 3;
                  return (
                    <div key={ind.id} className="pt-4 first:pt-0 space-y-2.5">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-800 font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {ind.id}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {ind.text}
                          </div>
                          {ind.sectionTitle && (
                            <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                              {ind.sectionTitle}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Score Options (1-4) */}
                      <div className="pl-0 sm:pl-10 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((scoreVal) => {
                          const isSelected = currentVal === scoreVal;
                          let btnStyle = '';
                          if (isSelected) {
                            if (scoreVal === 4) btnStyle = 'bg-emerald-600 text-white ring-2 ring-emerald-400 font-extrabold shadow-sm';
                            else if (scoreVal === 3) btnStyle = 'bg-blue-600 text-white ring-2 ring-blue-400 font-extrabold shadow-sm';
                            else if (scoreVal === 2) btnStyle = 'bg-amber-500 text-white ring-2 ring-amber-400 font-extrabold shadow-sm';
                            else btnStyle = 'bg-rose-600 text-white ring-2 ring-rose-400 font-extrabold shadow-sm';
                          } else {
                            btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200';
                          }

                          return (
                            <button
                              key={scoreVal}
                              type="button"
                              onClick={() => handleScoreChange(ind.id, scoreVal as ScoreValue)}
                              className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${btnStyle}`}
                            >
                              <span className="font-mono font-black">{scoreVal}</span>
                              <span className="text-[10px]">
                                {scoreVal === 4 ? 'Amat Baik' : scoreVal === 3 ? 'Baik' : scoreVal === 2 ? 'Cukup' : 'Kurang'}
                              </span>
                              {isSelected && <Check className="w-3 h-3" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Section Comment */}
                <div className="pt-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan Kritis / Rekomendasi Pengawas untuk {sec.title}:
                  </label>
                  <textarea
                    rows={2}
                    placeholder={`Tuliskan ulasan spesifik pengawas untuk aspek ${sec.title}...`}
                    value={currentComment || ''}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Qualitative Feedback for RPP */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Catatan Kualitatif Telaah Dokumen RPP
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-emerald-950 mb-1">
                Kelebihan Dokumen RPP:
              </label>
              <textarea
                rows={3}
                placeholder="Hal-hal unggul dalam perencanaan..."
                value={feedback.kelebihan}
                onChange={(e) => setFeedback({ ...feedback, kelebihan: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-amber-950 mb-1">
                Hal yang Perlu Ditingkatkan pada RPP:
              </label>
              <textarea
                rows={3}
                placeholder="Aspek RPP yang perlu disempurnakan..."
                value={feedback.halDitingkatkan}
                onChange={(e) => setFeedback({ ...feedback, halDitingkatkan: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-32">
      {/* 4-STAGE INTERACTIVE STEPPER BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm sticky top-16 z-30 backdrop-blur-md bg-white/95">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
            {/* Stage 1 */}
            <button
              type="button"
              onClick={() => setActiveStage(1)}
              className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex items-center gap-2.5 ${
                activeStage === 1
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs flex-shrink-0 ${
                  activeStage === 1
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                1
              </div>
              <div className="truncate">
                <div className="font-extrabold text-xs text-slate-900 truncate">1. Telaah RPP</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {rppCalculated.finalScore}% ({rppCalculated.predicate})
                </div>
              </div>
            </button>

            {/* Stage 2 */}
            <button
              type="button"
              onClick={() => setActiveStage(2)}
              className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex items-center gap-2.5 ${
                activeStage === 2
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs flex-shrink-0 ${
                  activeStage === 2
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                2
              </div>
              <div className="truncate">
                <div className="font-extrabold text-xs text-slate-900 truncate">2. Pra Observasi</div>
                <div className="text-[10px] text-slate-500 truncate">Wawancara & Fokus</div>
              </div>
            </button>

            {/* Stage 3 */}
            <button
              type="button"
              onClick={() => setActiveStage(3)}
              className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex items-center gap-2.5 ${
                activeStage === 3
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs flex-shrink-0 ${
                  activeStage === 3
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                3
              </div>
              <div className="truncate">
                <div className="font-extrabold text-xs text-slate-900 truncate">3. Observasi Kelas</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {obsCalculated.observasiFinalScore}% ({obsCalculated.observasiPredicate})
                </div>
              </div>
            </button>

            {/* Stage 4 */}
            <button
              type="button"
              onClick={() => setActiveStage(4)}
              className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex items-center gap-2.5 ${
                activeStage === 4
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs flex-shrink-0 ${
                  activeStage === 4
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                4
              </div>
              <div className="truncate">
                <div className="font-extrabold text-xs text-slate-900 truncate">4. Pasca Observasi</div>
                <div className="text-[10px] text-slate-500 truncate">
                  Tindak Lanjut ({pascaObservasi.programTindakLanjut?.length || 0})
                </div>
              </div>
            </button>
          </div>

          {/* Integrated Live Result Pill */}
          <div className="bg-slate-900 text-white p-2.5 px-4 rounded-2xl flex items-center gap-3.5 shadow-md border border-slate-700 self-stretch lg:self-auto justify-between sm:justify-end">
            <div className="text-right">
              <div className="text-[9px] text-slate-400 uppercase font-semibold">
                Skor Akhir Terpadu
              </div>
              <div className="text-lg sm:text-xl font-black text-amber-400 font-mono leading-none mt-0.5">
                {combinedCalculated.combinedFinalScore}{' '}
                <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
              </div>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getPredicateBadgeClass(
                  combinedCalculated.combinedPredicate
                )}`}
              >
                {combinedCalculated.combinedPredicate} - {combinedCalculated.combinedPredicateLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* STAGE 1: TELAAH RPP */}
      {activeStage === 1 && (
        <div className="space-y-8 animate-fadeIn">
          {/* MODE SELECTOR BANNER */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tahap 1: Telaah Perencanaan Pembelajaran
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  Instrumen Telaah RPP / Modul Ajar (42 Indikator)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih <strong>Mode 1: Generate Otomatis (AI)</strong> untuk telaah cepat berbasis file Word/PDF/Link/Teks, atau <strong>Mode 2: Telaah Manual</strong>.
                </p>
              </div>
            </div>

            {/* DUAL BUTTON TOGGLE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setGeneratorMode('generate')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  generatorMode === 'generate'
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl ${
                    generatorMode === 'generate'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">
                      1. Mode Generate Otomatis (AI)
                    </span>
                    {generatorMode === 'generate' && (
                      <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                        Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Unggah file Word (.docx), PDF (.pdf), Tautan URL, atau Salin Teks. AI otomatis mengekstrak identitas & menilai 42 indikator.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setGeneratorMode('manual')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  generatorMode === 'manual'
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl ${
                    generatorMode === 'manual'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Edit3 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">
                      2. Mode Telaah Manual (Mandiri)
                    </span>
                    {generatorMode === 'manual' && (
                      <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                        Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Isi identitas dokumen & tentukan skor 1 s.d. 4 pada 42 indikator secara mandiri dengan tombol aksi cepat.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* AI GENERATOR PANEL IF IN GENERATE MODE */}
          {generatorMode === 'generate' && (
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-400/20 text-amber-300 rounded-2xl border border-amber-400/30">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                      Unggah Dokumen RPP / Modul Ajar untuk Di-Generate
                    </h3>
                    <p className="text-xs text-indigo-200">
                      Pilih format dokumen masukan untuk dianalisis secara kritis:
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Mode Telaah Kritis (42 Indikator)
                  </span>
                </div>
              </div>

              {/* QUICK PRESET SAMPLES */}
              <div className="bg-slate-800/70 p-3 rounded-2xl border border-indigo-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5" /> Atau Gunakan Contoh Draf RPP untuk Uji Coba Cepat:
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SAMPLE_RPP_DRAFTS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplySampleDraft(sample)}
                      className="text-left p-2.5 bg-slate-700/60 hover:bg-indigo-600/60 border border-slate-600/60 hover:border-indigo-400 rounded-xl transition-all text-[11px] text-slate-200 hover:text-white cursor-pointer"
                    >
                      <div className="font-bold text-amber-200 truncate">{sample.subject}</div>
                      <div className="text-[10px] text-slate-300 truncate">{sample.school}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* INPUT SOURCE SELECTOR TABS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-indigo-500/20 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setInputSource('word');
                    setFileReadError(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    inputSource === 'word'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-indigo-200 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>File Word (.docx)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputSource('pdf');
                    setFileReadError(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    inputSource === 'pdf'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-indigo-200 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  <span>File PDF (.pdf)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputSource('link');
                    setFileReadError(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    inputSource === 'link'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-indigo-200 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Tautan / Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputSource('text');
                    setFileReadError(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    inputSource === 'text'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-indigo-200 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Salin Teks Langsung</span>
                </button>
              </div>

              {/* TAB 1: WORD UPLOAD */}
              {inputSource === 'word' && (
                <div className="space-y-3">
                  <label
                    htmlFor="word-upload-input"
                    className="border-2 border-dashed border-indigo-400/40 hover:border-indigo-400 bg-slate-800/60 hover:bg-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">
                        Klik untuk memilih File Dokumen Word (.docx / .doc)
                      </div>
                      <div className="text-xs text-indigo-300 mt-1">
                        Mendukung berkas Microsoft Word RPP atau Modul Ajar
                      </div>
                    </div>
                    <input
                      id="word-upload-input"
                      type="file"
                      accept=".docx,.doc"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleWordFileUpload(file);
                      }}
                    />
                  </label>

                  {uploadedFile && inputSource === 'word' && (
                    <div className="p-3.5 bg-blue-900/40 border border-blue-500/40 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          Berkas aktif: <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <span className="text-[11px] text-blue-300 font-semibold">Siap di-generate</span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PDF UPLOAD */}
              {inputSource === 'pdf' && (
                <div className="space-y-3">
                  <label
                    htmlFor="pdf-upload-input"
                    className="border-2 border-dashed border-rose-400/40 hover:border-rose-400 bg-slate-800/60 hover:bg-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center">
                      <FileCode className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">
                        Klik untuk memilih File PDF Modul Ajar (.pdf)
                      </div>
                      <div className="text-xs text-indigo-300 mt-1">
                        AI Gemini akan membaca dan menganalisis seluruh halaman PDF secara multimodal
                      </div>
                    </div>
                    <input
                      id="pdf-upload-input"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePdfFileUpload(file);
                      }}
                    />
                  </label>

                  {uploadedFile && inputSource === 'pdf' && (
                    <div className="p-3.5 bg-rose-900/40 border border-rose-500/40 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          Berkas aktif: <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-300 font-semibold">Siap di-generate</span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: LINK INPUT */}
              {inputSource === 'link' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Masukkan link dokumen RPP (contoh: Google Drive, Google Docs, PMM, atau URL publik)..."
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="flex-1 p-3 bg-slate-800 border border-indigo-500/40 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleFetchLinkContent}
                      disabled={isFileReading || !linkUrl}
                      className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {isFileReading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      <span>Ambil Konten</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-indigo-300">
                    *Catatan: Jika link dari Google Docs/Drive, pastikan diset ke <strong>"Siapa saja yang memiliki link dapat melihat"</strong>.
                  </p>
                </div>
              )}

              {/* TAB 4: RAW TEXT */}
              {inputSource === 'text' && (
                <div className="space-y-2">
                  <textarea
                    rows={6}
                    placeholder="Tempelkan teks dokumen RPP/Modul Ajar di sini..."
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full p-3.5 bg-slate-800 border border-indigo-500/40 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <div className="text-right text-[11px] text-indigo-300">
                    {rawText.length} karakter
                  </div>
                </div>
              )}

              {/* ERROR OR SUCCESS NOTICES */}
              {fileReadError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />
                  <span>{fileReadError}</span>
                </div>
              )}

              {aiError && (
                <div className="p-3.5 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-xs text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              {aiSuccessMessage && (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-xs sm:text-sm text-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>{aiSuccessMessage}</span>
                </div>
              )}

              {/* GENERATE ACTION BUTTON */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleRunAIGenerator}
                  disabled={isAiLoading || isFileReading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                      <span>{aiStep || 'AI Sedang Memproses Telaah RPP...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-slate-950" />
                      <span>⚡ Mulai Generate Telaah RPP Otomatis</span>
                    </>
                  )}
                </button>

                <span className="text-xs text-indigo-300 text-center sm:text-right">
                  Hasil telaah dapat langsung disimpan atau disunting di bawah.
                </span>
              </div>
            </div>
          )}

          {/* SECTION 1: IDENTITAS GURU & DOKUMEN PERENCANAAN */}
          <div ref={resultRef} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                1. Identitas Guru & Satuan Pendidikan
              </h3>
              <span className="text-xs text-slate-500">(Wajib diisi)</span>
            </div>

            {/* Quick Teacher Selector from Directory */}
            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-xs font-bold text-blue-900">
                  Ambil Data dari Direktori Data Guru:
                </span>
              </div>
              <select
                onChange={(e) => {
                  const teacherId = e.target.value;
                  if (!teacherId) return;
                  const teachers = getAllTeachers();
                  const found = teachers.find((t) => t.id === teacherId);
                  if (found) {
                    setIdentity({
                      ...identity,
                      teacherName: found.teacherName,
                      nipNuptk: found.nipNuptk,
                      subject: found.subject,
                      gradeFase: found.gradeFase,
                      schoolName: found.schoolName,
                      unitKerja: found.unitKerja,
                    });
                  }
                }}
                className="w-full sm:w-80 px-3 py-2 bg-white border border-blue-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">-- Pilih Guru dari Data Guru --</option>
                {getAllTeachers().map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.teacherName} ({t.subject} - {t.schoolName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Guru *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dra. Hj. Siti Aminah, M.Pd."
                  value={identity.teacherName}
                  onChange={(e) => setIdentity({ ...identity, teacherName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">NIP / NUPTK</label>
                <input
                  type="text"
                  placeholder="Contoh: 198203152008012010"
                  value={identity.nipNuptk || ''}
                  onChange={(e) => setIdentity({ ...identity, nipNuptk: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mata Pelajaran *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: IPA / Matematika / B. Indonesia"
                  value={identity.subject}
                  onChange={(e) => setIdentity({ ...identity, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Kelas / Fase *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kelas VII / Fase D"
                  value={identity.gradeFase}
                  onChange={(e) => setIdentity({ ...identity, gradeFase: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Satuan Pendidikan (Sekolah) *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMP Negeri 1 Depok"
                  value={identity.schoolName}
                  onChange={(e) => setIdentity({ ...identity, schoolName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Unit Kerja *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMPN 1 Depok - Dinas Pendidikan"
                  value={identity.unitKerja}
                  onChange={(e) => setIdentity({ ...identity, unitKerja: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">
                  Judul Modul Ajar / RPP *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul Ajar Ekosistem & Perubahan Lingkungan Kota Depok"
                  value={identity.rppTitle}
                  onChange={(e) => setIdentity({ ...identity, rppTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Tanggal Telaah RPP</label>
                <input
                  type="date"
                  value={identity.assessmentDate}
                  onChange={(e) => setIdentity({ ...identity, assessmentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* QUICK TOOLBAR FOR STAGE 1 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" /> Aksi Cepat Skor RPP:
              </span>
              <button
                type="button"
                onClick={() => setAllRPPScores(4)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg font-bold transition-all cursor-pointer"
              >
                Set Semua 4 (Amat Baik)
              </button>
              <button
                type="button"
                onClick={() => setAllRPPScores(3)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-lg font-bold transition-all cursor-pointer"
              >
                Set Semua 3 (Baik)
              </button>
            </div>
          </div>

          {/* RENDER 42 INDICATORS */}
          {renderStage1RPPIndicators()}
        </div>
      )}

      {/* STAGE 2: PRA OBSERVASI */}
      {activeStage === 2 && (
        <div className="animate-fadeIn">
          <Stage2PraObservasi
            identity={identity}
            setIdentity={setIdentity}
            praObservasi={praObservasi}
            setPraObservasi={setPraObservasi}
          />
        </div>
      )}

      {/* STAGE 3: OBSERVASI KELAS (14 INDIKATOR) */}
      {activeStage === 3 && (
        <div className="animate-fadeIn">
          <Stage3ObservasiKelas
            scores={observasiScores}
            setScores={setObservasiScores}
            comments={observasiComments}
            setComments={setObservasiComments}
          />
        </div>
      )}

      {/* STAGE 4: PASCA OBSERVASI & TINDAK LANJUT */}
      {activeStage === 4 && (
        <div className="animate-fadeIn">
          <Stage4PascaObservasi
            identity={identity}
            praObservasi={praObservasi}
            observasiScores={observasiScores}
            observasiComments={observasiComments}
            rppFinalScore={rppCalculated.finalScore}
            observasiFinalScore={obsCalculated.observasiFinalScore}
            pascaObservasi={pascaObservasi}
            setPascaObservasi={setPascaObservasi}
          />
        </div>
      )}

      {/* FIXED BOTTOM FLOATING ACTIONS BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Back / Next Stage Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeStage > 1 && (
              <button
                type="button"
                onClick={() => setActiveStage((prev) => (prev - 1) as any)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Tahap Sebelumnya</span>
              </button>
            )}

            {activeStage < 4 && (
              <button
                type="button"
                onClick={() => setActiveStage((prev) => (prev + 1) as any)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-indigo-200"
              >
                <span>Lanjut ke Tahap {activeStage + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cancel & Save Full Evaluation */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Instrumen Terpadu (4 Tahap)</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
