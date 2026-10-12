import * as XLSX from 'xlsx';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { RPPEvaluation } from '../types';
import { getAppSettings } from '../data/storage';
import {
  INDICATORS,
  OBSERVASI_INDICATORS,
  CREATOR_INFO,
} from '../data/instrumentData';

export function formatDateIndonesian(dateStr?: string): string {
  if (!dateStr) return '23 Agustus 2026';
  if (
    dateStr.includes('Agustus') ||
    dateStr.includes('Januari') ||
    dateStr.includes('Februari') ||
    dateStr.includes('Maret') ||
    dateStr.includes('April') ||
    dateStr.includes('Mei') ||
    dateStr.includes('Juni') ||
    dateStr.includes('Juli') ||
    dateStr.includes('September') ||
    dateStr.includes('Oktober') ||
    dateStr.includes('November') ||
    dateStr.includes('Desember')
  ) {
    return dateStr;
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function exportRecapToExcel(
  evaluations: RPPEvaluation[],
  fileName = 'Rekapan_Supervisi_Terpadu_Kota_Depok.xlsx'
) {
  // Build Main Summary Worksheet Data
  const summaryRows = evaluations.map((item, index) => ({
    'No': index + 1,
    'Nama Guru': item.identity.teacherName,
    'NIP/NUPTK': item.identity.nipNuptk || '-',
    'Mata Pelajaran': item.identity.subject,
    'Kelas/Fase': item.identity.gradeFase,
    'Satuan Pendidikan': item.identity.schoolName,
    'Unit Kerja': item.identity.unitKerja,
    'Judul RPP/Materi': item.identity.rppTitle,
    'Tgl Telaah RPP': item.identity.assessmentDate,
    'Tgl Observasi Kelas': item.identity.observationDate || item.identity.assessmentDate,

    // Nilai Kunci
    'Nilai Telaah RPP (0-100)': item.finalScore,
    'Predikat RPP': item.predicate,
    'Nilai Observasi Kelas (0-100)': item.observasiFinalScore,
    'Predikat Observasi': item.observasiPredicate,
    'SKOR AKHIR TERPADU (0-100)': item.combinedFinalScore,
    'PREDIKAT GABUNGAN': item.combinedPredicate,
    'KUALIFIKASI GABUNGAN': item.combinedPredicateLabel,

    // Pra & Pasca
    'Fokus Pra-Observasi': item.praObservasi?.fokusPengembangan || '-',
    'Refleksi Guru': item.pascaObservasi?.refleksiGuru || '-',
    'Kelebihan Utama': item.pascaObservasi?.kelebihanUtama || item.feedback?.kelebihan || '-',
    'Hal Perlu Ditingkatkan': item.pascaObservasi?.halDitingkatkan || item.feedback?.halDitingkatkan || '-',
    'Kesimpulan Supervisi': item.pascaObservasi?.kesimpulanSupervisi || '-',
    'Jumlah Program RTL': item.pascaObservasi?.programTindakLanjut?.length || 0,
    'Pengawas Pembina': item.identity.penelaahName || getAppSettings().pengawasName,
  }));

  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  summarySheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 26 }, // Nama Guru
    { wch: 20 }, // NIP
    { wch: 20 }, // Mapel
    { wch: 15 }, // Kelas
    { wch: 24 }, // Sekolah
    { wch: 26 }, // Unit Kerja
    { wch: 30 }, // Judul
    { wch: 14 }, // Tgl RPP
    { wch: 14 }, // Tgl Obs
    { wch: 14 }, // Nilai RPP
    { wch: 10 }, // Pred RPP
    { wch: 14 }, // Nilai Obs
    { wch: 10 }, // Pred Obs
    { wch: 16 }, // Skor Terpadu
    { wch: 12 }, // Pred Terpadu
    { wch: 22 }, // Label Terpadu
    { wch: 35 }, // Fokus Pra
    { wch: 35 }, // Refleksi
    { wch: 40 }, // Kelebihan
    { wch: 40 }, // Hal Ditingkatkan
    { wch: 40 }, // Kesimpulan
    { wch: 10 }, // Jumlah RTL
    { wch: 25 }, // Pengawas
  ];

  // Build Observasi 14 Indikator Detail Sheet
  const obsDetailRows = evaluations.map((item, index) => {
    const row: Record<string, any> = {
      'No': index + 1,
      'Nama Guru': item.identity.teacherName,
      'Mata Pelajaran': item.identity.subject,
      'Satuan Pendidikan': item.identity.schoolName,
      'Nilai Observasi': item.observasiFinalScore,
      'Predikat Observasi': item.observasiPredicate,
    };
    OBSERVASI_INDICATORS.forEach((ind) => {
      row[`Ind_${ind.id}`] = item.observasiScores?.[ind.id] || 0;
      row[`Catatan_${ind.id}`] = item.observasiComments?.[ind.id] || '';
    });
    return row;
  });

  const obsDetailSheet = XLSX.utils.json_to_sheet(obsDetailRows);

  // Build RPP 42 Indikator Detail Sheet
  const rppDetailRows = evaluations.map((item, index) => {
    const row: Record<string, any> = {
      'No': index + 1,
      'Nama Guru': item.identity.teacherName,
      'Mata Pelajaran': item.identity.subject,
      'Satuan Pendidikan': item.identity.schoolName,
      'Nilai RPP': item.finalScore,
      'Predikat RPP': item.predicate,
    };
    INDICATORS.forEach((ind) => {
      row[`RPP_${ind.id}`] = item.scores?.[ind.id] || 0;
    });
    return row;
  });

  const rppDetailSheet = XLSX.utils.json_to_sheet(rppDetailRows);

  // Create workbook and append sheets
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Rekapan_Supervisi_Terpadu');
  XLSX.utils.book_append_sheet(workbook, obsDetailSheet, 'Observasi_14_Indikator');
  XLSX.utils.book_append_sheet(workbook, rppDetailSheet, 'Telaah_RPP_42_Indikator');

  XLSX.writeFile(workbook, fileName);
}

