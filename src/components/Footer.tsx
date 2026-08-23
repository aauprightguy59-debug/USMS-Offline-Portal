import React from 'react';
import { Phone, MessageSquare, ShieldCheck, HardDrive, WifiOff, MapPin, Building2 } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const Footer: React.FC<{ onOpenBackup: () => void }> = ({ onOpenBackup }) => {
  const { schoolProfile } = useSchool();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Left: School info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>{schoolProfile.name}</span>
            </div>
            <p className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>{schoolProfile.address || 'Gboko, Benue State'}</span>
            </p>
            <p className="text-slate-500 text-[11px]">
              Govt Reg / Approval: {schoolProfile.regNumber || 'Approved Standard'}
            </p>
          </div>

          {/* Center: System Offline Capability */}
          <div className="flex flex-col items-center justify-center text-center space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
              <WifiOff className="w-4 h-4" />
              <span>Universal Standalone School System (USMS)</span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-sm">
              Designed for offline deployment across Nursery, Primary, and Secondary schools without requiring active internet access.
            </p>
            <button
              onClick={onOpenBackup}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
            >
              <HardDrive className="w-3 h-3" /> Backup database / Export to file
            </button>
          </div>

          {/* Right: Company Credits & Contacts */}
          <div className="md:text-right space-y-1">
            <p className="text-[11px] text-slate-400">
              Developed & Engineered by:
            </p>
            <p className="text-white font-bold text-xs tracking-wide">
              JADSL ICT Unit Community Centre, Gboko
            </p>
            <div className="flex flex-wrap md:justify-end items-center gap-3 pt-1 text-[11px]">
              <a
                href="tel:070677978"
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition"
              >
                <Phone className="w-3 h-3" />
                <span>070677978</span>
              </a>
              <a
                href="https://wa.me/2348071119766"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition"
              >
                <MessageSquare className="w-3 h-3" />
                <span>WhatsApp: 08071119766</span>
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800/80 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            Universal School Management System (USMS) &bull; Standalone Edition &copy; 2026 JADSL ICT Unit Community Centre, Gboko &bull; Tel: 070677978 &bull; WhatsApp: 08071119766
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Protected by Master Admin Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
