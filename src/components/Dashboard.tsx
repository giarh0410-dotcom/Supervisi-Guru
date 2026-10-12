import React, { useState, useMemo } from 'react';
import {
  Users,
  Award,
  TrendingUp,
  FileSpreadsheet,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  School,
  Sparkles,
  Layers,
  MessageSquare,
  ListTodo,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { RPPEvaluation, FilterOptions } from '../types';
import { exportRecapToExcel, exportRecapToWord, exportSingleEvaluationToWord } from '../utils/exportUtils';
import { AIRecapRecommendationModal } from './AIRecapRecommendationModal';

interface DashboardProps {
  evaluations: RPPEvaluation[];
  onSelectEvaluation: (id: string) => void;
  onEditEvaluation: (id: string) => void;
  onDeleteEvaluation: (id: string) => void;
  onNewAssessment: () => void;
  onResetSampleData: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  evaluations,
  onSelectEvaluation,
  onEditEvaluation,
  onDeleteEvaluation,
  onNewAssessment,
  onResetSampleData,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    schoolFilter: 'ALL',
    subjectFilter: 'ALL',
    predicateFilter: 'ALL',
    gradeFilter: 'ALL',
  });

  // Extract unique filter options
  const schoolOptions = useMemo(() => {
    const set = new Set(evaluations.map((e) => e.identity.schoolName));
    return Array.from(set).sort();
  }, [evaluations]);

  const subjectOptions = useMemo(() => {
    const set = new Set(evaluations.map((e) => e.identity.subject));
    return Array.from(set).sort();
  }, [evaluations]);

  // View Mode for Table: 'COMBINED' | 'RPP' | 'OBSERVASI' | 'PASCA'
  const [activeTableTab, setActiveTableTab] = useState<'COMBINED' | 'RPP' | 'OBSERVASI' | 'PASCA'>('COMBINED');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Filtered evaluations
  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((item) => {
      const matchesSearch =
        item.identity.teacherName
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        item.identity.schoolName
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        item.identity.subject
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        item.identity.rppTitle
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        (item.identity.nipNuptk &&
          item.identity.nipNuptk.includes(filters.searchQuery));

      const matchesSchool =
        filters.schoolFilter === 'ALL' ||
        item.identity.schoolName === filters.schoolFilter;

      const matchesSubject =
        filters.subjectFilter === 'ALL' ||
        item.identity.subject === filters.subjectFilter;

      const matchesPredicate =
        filters.predicateFilter === 'ALL' ||
        item.combinedPredicate === filters.predicateFilter ||
        item.predicate === filters.predicateFilter;

      return matchesSearch && matchesSchool && matchesSubject && matchesPredicate;
    });
  }, [evaluations, filters]);

  // Analytics Stats
  const stats = useMemo(() => {
    const totalCount = evaluations.length;
    if (totalCount === 0) {
      return {
        avgCombinedScore: 0,
        avgRppScore: 0,
        avgObsScore: 0,
        predA: 0,
        predB: 0,
        predC: 0,
        predD: 0,
      };
    }

    const avgCombinedScore = Number(
      (
        evaluations.reduce((acc, curr) => acc + (curr.combinedFinalScore || curr.finalScore), 0) /
        totalCount
      ).toFixed(1)
    );

    const avgRppScore = Number(
      (evaluations.reduce((acc, curr) => acc + curr.finalScore, 0) / totalCount).toFixed(1)
    );

    const avgObsScore = Number(
      (
        evaluations.reduce((acc, curr) => acc + (curr.observasiFinalScore || 85), 0) / totalCount
      ).toFixed(1)
    );

    const predA = evaluations.filter((e) => (e.combinedPredicate || e.predicate) === 'A').length;
    const predB = evaluations.filter((e) => (e.combinedPredicate || e.predicate) === 'B').length;
    const predC = evaluations.filter((e) => (e.combinedPredicate || e.predicate) === 'C').length;
    const predD = evaluations.filter((e) => (e.combinedPredicate || e.predicate) === 'D').length;

    return {
      avgCombinedScore,
      avgRppScore,
      avgObsScore,
      predA,
      predB,
      predC,
      predD,
    };
  }, [evaluations]);

  // Predicate Chart Data
  const predicateChartData = [
    { name: 'Predikat A (Amat Baik)', count: stats.predA, color: '#10B981' },
    { name: 'Predikat B (Baik)', count: stats.predB, color: '#3B82F6' },
    { name: 'Predikat C (Cukup)', count: stats.predC, color: '#F59E0B' },
    { name: 'Predikat D (Kurang)', count: stats.predD, color: '#EF4444' },
  ];

  const getPredicateBadgeClass = (pred: 'A' | 'B' | 'C' | 'D') => {
    switch (pred) {
      case 'A':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'B':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
      case 'C':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'D':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Action Header & Quick Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Siklus Penuh: Telaah RPP • Pra-Observasi • Observasi Kelas • Pasca-Observasi & RTL</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Dashboard Hasil Supervisi Klinis Terpadu (PM)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Supervisor SMP Islam Modern Al Fakhir: <span className="font-bold text-slate-800">Deny Rahmat, S.Sos.I.</span> <span className="font-mono text-slate-600">(NUPTK. 1856762663120002)</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => exportRecapToWord(evaluations)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            title="Unduh seluruh data rekapan semua guru dalam format Dokumen Word (.docx)"
          >
            <FileText className="w-4 h-4" />
            <span>Rekapan Supervisi (Word .docx)</span>
          </button>

          <button
            onClick={() => exportRecapToExcel(evaluations)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            title="Unduh seluruh data rekapan dalam format MS Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Rekapan Supervisi (Excel .xlsx)</span>
          </button>

          <button
            onClick={onNewAssessment}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Supervisi Baru (4 Tahap)</span>
          </button>

          {evaluations.length > 0 && (
            <button
              onClick={onResetSampleData}
              className="flex items-center gap-2 px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-medium text-xs transition-all border border-rose-200 cursor-pointer"
              title="Hapus seluruh data supervisi yang tersimpan"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assessed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Guru Disupervisi
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                {evaluations.length} <span className="text-sm font-normal text-slate-500">Guru</span>
              </p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <School className="w-3.5 h-3.5 text-slate-400" /> SMP Binaan Kota Depok
          </p>
        </div>

        {/* Avg RPP Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Rata-Rata Telaah RPP
              </p>
              <p className="text-3xl font-extrabold text-indigo-600 mt-1">
                {stats.avgRppScore}%
              </p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> 42 Indikator Perencanaan
          </p>
        </div>

        {/* Avg Observasi Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Rata-Rata Observasi Kelas
              </p>
              <p className="text-3xl font-extrabold text-sky-600 mt-1">
                {stats.avgObsScore}%
              </p>
            </div>
            <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
              <Eye className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" /> 14 Indikator Kelas PM
          </p>
        </div>

        {/* Combined Supervised Score */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Rata-Rata Skor Terpadu
              </p>
              <p className="text-3xl font-extrabold text-white mt-1">
                {stats.avgCombinedScore}%
              </p>
            </div>
            <div className="p-3 bg-amber-400/20 rounded-xl text-amber-400">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-300">
            <span>A: {stats.predA}</span>
            <span>•</span>
            <span>B: {stats.predB}</span>
            <span>•</span>
            <span>C: {stats.predC}</span>
            <span>•</span>
            <span>D: {stats.predD}</span>
          </div>
        </div>
      </div>

      {/* Table Filters & Toolbar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Tabel Rekapan Siklus Supervisi Guru ({filteredEvaluations.length} Guru)
          </h3>
          <p className="text-xs text-slate-500">
            Gunakan filter di bawah untuk memfilter berdasarkan nama guru, mapel, atau predikat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Text */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari guru, NIP, mapel, materi..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* School Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={filters.schoolFilter}
              onChange={(e) => setFilters({ ...filters, schoolFilter: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="ALL">Semua Sekolah (Satuan Pendidikan)</option>
              {schoolOptions.map((sch) => (
                <option key={sch} value={sch}>
                  {sch}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={filters.subjectFilter}
              onChange={(e) => setFilters({ ...filters, subjectFilter: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Mata Pelajaran</option>
              {subjectOptions.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Predicate Filter */}
          <div>
            <select
              value={filters.predicateFilter}
              onChange={(e) => setFilters({ ...filters, predicateFilter: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Predikat (A, B, C, D)</option>
              <option value="A">Predikat A - Amat Baik (91-100)</option>
              <option value="B">Predikat B - Baik (81-90)</option>
              <option value="C">Predikat C - Cukup (71-80)</option>
              <option value="D">Predikat D - Kurang (≤70)</option>
            </select>
          </div>
        </div>

        {/* Table View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTableTab('COMBINED')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTableTab === 'COMBINED'
                  ? 'bg-slate-900 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ★ Rapor Supervisi Terpadu
            </button>
            <button
              onClick={() => setActiveTableTab('RPP')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTableTab === 'RPP'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📄 1. Telaah RPP (42 Indikator)
            </button>
            <button
              onClick={() => setActiveTableTab('OBSERVASI')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTableTab === 'OBSERVASI'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👁️ 2. Observasi Kelas (14 Indikator)
            </button>
            <button
              onClick={() => setActiveTableTab('PASCA')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTableTab === 'PASCA'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📋 3. Pasca & RTL
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer"
              title="Analisis Rekomendasi & Umpan Balik Supervisi AI Gemini"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Analisis Rekomendasi AI</span>
            </button>

            <button
              onClick={() => exportRecapToWord(filteredEvaluations)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Unduh Rekapan Semua Guru dalam Format Word (.docx)"
            >
              <FileText className="w-4 h-4" />
              <span>Rekapan Word (.docx)</span>
            </button>

            <button
              onClick={() => exportRecapToExcel(filteredEvaluations)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Ekspor Seluruh Rekapan Nilai, Umpan Balik & Rekomendasi ke Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Rekapan Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-3">Nama Guru & NIP</th>
                <th className="py-3 px-3">Sekolah & Mapel</th>

                {activeTableTab === 'COMBINED' && (
                  <>
                    <th className="py-3 px-3 text-center">Nilai RPP</th>
                    <th className="py-3 px-3 text-center">Nilai Observasi</th>
                    <th className="py-3 px-3 text-center font-black text-indigo-900">SKOR TERPADU</th>
                    <th className="py-3 px-3 text-center">Predikat</th>
                    <th className="py-3 px-3 min-w-[200px]">Kelebihan & Refleksi</th>
                  </>
                )}

                {activeTableTab === 'RPP' && (
                  <>
                    <th className="py-3 px-2 text-center" title="Keselarasan (20)">A</th>
                    <th className="py-3 px-2 text-center" title="Kerangka (16)">B</th>
                    <th className="py-3 px-2 text-center" title="Pengalaman Belajar (76)">C</th>
                    <th className="py-3 px-2 text-center" title="LitNum (32)">D</th>
                    <th className="py-3 px-2 text-center" title="Asesmen (24)">E</th>
                    <th className="py-3 px-3 text-center font-bold">Total (168)</th>
                    <th className="py-3 px-3 text-center font-bold">Nilai RPP</th>
                    <th className="py-3 px-3 text-center">Predikat</th>
                  </>
                )}

                {activeTableTab === 'OBSERVASI' && (
                  <>
                    <th className="py-3 px-3 text-center">Pendahuluan (4 Indikator)</th>
                    <th className="py-3 px-3 text-center">Inti (6 Indikator)</th>
                    <th className="py-3 px-3 text-center">Penutup (4 Indikator)</th>
                    <th className="py-3 px-3 text-center font-bold">Skor (56)</th>
                    <th className="py-3 px-3 text-center font-black text-sky-700">Nilai Obs (%)</th>
                    <th className="py-3 px-3 text-center">Predikat Obs</th>
                  </>
                )}

                {activeTableTab === 'PASCA' && (
                  <>
                    <th className="py-3 px-3 min-w-[180px]">Refleksi Guru</th>
                    <th className="py-3 px-3 min-w-[180px]">Kelebihan Utama</th>
                    <th className="py-3 px-3 min-w-[180px]">Hal Ditingkatkan</th>
                    <th className="py-3 px-3 text-center w-24">Jumlah RTL</th>
                  </>
                )}

                <th className="py-3 px-3 text-center">Tanggal</th>
                <th className="py-3 px-3 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredEvaluations.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-500 space-y-3">
                    <p className="text-sm font-semibold text-slate-700">
                      Belum Ada Data Hasil Supervisi
                    </p>
                    <button
                      onClick={onNewAssessment}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-md transition-all mt-2 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Buat Form Supervisi Baru (4 Tahap)</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredEvaluations.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-indigo-50/40 transition-colors align-top">
                    <td className="py-3 px-3 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.identity.teacherName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        NIP: {item.identity.nipNuptk || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{item.identity.schoolName}</div>
                      <div className="text-[10px] text-slate-500">
                        {item.identity.subject} • {item.identity.gradeFase}
                      </div>
                    </td>

                    {/* COMBINED TAB */}
                    {activeTableTab === 'COMBINED' && (
                      <>
                        <td className="py-3 px-3 text-center font-mono font-bold text-indigo-700">
                          {item.finalScore}%
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-sky-700">
                          {item.observasiFinalScore || 85}%
                        </td>
                        <td className="py-3 px-3 text-center font-black text-amber-600 font-mono text-sm">
                          {item.combinedFinalScore || 88}%
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border ${getPredicateBadgeClass(
                              item.combinedPredicate || item.predicate
                            )}`}
                          >
                            {item.combinedPredicate || item.predicate}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-600 line-clamp-2 max-w-xs">
                          {item.pascaObservasi?.kelebihanUtama || item.feedback?.kelebihan || '-'}
                        </td>
                      </>
                    )}

                    {/* RPP TAB */}
                    {activeTableTab === 'RPP' && (
                      <>
                        <td className="py-3 px-2 text-center font-mono text-slate-600">{item.scoreA}</td>
                        <td className="py-3 px-2 text-center font-mono text-slate-600">{item.scoreB}</td>
                        <td className="py-3 px-2 text-center font-mono text-slate-600">{item.scoreC}</td>
                        <td className="py-3 px-2 text-center font-mono text-slate-600">{item.scoreD}</td>
                        <td className="py-3 px-2 text-center font-mono text-slate-600">{item.scoreE}</td>
                        <td className="py-3 px-3 text-center font-bold text-slate-900 font-mono">
                          {item.totalScore}
                        </td>
                        <td className="py-3 px-3 text-center font-extrabold text-indigo-700 font-mono">
                          {item.finalScore}%
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] border ${getPredicateBadgeClass(
                              item.predicate
                            )}`}
                          >
                            {item.predicate}
                          </span>
                        </td>
                      </>
                    )}

                    {/* OBSERVASI TAB */}
                    {activeTableTab === 'OBSERVASI' && (
                      <>
                        <td className="py-3 px-3 text-center font-mono text-slate-700">
                          {((item.observasiSectionA || 14) / 16 * 100).toFixed(0)}%
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-700">
                          {((item.observasiSectionB || 20) / 24 * 100).toFixed(0)}%
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-700">
                          {((item.observasiSectionC || 14) / 16 * 100).toFixed(0)}%
                        </td>
                        <td className="py-3 px-3 text-center font-bold font-mono text-slate-900">
                          {item.observasiTotalScore || 48}/56
                        </td>
                        <td className="py-3 px-3 text-center font-extrabold text-sky-700 font-mono">
                          {item.observasiFinalScore || 85}%
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] border ${getPredicateBadgeClass(
                              item.observasiPredicate || 'B'
                            )}`}
                          >
                            {item.observasiPredicate || 'B'}
                          </span>
                        </td>
                      </>
                    )}

                    {/* PASCA TAB */}
                    {activeTableTab === 'PASCA' && (
                      <>
                        <td className="py-3 px-3 text-[11px] text-slate-700 line-clamp-2 max-w-xs">
                          {item.pascaObservasi?.refleksiGuru || '-'}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-emerald-800 line-clamp-2 max-w-xs">
                          {item.pascaObservasi?.kelebihanUtama || item.feedback?.kelebihan || '-'}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-amber-800 line-clamp-2 max-w-xs">
                          {item.pascaObservasi?.halDitingkatkan || item.feedback?.halDitingkatkan || '-'}
                        </td>
                        <td className="py-3 px-3 text-center font-bold font-mono text-indigo-700">
                          {item.pascaObservasi?.programTindakLanjut?.length || 0} Kegiatan
                        </td>
                      </>
                    )}

                    <td className="py-3 px-3 text-center text-[10px] text-slate-500 whitespace-nowrap">
                      {item.identity.assessmentDate}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectEvaluation(item.id)}
                          className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Lihat & Cetak Laporan Supervisi Terpadu"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => exportSingleEvaluationToWord(item)}
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Unduh Laporan Word (.docx)"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditEvaluation(item.id)}
                          className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Edit Supervisi"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteEvaluation(item.id)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Supervisory Recommendation Modal */}
      <AIRecapRecommendationModal
        evaluations={filteredEvaluations}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
