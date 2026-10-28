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
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 font-bold';
      case 'B':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/40 font-bold';
      case 'C':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/40 font-bold';
      case 'D':
        return 'bg-rose-500/20 text-rose-300 border-rose-400/40 font-bold';
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* AI Recap Recommendation Modal */}
      <AIRecapRecommendationModal
        evaluations={evaluations}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* GLASSY ACTION HEADER */}
      <div className="backdrop-blur-2xl bg-white/70 border border-white/60 shadow-2xl shadow-indigo-950/10 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/10 border border-indigo-500/30 text-indigo-700 text-xs font-bold rounded-full">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Siklus Penuh: Telaah RPP • Pra-Observasi • Observasi Kelas • Pasca-Observasi & RTL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-indigo-600" />
            Dashboard Hasil Supervisi Klinis Terpadu (PM)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Supervisor SMP Islam Modern Al Fakhir: <span className="font-bold text-slate-900">Deny Rahmat, S.Sos.I.</span> <span className="font-mono text-slate-500">(NUPTK. 1856762663120002)</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-2xl font-black text-xs shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Analisis & Rekomendasi</span>
          </button>

          <button
            onClick={() => exportRecapToWord(evaluations)}
            className="flex items-center gap-2 px-4 py-3 bg-white/80 hover:bg-white text-blue-700 border border-blue-200 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer"
            title="Unduh seluruh data rekapan semua guru dalam format Dokumen Word (.docx)"
          >
            <FileText className="w-4 h-4" />
            <span>Word (.docx)</span>
          </button>

          <button
            onClick={() => exportRecapToExcel(evaluations)}
            className="flex items-center gap-2 px-4 py-3 bg-white/80 hover:bg-white text-emerald-700 border border-emerald-200 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer"
            title="Unduh seluruh data rekapan dalam format MS Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            onClick={onNewAssessment}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>+ Supervisi Baru</span>
          </button>
        </div>
      </div>

      {/* GLASSY METRIC STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Assessed */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/60 shadow-xl shadow-slate-900/5 p-6 rounded-3xl relative overflow-hidden group hover:shadow-2xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Guru Disupervisi
              </p>
              <p className="text-3xl font-black text-slate-900 mt-1">
                {evaluations.length} <span className="text-sm font-normal text-slate-500">Guru</span>
              </p>
            </div>
            <div className="p-3.5 bg-blue-600/10 rounded-2xl text-blue-600 border border-blue-200/50 shadow-inner">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 flex items-center gap-1 relative z-10 font-medium">
            <School className="w-3.5 h-3.5 text-indigo-600" /> SMP Binaan Kota Depok
          </p>
        </div>

        {/* Avg RPP Score */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/60 shadow-xl shadow-slate-900/5 p-6 rounded-3xl relative overflow-hidden group hover:shadow-2xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Rata-Rata Telaah RPP
              </p>
              <p className="text-3xl font-black text-indigo-600 mt-1">
                {stats.avgRppScore}%
              </p>
            </div>
            <div className="p-3.5 bg-indigo-600/10 rounded-2xl text-indigo-600 border border-indigo-200/50 shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 flex items-center gap-1 relative z-10 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> 42 Indikator Perencanaan
          </p>
        </div>

        {/* Avg Observasi Score */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/60 shadow-xl shadow-slate-900/5 p-6 rounded-3xl relative overflow-hidden group hover:shadow-2xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Rata-Rata Observasi Kelas
              </p>
              <p className="text-3xl font-black text-sky-600 mt-1">
                {stats.avgObsScore}%
              </p>
            </div>
            <div className="p-3.5 bg-sky-600/10 rounded-2xl text-sky-600 border border-sky-200/50 shadow-inner">
              <Eye className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 flex items-center gap-1 relative z-10 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> 14 Indikator Kelas PM
          </p>
        </div>

        {/* Combined Supervised Score */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-3xl border border-indigo-800/50 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                ★ SKOR AKHIR TERPADU
              </p>
              <p className="text-3xl font-black text-amber-400 mt-1 font-mono">
                {stats.avgCombinedScore}%
              </p>
            </div>
            <div className="p-3.5 bg-amber-400/20 rounded-2xl text-amber-400 border border-amber-400/30 shadow-inner">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-indigo-200 relative z-10 font-medium">
            <span>A: <strong className="text-white">{stats.predA}</strong></span>
            <span>•</span>
            <span>B: <strong className="text-white">{stats.predB}</strong></span>
            <span>•</span>
            <span>C: <strong className="text-white">{stats.predC}</strong></span>
          </div>
        </div>
      </div>

      {/* GLASSY ANALYTICS CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Predicate Distribution */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/60 shadow-xl shadow-slate-900/5 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" /> Distribusi Predikat Mutu Guru
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Total: {evaluations.length} Guru</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predicateChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Jumlah Guru" radius={[8, 8, 0, 0]}>
                  {predicateChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Quick Summary Guide */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/60 shadow-xl shadow-slate-900/5 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-200/60 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" /> Panduan Kualifikasi Mutu & Predikat
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div className="font-bold text-emerald-900">Predikat A (Amat Baik / Unggul)</div>
              <span className="font-mono font-black text-emerald-700">91% - 100%</span>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between">
              <div className="font-bold text-blue-900">Predikat B (Baik / Cakap)</div>
              <span className="font-mono font-black text-blue-700">76% - 90%</span>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
              <div className="font-bold text-amber-900">Predikat C (Cukup / Perlu Pendampingan)</div>
              <span className="font-mono font-black text-amber-700">60% - 75%</span>
            </div>
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between">
              <div className="font-bold text-rose-900">Predikat D (Kurang / Intervensi Intensif)</div>
              <span className="font-mono font-black text-rose-700">&lt; 60%</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="backdrop-blur-xl bg-white/70 border border-white/60 shadow-xl shadow-slate-900/5 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Cari guru, NIP, mapel, atau sekolah..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={filters.schoolFilter}
            onChange={(e) => setFilters({ ...filters, schoolFilter: e.target.value })}
            className="px-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">Semua Sekolah ({schoolOptions.length})</option>
            {schoolOptions.map((sch) => (
              <option key={sch} value={sch}>
                {sch}
              </option>
            ))}
          </select>

          <select
            value={filters.subjectFilter}
            onChange={(e) => setFilters({ ...filters, subjectFilter: e.target.value })}
            className="px-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">Semua Mapel ({subjectOptions.length})</option>
            {subjectOptions.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>

          <select
            value={filters.predicateFilter}
            onChange={(e) => setFilters({ ...filters, predicateFilter: e.target.value })}
            className="px-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">Semua Predikat</option>
            <option value="A">Predikat A</option>
            <option value="B">Predikat B</option>
            <option value="C">Predikat C</option>
            <option value="D">Predikat D</option>
          </select>
        </div>
      </div>

      {/* TABLE VIEW TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTableTab('COMBINED')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTableTab === 'COMBINED'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white/80 text-slate-600 hover:bg-slate-100'
          }`}
        >
          ★ Rekap Skor Akhir Terpadu
        </button>
        <button
          onClick={() => setActiveTableTab('RPP')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTableTab === 'RPP'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white/80 text-slate-600 hover:bg-slate-100'
          }`}
        >
          1. Rekap Telaah RPP (42 Indikator)
        </button>
        <button
          onClick={() => setActiveTableTab('OBSERVASI')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTableTab === 'OBSERVASI'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white/80 text-slate-600 hover:bg-slate-100'
          }`}
        >
          3. Rekap Observasi Kelas (14 Indikator)
        </button>
        <button
          onClick={() => setActiveTableTab('PASCA')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTableTab === 'PASCA'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white/80 text-slate-600 hover:bg-slate-100'
          }`}
        >
          4. Pasca-Observasi & Matriks RTL
        </button>
      </div>

      {/* GLASSY EVALUATIONS TABLE */}
      <div className="backdrop-blur-xl bg-white/70 border border-white/60 shadow-xl shadow-slate-900/5 rounded-3xl overflow-hidden">
        {filteredEvaluations.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Tidak ada data supervisi ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Coba sesuaikan filter pencarian atau buat asesmen supervisi terpadu baru.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900/90 text-white font-bold border-b border-slate-800">
                  <th className="p-3.5 text-center w-12">No</th>
                  <th className="p-3.5">Nama Guru & NIP</th>
                  <th className="p-3.5">Mata Pelajaran & Sekolah</th>
                  {activeTableTab === 'COMBINED' && (
                    <>
                      <th className="p-3.5 text-center">Nilai RPP</th>
                      <th className="p-3.5 text-center">Nilai Observasi</th>
                      <th className="p-3.5 text-center">Skor Akhir Terpadu</th>
                    </>
                  )}
                  {activeTableTab === 'RPP' && (
                    <th className="p-3.5 text-center">Telaah RPP (42 Indikator)</th>
                  )}
                  {activeTableTab === 'OBSERVASI' && (
                    <th className="p-3.5 text-center">Observasi Kelas (14 Indikator)</th>
                  )}
                  {activeTableTab === 'PASCA' && (
                    <th className="p-3.5">Rencana Tindak Lanjut (RTL) Utama</th>
                  )}
                  <th className="p-3.5 text-center w-40">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 bg-white/50">
                {filteredEvaluations.map((item, idx) => {
                  const combinedScore = item.combinedFinalScore ?? item.finalScore;
                  const combinedPred = item.combinedPredicate ?? item.predicate;
                  const combinedLabel = item.combinedPredicateLabel ?? item.predicateLabel;

                  return (
                    <tr key={item.id} className="hover:bg-indigo-50/40 transition-colors">
                      <td className="p-3.5 text-center font-bold text-slate-500 font-mono">{idx + 1}</td>
                      <td className="p-3.5">
                        <div className="font-extrabold text-slate-900">{item.identity.teacherName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{item.identity.nipNuptk || '-'}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-indigo-950">{item.identity.subject} ({item.identity.gradeFase})</div>
                        <div className="text-[11px] text-slate-600">{item.identity.schoolName}</div>
                      </td>

                      {activeTableTab === 'COMBINED' && (
                        <>
                          <td className="p-3.5 text-center font-mono font-bold text-indigo-700">
                            {item.finalScore}%
                          </td>
                          <td className="p-3.5 text-center font-mono font-bold text-sky-700">
                            {item.observasiFinalScore ?? 85}%
                          </td>
                          <td className="p-3.5 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border ${getPredicateBadgeClass(combinedPred as any)}`}>
                              {combinedScore}% ({combinedPred})
                            </span>
                          </td>
                        </>
                      )}

                      {activeTableTab === 'RPP' && (
                        <td className="p-3.5 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border ${getPredicateBadgeClass(item.predicate)}`}>
                            {item.finalScore}% - Predikat {item.predicate} ({item.predicateLabel})
                          </span>
                        </td>
                      )}

                      {activeTableTab === 'OBSERVASI' && (
                        <td className="p-3.5 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border ${getPredicateBadgeClass(item.observasiPredicate || 'A')}`}>
                            {item.observasiFinalScore ?? 85}% - Predikat {item.observasiPredicate || 'A'}
                          </span>
                        </td>
                      )}

                      {activeTableTab === 'PASCA' && (
                        <td className="p-3.5 text-slate-700 text-xs leading-relaxed">
                          {item.pascaObservasi?.programTindakLanjut?.[0]?.namaProgram || 'Pendampingan klinis lanjutan terprogram.'}
                        </td>
                      )}

                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectEvaluation(item.id)}
                            title="Buka Rapor Lengkap"
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition-all cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditEvaluation(item.id)}
                            title="Edit Data"
                            className="p-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow transition-all cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => exportSingleEvaluationToWord(item)}
                            title="Unduh Rapor Word"
                            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow transition-all cursor-pointer"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteEvaluation(item.id)}
                            title="Hapus Rekaman"
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
