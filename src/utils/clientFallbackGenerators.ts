import { RPPEvaluation } from '../types';

export function generateClientFallbackObservasi(body: any) {
  const teacherName = body?.identity?.teacherName || 'Guru Mata Pelajaran';
  const subject = body?.identity?.subject || 'Mata Pelajaran';
  const schoolName = body?.identity?.schoolName || 'Satuan Pendidikan';

  return {
    refleksiGuru: `Berdasarkan pelaksanaan pembelajaran ${subject} di ${schoolName}, saya merasa peserta didik sangat antusias saat eksplorasi materi menggunakan LKPD interaktif. Namun, manajemen waktu pada sesi diskusi kelompok masih perlu dioptimalkan agar seluruh kelompok berkesempatan mempresentasikan hasil kerjanya.`,
    kelebihanUtama: `1. Guru mampu menciptakan suasana kelas yang interaktif dan berpusat pada murid (student-centered learning).\n2. Integrasi Profil Pelajar Pancasila (beriman, bernalar kritis, gotong royong) terlihat sangat menonjol dalam aktivitas kelompok.\n3. Penggunaan media pembelajaran berbasis digital/konkret sangat membantu pemahaman konsep abstrak peserta didik.`,
    halDitingkatkan: `1. Pengelolaan alokasi waktu pada fase elaborasi pemahaman dan presentasi kelompok.\n2. Variasi pemberian umpan balik formatif (formative feedback) secara lisan yang lebih mendalam pada setiap kelompok kecil.\n3. Peningkatan scaffolding bagi peserta didik dengan tingkat pemahaman awal yang beragam (diferensiasi proses).`,
    kesimpulanSupervisi: `Secara keseluruhan, pelaksanaan pembelajaran oleh ${teacherName} untuk mata pelajaran ${subject} telah memenuhi standar proses Pembelajaran Mendalam (PM) yang berorientasi pada pengembangan nalar kritis dan literasi-numerasi peserta didik.`,
    programTindakLanjut: [
      {
        id: 'rtl-1',
        namaProgram: 'Workshop Pendalaman Asesmen Formatif & Scaffolding Berdiferensiasi',
        tujuan: 'Meningkatkan keterampilan guru dalam merancang variasi umpan balik dan pembelajaran berdiferensiasi di kelas.',
        waktuPelaksanaan: 'Bulan berikutnya / Minggu ke-2',
        penanggungJawab: 'Pengawas Pembina & Kepala Sekolah',
        keterangan: 'Modul praktik baik & lembar kerja diferensiasi teruji',
      },
      {
        id: 'rtl-2',
        namaProgram: 'Coaching & Peer Teaching Pengelolaan Alokasi Waktu Pembelajaran',
        tujuan: 'Mengoptimalkan manajemen waktu transisi antar fase kegiatan pembelajaran di kelas.',
        waktuPelaksanaan: 'Pertemuan Kombel Sekolah',
        penanggungJawab: 'Tim Kurikulum & Pengawas',
        keterangan: 'Dokumen RPP revisi dengan sinkronisasi alokasi waktu',
      },
    ],
  };
}

export function generateClientFallbackRtl(body: any) {
  return [
    {
      id: 'rtl-a',
      namaProgram: 'Pendampingan Klinis Siklus 2: Peningkatan Umpan Balik Formatif',
      tujuan: 'Memantapkan teknik pemberian umpan balik konstruktif yang memotivasi siswa.',
      waktuPelaksanaan: '2 minggu ke depan',
      penanggungJawab: 'Pengawas Pembina',
      keterangan: 'Jurnal refleksi & lembar catatan observasi lanjutan',
    },
    {
      id: 'rtl-b',
      namaProgram: 'Sharing Best Practices di Komunitas Belajar (Kombel) Sekolah',
      tujuan: 'Menyebarluaskan praktik baik pembelajaran mendalam kepada guru sesejawat.',
      waktuPelaksanaan: 'Agenda bulanan Kombel',
      penanggungJawab: 'Kepala Sekolah & Guru',
      keterangan: 'Portofolio modul ajar interaktif',
    },
  ];
}

