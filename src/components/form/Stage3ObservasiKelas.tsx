import React from 'react';
import { ScoreValue } from '../../types';
import {
  OBSERVASI_INDICATORS,
  OBSERVASI_SECTION_INFO,
  calculateObservasiScores,
  createDefaultObservasiScores,
} from '../../data/instrumentData';
import {
  Award,
  CheckCircle2,
  Sliders,
  Sparkles,
  MessageSquare,
  BookOpen,
  Info,
  Check,
} from 'lucide-react';

interface Stage3ObservasiKelasProps {
  scores: Record<number, ScoreValue>;
  setScores: React.Dispatch<React.SetStateAction<Record<number, ScoreValue>>>;
  comments: Record<number, string>;
  setComments: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

export const Stage3ObservasiKelas: React.FC<Stage3ObservasiKelasProps> = ({
  scores,
  setScores,
  comments,
  setComments,
}) => {
  const calculated = calculateObservasiScores(scores);

  const handleScoreChange = (id: number, val: ScoreValue) => {
    setScores((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const handleCommentChange = (id: number, val: string) => {
    setComments((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const setAllScores = (val: ScoreValue) => {
    setScores(createDefaultObservasiScores(val));
  };

  const handleAutoFillSampleComments = () => {
    const sampleComments: Record<number, string> = {
      1: 'Apersepsi dan pengkondisian awal belajar berlangsung komunikatif; kehadiran dan kesiapan murid diperiksa serta guru menyampaikan tujuan belajar dengan jelas.',
      2: 'Guru menayangkan video isu kontekstual terkini yang memicu kesadaran murid akan manfaat nyata materi dalam kehidupan sehari-hari.',
      3: 'Pertanyaan esensial yang diajukan guru mampu membangkitkan rasa ingin tahu dan merangsang murid menyampaikan hipotesis awal.',
      4: 'Tujuan pembelajaran dan target penguatan literasi-numerasi disampaikan dengan bahasa yang mudah dipahami murid.',
      5: 'Rencana kerja kelompok, pembagian peran, dan rubrik asesmen dijelaskan secara terstruktur sebelum aktivitas dimulai.',
      6: 'Murid sangat aktif bertanya, berdiskusi, dan mencari rujukan informasi dari berbagai sumber belajar yang disediakan.',
      7: 'Lingkungan belajar ramah anak; murid mengakses bahan bacaan artikel, grafik infografik, dan media digital secara aktif.',
      8: 'Guru membimbing murid mengonstruksi konsep baru dengan mengaitkan pengetahuan sebelumnya serta fenomena lingkungan riil.',
      9: 'Diskusi kelompok berjalan demokratis; nilai integritas, saling menghargai pendapat, dan karakter positif terpupuk dengan baik.',
      10: 'Murid mempraktikkan konsep untuk menyelesaikan studi kasus nyata pada Lembar Kerja Peserta Didik (LKPD).',
      11: 'Kelompok murid mampu mengajukan ide-ide kreatif dan solusi alternatif dalam menyelesaikan permasalahan yang diberikan.',
      12: 'Refleksi penutup terlaksana dengan baik; murid menarik simpulan secara mandiri dan menuliskan kesan belajar.',
      13: 'Guru memberikan penguatan, apresiasi positif kepada kelompok teraktif, dan umpan balik konstruktif atas capaian belajar.',
      14: 'Rencana materi pertemuan berikutnya dan tugas pengembangan diri berbasis literasi-numerasi disampaikan dengan jelas.',
    };
    setComments(sampleComments);
    setScores({
      1: 4, 2: 4, 3: 4, 4: 4, 5: 4,
      6: 4, 7: 4, 8: 4, 9: 4, 10: 4, 11: 3,
      12: 4, 13: 4, 14: 3,
    });
  };

  const getPredicateBadgeClass = (pred: 'A' | 'B' | 'C' | 'D') => {
    switch (pred) {
      case 'A':
        return 'bg-emerald-600 text-white font-extrabold';
      case 'B':
        return 'bg-blue-600 text-white font-extrabold';
      case 'C':
        return 'bg-amber-600 text-white font-extrabold';
      case 'D':
        return 'bg-rose-600 text-white font-extrabold';
    }
  };

  const getRatingText = (val: number) => {
    switch (val) {
      case 4:
        return 'Amat Baik (4)';
      case 3:
        return 'Baik (3)';
      case 2:
        return 'Cukup (2)';
      case 1:
        return 'Kurang (1)';
      default:
        return '-';
    }
  };

  // Group indicators by Section: A (1-5), B (6-11), C (12-14)
  const sections = [
    {
      key: 'A',
      title: 'A. KEGIATAN PENDAHULUAN',
      subtitle: 'Indikator 1 s.d. 5 (Skor Maksimal: 20)',
      indicators: OBSERVASI_INDICATORS.filter((i) => i.section === 'A'),
      subScore: calculated.observasiScoreA,
      max: 20,
    },
    {
      key: 'B',
      title: 'B. KEGIATAN INTI',
      subtitle: 'Indikator 6 s.d. 11 (Skor Maksimal: 24) • Memahami & Mengaplikasi',
      indicators: OBSERVASI_INDICATORS.filter((i) => i.section === 'B'),
      subScore: calculated.observasiScoreB,
      max: 24,
    },
    {
      key: 'C',
      title: 'C. KEGIATAN PENUTUP',
      subtitle: 'Indikator 12 s.d. 14 (Skor Maksimal: 12) • Refleksi, Umpan Balik & Tindak Lanjut',
      indicators: OBSERVASI_INDICATORS.filter((i) => i.section === 'C'),
      subScore: calculated.observasiScoreC,
      max: 12,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-md border border-indigo-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-200 text-xs font-bold rounded-full mb-1.5 border border-blue-400/30">
            <Award className="w-3.5 h-3.5 text-amber-300" /> Tahap 3: Pelaksanaan Pembelajaran di Kelas
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            Instrumen Observasi Kelas (14 Indikator Resmi)
          </h2>
          <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
            Pengamatan langsung proses pembelajaran mendalam berorientasi pada peserta didik. Berikan skor (1-4) dan tuliskan catatan observasi / komentar kritis pada setiap indikator.
          </p>
        </div>

        {/* Live Score Summary Badge */}
        <div className="bg-slate-900/90 text-white p-3.5 px-5 rounded-2xl flex items-center gap-4 shadow-lg border border-slate-700 self-start md:self-auto">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Skor Observasi</div>
            <div className="text-2xl font-black text-amber-400 font-mono leading-tight">
              {calculated.observasiFinalScore}{' '}
              <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Total: {calculated.observasiTotalScore} / 56
            </div>
          </div>
          <div className="border-l border-slate-700 pl-4">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Predikat</div>
            <span
              className={`inline-block px-3 py-0.5 rounded-full text-xs mt-0.5 font-bold ${getPredicateBadgeClass(
                calculated.observasiPredicate
              )}`}
            >
              {calculated.observasiPredicate} - {calculated.observasiPredicateLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Score Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-600" /> Aksi Cepat Skor Observasi:
          </span>
          <button
            type="button"
            onClick={() => setAllScores(4)}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg font-bold transition-all cursor-pointer"
          >
            Set Semua 4 (Amat Baik)
          </button>
          <button
            type="button"
            onClick={() => setAllScores(3)}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-lg font-bold transition-all cursor-pointer"
          >
            Set Semua 3 (Baik)
          </button>
          <button
            type="button"
            onClick={() => setAllScores(2)}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-lg font-bold transition-all cursor-pointer"
          >
            Set Semua 2 (Cukup)
          </button>
        </div>

        <button
          type="button"
          onClick={handleAutoFillSampleComments}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-bold transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Isi Draf Contoh Catatan Observasi</span>
        </button>
      </div>

      {/* 3 SECTIONS: A. PENDAHULUAN, B. INTI, C. PENUTUP */}
      <div className="space-y-6">
        {sections.map((sec) => (
          <div
            key={sec.key}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold tracking-wide text-white">
                  {sec.title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">{sec.subtitle}</p>
              </div>

              <div className="bg-slate-800 px-4 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2 self-start sm:self-auto">
                <span className="text-slate-400">Subtotal:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {sec.subScore} / {sec.max}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({((sec.subScore / sec.max) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>

            {/* List of Indicators in this section */}
            <div className="p-4 sm:p-6 divide-y divide-slate-100 space-y-6">
              {sec.indicators.map((ind) => {
                const currentScore = scores[ind.id] || 3;
                const currentComment = comments[ind.id] || '';

                return (
                  <div key={ind.id} className="pt-6 first:pt-0 space-y-3">
                    {/* Indicator Header & Description */}
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                        {ind.id}
                      </span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 text-sm sm:text-base">
                          {ind.description}
                        </div>
                      </div>
                    </div>

                    {/* Score Buttons (1, 2, 3, 4) */}
                    <div className="pl-0 sm:pl-11 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[1, 2, 3, 4].map((scoreVal) => {
                        const isSelected = currentScore === scoreVal;
                        let colorClasses = '';

                        if (isSelected) {
                          if (scoreVal === 4) colorClasses = 'bg-emerald-600 text-white ring-2 ring-emerald-400 font-extrabold shadow-md';
                          else if (scoreVal === 3) colorClasses = 'bg-blue-600 text-white ring-2 ring-blue-400 font-extrabold shadow-md';
                          else if (scoreVal === 2) colorClasses = 'bg-amber-500 text-white ring-2 ring-amber-400 font-extrabold shadow-md';
                          else colorClasses = 'bg-rose-600 text-white ring-2 ring-rose-400 font-extrabold shadow-md';
                        } else {
                          colorClasses = 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200';
                        }

                        return (
                          <button
                            key={scoreVal}
                            type="button"
                            onClick={() => handleScoreChange(ind.id, scoreVal as ScoreValue)}
                            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${colorClasses}`}
                          >
                            <span className="font-mono text-base font-black">{scoreVal}</span>
                            <span className="text-[11px] truncate">
                              {scoreVal === 4
                                ? 'Amat Baik'
                                : scoreVal === 3
                                ? 'Baik'
                                : scoreVal === 2
                                ? 'Cukup'
                                : 'Kurang'}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Critical Comments / Catatan Observasi input */}
                    <div className="pl-0 sm:pl-11">
                      <div className="relative">
                        <textarea
                          rows={2}
                          placeholder="Komentar Kritis / Catatan Observasi untuk indikator ini..."
                          value={currentComment}
                          onChange={(e) => handleCommentChange(ind.id, e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-400 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
