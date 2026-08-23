import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { USMSLogo } from './USMSLogo';
import {
  Shield,
  Lock,
  KeyRound,
  User,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
  Building,
  GraduationCap,
  Briefcase,
  FileSpreadsheet,
  FileText,
  Calendar,
  HardDrive
} from 'lucide-react';

interface MasterAdminLoginProps {
  onLoginSuccess?: () => void;
}

export const MasterAdminLogin: React.FC<MasterAdminLoginProps> = ({ onLoginSuccess }) => {
  const { schoolProfile, adminLogin, students, staff, classes } = useSchool();
  
  const [username, setUsername] = useState('admin');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your Master Administrator PIN / Password');
      return;
    }

    const success = adminLogin(pin, username);
    if (success) {
      setError('');
      setIsSuccess(true);
      if (rememberSession) {
        try {
          localStorage.setItem('usms_admin_remember', 'true');
        } catch {}
      }
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
      }, 500);
    } else {
      setError('Access Denied: Invalid Master PIN or Username. Please check your credentials.');
    }
  };

  const handleQuickDigit = (digit: string) => {
    if (pin.length < 16) {
      setPin(prev => prev + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-hidden font-sans">
      
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 flex items-center justify-center p-1.5 shadow-md ring-1 ring-blue-400/40">
            <USMSLogo className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                UNIVERSAL SCHOOL MANAGEMENT SYSTEM
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                USMS MASTER PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {schoolProfile.name || 'Universal Comprehensive Academy'} &bull; Session {schoolProfile.session} ({schoolProfile.currentTerm})
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Standalone Offline Encrypted ERP</span>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          
          {/* Left Column: System Identity & Master Privilege Overview (col-span-6) */}
          <div className="lg:col-span-6 space-y-6 hidden md:block">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Master Access Privilege Gateway</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                School Administrator <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-yellow-300">
                  Master Control Center
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                Universal School Management System requires authenticated administrator login before granting access. All school records, student registers, staff payroll, examination computation, and broadsheets are consolidated inside the Master Dashboard.
              </p>
            </div>

            {/* Privilege Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-blue-900/40 rounded-lg text-blue-400 flex-shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Admissions & Registry</h4>
                  <p className="text-[11px] text-slate-400">Student enrollment, ID cards & records</p>
                </div>
              </div>

              <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-purple-900/40 rounded-lg text-purple-400 flex-shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Staff & Payroll</h4>
                  <p className="text-[11px] text-slate-400">Salaries, allowances & payment vouchers</p>
                </div>
              </div>

              <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-indigo-900/40 rounded-lg text-indigo-400 flex-shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Exams & CA Scores</h4>
                  <p className="text-[11px] text-slate-400">CA 1, 2, 3 & Terminal computations</p>
                </div>
              </div>

              <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-emerald-900/40 rounded-lg text-emerald-400 flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Multi-Term Timetables</h4>
                  <p className="text-[11px] text-slate-400">Weekly class matrices & conflict checks</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/50 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span>100% Offline Local Storage &bull; JSON Backups</span>
              </span>
              <span className="text-slate-300 font-mono font-bold">USMS v2.5</span>
            </div>

          </div>

          {/* Right Column: Master Login Form Card (col-span-6) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full backdrop-blur-xl relative overflow-hidden">
              
              {/* Subtle top crest badge */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 flex items-center justify-center p-2 shadow-inner ring-2 ring-yellow-400/30">
                    <USMSLogo className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Administrator Login</h3>
                    <p className="text-xs text-slate-400">Enter master access privilege PIN</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-mono">
                  MASTER PRIVILEGE
                </span>
              </div>

              {/* Form Body */}
              <form onSubmit={handleLogin} className="space-y-4 pt-5">
                
                {error && (
                  <div className="p-3 bg-red-950/60 border border-red-800/70 rounded-xl flex items-center gap-2.5 text-xs text-red-300 animate-shake">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                {isSuccess && (
                  <div className="p-3 bg-green-950/60 border border-green-800/70 rounded-xl flex items-center gap-2.5 text-xs text-green-300 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-400" />
                    <span>Master Access Granted! Opening Dashboard...</span>
                  </div>
                )}

                {/* Administrator Username */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Administrator Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError('');
                      }}
                      placeholder="e.g. admin"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-inner font-mono"
                    />
                  </div>
                </div>

                {/* Master PIN / Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Master Administrator PIN
                    </label>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Lock className="w-3 h-3 text-slate-400" />
                      Confidential
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter Master PIN"
                      autoFocus
                      required
                      className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-base tracking-widest font-mono text-center font-bold text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* On-Screen Touch / Click Numeric Keypad */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => handleQuickDigit(num)}
                      className="py-2 text-sm font-bold bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-200 rounded-lg border border-slate-700/60 transition cursor-pointer active:scale-95 shadow-sm"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPin('')}
                    className="py-2 text-xs font-semibold bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-700/60 transition cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDigit('0')}
                    className="py-2 text-sm font-bold bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-200 rounded-lg border border-slate-700/60 transition cursor-pointer active:scale-95"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleBackspace}
                    className="py-2 text-xs font-semibold bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-700/60 transition cursor-pointer"
                  >
                    &larr; Del
                  </button>
                </div>

                {/* Submit Action */}
                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-yellow-300" />
                    <span>Login as Master Administrator</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                {/* Footer Security Notice */}
                <div className="pt-3 border-t border-slate-800/80 text-center">
                  <p className="text-[11px] text-slate-400">
                    Protected by Master Admin Security &bull; Standalone Offline Mode
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    JADSL ICT Unit Community Centre, Gboko &bull; Tel: 070677978
                  </p>
                </div>

              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Footer System Credits */}
      <footer className="px-6 py-3 border-t border-slate-800/60 bg-slate-950/80 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Universal School Management System (USMS) &bull; Standalone Edition</span>
        <span>JADSL ICT Unit Community Centre, Gboko &bull; Tel: 070677978 &bull; WhatsApp: 08071119766</span>
      </footer>

    </div>
  );
};