export function exportSingleEvaluationToExcel(item: RPPEvaluation) {
  const fileName = `Rapor_Supervisi_Terpadu_${item.identity.teacherName.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;

  // Sheet 1: Executive Summary
  const summaryRows = [
    { Field: 'LAPORAN HASIL SIKLUS SUPERVISI KLINIS TERPADU (4 TAHAP)', Value: '' },
    { Field: 'DINAS PENDIDIKAN KOTA DEPOK', Value: '' },
    { Field: 'Pengawas Pembina: Tati Maryati, S.Pd., M.Pd. (NIP. 197811082006042014)', Value: '' },
    { Field: '', Value: '' },
    { Field: '=== IDENTITAS GURU & SATUAN PENDIDIKAN ===', Value: '' },
    { Field: 'Nama Guru', Value: item.identity.teacherName },
    { Field: 'NIP / NUPTK', Value: item.identity.nipNuptk || '-' },
    { Field: 'Mata Pelajaran', Value: item.identity.subject },
    { Field: 'Kelas / Fase', Value: item.identity.gradeFase },
    { Field: 'Satuan Pendidikan', Value: item.identity.schoolName },
    { Field: 'Unit Kerja', Value: item.identity.unitKerja },
    { Field: 'Judul Modul Ajar / Topik', Value: item.identity.rppTitle },
    { Field: 'Tanggal Telaah RPP', Value: item.identity.assessmentDate },
    { Field: 'Tanggal Observasi Kelas', Value: item.identity.observationDate || item.identity.assessmentDate },
    { Field: '', Value: '' },
    { Field: '=== REKAPITULASI HASIL SIKLUS SUPERVISI ===', Value: '' },
    { Field: '1. Nilai Telaah RPP (42 Indikator)', Value: `${item.finalScore} / 100 (Predikat: ${item.predicate} - ${item.predicateLabel})` },
    { Field: '2. Nilai Observasi Kelas (14 Indikator)', Value: `${item.observasiFinalScore} / 100 (Predikat: ${item.observasiPredicate} - ${item.observasiPredicateLabel})` },
    { Field: '3. SKOR AKHIR TERPADU GABUNGAN', Value: `${item.combinedFinalScore} / 100` },
    { Field: 'PREDIKAT GABUNGAN', Value: `${item.combinedPredicate} - ${item.combinedPredicateLabel}` },
    { Field: '', Value: '' },
    { Field: '=== HASIL EVALUASI & TINDAK LANJUT ===', Value: '' },
    { Field: 'Refleksi Diri Guru', Value: item.pascaObservasi?.refleksiGuru || '-' },
    { Field: 'Hal-hal Positif / Kelebihan Utama', Value: item.pascaObservasi?.kelebihanUtama || item.feedback?.kelebihan || '-' },
    { Field: 'Hal yang Perlu Ditingkatkan', Value: item.pascaObservasi?.halDitingkatkan || item.feedback?.halDitingkatkan || '-' },
    { Field: 'Catatan Umum / Kesimpulan Supervisi', Value: item.pascaObservasi?.kesimpulanSupervisi || '-' },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  summarySheet['!cols'] = [{ wch: 45 }, { wch: 65 }];

  // Sheet 2: 14 Observasi Indicators Detail
  const obsRows = OBSERVASI_INDICATORS.map((ind) => ({
    'No': ind.id,
    'Bagian': ind.sectionTitle,
    'Indikator Observasi': ind.description,
    'Skor (1-4)': item.observasiScores?.[ind.id] || 0,
    'Kriteria':
      (item.observasiScores?.[ind.id] || 0) === 4
        ? 'Amat Baik'
        : (item.observasiScores?.[ind.id] || 0) === 3
        ? 'Baik'
        : (item.observasiScores?.[ind.id] || 0) === 2
        ? 'Cukup'
        : 'Kurang',
    'Komentar Kritis / Catatan Observasi': item.observasiComments?.[ind.id] || '-',
  }));
  const obsSheet = XLSX.utils.json_to_sheet(obsRows);
  obsSheet['!cols'] = [{ wch: 6 }, { wch: 28 }, { wch: 70 }, { wch: 12 }, { wch: 14 }, { wch: 60 }];

  // Sheet 3: Program Tindak Lanjut Table
  const rtlRows = (item.pascaObservasi?.programTindakLanjut || []).map((prog, idx) => ({
    'No': idx + 1,
    'Nama Program / Kegiatan': prog.namaProgram,
    'Tujuan Capaian': prog.tujuan,
    'Waktu Pelaksanaan': prog.waktuPelaksanaan,
    'Penanggung Jawab / Mitra': prog.penanggungJawab,
    'Keterangan / Luaran': prog.keterangan,
  }));
  const rtlSheet = XLSX.utils.json_to_sheet(rtlRows);
  rtlSheet['!cols'] = [{ wch: 6 }, { wch: 40 }, { wch: 45 }, { wch: 22 }, { wch: 25 }, { wch: 40 }];

  // Sheet 4: RPP 42 Indicators Detail
  const rppRows = INDICATORS.map((ind) => ({
    'No': ind.id,
    'Bagian': ind.sectionTitle,
    'Indikator RPP': ind.text,
    'Skor (1-4)': item.scores?.[ind.id] || 0,
  }));
  const rppSheet = XLSX.utils.json_to_sheet(rppRows);
  rppSheet['!cols'] = [{ wch: 6 }, { wch: 32 }, { wch: 70 }, { wch: 12 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Rangkuman_Supervisi');
  XLSX.utils.book_append_sheet(workbook, obsSheet, 'Observasi_14_Indikator');
  XLSX.utils.book_append_sheet(workbook, rtlSheet, 'Program_Tindak_Lanjut');
  XLSX.utils.book_append_sheet(workbook, rppSheet, 'Telaah_RPP_42_Indikator');

  XLSX.writeFile(workbook, fileName);
}

export function printPDFReport() {
  window.print();
}

export async function exportRecapToWord(
  evaluations: RPPEvaluation[],
  fileName = 'Laporan_Rekapitulasi_Supervisi_Terpadu_Kota_Depok.docx'
) {
  const currentDate = formatDateIndonesian(new Date().toISOString().split('T')[0]);
  const totalCount = evaluations.length;
  const avgRpp = totalCount > 0
    ? (evaluations.reduce((acc, curr) => acc + curr.finalScore, 0) / totalCount).toFixed(1)
    : '0';
  const avgObs = totalCount > 0
    ? (evaluations.reduce((acc, curr) => acc + (curr.observasiFinalScore || 85), 0) / totalCount).toFixed(1)
    : '0';
  const avgCombined = totalCount > 0
    ? (evaluations.reduce((acc, curr) => acc + (curr.combinedFinalScore || curr.finalScore), 0) / totalCount).toFixed(1)
    : '0';

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Kop Surat Rekapan
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'PEMERINTAH KOTA DEPOK • DINAS PENDIDIKAN',
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'LAPORAN REKAPITULASI HASIL SUPERVISI KLINIS TERPADU (PM)',
                bold: true,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'PEMBELAJARAN MENDALAM TERINTEGRASI LITERASI & NUMERASI SMP KOTA DEPOK',
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Pengawas Pembina: Tati Maryati, S.Pd., M.Pd.',
                italics: true,
                size: 18,
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Ringkasan Statistik
          new Paragraph({
            children: [
              new TextRun({
                text: 'I. RINGKASAN CAPAIAN SUPERVISI KOLEKTIF',
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Parameter', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nilai Rata-rata / Keterangan', bold: true })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Jumlah Guru Disupervisi' })] }),
                  new TableCell({ children: [new Paragraph({ text: `${totalCount} Orang Guru` })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Rata-rata Nilai Telaah RPP' })] }),
                  new TableCell({ children: [new Paragraph({ text: `${avgRpp}%` })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Rata-rata Nilai Observasi Kelas' })] }),
                  new TableCell({ children: [new Paragraph({ text: `${avgObs}%` })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Rata-rata Skor Akhir Terpadu', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${avgCombined}%`, bold: true })] })] }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // Tabel Rekapan Guru
          new Paragraph({
            children: [
              new TextRun({
                text: 'II. DAFTAR HASIL SUPERVISI PER GURU BINAAN',
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'No', bold: true })] })], width: { size: 5, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nama Guru & NIP', bold: true })] })], width: { size: 28, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Sekolah & Mapel', bold: true })] })], width: { size: 27, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'RPP', bold: true })] })], width: { size: 12, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Obs', bold: true })] })], width: { size: 12, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Skor Akhir', bold: true })] })], width: { size: 16, type: WidthType.PERCENTAGE } }),
                ],
              }),
              ...evaluations.map((item, idx) => {
                return new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `${idx + 1}` })] }),
                    new TableCell({
                      children: [
                        new Paragraph({ children: [new TextRun({ text: item.identity.teacherName, bold: true })] }),
                        new Paragraph({ children: [new TextRun({ text: `NIP: ${item.identity.nipNuptk || '-'}`, size: 16 })] }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({ text: item.identity.schoolName }),
                        new Paragraph({ children: [new TextRun({ text: `${item.identity.subject} (${item.identity.gradeFase})`, size: 16 })] }),
                      ],
                    }),
                    new TableCell({ children: [new Paragraph({ text: `${item.finalScore}% (${item.predicate})` })] }),
                    new TableCell({ children: [new Paragraph({ text: `${item.observasiFinalScore || 85}% (${item.observasiPredicate || 'B'})` })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${item.combinedFinalScore || item.finalScore}% (${item.combinedPredicate || item.predicate})`, bold: true })] })] }),
                  ],
                });
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),

          // Blok Tanda Tangan Pengawas
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
                      new Paragraph({ children: [new TextRun({ text: `Depok, ${currentDate}` })] }),
                      new Paragraph({ children: [new TextRun({ text: 'Pengawas Pembina SMP Kota Depok,' })] }),
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
}

export async function exportSingleEvaluationToWord(item: RPPEvaluation) {
  const formattedDate = formatDateIndonesian(item.identity.assessmentDate);
  const formattedObsDate = formatDateIndonesian(
    item.identity.observationDate || item.identity.assessmentDate
  );
  const fileName = `Laporan_Supervisi_Terpadu_${item.identity.teacherName.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;

  const programs = item.pascaObservasi?.programTindakLanjut || [];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Kop Surat
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'PEMERINTAH KOTA DEPOK • DINAS PENDIDIKAN',
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'LAPORAN HASIL SIKLUS SUPERVISI KLINIS TERPADU PEMBELAJARAN MENDALAM (PM)',
                bold: true,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'TERINTEGRASI TELAAH RPP, PRA-OBSERVASI, OBSERVASI KELAS & PASCA-OBSERVASI',
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Pengawas Pembina SMP Kota Depok: Tati Maryati, S.Pd., M.Pd.',
                italics: true,
                size: 18,
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // I. IDENTITAS GURU
          new Paragraph({
            children: [
              new TextRun({
                text: 'I. IDENTITAS GURU & SATUAN PENDIDIKAN',
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nama Guru', bold: true })] })], width: { size: 30, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.identity.teacherName })] })], width: { size: 70, type: WidthType.PERCENTAGE } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'NIP / NUPTK', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.identity.nipNuptk || '-' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Mata Pelajaran', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.identity.subject })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Kelas / Fase', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.identity.gradeFase })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Satuan Pendidikan', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.identity.schoolName })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Materi / Modul Ajar', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.identity.rppTitle })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Waktu Observasi Kelas', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${formattedObsDate} ${item.identity.observationClassTime ? '(' + item.identity.observationClassTime + ')' : ''}` })] })] }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // II. REKAPITULASI SKOR TERPADU
          new Paragraph({
            children: [
              new TextRun({
                text: 'II. REKAPITULASI SKOR SIKLUS SUPERVISI TERPADU',
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tahapan Supervisi', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Skor Perolehan', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nilai (0-100)', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Predikat / Kualifikasi', bold: true })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: '1. Telaah RPP (42 Indikator)' })] }),
                  new TableCell({ children: [new Paragraph({ text: `${item.totalScore} / 168` })] }),
                  new TableCell({ children: [new Paragraph({ text: `${item.finalScore}%` })] }),
                  new TableCell({ children: [new Paragraph({ text: `${item.predicate} (${item.predicateLabel})` })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: '2. Observasi Kelas (14 Indikator)' })] }),
                  new TableCell({ children: [new Paragraph({ text: `${item.observasiTotalScore} / 56` })] }),
                  new TableCell({ children: [new Paragraph({ text: `${item.observasiFinalScore}%` })] }),
                  new TableCell({ children: [new Paragraph({ text: `${item.observasiPredicate} (${item.observasiPredicateLabel})` })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'SKOR AKHIR TERPADU GABUNGAN', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: '-' })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${item.combinedFinalScore}%`, bold: true, size: 24 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${item.combinedPredicate} - ${item.combinedPredicateLabel}`, bold: true })] })] }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // III. PRA OBSERVASI
          new Paragraph({
            children: [
              new TextRun({
                text: 'III. HASIL DISKUSI & PERENCANAAN PRA-OBSERVASI',
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Fokus Aspek Pengembangan: ', bold: true }),
              new TextRun({ text: item.praObservasi?.fokusPengembangan || '-' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Strategi & Media: ', bold: true }),
              new TextRun({ text: item.praObservasi?.strategiMedia || '-' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Kesiapan Peserta Didik: ', bold: true }),
              new TextRun({ text: item.praObservasi?.kesiapanSiswa || '-' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Catatan Kesepakatan Pra-Observasi: ', bold: true }),
              new TextRun({ text: item.praObservasi?.catatanPraObservasi || '-' }),
            ],
          }),
          new Paragraph({ text: '' }),

          // IV. 14 INDIKATOR OBSERVASI KELAS (EXACT TABLE)
          new Paragraph({
            children: [
              new TextRun({
                text: 'IV. HASIL OBSERVASI KELAS (14 INDIKATOR RESMI PEMBELAJARAN MENDALAM)',
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'No', bold: true })] })], width: { size: 6, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Indikator Pengamatan Kelas', bold: true })] })], width: { size: 44, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Skor (1-4)', bold: true })] })], width: { size: 12, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Komentar Kritis / Catatan Observasi', bold: true })] })], width: { size: 38, type: WidthType.PERCENTAGE } }),
                ],
              }),
              ...OBSERVASI_INDICATORS.map((ind) => {
                const s = item.observasiScores?.[ind.id] || 0;
                const c = item.observasiComments?.[ind.id] || '-';
                return new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `${ind.id}` })] }),
                    new TableCell({ children: [new Paragraph({ text: ind.description })] }),
                    new TableCell({ children: [new Paragraph({ text: `${s}` })] }),
                    new TableCell({ children: [new Paragraph({ text: c })] }),
                  ],
                });
              }),
            ],
          }),
          new Paragraph({ text: '' }),

          // V. EVALUASI PASCA OBSERVASI & REFLEKSI
          new Paragraph({
            children: [
              new TextRun({
                text: 'V. EVALUASI PASCA OBSERVASI, REFLEKSI & KESIMPULAN',
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Refleksi Guru Setelah Mengajar:', bold: true }),
            ],
          }),
          new Paragraph({ text: item.pascaObservasi?.refleksiGuru || '-' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Hal-hal Positif / Kelebihan Utama:', bold: true }),
            ],
          }),
          new Paragraph({ text: item.pascaObservasi?.kelebihanUtama || item.feedback?.kelebihan || '-' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Hal yang Perlu Ditingkatkan:', bold: true }),
            ],
          }),
          new Paragraph({ text: item.pascaObservasi?.halDitingkatkan || item.feedback?.halDitingkatkan || '-' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: '4. Catatan Umum Pengawas / Kesimpulan Supervisi:', bold: true }),
            ],
          }),
          new Paragraph({ text: item.pascaObservasi?.kesimpulanSupervisi || '-' }),
          new Paragraph({ text: '' }),

          // VI. MATRIKS PROGRAM TINDAK LANJUT
          new Paragraph({
            children: [
              new TextRun({
                text: 'VI. MATRIKS RENCANA PROGRAM TINDAK LANJUT (RTL)',
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'No', bold: true })] })], width: { size: 6, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nama Program / Kegiatan', bold: true })] })], width: { size: 30, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tujuan Capaian', bold: true })] })], width: { size: 28, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Waktu', bold: true })] })], width: { size: 16, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Penanggung Jawab', bold: true })] })], width: { size: 20, type: WidthType.PERCENTAGE } }),
                ],
              }),
              ...programs.map((prog, idx) => {
                return new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `${idx + 1}` })] }),
                    new TableCell({ children: [new Paragraph({ text: prog.namaProgram })] }),
                    new TableCell({ children: [new Paragraph({ text: prog.tujuan })] }),
                    new TableCell({ children: [new Paragraph({ text: prog.waktuPelaksanaan })] }),
                    new TableCell({ children: [new Paragraph({ text: prog.penanggungJawab })] }),
                  ],
                });
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),

          // DUAL OFFICIAL SIGNATURE BLOCK
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
                    children: [
                      new Paragraph({ text: '' }),
                      new Paragraph({ children: [new TextRun({ text: 'Guru Mata Pelajaran,' })] }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ children: [new TextRun({ text: item.identity.teacherName, bold: true, underline: {} })] }),
                      new Paragraph({ children: [new TextRun({ text: `NIP. ${item.identity.nipNuptk || '...................................'}` })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: `Depok, ${formattedDate}` })] }),
                      new Paragraph({ children: [new TextRun({ text: `${getAppSettings().pengawasJabatan},` })] }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ text: '' }),
                      new Paragraph({ children: [new TextRun({ text: getAppSettings().pengawasName, bold: true, underline: {} })] }),
                      new Paragraph({ children: [new TextRun({ text: `NIP. ${getAppSettings().pengawasNip}` })] }),
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
}

export function downloadTeacherTemplate() {
  const sampleData = [
    {
      'Nama Guru': 'Dra. Hj. Siti Aminah, M.Pd.',
      'NIP / NUPTK': '198203152008012010',
      'Mata Pelajaran': 'IPA (Ilmu Pengetahuan Alam)',
      'Kelas / Fase': 'Kelas VII / Fase D',
      'Satuan Pendidikan': 'SMP Negeri 1 Depok',
      'Unit Kerja': 'SMP Negeri 1 Depok - Dinas Pendidikan Kota Depok',
      'Email': 'siti.aminah@smpn1depok.sch.id',
      'No HP / WA': '081234567890',
      'Catatan': 'Guru Penggerak Angkatan 5',
    },
    {
      'Nama Guru': 'Budi Santoso, S.Pd., M.Si.',
      'NIP / NUPTK': '198506142010011015',
      'Mata Pelajaran': 'Matematika',
      'Kelas / Fase': 'Kelas VIII / Fase D',
      'Satuan Pendidikan': 'SMP Negeri 2 Depok',
      'Unit Kerja': 'SMP Negeri 2 Depok - Dinas Pendidikan Kota Depok',
      'Email': 'budi.santoso@smpn2depok.sch.id',
      'No HP / WA': '081987654321',
      'Catatan': 'Wakil Kurikulum',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [
    { wch: 28 },
    { wch: 22 },
    { wch: 25 },
    { wch: 18 },
    { wch: 25 },
    { wch: 40 },
    { wch: 30 },
    { wch: 18 },
    { wch: 30 },
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Data Guru');
  XLSX.writeFile(workbook, 'Template_Input_Data_Guru_Supervisi.xlsx');
}

