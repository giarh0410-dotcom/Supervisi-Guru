import React, { useState } from 'react';
import {
  Printer,
  FileSpreadsheet,
  FileText,
  Edit,
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Calendar,
  User,
  School,
  Building,
  Trash2,
  ListTodo,
  TrendingUp,
  MessageSquare,
  Eye,
  Layers,
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { RPPEvaluation } from '../types';
import { getAppSettings } from '../data/storage';
import {
  INDICATORS,
  SECTION_INFO,
  OBSERVASI_INDICATORS,
  CREATOR_INFO,
} from '../data/instrumentData';
import {
  exportSingleEvaluationToExcel,
  exportSingleEvaluationToWord,
  printPDFReport,
  formatDateIndonesian,
} from '../utils/exportUtils';

interface ReportCardViewProps {
  evaluation: RPPEvaluation;
  onEdit: () => void;
  onBack: () => void;
  onDelete?: () => void;
}

export const ReportCardView: React.FC<ReportCardViewProps> = ({
  evaluation,
  onEdit,
  onBack,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'rekap' | 'rpp' | 'pra' | 'observasi' | 'pasca'>('rekap');
  const settings = getAppSettings();

  const {
    identity,
    scores,
    sectionComments,
    feedback,
    praObservasi,
    observasiScores,
    observasiComments,
    pascaObservasi,
  } = evaluation;

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

  const getRatingText = (val: number) => {
    switch (val) {
      case 4:
        return 'Amat Baik';
      case 3:
        return 'Baik';
      case 2:
        return 'Cukup';
      case 1:
        return 'Kurang';
      default:
        return '-';
    }
  };

  // Comparative score chart data
  const comparisonData = [
    {
      name: 'Telaah RPP',
      score: evaluation.finalScore,
      max: 100,
      fill: '#4F46E5',
    },
    {
      name: 'Observasi Kelas',
      score: evaluation.observasiFinalScore || 85,
      max: 100,
      fill: '#0EA5E9',
    },
    {
      name: 'Skor Gabungan',
      score: evaluation.combinedFinalScore || 88,
      max: 100,
      fill: '#10B981',
    },
  ];

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto">
      {/* TOOLBAR BUTTONS (HIDDEN ON PRINT) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors border border-slate-300 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Rekapan</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportSingleEvaluationToWord(evaluation)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-all shadow-md cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Unduh Word (.docx)</span>
          </button>

          <button
            onClick={() => exportSingleEvaluationToExcel(evaluation)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition-all shadow-md cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Unduh Excel (.xlsx)</span>
          </button>

          <button
            onClick={printPDFReport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-all shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Unduh / Cetak PDF</span>
          </button>

          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-semibold text-xs transition-all cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Supervisi</span>
          </button>

          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-semibold text-xs transition-all cursor-pointer"
              title="Hapus data hasil supervisi ini"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus</span>
            </button>
          )}
        </div>
      </div>

      {/* TABS SELECTOR (HIDDEN ON PRINT) */}
      <div className="flex flex-wrap gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 print:hidden text-xs font-bold">
        <button
          onClick={() => setActiveTab('rekap')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'rekap'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-white'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Rangkuman Eksekutif Terpadu</span>
        </button>

        <button
          onClick={() => setActiveTab('rpp')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'rpp'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Telaah RPP ({evaluation.finalScore}%)</span>
        </button>

        <button
          onClick={() => setActiveTab('pra')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'pra'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>2. Pra-Observasi</span>
        </button>

        <button
          onClick={() => setActiveTab('observasi')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'observasi'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>3. Observasi Kelas 14 Indikator ({evaluation.observasiFinalScore}%)</span>
        </button>

        <button
          onClick={() => setActiveTab('pasca')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'pasca'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-white'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          <span>4. Pasca & RTL ({evaluation.pascaObservasi?.programTindakLanjut?.length || 0})</span>
        </button>
      </div>

      {/* PRINT-OPTIMIZED DOCUMENT CONTAINER */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8 print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none">
        {/* KOP SURAT / OFFICIAL HEADER */}
        <div className="border-b-4 border-double border-slate-800 pb-4 flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <SchoolLogo size={64} />
          </div>
          <div className="flex-1 text-center space-y-1">
            <h2 className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-slate-700">
              PEMERINTAH KOTA DEPOK • DINAS PENDIDIKAN
            </h2>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase">
              LAPORAN SIKLUS SUPERVISI KLINIS TERPADU PEMBELAJARAN MENDALAM (PM)
              <br />
              TERINTEGRASI LITERASI DAN NUMERASI
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              {settings.pengawasJabatan}: <span className="font-bold">{settings.pengawasName}</span> | Supervisor: <span className="font-bold">{settings.supervisorName}</span>
            </p>
          </div>
          <div className="flex-shrink-0 w-16 hidden sm:block"></div>
        </div>

        {/* IDENTITAS TABLE */}
        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-3">
          <h3 className="text-xs font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <User className="w-4 h-4 text-indigo-600" /> IDENTITAS GURU & SATUAN PENDIDIKAN
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-slate-200/60 py-1">
              <span className="text-slate-500 font-medium">Nama Guru:</span>
              <span className="font-bold text-slate-900">{identity.teacherName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 py-1">
              <span className="text-slate-500 font-medium">NIP / NUPTK:</span>
              <span className="font-mono font-bold text-slate-800">{identity.nipNuptk || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 py-1">
              <span className="text-slate-500 font-medium">Mata Pelajaran:</span>
              <span className="font-bold text-slate-900">{identity.subject}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 py-1">
              <span className="text-slate-500 font-medium">Kelas / Fase:</span>
              <span className="font-bold text-slate-900">{identity.gradeFase}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 py-1">
              <span className="text-slate-500 font-medium">Satuan Pendidikan:</span>
              <span className="font-bold text-slate-900">{identity.schoolName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 py-1">
              <span className="text-slate-500 font-medium">Unit Kerja:</span>
              <span className="font-bold text-slate-900">{identity.unitKerja}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 py-1 md:col-span-2">
              <span className="text-slate-500 font-medium">Judul Modul Ajar / RPP:</span>
              <span className="font-bold text-indigo-950">{identity.rppTitle}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 py-1">
              <span className="text-slate-500 font-medium">Tanggal Telaah RPP:</span>
              <span className="font-semibold text-slate-800">{formatDateIndonesian(identity.assessmentDate)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 py-1">
              <span className="text-slate-500 font-medium">Tanggal Observasi Kelas:</span>
              <span className="font-semibold text-slate-800">
                {formatDateIndonesian(identity.observationDate || identity.assessmentDate)}
              </span>
            </div>
          </div>
        </div>

        {/* 3 SCORE CARDS: RPP, OBSERVASI, COMBINED */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Telaah RPP */}
          <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-900 tracking-wider">
              1. Nilai Telaah RPP
            </span>
            <div className="text-3xl font-black text-indigo-700 font-mono">
              {evaluation.finalScore}%
            </div>
            <div className="text-xs font-bold text-indigo-900">
              Predikat {evaluation.predicate} ({evaluation.predicateLabel})
            </div>
            <div className="text-[10px] text-slate-500">Skor: {evaluation.totalScore} / 168 (42 Indikator)</div>
          </div>

          {/* Card 2: Observasi Kelas */}
          <div className="bg-sky-50/70 border border-sky-200 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-sky-900 tracking-wider">
              2. Nilai Observasi Kelas
            </span>
            <div className="text-3xl font-black text-sky-700 font-mono">
              {evaluation.observasiFinalScore}%
            </div>
            <div className="text-xs font-bold text-sky-900">
              Predikat {evaluation.observasiPredicate} ({evaluation.observasiPredicateLabel})
            </div>
            <div className="text-[10px] text-slate-500">Skor: {evaluation.observasiTotalScore} / 56 (14 Indikator)</div>
          </div>

          {/* Card 3: Skor Gabungan Terpadu */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-center space-y-1 shadow-md">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              ★ SKOR AKHIR TERPADU
            </span>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {evaluation.combinedFinalScore}%
            </div>
            <div className="text-xs font-bold text-white">
              Predikat {evaluation.combinedPredicate} ({evaluation.combinedPredicateLabel})
            </div>
            <div className="text-[10px] text-slate-400">Kombinasi RPP + Observasi Kelas</div>
          </div>
        </div>

        {/* TAB 1: RANGKUMAN EKSEKUTIF VIEW */}
        {(activeTab === 'rekap' || true) && (
          <div className={`space-y-8 ${activeTab !== 'rekap' ? 'hidden print:block' : ''}`}>
            {/* HASIL EVALUASI & REFLEKSI SECTION */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" /> HASIL EVALUASI, REFLEKSI & KESIMPULAN
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1">
                  <span className="font-extrabold text-emerald-900 uppercase text-[11px] block">
                    Hal-hal Positif / Kelebihan Utama:
                  </span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                    {pascaObservasi?.kelebihanUtama || feedback?.kelebihan || 'Praktik baik terlaksana dengan lancar.'}
                  </p>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
                  <span className="font-extrabold text-amber-900 uppercase text-[11px] block">
                    Hal yang Perlu Ditingkatkan:
                  </span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                    {pascaObservasi?.halDitingkatkan || feedback?.halDitingkatkan || 'Perlu penguatan scaffolding.'}
                  </p>
                </div>

                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1">
                  <span className="font-extrabold text-blue-900 uppercase text-[11px] block">
                    Refleksi Guru Setelah Mengajar:
                  </span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                    {pascaObservasi?.refleksiGuru || 'Murid antusias mengikuti alur pembelajaran.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="font-extrabold text-slate-900 uppercase text-[11px] block">
                    Catatan Umum Pengawas / Kesimpulan Supervisi:
                  </span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                    {pascaObservasi?.kesimpulanSupervisi || 'Pelaksanaan pembelajaran memenuhi standar PM.'}
                  </p>
                </div>
              </div>
            </div>

            {/* MATRIKS PROGRAM TINDAK LANJUT */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <ListTodo className="w-4 h-4 text-indigo-600" /> MATRIKS PROGRAM & REKOMENDASI TINDAK LANJUT (RTL)
              </h3>

              {(!pascaObservasi?.programTindakLanjut || pascaObservasi.programTindakLanjut.length === 0) ? (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                  Belum ada daftar program tindak lanjut yang dicatat.
                </p>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                        <th className="p-2.5 w-10 text-center">No</th>
                        <th className="p-2.5 w-48">Nama Program / Kegiatan</th>
                        <th className="p-2.5">Tujuan Capaian</th>
                        <th className="p-2.5 w-32">Waktu</th>
                        <th className="p-2.5 w-36">Penanggung Jawab</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {pascaObservasi.programTindakLanjut.map((prog, idx) => (
                        <tr key={prog.id || idx} className="hover:bg-slate-50">
                          <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="p-2.5 font-bold text-indigo-950">{prog.namaProgram}</td>
                          <td className="p-2.5 text-slate-700 leading-relaxed">{prog.tujuan}</td>
                          <td className="p-2.5 text-slate-600">{prog.waktuPelaksanaan}</td>
                          <td className="p-2.5 text-slate-600">{prog.penanggungJawab}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LEMBAR 1 TELAAH RPP (42 INDIKATOR) */}
        {activeTab === 'rpp' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-black uppercase text-indigo-900 tracking-wider border-b border-slate-200 pb-2">
              RINCIAN TELAAH 42 INDIKATOR MODUL AJAR / RPP
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-2 w-10 text-center">No</th>
                    <th className="p-2">Indikator Penilaian Pembelajaran Mendalam</th>
                    <th className="p-2 text-center w-20">Skor (1-4)</th>
                    <th className="p-2 text-center w-28">Kriteria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {INDICATORS.map((ind) => {
                    const scoreVal = scores[ind.id] || 0;
                    return (
                      <tr key={ind.id} className="hover:bg-slate-50">
                        <td className="p-2 text-center font-bold text-slate-500 font-mono">{ind.id}</td>
                        <td className="p-2 text-slate-800 font-medium leading-tight">{ind.text}</td>
                        <td className="p-2 text-center font-extrabold text-indigo-900 font-mono text-sm">
                          {scoreVal}
                        </td>
                        <td className="p-2 text-center font-semibold text-slate-700">
                          {getRatingText(scoreVal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LEMBAR 2 PRA-OBSERVASI */}
        {activeTab === 'pra' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-black uppercase text-indigo-900 tracking-wider border-b border-slate-200 pb-2">
              LEMBAR WAWANCARA & PERENCANAAN PRA-OBSERVASI
            </h3>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm">
              <div>
                <span className="font-bold text-slate-700 block">1. Topik / Materi Pembelajaran:</span>
                <p className="text-slate-900 font-medium mt-0.5">{praObservasi?.topic || '-'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">2. Tujuan Pembelajaran yang Ingin Dicapai:</span>
                <p className="text-slate-900 font-medium mt-0.5">{praObservasi?.learningGoals || '-'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">3. Fokus Pengembangan yang Diobservasi:</span>
                <p className="text-slate-900 font-medium mt-0.5">{praObservasi?.fokusPengembangan || '-'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">4. Strategi & Media Pembelajaran:</span>
                <p className="text-slate-900 font-medium mt-0.5">{praObservasi?.strategiMedia || '-'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">5. Kesiapan Peserta Didik:</span>
                <p className="text-slate-900 font-medium mt-0.5">{praObservasi?.kesiapanSiswa || '-'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">6. Potensi Kendala & Alternatif Solusi:</span>
                <p className="text-slate-900 font-medium mt-0.5">{praObservasi?.potensiKendala || '-'}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-indigo-900 block">Catatan Kesepakatan Pengawas Pembina:</span>
                <p className="text-indigo-950 font-semibold mt-0.5">{praObservasi?.catatanPraObservasi || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LEMBAR 3 OBSERVASI KELAS (14 INDIKATOR) */}
        {activeTab === 'observasi' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-black uppercase text-indigo-900 tracking-wider border-b border-slate-200 pb-2">
              RINCIAN INSTRUMEN OBSERVASI KELAS (14 INDIKATOR)
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-2.5 w-10 text-center">No</th>
                    <th className="p-2.5 w-80">Indikator Pengamatan Kelas</th>
                    <th className="p-2.5 text-center w-20">Skor (1-4)</th>
                    <th className="p-2.5">Komentar Kritis / Catatan Observasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {OBSERVASI_INDICATORS.map((ind) => {
                    const s = observasiScores?.[ind.id] || 0;
                    const c = observasiComments?.[ind.id] || '-';
                    return (
                      <tr key={ind.id} className="hover:bg-slate-50">
                        <td className="p-2.5 text-center font-bold text-slate-500 font-mono">{ind.id}</td>
                        <td className="p-2.5 font-medium text-slate-900 leading-tight">
                          <div className="text-[10px] font-bold text-indigo-700 uppercase mb-0.5">{ind.sectionTitle}</div>
                          {ind.description}
                        </td>
                        <td className="p-2.5 text-center font-black text-indigo-900 text-base font-mono">
                          {s}
                        </td>
                        <td className="p-2.5 text-slate-700 italic leading-relaxed">
                          {c}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: LEMBAR 4 PASCA OBSERVASI & PROGRAM RTL */}
        {activeTab === 'pasca' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xs font-black uppercase text-indigo-900 tracking-wider border-b border-slate-200 pb-2">
              EVALUASI PASCA OBSERVASI & MATRIKS PROGRAM TINDAK LANJUT
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1">
                <span className="font-extrabold text-blue-900 uppercase text-[11px] block">
                  Refleksi Guru:
                </span>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                  {pascaObservasi?.refleksiGuru || '-'}
                </p>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1">
                <span className="font-extrabold text-emerald-900 uppercase text-[11px] block">
                  Kelebihan Utama:
                </span>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                  {pascaObservasi?.kelebihanUtama || '-'}
                </p>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
                <span className="font-extrabold text-amber-900 uppercase text-[11px] block">
                  Hal yang Perlu Ditingkatkan:
                </span>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                  {pascaObservasi?.halDitingkatkan || '-'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="font-extrabold text-slate-900 uppercase text-[11px] block">
                  Kesimpulan Supervisi:
                </span>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                  {pascaObservasi?.kesimpulanSupervisi || '-'}
                </p>
              </div>
            </div>

            {/* List of Programs */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Daftar Program & Rekomendasi Tindak Lanjut:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(pascaObservasi?.programTindakLanjut || []).map((prog, idx) => (
                  <div
                    key={prog.id || idx}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs"
                  >
                    <div className="font-bold text-slate-900 text-sm">
                      {idx + 1}. {prog.namaProgram}
                    </div>
                    <div className="text-slate-700">
                      <span className="font-semibold text-slate-500">Tujuan:</span> {prog.tujuan}
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600 border-t border-slate-200 pt-1.5">
                      <span><strong>Waktu:</strong> {prog.waktuPelaksanaan}</span>
                      <span><strong>PJ:</strong> {prog.penanggungJawab}</span>
                    </div>
                    {prog.keterangan && (
                      <div className="text-[11px] bg-white p-2 rounded-xl border border-slate-200 text-slate-600">
                        <strong>Luaran:</strong> {prog.keterangan}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* OFFICIAL SIGNATURE FOOTER (3 COLUMNS: GURU, KEPALA SEKOLAH, PENGAWAS) */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs sm:text-sm break-inside-avoid border-t border-slate-200">
          <div>
            <p className="text-slate-700 font-medium">Guru Mata Pelajaran,</p>
            <div className="h-20 flex items-end justify-center">
              <span className="border-b border-slate-800 w-36 block"></span>
            </div>
            <p className="font-bold text-slate-900 mt-2">{identity.teacherName}</p>
            <p className="text-slate-600 text-[11px]">NIP/NUPTK. {identity.nipNuptk || '-'}</p>
          </div>

          <div>
            <p className="text-slate-700 font-medium">Mengetahui,</p>
            <p className="text-slate-700 font-medium">{settings.kepalaSekolahJabatan},</p>
            <div className="h-20 flex items-end justify-center">
              <span className="border-b border-slate-800 w-36 block"></span>
            </div>
            <p className="font-bold text-slate-900 mt-2">{settings.kepalaSekolahName}</p>
            <p className="text-slate-600 text-[11px]">NIP. {settings.kepalaSekolahNip}</p>
          </div>

          <div>
            <p className="text-slate-700 font-medium">
              Depok, {formatDateIndonesian(identity.assessmentDate)}
            </p>
            <p className="text-slate-700 font-medium">{settings.pengawasJabatan},</p>
            <div className="h-20 flex items-end justify-center">
              <span className="border-b border-slate-800 w-36 block"></span>
            </div>
            <p className="font-bold text-slate-900 mt-2">
              {settings.pengawasName}
            </p>
            <p className="text-slate-600 text-[11px]">
              NIP. {settings.pengawasNip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
