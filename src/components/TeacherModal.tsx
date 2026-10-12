import React, { useState, useEffect } from 'react';
import { TeacherProfile } from '../types';
import { X, User, BookOpen, Building, Mail, Phone, CheckCircle2 } from 'lucide-react';

interface TeacherModalProps {
  isOpen: boolean;
  teacher?: TeacherProfile;
  onSave: (teacher: TeacherProfile) => void;
  onClose: () => void;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  teacher,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<TeacherProfile>>({
    teacherName: '',
    nipNuptk: '',
    subject: '',
    gradeFase: 'Kelas VII / Fase D',
    schoolName: '',
    unitKerja: '',
    email: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    if (teacher) {
      setFormData(teacher);
    } else {
      setFormData({
        teacherName: '',
        nipNuptk: '',
        subject: '',
        gradeFase: 'Kelas VII / Fase D',
        schoolName: 'SMP Negeri 1 Depok',
        unitKerja: 'SMP Negeri 1 Depok - Dinas Pendidikan Kota Depok',
        email: '',
        phone: '',
        notes: '',
      });
    }
  }, [teacher, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacherName || !formData.subject || !formData.schoolName) {
      alert('Mohon lengkapi Nama Guru, Mata Pelajaran, dan Satuan Pendidikan.');
      return;
    }

    const savedTeacher: TeacherProfile = {
      id: teacher?.id || `teacher-${Date.now()}`,
      teacherName: formData.teacherName || '',
      nipNuptk: formData.nipNuptk || '',
      subject: formData.subject || '',
      gradeFase: formData.gradeFase || 'Kelas VII / Fase D',
      schoolName: formData.schoolName || '',
      unitKerja: formData.unitKerja || formData.schoolName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      notes: formData.notes || '',
      createdAt: teacher?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(savedTeacher);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 rounded-xl border border-blue-400/30">
              <User className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {teacher ? 'Edit Data Guru' : 'Tambah Guru Baru'}
              </h3>
              <p className="text-xs text-indigo-200">
                Direktori Data Pengajar / Guru Supervisi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Lengkap & Gelar *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.teacherName || ''}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  placeholder="Contoh: Dra. Hj. Siti Aminah, M.Pd."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                NIP / NUPTK
              </label>
              <input
                type="text"
                value={formData.nipNuptk || ''}
                onChange={(e) => setFormData({ ...formData, nipNuptk: e.target.value })}
                placeholder="Contoh: 198203152008012010"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mata Pelajaran *
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.subject || ''}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Contoh: IPA / Matematika / Bahasa Indonesia"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kelas / Fase *
              </label>
              <input
                type="text"
                required
                value={formData.gradeFase || ''}
                onChange={(e) => setFormData({ ...formData, gradeFase: e.target.value })}
                placeholder="Contoh: Kelas VII / Fase D"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Satuan Pendidikan (Sekolah) *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.schoolName || ''}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="Contoh: SMP Negeri 1 Depok"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Unit Kerja / Dinas
              </label>
              <input
                type="text"
                value={formData.unitKerja || ''}
                onChange={(e) => setFormData({ ...formData, unitKerja: e.target.value })}
                placeholder="Contoh: SMP Negeri 1 Depok - Dinas Pendidikan"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="guru@sekolah.sch.id"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                No. Telepon / WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08123456789"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Catatan / Keterangan Pembinaan
            </label>
            <textarea
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Catatan kelebihan, potensi, atau riwayat pembinaan guru..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Guru</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
