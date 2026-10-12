import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { getAppSettings, saveAppSettings } from '../data/storage';
import { X, Settings, Building, User, Award, Shield, Upload, CheckCircle2, RefreshCw } from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved,
}) => {
  const [settings, setSettings] = useState<AppSettings>({
    schoolName: '',
    unitKerja: '',
    pengawasName: '',
    pengawasNip: '',
    pengawasJabatan: '',
    kepalaSekolahName: '',
    kepalaSekolahNip: '',
    kepalaSekolahJabatan: '',
    supervisorName: '',
    supervisorNuptk: '',
    supervisorJabatan: '',
    logoDataUrl: '',
  });

  useEffect(() => {
    if (isOpen) {
      setSettings(getAppSettings());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file gambar terlalu besar (maksimal 2MB).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev) => ({
          ...prev,
          logoDataUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppSettings(settings);
    onSettingsSaved(settings);
    onClose();
  };

  const handleResetDefault = () => {
    if (confirm('Kembalikan pengaturan ke default awal?')) {
      const defaultSettings: AppSettings = {
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
        logoDataUrl: '',
      };
      setSettings(defaultSettings);
      saveAppSettings(defaultSettings);
      onSettingsSaved(defaultSettings);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 rounded-xl border border-blue-400/30">
              <Settings className="w-6 h-6 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Pengaturan Identitas & Logo Sekolah</h3>
              <p className="text-xs text-indigo-200">
                Pengaturan terpisah: Pengawas, Kepala Sekolah, & Supervisor
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Logo Upload Section */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
            <div className="flex-shrink-0">
              {settings.logoDataUrl ? (
                <img
                  src={settings.logoDataUrl}
                  alt="Logo Sekolah"
                  className="w-20 h-20 object-contain rounded-2xl bg-white p-2 border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white p-2 border border-slate-200 shadow-sm flex items-center justify-center">
                  <SchoolLogo size={56} />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h4 className="text-sm font-bold text-slate-800">Logo Sekolah / Madrasah</h4>
              <p className="text-xs text-slate-500">
                Unggah gambar logo sekolah (format PNG/JPG, maksimal 2MB) untuk ditampilkan pada kop laporan dan header aplikasi.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow transition-all">
                <Upload className="w-4 h-4" />
                <span>Pilih Gambar Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {settings.logoDataUrl && (
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, logoDataUrl: '' })}
                  className="ml-3 text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                >
                  Hapus Logo Kustom
                </button>
              )}
            </div>
          </div>

          {/* School Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Building className="w-4 h-4 text-blue-600" /> Identitas Satuan Pendidikan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Satuan Pendidikan (Sekolah) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.schoolName || ''}
                  onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                  placeholder="Contoh: SMP Islam Modern Al Fakhir"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Unit Kerja / Dinas / Alamat *
                </label>
                <input
                  type="text"
                  required
                  value={settings.unitKerja || ''}
                  onChange={(e) => setSettings({ ...settings, unitKerja: e.target.value })}
                  placeholder="Contoh: SMP Islam Modern Al Fakhir - Depok"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Pengawas Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Award className="w-4 h-4 text-amber-600" /> Identitas Pengawas Sekolah / Pembina
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar Pengawas *
                </label>
                <input
                  type="text"
                  required
                  value={settings.pengawasName || ''}
                  onChange={(e) => setSettings({ ...settings, pengawasName: e.target.value })}
                  placeholder="Contoh: Tati Maryati, S.Pd., M.Pd."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP Pengawas *
                </label>
                <input
                  type="text"
                  required
                  value={settings.pengawasNip || ''}
                  onChange={(e) => setSettings({ ...settings, pengawasNip: e.target.value })}
                  placeholder="Contoh: 197811082006042014"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jabatan Pengawas *
              </label>
              <input
                type="text"
                required
                value={settings.pengawasJabatan || ''}
                onChange={(e) => setSettings({ ...settings, pengawasJabatan: e.target.value })}
                placeholder="Contoh: Pengawas Pembina SMP Kota Depok"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Kepala Sekolah Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Shield className="w-4 h-4 text-emerald-600" /> Identitas Kepala Sekolah
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar Kepala Sekolah *
                </label>
                <input
                  type="text"
                  required
                  value={settings.kepalaSekolahName || ''}
                  onChange={(e) => setSettings({ ...settings, kepalaSekolahName: e.target.value })}
                  placeholder="Contoh: Dr. H. Ahmad Fauzi, M.Pd."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP Kepala Sekolah *
                </label>
                <input
                  type="text"
                  required
                  value={settings.kepalaSekolahNip || ''}
                  onChange={(e) => setSettings({ ...settings, kepalaSekolahNip: e.target.value })}
                  placeholder="Contoh: 197205121998031004"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jabatan Kepala Sekolah *
              </label>
              <input
                type="text"
                required
                value={settings.kepalaSekolahJabatan || ''}
                onChange={(e) => setSettings({ ...settings, kepalaSekolahJabatan: e.target.value })}
                placeholder="Contoh: Kepala SMP Islam Modern Al Fakhir"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Supervisor Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <User className="w-4 h-4 text-indigo-600" /> Identitas Supervisor / Tim Penilai
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar Supervisor *
                </label>
                <input
                  type="text"
                  required
                  value={settings.supervisorName || ''}
                  onChange={(e) => setSettings({ ...settings, supervisorName: e.target.value })}
                  placeholder="Contoh: Deny Rahmat, S.Sos.I."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP / NUPTK Supervisor *
                </label>
                <input
                  type="text"
                  required
                  value={settings.supervisorNuptk || ''}
                  onChange={(e) => setSettings({ ...settings, supervisorNuptk: e.target.value })}
                  placeholder="Contoh: 1856762663120002"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jabatan Supervisor *
              </label>
              <input
                type="text"
                required
                value={settings.supervisorJabatan || ''}
                onChange={(e) => setSettings({ ...settings, supervisorJabatan: e.target.value })}
                placeholder="Contoh: Supervisor SMP Islam Modern Al Fakhir"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefault}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center gap-3">
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
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
