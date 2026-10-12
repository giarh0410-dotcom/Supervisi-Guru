import React, { useState } from 'react';
import {
  PascaObservasiData,
  ProgramTindakLanjutItem,
  TeacherIdentity,
  ScoreValue,
  PraObservasiData,
} from '../../types';
import { AddProgramModal } from './AddProgramModal';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileCheck,
  Award,
  ListTodo,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';

interface Stage4PascaObservasiProps {
  identity: TeacherIdentity;
  praObservasi: PraObservasiData;
  observasiScores: Record<number, ScoreValue>;
  observasiComments: Record<number, string>;
  rppFinalScore: number;
  observasiFinalScore: number;
  pascaObservasi: PascaObservasiData;
  setPascaObservasi: React.Dispatch<React.SetStateAction<PascaObservasiData>>;
}

export const Stage4PascaObservasi: React.FC<Stage4PascaObservasiProps> = ({
  identity,
  praObservasi,
  observasiScores,
  observasiComments,
  rppFinalScore,
  observasiFinalScore,
  pascaObservasi,
  setPascaObservasi,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramTindakLanjutItem | null>(null);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isRtlLoading, setIsRtlLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);

  // Run AI Analysis & Recommendation for Pasca-Observasi (Full Form)
  const handleRunAiAnalysis = async () => {
    setIsAiLoading(true);
    setAiError(null);
    setAiSuccess(null);

    try {
      const response = await fetch('/api/analyze-observasi-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity,
          praObservasi,
          observasiScores,
          observasiComments,
          rppFinalScore,
          observasiFinalScore,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Gagal menganalisis data observasi.');
      }

      const { data } = json;

      setPascaObservasi((prev) => ({
        ...prev,
        refleksiGuru: data.refleksiGuru || prev.refleksiGuru,
        kelebihanUtama: data.kelebihanUtama || prev.kelebihanUtama,
        halDitingkatkan: data.halDitingkatkan || prev.halDitingkatkan,
        kesimpulanSupervisi: data.kesimpulanSupervisi || prev.kesimpulanSupervisi,
        programTindakLanjut:
          Array.isArray(data.programTindakLanjut) && data.programTindakLanjut.length > 0
            ? data.programTindakLanjut
            : prev.programTindakLanjut,
      }));

      setAiSuccess(
        '✨ Berhasil meng-generate analisis pasca-observasi, evaluasi, refleksi, dan rekomendasi program tindak lanjut!'
      );
    } catch (err: any) {
      console.error('AI Pasca Observasi Error:', err);
      setAiError(err.message || 'Terjadi kesalahan saat memproses analisis AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Run AI Generation specifically for Matriks Program Rencana Tindak Lanjut (RTL)
  const handleGenerateRtlAi = async () => {
    setIsRtlLoading(true);
    setAiError(null);
    setAiSuccess(null);

    try {
      const response = await fetch('/api/generate-rtl-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity,
          praObservasi,
          observasiScores,
          observasiComments,
          rppFinalScore,
          observasiFinalScore,
          halDitingkatkan: pascaObservasi.halDitingkatkan,
          kelebihanUtama: pascaObservasi.kelebihanUtama,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Gagal membuat matriks program RTL.');
      }

      const programs: ProgramTindakLanjutItem[] = json.data || [];
      if (programs.length > 0) {
        setPascaObservasi((prev) => ({
          ...prev,
          programTindakLanjut: programs,
        }));
        setAiSuccess(
          `✨ Berhasil merumuskan ${programs.length} program dalam Matriks Rencana Tindak Lanjut (RTL) dengan bantuan AI!`
        );
      } else {
        throw new Error('Tidak ada program RTL yang dihasilkan.');
      }
    } catch (err: any) {
      console.error('AI RTL Error:', err);
      setAiError(err.message || 'Terjadi kesalahan saat merumuskan Matriks RTL.');
    } finally {
      setIsRtlLoading(false);
    }
  };

  const handleAddProgram = (newProg: ProgramTindakLanjutItem) => {
    setPascaObservasi((prev) => {
      const existing = prev.programTindakLanjut || [];
      const index = existing.findIndex((p) => p.id === newProg.id);
      if (index >= 0) {
        const updated = [...existing];
        updated[index] = newProg;
        return { ...prev, programTindakLanjut: updated };
      } else {
        return { ...prev, programTindakLanjut: [...existing, newProg] };
      }
    });
    setEditingProgram(null);
  };

  const handleDeleteProgram = (id: string) => {
    setPascaObservasi((prev) => ({
      ...prev,
      programTindakLanjut: (prev.programTindakLanjut || []).filter((p) => p.id !== id),
    }));
  };

  const handleOpenEdit = (prog: ProgramTindakLanjutItem) => {
    setEditingProgram(prog);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-md border border-indigo-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-200 text-xs font-bold rounded-full mb-1.5 border border-blue-400/30">
            <UserCheck className="w-3.5 h-3.5 text-amber-300" /> Tahap 4: Pasca Observasi & Tindak Lanjut
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            Evaluasi, Refleksi, dan Rencana Program Tindak Lanjut
          </h2>
          <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
            Sintesis hasil supervisi klinis: dialog refleksi bersama guru, penarikan kesimpulan kualitas pembelajaran, dan perumusan matriks program pembinaan berkelanjutan.
          </p>
        </div>

        {/* AI Assist Button */}
        <button
          type="button"
          onClick={handleRunAiAnalysis}
          disabled={isAiLoading}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 text-xs font-extrabold rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 self-start md:self-auto cursor-pointer"
        >
          {isAiLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>AI Sedang Menganalisis...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Bantu AI Analisis & Rekomendasi</span>
            </>
          )}
        </button>
      </div>

      {/* Notices */}
      {aiSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs sm:text-sm text-emerald-800 flex items-center gap-2.5">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{aiSuccess}</span>
        </div>
      )}

      {aiError && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs sm:text-sm text-rose-800 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{aiError}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Date of Post Interview */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-700 block">
              Tanggal Pertemuan Pasca Observasi (Feedback Session):
            </span>
            <span className="text-[11px] text-slate-500">
              Pertemuan pemberian umpan balik dan refleksi bersama Guru
            </span>
          </div>
          <input
            type="date"
            value={pascaObservasi.postInterviewDate || ''}
            onChange={(e) =>
              setPascaObservasi({ ...pascaObservasi, postInterviewDate: e.target.value })
            }
            className="px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-xs sm:text-sm"
          />
        </div>

        {/* 1. Refleksi Guru */}
        <div className="space-y-2">
          <label className="block font-bold text-slate-900 text-sm flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-indigo-600" />
            1. Refleksi Guru Setelah Mengajar:
          </label>
          <p className="text-xs text-slate-500">
            Ungkapan perasaan guru, apa yang sudah berjalan dengan sangat baik, kendala yang dihadapi selama pembelajaran di kelas, serta respon peserta didik.
          </p>
          <textarea
            rows={3}
            placeholder="Tuliskan poin-poin refleksi diri guru setelah pelaksanaan pembelajaran..."
            value={pascaObservasi.refleksiGuru}
            onChange={(e) =>
              setPascaObservasi({ ...pascaObservasi, refleksiGuru: e.target.value })
            }
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs sm:text-sm"
          />
        </div>

        {/* 3. Analisis Hasil & Rekomendasi Tindak Lanjut (EXACT FORMAT USER PROMPT) */}
        <div className="pt-4 border-t border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              3. Analisis Hasil & Rekomendasi Tindak Lanjut
            </h3>

            <button
              type="button"
              onClick={handleRunAiAnalysis}
              disabled={isAiLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-400/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Bantu AI Analisis & Rekomendasi</span>
            </button>
          </div>

          {/* Hal-hal Positive / Kelebihan Utama */}
          <div className="space-y-1.5">
            <label className="block font-bold text-emerald-950 text-xs sm:text-sm">
              Hal-hal Positif / Kelebihan Utama
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan praktik baik, penguasaan materi, atau inovasi yang ditunjukkan guru..."
              value={pascaObservasi.kelebihanUtama}
              onChange={(e) =>
                setPascaObservasi({ ...pascaObservasi, kelebihanUtama: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-emerald-50/30 border border-emerald-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs sm:text-sm"
            />
          </div>

          {/* Hal yang Perlu Ditingkatkan */}
          <div className="space-y-1.5">
            <label className="block font-bold text-amber-950 text-xs sm:text-sm">
              Hal yang Perlu Ditingkatkan
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan aspek pembelajaran yang memerlukan pembinaan lebih lanjut..."
              value={pascaObservasi.halDitingkatkan}
              onChange={(e) =>
                setPascaObservasi({ ...pascaObservasi, halDitingkatkan: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-amber-50/30 border border-amber-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs sm:text-sm"
            />
          </div>

          {/* Catatan Umum Pengawas / Kesimpulan Supervisi */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-900 text-xs sm:text-sm">
              Catatan Umum Pengawas / Kesimpulan Supervisi
            </label>
            <textarea
              rows={3}
              placeholder="Kesimpulan umum pengawas mengenai kualitas proses pembelajaran..."
              value={pascaObservasi.kesimpulanSupervisi}
              onChange={(e) =>
                setPascaObservasi({ ...pascaObservasi, kesimpulanSupervisi: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs sm:text-sm"
            />
          </div>

          {/* Program & Rekomendasi Tindak Lanjut (count) */}
          <div className="pt-3 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block font-extrabold text-indigo-950 text-xs sm:text-sm">
                  Matriks Program Rencana Tindak Lanjut ({pascaObservasi.programTindakLanjut?.length || 0})
                </label>
                <p className="text-[11px] text-slate-500">
                  Matriks rencana aksi nyata dan program pembinaan guru pasca observasi
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateRtlAi}
                  disabled={isRtlLoading || isAiLoading}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 rounded-xl font-bold text-xs shadow-md shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
                  title="Generate Matriks Program Tindak Lanjut terstruktur berbasis AI"
                >
                  {isRtlLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      <span>Menyusun RTL...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>Bantu AI Matriks RTL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProgram(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Program</span>
                </button>
              </div>
            </div>

            {/* If 0 programs */}
            {(!pascaObservasi.programTindakLanjut || pascaObservasi.programTindakLanjut.length === 0) && (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-3 bg-slate-50/50">
                <ListTodo className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
                  Belum ada program tindak lanjut. Klik <strong>"Bantu AI Matriks RTL"</strong> untuk merumuskan program pembinaan otomatis, atau <strong>"Tambah Program"</strong> manual.
                </p>
                <div className="flex justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleGenerateRtlAi}
                    disabled={isRtlLoading || isAiLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Matriks RTL Otomatis dengan AI</span>
                  </button>
                </div>
              </div>
            )}

            {/* List of Programs */}
            {pascaObservasi.programTindakLanjut && pascaObservasi.programTindakLanjut.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pascaObservasi.programTindakLanjut.map((prog, idx) => (
                  <div
                    key={prog.id || idx}
                    className="p-4 bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl shadow-xs space-y-2.5 transition-all text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[11px]">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">
                          {prog.namaProgram}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(prog)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Program"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProgram(prog.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Program"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {prog.tujuan && (
                      <div className="text-slate-700">
                        <span className="font-semibold text-slate-500">Tujuan:</span> {prog.tujuan}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                      {prog.waktuPelaksanaan && (
                        <span>
                          <strong className="text-slate-700">Waktu:</strong> {prog.waktuPelaksanaan}
                        </span>
                      )}
                      {prog.penanggungJawab && (
                        <span>
                          <strong className="text-slate-700">Mitra/PJ:</strong> {prog.penanggungJawab}
                        </span>
                      )}
                    </div>

                    {prog.keterangan && (
                      <div className="text-[11px] bg-slate-50 p-2 rounded-xl text-slate-600 border border-slate-100">
                        <strong>Luaran:</strong> {prog.keterangan}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Program Modal */}
      <AddProgramModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProgram(null);
        }}
        onSave={handleAddProgram}
        editingProgram={editingProgram}
      />
    </div>
  );
};
