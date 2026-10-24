import React, { useState } from 'react';
import { ProgramTindakLanjutItem } from '../../types';
import { X, PlusCircle, Check, Sparkles } from 'lucide-react';

interface AddProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: ProgramTindakLanjutItem) => void;
  editingProgram?: ProgramTindakLanjutItem | null;
}

const RTL_TEMPLATES = [
  {
    namaProgram: 'Workshop Penyusunan LKPD Berdiferensiasi & Numerasi',
    tujuan: 'Meningkatkan keterampilan guru dalam merancang lembar aktivitas adaptif sesuai keragaman kesiapan belajar murid.',
    waktuPelaksanaan: 'Bulan Depan (Minggu ke-2)',
    penanggungJawab: 'Pengawas Sekolah & Tim Pengembang Kurikulum',
    keterangan: 'Prototipe LKPD berdiferensiasi dan instrumen asesmen siap ajar di kelas.',
  },
  {
    namaProgram: 'Coaching Klinis & Pendampingan Asesmen Formatif',
    tujuan: 'Mengoptimalkan rubrik penilaian kinerja dan teknik umpan balik seketika (exit ticket / check-in) saat pembelajaran berlangsung.',
    waktuPelaksanaan: '2 Pekan Pasca Observasi',
    penanggungJawab: 'Pengawas Pembina (Tati Maryati, S.Pd., M.Pd.)',
    keterangan: 'Observasi klinis tindak lanjut siklus ke-2 di ruang kelas.',
  },
  {
    namaProgram: 'Diseminasi Praktik Baik Pembelajaran Mendalam di MGMP',
    tujuan: 'Menularkan pengalaman penerapan alur Pembelajaran Mendalam kepada rekan sejawat di MGMP Kota Depok.',
    waktuPelaksanaan: 'Pertemuan Rutin MGMP Bulan Berjalan',
    penanggungJawab: 'Pengawas Pembina & Pengurus MGMP',
    keterangan: 'Pemaparan best practice dan bahan ajar interaktif.',
  },
  {
    namaProgram: 'Peer Teaching & Penguatan Kombel Sekolah',
    tujuan: 'Menguatkan budaya refleksi kolaboratif dan telaah sejawat modul ajar antar guru serumpun.',
    waktuPelaksanaan: 'Setiap Jumat Pekan ke-3',
    penanggungJawab: 'Kepala Sekolah & Ketua Kombel',
    keterangan: 'Laporan notula refleksi dan modul ajar terstandardisasi.',
  },
];

export const AddProgramModal: React.FC<AddProgramModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProgram,
}) => {
  const [namaProgram, setNamaProgram] = useState(editingProgram?.namaProgram || '');
  const [tujuan, setTujuan] = useState(editingProgram?.tujuan || '');
  const [waktuPelaksanaan, setWaktuPelaksanaan] = useState(editingProgram?.waktuPelaksanaan || '');
  const [penanggungJawab, setPenanggungJawab] = useState(editingProgram?.penanggungJawab || '');
  const [keterangan, setKeterangan] = useState(editingProgram?.keterangan || '');

  React.useEffect(() => {
    if (editingProgram) {
      setNamaProgram(editingProgram.namaProgram);
      setTujuan(editingProgram.tujuan);
      setWaktuPelaksanaan(editingProgram.waktuPelaksanaan);
      setPenanggungJawab(editingProgram.penanggungJawab);
      setKeterangan(editingProgram.keterangan);
    } else {
      setNamaProgram('');
      setTujuan('');
      setWaktuPelaksanaan('Bulan Depan (2 Pekan ke depan)');
      setPenanggungJawab('Pengawas Sekolah & Kepala Sekolah');
      setKeterangan('');
    }
  }, [editingProgram, isOpen]);

  if (!isOpen) return null;

  const handleApplyTemplate = (tpl: typeof RTL_TEMPLATES[0]) => {
    setNamaProgram(tpl.namaProgram);
    setTujuan(tpl.tujuan);
    setWaktuPelaksanaan(tpl.waktuPelaksanaan);
    setPenanggungJawab(tpl.penanggungJawab);
    setKeterangan(tpl.keterangan);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProgram.trim()) {
      alert('Mohon isi nama program / kegiatan pembinaan.');
      return;
    }

    onSave({
      id: editingProgram?.id || `prog-${Date.now()}`,
      namaProgram,
      tujuan,
      waktuPelaksanaan,
      penanggungJawab,
      keterangan,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <h3 className="font-bold text-base flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-300" />
            {editingProgram ? 'Edit Program Tindak Lanjut' : 'Tambah Program Tindak Lanjut'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-indigo-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        {!editingProgram && (
          <div className="px-6 pt-4 pb-2 bg-indigo-50/50 border-b border-indigo-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Pilihan Rekomendasi Cepat / Template RTL:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {RTL_TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded-lg text-[11px] font-medium transition-all shadow-2xs text-left"
                >
                  + {tpl.namaProgram.slice(0, 32)}...
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Program / Kegiatan Pembinaan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Workshop Pembuatan LKPD Berbasis Data Numerasi"
              value={namaProgram}
              onChange={(e) => setNamaProgram(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tujuan / Target Capaian</label>
            <textarea
              rows={2}
              placeholder="Contoh: Meningkatkan kemampuan guru merancang asesmen formatif adaptif"
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Waktu Pelaksanaan</label>
              <input
                type="text"
                placeholder="Contoh: September 2026 / Minggu ke-2"
                value={waktuPelaksanaan}
                onChange={(e) => setWaktuPelaksanaan(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Penanggung Jawab / Mitra</label>
              <input
                type="text"
                placeholder="Contoh: Pengawas, KS, MGMP"
                value={penanggungJawab}
                onChange={(e) => setPenanggungJawab(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Keterangan / Luaran yang Diharapkan
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Dokumen Modul Ajar revisi & Lembar Kerja siap guna di kelas"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e as any);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Program</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