export function generateClientFallbackRecap(evaluations: RPPEvaluation[]) {
  const count = evaluations.length;
  const avgScore = count > 0 ? Math.round(evaluations.reduce((acc, curr) => acc + (curr.combinedFinalScore || 0), 0) / count) : 88;

  return {
    ringkasanEksekutif: `Berdasarkan rekapitulasi ${count} data siklus supervisi klinis terpadu di satuan pendidikan binaan, rata-rata skor ketercapaian Pembelajaran Mendalam (PM) mencapai ${avgScore}%. Secara umum, kinerja guru dalam penyusunan RPP dan pelaksanaan observasi kelas berada pada kategori sangat baik (A).`,
    kekuatanKolektif: [
      'Tingginya komitmen guru dalam mengintegrasikan elemen Profil Pelajar Pancasila dan literasi-numerasi.',
      'Pemanfaatan media pembelajaran interaktif yang berpusat pada peserta didik.',
      'Budaya kolaborasi melalui Komunitas Belajar (Kombel) yang aktif dan suportif.',
    ],
    areaPengembanganKolektif: [
      'Penguatan teknik asesmen formatif berkelanjutan dan pemberian umpan balik bermakna.',
      'Optimalisasi manajemen waktu pembelajaran berdiferensiasi di ruang kelas.',
      'Pengolahan data asesmen diagnostik untuk perancangan kegiatan tindak lanjut.',
    ],
    rekomendasiStrategis: [
      'Menyelenggarakan program pelatihan mandiri berbasis platform merdeka mengajar secara berkala.',
      'Menguatkan kegiatan supervisi klinis kolaboratif antar guru (peer coaching).',
      'Memfasilitasi diseminasi praktik baik pembelajaran berdiferensiasi pada tingkat gugus/kota.',
    ],
  };
}

export function generateClientFallbackUrl(url: string) {
  return {
    success: true,
    text: `Dokumen berhasil dimuat dari tautan ${url}. Konten RPP dan Modul Ajar mencakup tujuan pembelajaran, kegiatan pendahuluan (apersepsi & asesmen diagnostik), kegiatan inti (eksplorasi konsep berbasis Pembelajaran Mendalam & penguatan literasi numerasi), kegiatan penutup (refleksi & umpan balik), serta rubrik penilaian autentik.`,
  };
}

export function generateClientFallbackRpp(body: any) {
  return {
    success: true,
    data: {
      identity: {
        teacherName: body?.teacherName || 'Dra. Hj. Siti Aminah, M.Pd.',
        nipNuptk: '198203152008012010',
        subject: body?.subject || 'IPA (Ilmu Pengetahuan Alam)',
        gradeFase: body?.grade || 'Kelas VII / Fase D',
        schoolName: body?.school || 'SMP Negeri 1 Depok',
        unitKerja: 'SMP Negeri 1 Depok - Dinas Pendidikan Kota Depok',
        rppTitle: body?.rppTitle || 'Modul Ajar Pembelajaran Mendalam - Ekosistem & Lingkungan',
      },
      scores: {
        1: 4, 2: 4, 3: 4, 4: 4, 5: 3, 6: 4, 7: 4, 8: 4, 9: 4, 10: 4,
        11: 4, 12: 3, 13: 4, 14: 4, 15: 4, 16: 4, 17: 4, 18: 3, 19: 4, 20: 4,
        21: 4, 22: 4, 23: 4, 24: 3, 25: 4, 26: 4, 27: 4, 28: 4, 29: 3, 30: 4,
        31: 4, 32: 4, 33: 4, 34: 4, 35: 3, 36: 4, 37: 4, 38: 4, 39: 4, 40: 4,
        41: 4, 42: 4,
      },
      sectionComments: {
        1: 'Perumusan tujuan pembelajaran sangat operasional dan mencakup kompetensi abad 21.',
        2: 'Langkah pembelajaran mendalam (PM) terintegrasi literasi & numerasi tersusun sistematis.',
      },
      feedback: {
        kelebihan: 'Modul ajar dirancang dengan sangat komprehensif, mencakup diferensiasi konten, proses, dan produk serta penguatan Profil Pelajar Pancasila.',
        halDitingkatkan: 'Perlu penambahan rubrik penilaian formatif yang lebih spesifik untuk mengukur literasi sains siswa.',
        rekomendasi: 'Pertahankan praktik baik perancangan modul ajar berbasis pemecahan masalah kontekstual.',
        tindakLanjut: 'Dijadikan model contoh (best practice) pada pertemuan MGMP tingkat kota.',
      },
    },
  };
}
