import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { USMSLogo } from './USMSLogo';
import { ACADEMIC_SESSIONS, TermType } from '../types';
import {
  Menu,
  Upload,
  UserPlus,
  ShieldCheck,
  LogOut,
  Sparkles,
  Calendar,
  Lock,
  User
} from 'lucide-react';

interface HeaderProps {
  onOpenAdmission: () => void;
  onOpenExcelUpload: () => void;
  onOpenBackup: () => void;
  onToggleMobileMenu: () => void;
  onOpenAdminAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmission,
  onOpenExcelUpload,
  onOpenBackup,
  onToggleMobileMenu,
  onOpenAdminAuth
}) => {
  const {
    schoolProfile,
    isAdminAuthenticated,
    adminLogout,
    setActiveTab,
    setActiveSession,
    setActiveTerm
  } = useSchool();

  const handleLogout = () => {
    adminLogout();
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 sm:px-6 lg:px-8 sticky top-0 z-20 print:hidden select-none">
      
      {/* Left: Mobile Toggle + USMS Vector Logo + School Brand Info */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 min-w-0">
          {/* USMS Logo Top Left Header */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-1 shadow-sm ring-1 ring-blue-500/30">
              <USMSLogo className="w-5 h-5" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-extrabold tracking-widest text-blue-600 dark:text-blue-400 uppercase leading-tight font-mono">
                USMS &bull; ERP
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                Universal SMS
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          {/* School Name & Working Academic Session/Term Selector */}
          <div className="min-w-0">
            <h2 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white truncate max-w-[180px] sm:max-w-xs md:max-w-md">
              {schoolProfile.name || 'Universal School Management System'}
            </h2>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
              <div className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 rounded px-1.5 py-0.5">
                <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <select
                  value={schoolProfile.session}
                  onChange={(e) => setActiveSession(e.target.value)}
                  className="bg-transparent font-bold text-blue-700 dark:text-blue-300 text-[11px] focus:outline-none cursor-pointer pr-1"
                  title="Select Working Academic Session (2024/2025 to 2050/2051)"
                >
                  {ACADEMIC_SESSIONS.map((sess) => (
                    <option key={sess} value={sess} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {sess} Session
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">&bull;</span>
              <select
                value={schoolProfile.currentTerm}
                onChange={(e) => setActiveTerm(e.target.value as TermType)}
                className="hidden sm:inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded px-1.5 py-0.5 text-[11px] border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
                title="Select Current Term"
              >
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Master Administrator Privilege Badge, Lock & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Master Admin Profile & Lock Session Button */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-1 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:block" />
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">
              {schoolProfile.adminConfig?.username || 'admin'}
            </span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Master Admin
            </span>
          </div>

          <button
            id="btn-header-logout"
            type="button"
            onClick={handleLogout}
            title="Lock Master Administrator Session and return to Login"
            className="ml-1 sm:ml-2 px-2.5 py-1 text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-600 active:scale-95 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold border border-rose-200 dark:border-rose-900/40 shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        <button
          id="btn-header-import-excel"
          onClick={onOpenExcelUpload}
          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden md:inline">Import Excel</span>
          <span className="md:hidden">Import</span>
        </button>

        <button
          id="btn-header-new-admission"
          onClick={onOpenAdmission}
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer flex items-center gap-1.5"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ Admission</span>
        </button>
      </div>

    </header>
  );
};
