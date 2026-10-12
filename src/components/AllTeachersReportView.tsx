import React, { useState } from 'react';
import { TeacherProfile, RPPEvaluation } from '../types';
import {
  FileText,
  Search,
  School,
  BookOpen,
  Award,
  ExternalLink,
  Printer,
  FileSpreadsheet,
  Download,
  Users,
} from 'lucide-react';
import { exportSingleEvaluationToExcel, exportSingleEvaluationToWord, printPDFReport } from '../utils/exportUtils';

interface AllTeachersReportViewProps {
  teachers: TeacherProfile[];
  evaluations: RPPEvaluation[];
  onSelectEvaluation: (evalId: string) => void;
  onStartSupervision: (teacher: TeacherProfile) => void;
}

export const AllTeachersReportView: React.FC<AllTeachersReportViewProps> = ({
  teachers,
  evaluations,
  onSelectEvaluation,
  onStartSupervision,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('ALL');

  const schoolList = Array.from(new Set(teachers.map((t) => t.schoolName).filter(Boolean)));

  // Map each teacher to their evaluations
  const teacherReportList = teachers.map((teacher) => {
    const teacherEvals = evaluations.filter(
      (ev) => ev.identity.teacherName.toLowerCase().trim() === teacher.teacherName.toLowerCase().trim()
    );
    return {
      teacher,
      evaluations: teacherEvals,
      latestEval: teacherEvals[0],
    };
  });

  const filteredList = teacherReportList.filter(({ teacher }) => {
    const matchSearch =
      teacher.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (teacher.nipNuptk && teacher.nipNuptk.includes(searchQuery));
    const matchSchool = selectedSchool === 'ALL' || teacher.schoolName === selectedSchool;
    return matchSearch && matchSchool;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-400/30">
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>Pusat Rapor & Dokumen Supervisi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Rapor Supervisi Semua Guru
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl">
            Akses, cetak, atau unduh laporan hasil siklus supervisi terpadu (Telaah RPP, Pra-Observasi, Observasi Kelas, dan Pasca Observasi) untuk seluruh guru di satuan pendidikan.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-indigo-500/30 px-5 py-4 rounded-2xl text-center flex-shrink-0">
          <div className="text-2xl font-black text-amber-300">{teachers.length}</div>
          <div className="text-xs text-indigo-200 font-medium">Total Guru Binaan</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama guru, NIP, mapel, atau sekolah..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="ALL">Semua Satuan Pendidikan ({schoolList.length})</option>
          {schoolList.map((sch) => (
            <option key={sch} value={sch}>
              {sch}
            </option>
          ))}
        </select>
      </div>

      {/* Teachers Report Cards List */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Tidak ada guru ditemukan</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Coba sesuaikan kata kunci pencarian atau filter sekolah.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map(({ teacher, evaluations: tEvals, latestEval }) => (
            <div
              key={teacher.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-lg flex items-center justify-center shadow flex-shrink-0">
                  {teacher.teacherName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base">{teacher.teacherName}</h3>
                    <span className="text-xs font-mono text-slate-500">
                      ({teacher.nipNuptk || 'NIP belum diisi'})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-blue-700">
                      <BookOpen className="w-3.5 h-3.5" /> {teacher.subject} ({teacher.gradeFase})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <School className="w-3.5 h-3.5 text-indigo-600" /> {teacher.schoolName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                {latestEval ? (
                  <div className="text-left sm:text-right space-y-0.5">
                    <div className="text-xs font-bold text-slate-700">
                      Skor Terpadu: <span className="font-mono text-blue-700 font-black text-sm">{latestEval.combinedFinalScore}%</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Predikat: <span className="font-bold text-emerald-700">{latestEval.combinedPredicate} ({latestEval.combinedPredicateLabel})</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {tEvals.length} Siklus Supervisi Tercatat
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-amber-600 font-semibold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                    Belum Ada Supervisi
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
                  {latestEval ? (
                    <>
                      <button
                        onClick={() => onSelectEvaluation(latestEval.id)}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-amber-300" />
                        <span>Buka Rapor</span>
                      </button>

                      <button
                        onClick={() => exportSingleEvaluationToWord(latestEval)}
                        title="Unduh Word"
                        className="p-2.5 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-xl border border-slate-200 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => exportSingleEvaluationToExcel(latestEval)}
                        title="Unduh Excel"
                        className="p-2.5 bg-slate-100 hover:bg-emerald-50 text-emerald-700 rounded-xl border border-slate-200 transition-all cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onStartSupervision(teacher)}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>Mulai Supervisi</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
