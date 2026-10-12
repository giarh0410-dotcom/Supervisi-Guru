import React, { useState, useMemo } from 'react';
import { TeacherProfile, RPPEvaluation } from '../types';
import {
  Users,
  Search,
  Plus,
  Building,
  BookOpen,
  Phone,
  Mail,
  Edit,
  Trash2,
  FileText,
  Award,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { TeacherModal } from './TeacherModal';

interface TeacherDirectoryProps {
  teachers: TeacherProfile[];
  evaluations: RPPEvaluation[];
  onSaveTeacher: (teacher: TeacherProfile) => void;
  onDeleteTeacher: (id: string) => void;
  onStartSupervisionForTeacher: (teacher: TeacherProfile) => void;
  onViewEvaluation: (evalId: string) => void;
}

export const TeacherDirectory: React.FC<TeacherDirectoryProps> = ({
  teachers,
  evaluations,
  onSaveTeacher,
  onDeleteTeacher,
  onStartSupervisionForTeacher,
  onViewEvaluation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherProfile | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Unique school list and subject list for filters
  const schoolList = useMemo(() => {
    const set = new Set(teachers.map((t) => t.schoolName).filter(Boolean));
    return Array.from(set);
  }, [teachers]);

  const subjectList = useMemo(() => {
    const set = new Set(teachers.map((t) => t.subject).filter(Boolean));
    return Array.from(set);
  }, [teachers]);

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchSearch =
        t.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.nipNuptk && t.nipNuptk.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.schoolName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSchool = selectedSchool === 'ALL' || t.schoolName === selectedSchool;
      const matchSubject = selectedSubject === 'ALL' || t.subject === selectedSubject;

      return matchSearch && matchSchool && matchSubject;
    });
  }, [teachers, searchQuery, selectedSchool, selectedSubject]);

  // Get evaluations for a specific teacher name
  const getTeacherEvaluations = (teacherName: string) => {
    return evaluations.filter(
      (ev) => ev.identity.teacherName.toLowerCase().trim() === teacherName.toLowerCase().trim()
    );
  };

  const handleEdit = (teacher: TeacherProfile) => {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTeacher(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Teacher Modal */}
      <TeacherModal
        isOpen={isModalOpen}
        teacher={editingTeacher}
        onSave={(teacher) => {
          onSaveTeacher(teacher);
          setIsModalOpen(false);
        }}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Hapus Data Guru?</h3>
              <p className="text-sm text-slate-500 mt-1">
                Data guru ini akan dihapus dari direktori. Rekaman supervisi yang sudah ada tidak akan terhapus.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteTeacher(deleteId);
                  setDeleteId(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold border border-blue-400/30">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span>Manajemen Pendidik & Tenaga Kependidikan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Direktori Data Guru & Pengampu
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl">
            Kelola profil guru binaan, pantau riwayat siklus supervisi terpadu (Telaah RPP, Pra-Observasi, Observasi Kelas, & Pasca Observasi), dan mulai asesmen baru dengan cepat.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/30 flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Guru Baru</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{teachers.length}</div>
            <div className="text-xs text-slate-500 font-medium">Total Guru Terdaftar</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{schoolList.length}</div>
            <div className="text-xs text-slate-500 font-medium">Satuan Pendidikan (Sekolah)</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{evaluations.length}</div>
            <div className="text-xs text-slate-500 font-medium">Total Siklus Supervisi</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama guru, NIP, mapel, atau sekolah..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">Semua Sekolah ({schoolList.length})</option>
            {schoolList.map((sch) => (
              <option key={sch} value={sch}>
                {sch}
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">Semua Mapel ({subjectList.length})</option>
            {subjectList.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Teacher Cards Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Tidak ada guru ditemukan</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau filter sekolah/mapel, atau tambahkan data guru baru.
          </p>
          <button
            onClick={handleAddNew}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 cursor-pointer inline-flex items-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Guru Baru</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => {
            const tEvals = getTeacherEvaluations(teacher.teacherName);
            const latestEval = tEvals[0];

            return (
              <div
                key={teacher.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top Banner */}
                <div className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-br from-slate-50/80 to-blue-50/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-base flex items-center justify-center shadow-md flex-shrink-0">
                        {teacher.teacherName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {teacher.teacherName}
                        </h3>
                        <p className="text-xs font-mono text-slate-500">
                          {teacher.nipNuptk ? `NIP/NUPTK: ${teacher.nipNuptk}` : 'NIP belum diisi'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(teacher)}
                        title="Edit Guru"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(teacher.id)}
                        title="Hapus Guru"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4 flex-1">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-semibold">{teacher.subject}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{teacher.gradeFase}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <Building className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span className="font-medium line-clamp-1">{teacher.schoolName}</span>
                    </div>

                    {teacher.email && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                    )}

                    {teacher.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Supervision Summary Box */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Riwayat Supervisi:</span>
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold">
                        {tEvals.length} Siklus
                      </span>
                    </div>

                    {latestEval ? (
                      <div className="space-y-1 text-xs pt-1 border-t border-slate-200/60">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Nilai Akhir Gabungan:</span>
                          <span className="font-black text-blue-900">
                            {latestEval.combinedFinalScore} / 100
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Predikat:</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              latestEval.combinedPredicate === 'A'
                                ? 'bg-emerald-100 text-emerald-800'
                                : latestEval.combinedPredicate === 'B'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Predikat {latestEval.combinedPredicate} ({latestEval.combinedPredicateLabel})
                          </span>
                        </div>
                        <button
                          onClick={() => onViewEvaluation(latestEval.id)}
                          className="mt-2 w-full py-1.5 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-200 transition-colors flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                        >
                          <span>Lihat Rapor Supervisi</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic py-1">
                        Belum ada data supervisi tercatat untuk guru ini.
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => onStartSupervisionForTeacher(teacher)}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Mulai Supervisi Terpadu</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
