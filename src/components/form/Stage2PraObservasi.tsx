import React from 'react';
import { PraObservasiData, TeacherIdentity } from '../../types';
import { HelpCircle, Sparkles, MessageSquare, Target, Lightbulb, ShieldAlert, CheckSquare } from 'lucide-react';

interface Stage2PraObservasiProps {
  identity: TeacherIdentity;
  setIdentity: React.Dispatch<React.SetStateAction<TeacherIdentity>>;
  praObservasi: PraObservasiData;
  setPraObservasi: React.Dispatch<React.SetStateAction<PraObservasiData>>;
}

export const Stage2PraObservasi: React.FC<Stage2PraObservasiProps> = ({
  identity,
  setIdentity,
  praObservasi,
  setPraObservasi,
}) => {
  const handleAutoFillDefault = () => {
    setPraObservasi({
      topic: identity.rppTitle || 'Penguatan Konsep & Penerapan Kontekstual',
      learningGoals: 'Peserta didik mampu memahami konsep esensial, menganalisis data teks/numerasi secara kritis, dan memecahkan permasalahan nyata dalam kehidupan sehari-hari.',
      fokusPengembangan: 'Penerapan Pembelajaran Mendalam (PM) alur Memahami-Mengaplikasi-Merefleksi, Penguatan Literasi dan Numerasi data, serta Keterlibatan Aktif Murid.',
      strategiMedia: 'Model Pembelajaran Berbasis Masalah (Problem-Based Learning), Teks Multimoda, LKPD Terstruktur, dan Media Digital Interaktif.',
      kesiapanSiswa: 'Siswa heterogen dengan minat beragam; disediakan variasi bahan bacaan dan scaffolding bagi siswa yang memerlukan bimbingan membaca data.',
      potensiKendala: 'Manajemen waktu pada saat aktivitas eksplorasi kelompok dan penarikan kesimpulan.',
      catatanPraObservasi: 'Guru dan pengawas menyepakati fokus observasi klinis pada pengelolaan keterlibatan murid dalam menganalisis data LKPD serta penyampaian umpan balik formatif.',
      interviewDate: praObservasi.interviewDate || new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-md border border-indigo-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-200 text-xs font-bold rounded-full mb-1.5 border border-blue-400/30">
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" /> Tahap 2: Diskusi & Wawancara Pra-Observasi
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            Lembar Perencanaan & Kesepakatan Pra-Observasi Kelas
          </h2>
          <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
            Wawancara awal antara Pengawas Pembina dan Guru untuk mengidentifikasi fokus pengembangan, kesiapan peserta didik, strategi pembelajaran, dan jadwal pelaksanaan observasi kelas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutoFillDefault}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg transition-all self-start md:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Isi Draf Contoh Pra-Observasi</span>
        </button>
      </div>

      {/* Form Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Jadwal & Waktu Observasi */}
        <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-3">
          <h3 className="text-xs font-black uppercase text-indigo-900 tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" /> Kesepakatan Waktu & Lokasi Observasi Kelas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Wawancara Pra-Observasi</label>
              <input
                type="date"
                value={praObservasi.interviewDate || ''}
                onChange={(e) => setPraObservasi({ ...praObservasi, interviewDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rencana Tanggal Observasi Kelas</label>
              <input
                type="date"
                value={identity.observationDate || ''}
                onChange={(e) => setIdentity({ ...identity, observationDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jam Pelajaran / Kelas Sasaran</label>
              <input
                type="text"
                placeholder="Contoh: Jam ke 1-2 (07.30 - 08.50 WIB) di Kelas VII-B"
                value={identity.observationClassTime || ''}
                onChange={(e) => setIdentity({ ...identity, observationClassTime: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>
          </div>
        </div>

        {/* 6 Pertanyaan Wawancara Pra-Observasi */}
        <div className="space-y-5 text-xs sm:text-sm">
          {/* 1. Topik & Materi */}
          <div>
            <label className="block font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">1</span>
              Topik / Materi Pokok Pembelajaran yang akan Diobservasi:
            </label>
            <input
              type="text"
              placeholder="Contoh: Interaksi Makhluk Hidup & Dampak Polusi Lingkungan"
              value={praObservasi.topic}
              onChange={(e) => setPraObservasi({ ...praObservasi, topic: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* 2. Tujuan Pembelajaran */}
          <div>
            <label className="block font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">2</span>
              Tujuan Pembelajaran yang Ingin Dicapai (Memuat KKO, Literasi & Numerasi):
            </label>
            <textarea
              rows={2}
              placeholder="Tuliskan tujuan pembelajaran spesifik yang ingin dicapai pada sesi pembelajaran ini..."
              value={praObservasi.learningGoals}
              onChange={(e) => setPraObservasi({ ...praObservasi, learningGoals: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* 3. Fokus Pengembangan */}
          <div>
            <label className="block font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">3</span>
              Area / Fokus Pengembangan yang Ingin Diobservasi:
            </label>
            <p className="text-[11px] text-slate-500 mb-1.5">
              (Misal: Penerapan alur Pembelajaran Mendalam, Penguatan Literasi Teks Multimoda, Pengolahan Data Numerasi, Diferensiasi Kesiapan Belajar, atau Manajemen Waktu Diskusi).
            </p>
            <textarea
              rows={2}
              placeholder="Tuliskan fokus aspek yang menjadi target pengamatan utama pengawas..."
              value={praObservasi.fokusPengembangan}
              onChange={(e) => setPraObservasi({ ...praObservasi, fokusPengembangan: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* 4. Strategi & Media */}
          <div>
            <label className="block font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">4</span>
              Strategi, Model Pembelajaran & Media yang Dipersiapkan Guru:
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Model PBL, Media Video Kontekstual, LKPD Berbasis Data, Instrumen Rubrik Formatif..."
              value={praObservasi.strategiMedia}
              onChange={(e) => setPraObservasi({ ...praObservasi, strategiMedia: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* 5. Kesiapan Siswa & Potensi Kendala */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">5</span>
                Kesiapan Peserta Didik & Keberagaman:
              </label>
              <textarea
                rows={2}
                placeholder="Deskripsikan kondisi awal kesiapan murid, minat, atau kebutuhan khusus..."
                value={praObservasi.kesiapanSiswa}
                onChange={(e) => setPraObservasi({ ...praObservasi, kesiapanSiswa: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">6</span>
                Potensi Kendala & Alternatif Solusi:
              </label>
              <textarea
                rows={2}
                placeholder="Tantangan yang mungkin muncul saat mengajar dan cara antisipasinya..."
                value={praObservasi.potensiKendala}
                onChange={(e) => setPraObservasi({ ...praObservasi, potensiKendala: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 7. Catatan Pengawas / Kesepakatan */}
          <div className="pt-2">
            <label className="block font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              Catatan Kesepakatan Pra-Observasi Pengawas Pembina:
            </label>
            <textarea
              rows={3}
              placeholder="Catatan pengawas mengenai kesiapan guru dan poin-poin yang disepakati untuk diobservasi..."
              value={praObservasi.catatanPraObservasi}
              onChange={(e) => setPraObservasi({ ...praObservasi, catatanPraObservasi: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-indigo-50/40 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
