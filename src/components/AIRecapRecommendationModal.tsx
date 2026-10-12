import React, { useState } from 'react';
import {
  Sparkles,
  X,
  FileText,
  Copy,
  Check,
  Loader2,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  BookmarkPlus,
  Building2,
} from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';
import { RPPEvaluation } from '../types';
import { formatDateIndonesian } from '../utils/exportUtils';

interface AIRecapRecommendationModalProps {
  evaluations: RPPEvaluation[];
  isOpen: boolean;
  onClose: () => void;
}

interface AIAnalysisResult {
  ringkasanEksekutif: string;
  kelebihanKolektif: string;
  halDitingkatkanKolektif: string;
  rekomendasiPerbaikan: string;
  rencanaTindakLanjut: string;
}

export const AIRecapRecommendationModal: React.FC<AIRecapRecommendationModalProps> = ({
  evaluations,
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/analyze-recap-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ evaluations }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Gagal menganalisis rekomendasi AI.');
      }

      setResult(data.data);
    } catch (err: any) {
      console.error('AI Recap Error:', err);
      setError(err.message || 'Terjadi kesalahan saat menghubungkan ke AI Gemini.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    if (!result) return;
    const textToCopy = `REKAPAN ANALISIS REKOMENDASI AI PENGAWAS
DINAS PENDIDIKAN KOTA DEPOK
Pengawas Pembina: Tati Maryati, S.Pd., M.Pd.
Tanggal: Depok, ${formatDateIndonesian(new Date().toISOString())}

1. RINGKASAN EKSEKUTIF
${result.ringkasanEksekutif}

2. KELEBIHAN KOLEKTIF RPP
${result.kelebihanKolektif}

3. HAL YANG PERLU DITINGKATKAN
${result.halDitingkatkanKolektif}

4. REKOMENDASI PERBAIKAN PENGAWAS
${result.rekomendasiPerbaikan}

5. RENCANA TINDAK LANJUT
${result.rencanaTindakLanjut}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportWord = async () => {
    if (!result) return;

    const formattedDate = formatDateIndonesian(new Date().toISOString());
    const fileName = `Rekapan_Rekomendasi_AI_Pengawas_Depok_${new Date().toISOString().slice(0, 10)}.docx`;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'DINAS PENDIDIKAN KOTA DEPOK',
                  bold: true,
                  size: 22,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'REKAPAN ANALISIS REKOMENDASI SUPERVISI AI PENGAWAS PEMBINA',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'TELAAH RPP / MODUL AJAR PERENCANAAN PEMBELAJARAN MENDALAM (PM)',
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            new Paragraph({ text: '' }),

            // Executive Summary
            new Paragraph({
              children: [new TextRun({ text: 'I. RINGKASAN EKSEKUTIF SUPERVISI', bold: true, size: 20 })],
            }),
            new Paragraph({ text: result.ringkasanEksekutif }),
            new Paragraph({ text: '' }),

            // Strengths
            new Paragraph({
              children: [new TextRun({ text: 'II. KELEBIHAN KOLEKTIF PERENCANAAN PEMBELAJARAN', bold: true, size: 20 })],
            }),
            new Paragraph({ text: result.kelebihanKolektif }),
            new Paragraph({ text: '' }),

            // Areas to improve
            new Paragraph({
              children: [new TextRun({ text: 'III. HAL-HAL YANG PERLU DITINGKATKAN', bold: true, size: 20 })],
            }),
            new Paragraph({ text: result.halDitingkatkanKolektif }),
            new Paragraph({ text: '' }),

            // Recommendations
            new Paragraph({
              children: [new TextRun({ text: 'IV. REKOMENDASI PERBAIKAN STRATEGIS PENGAWAS', bold: true, size: 20 })],
            }),
            new Paragraph({ text: result.rekomendasiPerbaikan }),
            new Paragraph({ text: '' }),

            // Follow-up Plan
            new Paragraph({
              children: [new TextRun({ text: 'V. RENCANA TINDAK LANJUT SUPERVISI AKADEMIK', bold: true, size: 20 })],
            }),
            new Paragraph({ text: result.rencanaTindakLanjut }),
            new Paragraph({ text: '' }),
            new Paragraph({ text: '' }),

            // Signature
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [new Paragraph({ text: '' })],
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({ children: [new TextRun({ text: `Depok, ${formattedDate}` })] }),
                        new Paragraph({ children: [new TextRun({ text: 'Penelaah / Pengawas Pembina,' })] }),
                        new Paragraph({ text: '' }),
                        new Paragraph({ text: '' }),
                        new Paragraph({ text: '' }),
                        new Paragraph({ children: [new TextRun({ text: 'Tati Maryati, S.Pd., M.Pd.', bold: true, underline: {} })] }),
                        new Paragraph({ children: [new TextRun({ text: 'NIP. 197811082006042014' })] }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-700/60 rounded-2xl border border-indigo-400/30">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">
                Analisis Rekomendasi AI Pengawas Pembina
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Sintesis Otomatis Kelebihan, Hal Ditingkatkan, Rekomendasi & Tindak Lanjut RPP (Kota Depok)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {!result && !loading && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Generate Analisis Rekomendasi AI Supervisi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  AI Gemini akan menganalisis seluruh data dari <strong>{evaluations.length} RPP guru</strong> untuk merumuskan kelebihan kolektif, hal yang perlu ditingkatkan, rekomendasi perbaikan, serta rencana tindak lanjut pengawas.
                </p>
              </div>
              <button
                onClick={handleRunAnalysis}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Mulai Analisis Rekomendasi AI</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Menganalisis Rekapan & Merumuskan Rekomendasi...
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  AI Gemini sedang mengevaluasi data {evaluations.length} RPP guru. Mohon tunggu sebentar.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-red-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Gagal Menganalisis</div>
                <div>{error}</div>
                <button
                  onClick={handleRunAnalysis}
                  className="mt-2 text-xs font-bold text-red-700 underline hover:text-red-900"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Pengawas Pembina SMP Kota Depok</div>
                    <div className="text-sm font-extrabold text-slate-900">Tati Maryati, S.Pd., M.Pd.</div>
                    <div className="text-[11px] text-slate-500 font-mono">NIP. 197811082006042014</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Tanggal Analisis</div>
                  <div className="text-xs font-bold text-indigo-900">
                    Depok, {formatDateIndonesian(new Date().toISOString())}
                  </div>
                </div>
              </div>

              {/* 1. Ringkasan Eksekutif */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm border-b border-slate-100 pb-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>1. RINGKASAN EKSEKUTIF SUPERVISI RPP</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {result.ringkasanEksekutif}
                </p>
              </div>

              {/* 2. Kelebihan Kolektif */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm border-b border-emerald-100 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>2. KELEBIHAN KOLEKTIF PERENCANAAN PEMBELAJARAN</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100">
                  {result.kelebihanKolektif}
                </p>
              </div>

              {/* 3. Hal yang Perlu Ditingkatkan */}
              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm border-b border-amber-100 pb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>3. HAL-HAL YANG PERLU DITINGKATKAN</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-amber-50/40 p-3.5 rounded-xl border border-amber-100">
                  {result.halDitingkatkanKolektif}
                </p>
              </div>

              {/* 4. Rekomendasi Perbaikan */}
              <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm border-b border-indigo-100 pb-2">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  <span>4. REKOMENDASI PERBAIKAN STRATEGIS PENGAWAS</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100">
                  {result.rekomendasiPerbaikan}
                </p>
              </div>

              {/* 5. Rencana Tindak Lanjut */}
              <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm border-b border-blue-100 pb-2">
                  <BookmarkPlus className="w-4 h-4 text-blue-600" />
                  <span>5. RENCANA TINDAK LANJUT SUPERVISI AKADEMIK</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-blue-50/40 p-3.5 rounded-xl border border-blue-100">
                  {result.rencanaTindakLanjut}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Toolbar */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Pengawas Pembina: <strong>Tati Maryati, S.Pd., M.Pd.</strong>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {result && (
              <>
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                </button>

                <button
                  onClick={handleExportWord}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-blue-600/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen Word (.docx)</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
