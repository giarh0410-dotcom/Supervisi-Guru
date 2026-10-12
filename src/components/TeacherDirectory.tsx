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
  Download,
  Upload,
  FileSpreadsheet,
} from 'lucide-react';
import { TeacherModal } from './TeacherModal';
import { downloadTeacherTemplate } from '../utils/exportUtils';
import * as XLSX from 'xlsx';

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<any>(ws);

        let importedCount = 0;
        data.forEach((row) => {
          const teacherName = row['Nama Guru'] || row['nama'] || row['nama_guru'];
          if (teacherName) {
            const newTeacher: TeacherProfile = {
              id: `teacher-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              teacherName: String(teacherName).trim(),
              nipNuptk: String(row['NIP / NUPTK'] || row['nip'] || row['nipNuptk'] || ''),
              subject: String(row['Mata Pelajaran'] || row['mapel'] || row['subject'] || 'Umum'),
              gradeFase: String(row['Kelas / Fase'] || row['kelas'] || row['gradeFase'] || 'Kelas VII / Fase D'),
              schoolName: String(row['Satuan Pendidikan'] || row['sekolah'] || row['schoolName'] || 'SMP Islam Modern Al Fakhir'),
              unitKerja: String(row['Unit Kerja'] || row['unitKerja'] || 'SMP Islam Modern Al Fakhir - Depok'),
              email: String(row['Email'] || row['email'] || ''),
              phone: String(row['No HP / WA'] || row['phone'] || row['hp'] || ''),
              notes: String(row['Catatan'] || row['notes'] || ''),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            onSaveTeacher(newTeacher);
            importedCount++;
          }
        });
        alert(`Berhasil mengimpor ${importedCount} data guru dari file template!`);
      } catch (err) {
        console.error(err);
        alert('Gagal membaca file template. Pastikan format file sesuai dengan template.');
      }
    };
    reader.readAsBinaryString(file);
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
            Kelola profil guru binaan, pantau riwayat siklus supervisi terpadu, unduh template input data, serta impor data guru secara massal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end flex-shrink-0">
          <button
            onClick={downloadTeacherTemplate}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            title="Unduh Template Excel untuk Input Data Guru"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Unduh Template</span>
          </button>

          <label className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Impor Data Guru</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleAddNew}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Guru</span>
          </button>
        </div>
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
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{evaluations.length}</div>
            <div className="text-xs text-slate-500 font-medium">Total Siklus Supervisi</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama guru, NIP, mapel, atau sekolah..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">Semua Mapel ({subjectList.length})</option>
            {subjectList.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
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
          <h3 className="text-lg font-bold text-slate-800">Tidak ada data guru ditemukan</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Coba sesuaikan kata kunci pencarian, filter, atau klik tombol "Tambah Guru Baru" untuk mendaftarkan guru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => {
            const tEvals = getTeacherEvaluations(teacher.teacherName);
            const latestEval = tEvals[0];

            return (
              <div
                key={teacher.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col justify-between space-y-4 relative group"
              >
                {/* Header & Avatar */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-black text-base flex items-center justify-center shadow flex-shrink-0">
                      {teacher.teacherName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>

                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(teacher)}
                        title="Edit Profil"
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(teacher.id)}
                        title="Hapus Profil"
                        className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {teacher.teacherName}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      {teacher.nipNuptk ? `NIP/NUPTK. ${teacher.nipNuptk}` : 'NIP/NUPTK belum diisi'}
                    </p>
                  </div>

                  {/* School & Subject */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="truncate">{teacher.subject} ({teacher.gradeFase})</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span className="truncate">{teacher.schoolName}</span>
                    </div>
                    {teacher.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Supervision Status & Actions */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  {latestEval ? (
                    <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <div>
                        <span className="text-slate-500 font-medium block">Skor Terpadu:</span>
                        <span className="font-mono font-black text-blue-700 text-sm">
                          {latestEval.combinedFinalScore}% ({latestEval.combinedPredicate})
                        </span>
                      </div>
                      <button
                        onClick={() => onViewEvaluation(latestEval.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] shadow transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-300" />
                        <span>Lihat Rapor</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                      <span className="text-amber-800 font-semibold">Belum disupervisi</span>
                      <button
                        onClick={() => onStartSupervisionForTeacher(teacher)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-bold text-[11px] shadow transition-all cursor-pointer"
                      >
                        + Mulai Asesmen
                      </button>
                    </div>
                  )}

                  {tEvals.length > 1 && (
                    <div className="text-[11px] text-slate-500 text-center">
                      Tercatat {tEvals.length} siklus supervisi
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
