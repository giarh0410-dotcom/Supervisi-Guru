import React from 'react';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  FileText,
  Settings,
  Shield,
  Award,
  BookOpen,
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import { getAppSettings } from '../data/storage';

interface SidebarProps {
  activeTab: 'dashboard' | 'form' | 'report' | 'teachers' | 'all-reports';
  setActiveTab: (tab: 'dashboard' | 'form' | 'report' | 'teachers' | 'all-reports') => void;
  selectedTeacherName?: string;
  onNewAssessment: () => void;
  onOpenSettings: () => void;
  evaluationsCount: number;
  teachersCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedTeacherName,
  onNewAssessment,
  onOpenSettings,
  evaluationsCount,
  teachersCount,
}) => {
  const settings = getAppSettings();

  return (
    <aside className="w-full lg:w-72 backdrop-blur-2xl bg-slate-950/90 text-white flex flex-col border-r border-white/10 shadow-2xl print:hidden flex-shrink-0 relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand / School Header */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3 relative z-10">
        <div className="p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner flex-shrink-0">
          <SchoolLogo size={42} />
        </div>
        <div className="overflow-hidden">
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider truncate">
            {settings.schoolName}
          </div>
          <h2 className="text-sm font-black text-white tracking-tight leading-snug">
            Supervisi Terpadu
          </h2>
          <span className="text-[10px] text-indigo-300/80">Kurikulum Merdeka • PM & LitNum</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto relative z-10">
        <div className="text-[10px] font-black uppercase tracking-wider text-indigo-400 px-3 py-1">
          Menu Utama
        </div>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-lg shadow-blue-600/30 font-bold border border-blue-400/40'
              : 'text-indigo-200/90 hover:bg-white/10 hover:text-white border border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-blue-300" />
            <span>Rekapan & Dashboard</span>
          </div>
          <span className="px-2 py-0.5 bg-blue-900/60 text-blue-200 rounded-full text-xs font-bold border border-blue-500/30">
            {evaluationsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'teachers'
              ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-lg shadow-blue-600/30 font-bold border border-blue-400/40'
              : 'text-indigo-200/90 hover:bg-white/10 hover:text-white border border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-amber-300" />
            <span>Data Guru</span>
          </div>
          <span className="px-2 py-0.5 bg-indigo-900/60 text-indigo-200 rounded-full text-xs font-bold border border-indigo-500/30">
            {teachersCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all-reports')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'all-reports'
              ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-lg shadow-blue-600/30 font-bold border border-blue-400/40'
              : 'text-indigo-200/90 hover:bg-white/10 hover:text-white border border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-emerald-300" />
            <span>Rapor Semua Guru</span>
          </div>
        </button>

        <button
          onClick={onNewAssessment}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'form'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 border border-amber-400'
              : 'backdrop-blur-md bg-white/10 text-amber-300 hover:bg-white/20 hover:text-white border border-amber-500/30'
          }`}
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>+ Supervisi Terpadu (4 Tahap)</span>
        </button>

        {selectedTeacherName && (
          <button
            onClick={() => setActiveTab('report')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'report'
                ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-lg shadow-blue-600/30 font-bold border border-blue-400/40'
                : 'text-indigo-200/90 hover:bg-white/10 hover:text-white border border-transparent'
            }`}
          >
            <FileText className="w-5 h-5 text-emerald-300" />
            <div className="text-left truncate">
              <div className="text-[10px] text-indigo-300 uppercase tracking-wide">Rapor Aktif:</div>
              <div className="truncate font-bold">{selectedTeacherName}</div>
            </div>
          </button>
        )}

        <div className="pt-4 text-[10px] font-black uppercase tracking-wider text-indigo-400 px-3 py-1">
          Sistem & Konfigurasi
        </div>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-xs sm:text-sm text-indigo-200/90 hover:bg-white/10 hover:text-white transition-all cursor-pointer border border-transparent"
        >
          <Settings className="w-5 h-5 text-indigo-400 animate-spin-slow" />
          <span>Pengaturan Aplikasi</span>
        </button>
      </nav>

      {/* Supervisor & Pengawas Info Box */}
      <div className="p-4 border-t border-white/10 backdrop-blur-md bg-slate-900/60 space-y-2 text-xs relative z-10">
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <Award className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{settings.pengawasName}</span>
        </div>
        <div className="flex items-center gap-2 text-indigo-200">
          <Shield className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span className="truncate">Kepala: {settings.kepalaSekolahName}</span>
        </div>
        <div className="text-[10px] text-slate-400 pt-1 border-t border-white/10">
          Supervisor: {settings.supervisorName}
        </div>
      </div>
    </aside>
  );
};
