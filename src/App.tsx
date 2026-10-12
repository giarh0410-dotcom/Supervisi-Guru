import React, { useState, useEffect } from 'react';
import { RPPEvaluation, TeacherProfile } from './types';
import {
  getAllEvaluations,
  saveEvaluation,
  deleteEvaluation,
  clearAllEvaluations,
  getEvaluationById,
  getAllTeachers,
  saveTeacher,
  deleteTeacher,
  getAppSettings,
} from './data/storage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AssessmentForm } from './components/AssessmentForm';
import { ReportCardView } from './components/ReportCardView';
import { TeacherDirectory } from './components/TeacherDirectory';
import { AllTeachersReportView } from './components/AllTeachersReportView';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { SettingsModal } from './components/SettingsModal';
import { CheckCircle2, Settings } from 'lucide-react';
import {
  createDefaultScores,
  createDefaultObservasiScores,
  createDefaultPraObservasi,
  createDefaultPascaObservasi,
  calculateRPPScores,
  calculateObservasiScores,
  calculateCombinedSupervisionScore,
} from './data/instrumentData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'report' | 'teachers' | 'all-reports'>('dashboard');
  const [evaluations, setEvaluations] = useState<RPPEvaluation[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null);
  const [editingEvaluation, setEditingEvaluation] = useState<RPPEvaluation | undefined>(
    undefined
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [, setSettingsVersion] = useState(0);

  // Modal State for Deletion
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'single' | 'all';
    id?: string;
    teacherName?: string;
  }>({
    isOpen: false,
    type: 'single',
  });

  // Initial load
  useEffect(() => {
    const savedEvals = getAllEvaluations();
    setEvaluations(savedEvals);
    if (savedEvals.length > 0) {
      setSelectedEvaluationId(savedEvals[0].id);
    }

    const savedTeachers = getAllTeachers();
    setTeachers(savedTeachers);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Select evaluation for viewing report
  const handleSelectEvaluation = (id: string) => {
    setSelectedEvaluationId(id);
    setActiveTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Edit existing evaluation
  const handleEditEvaluation = (id: string) => {
    const item = getEvaluationById(id);
    if (item) {
      setEditingEvaluation(item);
      setSelectedEvaluationId(id);
      setActiveTab('form');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Start a new blank assessment
  const handleNewAssessment = () => {
    setEditingEvaluation(undefined);
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start supervision for a specific teacher from directory
  const handleStartSupervisionForTeacher = (teacher: TeacherProfile) => {
    const appSettings = getAppSettings();
    const scores = createDefaultScores(3);
    const rppCalc = calculateRPPScores(scores);
    const obsScores = createDefaultObservasiScores(3);
    const obsCalc = calculateObservasiScores(obsScores);
    const combined = calculateCombinedSupervisionScore(rppCalc.finalScore, obsCalc.observasiFinalScore);

    const newEval: RPPEvaluation = {
      id: `eval-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      identity: {
        teacherName: teacher.teacherName,
        nipNuptk: teacher.nipNuptk,
        subject: teacher.subject,
        gradeFase: teacher.gradeFase,
        schoolName: teacher.schoolName,
        unitKerja: teacher.unitKerja || teacher.schoolName,
        penelaahName: appSettings.pengawasName,
        penelaahNip: appSettings.pengawasNip,
        penelaahJabatan: appSettings.pengawasJabatan,
        assessmentDate: new Date().toISOString().split('T')[0],
        rppTitle: `Modul Ajar Pembelajaran Mendalam - ${teacher.subject}`,
        observationDate: '',
        observationClassTime: '',
      },
      scores,
      sectionComments: {},
      feedback: {
        kelebihan: '',
        halDitingkatkan: '',
        rekomendasi: '',
        tindakLanjut: '',
      },
      scoreA: rppCalc.scoreA,
      scoreB: rppCalc.scoreB,
      scoreC: rppCalc.scoreC,
      scoreD: rppCalc.scoreD,
      scoreE: rppCalc.scoreE,
      totalScore: rppCalc.totalScore,
      finalScore: rppCalc.finalScore,
      predicate: rppCalc.predicate,
      predicateLabel: rppCalc.predicateLabel,

      praObservasi: createDefaultPraObservasi(),

      observasiScores: obsScores,
      observasiComments: {},
      observasiScoreA: obsCalc.observasiScoreA,
      observasiScoreB: obsCalc.observasiScoreB,
      observasiScoreC: obsCalc.observasiScoreC,
      observasiTotalScore: obsCalc.observasiTotalScore,
      observasiFinalScore: obsCalc.observasiFinalScore,
      observasiPredicate: obsCalc.observasiPredicate,
      observasiPredicateLabel: obsCalc.observasiPredicateLabel,

      pascaObservasi: createDefaultPascaObservasi(),

      combinedFinalScore: combined.combinedFinalScore,
      combinedPredicate: combined.combinedPredicate,
      combinedPredicateLabel: combined.combinedPredicateLabel,
    };

    setEditingEvaluation(newEval);
    setActiveTab('form');
    showToast(`Memulai siklus supervisi untuk Guru ${teacher.teacherName}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save (Create or Update)
  const handleSaveEvaluation = (savedItem: RPPEvaluation) => {
    const updatedList = saveEvaluation(savedItem);
    setEvaluations(updatedList);
    setSelectedEvaluationId(savedItem.id);
    setEditingEvaluation(undefined);
    setActiveTab('report');
    showToast(`Data RPP Guru ${savedItem.identity.teacherName} berhasil disimpan!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Teacher CRUD
  const handleSaveTeacherProfile = (teacher: TeacherProfile) => {
    const updated = saveTeacher(teacher);
    setTeachers(updated);
    showToast(`Data guru ${teacher.teacherName} berhasil disimpan.`);
  };

  const handleDeleteTeacherProfile = (id: string) => {
    const updated = deleteTeacher(id);
    setTeachers(updated);
    showToast('Data guru berhasil dihapus.');
  };

  // Trigger single item delete modal
  const handleRequestDeleteEvaluation = (id: string) => {
    const item = getEvaluationById(id);
    const teacherName = item ? `${item.identity.teacherName} (${item.identity.schoolName})` : 'Guru ini';
    setDeleteModalState({
      isOpen: true,
      type: 'single',
      id,
      teacherName,
    });
  };

  // Trigger clear all delete modal
  const handleRequestClearAll = () => {
    setDeleteModalState({
      isOpen: true,
      type: 'all',
    });
  };

  // Execute confirmed deletion
  const handleConfirmDelete = () => {
    if (deleteModalState.type === 'single' && deleteModalState.id) {
      const updatedList = deleteEvaluation(deleteModalState.id);
      setEvaluations(updatedList);
      if (selectedEvaluationId === deleteModalState.id) {
        setSelectedEvaluationId(updatedList[0]?.id || null);
        setActiveTab('dashboard');
      }
      showToast(`Data telaah RPP ${deleteModalState.teacherName || ''} berhasil dihapus.`);
    } else if (deleteModalState.type === 'all') {
      const cleared = clearAllEvaluations();
      setEvaluations(cleared);
      setSelectedEvaluationId(null);
      setActiveTab('dashboard');
      showToast('Seluruh data rekapan berhasil dihapus.');
    }
  };

  const selectedEvaluation = evaluations.find((item) => item.id === selectedEvaluationId);
  const settings = getAppSettings();

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white flex flex-col lg:flex-row">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        type={deleteModalState.type}
        targetTitle={deleteModalState.teacherName}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsSaved={() => {
          setSettingsVersion((v) => v + 1);
          showToast('Pengaturan aplikasi berhasil diperbarui!');
        }}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedTeacherName={selectedEvaluation?.identity.teacherName}
        onNewAssessment={handleNewAssessment}
        onOpenSettings={() => setIsSettingsOpen(true)}
        evaluationsCount={evaluations.length}
        teachersCount={teachers.length}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs print:hidden">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-xl font-black text-slate-900">
              {activeTab === 'dashboard' && 'Dashboard Rekapan & Hasil Supervisi'}
              {activeTab === 'teachers' && 'Direktori Data Guru & Pengampu'}
              {activeTab === 'all-reports' && 'Pusat Rapor Supervisi Semua Guru'}
              {activeTab === 'form' && 'Formulir Supervisi Terpadu (4 Tahap)'}
              {activeTab === 'report' && `Rapor Supervisi: ${selectedEvaluation?.identity.teacherName || ''}`}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
              {settings.schoolName}
            </span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <Settings className="w-4 h-4 text-indigo-600 animate-spin-slow" />
              <span className="hidden sm:inline">Pengaturan</span>
            </button>
          </div>
        </header>

        {/* Main Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              evaluations={evaluations}
              onSelectEvaluation={handleSelectEvaluation}
              onEditEvaluation={handleEditEvaluation}
              onDeleteEvaluation={handleRequestDeleteEvaluation}
              onNewAssessment={handleNewAssessment}
              onResetSampleData={handleRequestClearAll}
            />
          )}

          {activeTab === 'teachers' && (
            <TeacherDirectory
              teachers={teachers}
              evaluations={evaluations}
              onSaveTeacher={handleSaveTeacherProfile}
              onDeleteTeacher={handleDeleteTeacherProfile}
              onStartSupervisionForTeacher={handleStartSupervisionForTeacher}
              onViewEvaluation={handleSelectEvaluation}
            />
          )}

          {activeTab === 'all-reports' && (
            <AllTeachersReportView
              teachers={teachers}
              evaluations={evaluations}
              onSelectEvaluation={handleSelectEvaluation}
              onStartSupervision={handleStartSupervisionForTeacher}
            />
          )}

          {activeTab === 'form' && (
            <AssessmentForm
              initialData={editingEvaluation}
              onSave={handleSaveEvaluation}
              onCancel={() => {
                setEditingEvaluation(undefined);
                setActiveTab('dashboard');
              }}
            />
          )}

          {activeTab === 'report' && selectedEvaluation && (
            <ReportCardView
              evaluation={selectedEvaluation}
              onEdit={() => handleEditEvaluation(selectedEvaluation.id)}
              onBack={() => setActiveTab('dashboard')}
              onDelete={() => handleRequestDeleteEvaluation(selectedEvaluation.id)}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 text-center print:hidden">
          <div className="max-w-7xl mx-auto px-4 space-y-1">
            <p className="font-semibold text-slate-300">
              Aplikasi Telaah Perencanaan Pembelajaran Mendalam (PM) Terintegrasi Literasi dan Numerasi
            </p>
            <p>
              {settings.pengawasJabatan}: <span className="text-amber-300 font-bold">{settings.pengawasName}</span> | Kepala Sekolah: <span className="text-emerald-300 font-bold">{settings.kepalaSekolahName}</span>
            </p>
            <p className="text-[11px] text-slate-500 pt-2">
              Mengacu pada Prinsip Pembelajaran Mendalam (PM) & Penguatan Literasi-Numerasi Kurikulum Nasional.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
