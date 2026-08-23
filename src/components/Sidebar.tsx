import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { USMSLogo } from './USMSLogo';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FileSpreadsheet,
  FileText,
  Award,
  Settings,
  HardDrive,
  Receipt,
  Lock,
  LogOut,
  ShieldCheck,
  Building
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBackup: () => void;
  onOpenAdminAuth: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBackup,
  onOpenAdminAuth,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const { students, staff, timetables, schoolProfile, isAdminAuthenticated, adminLogout } = useSchool();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'staff', label: 'Staff Records', icon: Briefcase, count: staff.length },
    { id: 'students', label: 'Admissions', icon: Users, count: students.length },
    { id: 'timetable', label: 'Timetables', icon: Calendar, badge: 'All Terms' },
    { id: 'exams', label: 'Examination', icon: FileSpreadsheet },
    { id: 'reports', label: 'Report Cards', icon: FileText },
    { id: 'vouchers', label: 'Payment Vouchers', icon: Receipt },
    { id: 'analytics', label: 'Merit & Analytics', icon: Award },
    { id: 'settings', label: 'System Setup', icon: Settings },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setActiveTab(item.id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogout = () => {
    if (window.confirm('Lock Master Administrator Session and return to Login?')) {
      adminLogout();
    }
  };

  const sidebarContent = (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 flex-shrink-0 select-none">
      
      {/* Brand Header with USMS Logo */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center p-1.5 shadow-inner ring-1 ring-blue-400/40">
            <USMSLogo className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 leading-none">
              USMS
              <span className="text-[9px] px-1.5 py-0.5 bg-yellow-400/20 text-yellow-300 font-bold rounded border border-yellow-400/30">
                UNIVERSAL
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold truncate max-w-[130px]">
              {schoolProfile.name ? schoolProfile.name.split(' ')[0] : 'School'} ERP
            </p>
          </div>
        </div>
      </div>

      {/* Master Admin Privilege Status Pill */}
      <div className="mx-3.5 my-2.5 p-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="leading-tight">
            <span className="text-[11px] font-bold text-slate-200 block">
              {schoolProfile.adminConfig?.username || 'admin'}
            </span>
            <span className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider">
              Master Privilege
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Lock Master Admin Session"
          className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
          Administrator Records
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Status & Official Developer Credits */}
      <div className="p-3.5 border-t border-slate-800 space-y-2.5 bg-slate-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="tracking-wide text-[11px]">OFFLINE STANDALONE</span>
          </div>
          <button
            id="btn-sidebar-backup"
            onClick={onOpenBackup}
            title="Export Offline Database Backup (JSON)"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition border border-slate-700 cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        <div className="pt-2 border-t border-slate-800/80">
          <p className="text-[10px] text-slate-300 font-bold leading-tight">
            JADSL ICT Unit Community Centre
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5">
            Gboko &bull; Tel: 070677978 &bull; WA: 08071119766
          </p>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 z-30">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fadeIn">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-64 h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
