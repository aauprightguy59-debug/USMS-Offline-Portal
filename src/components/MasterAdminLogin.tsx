import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { USMSLogo } from './USMSLogo';
import {
  Lock,
  User,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Phone,
  MessageSquare
} from 'lucide-react';

interface MasterAdminLoginProps {
  onLoginSuccess?: () => void;
}

export const MasterAdminLogin: React.FC<MasterAdminLoginProps> = ({ onLoginSuccess }) => {
  const { schoolProfile, adminLogin } = useSchool();
  
  const [username, setUsername] = useState('admin');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter Admin User Name');
      return;
    }
    if (!pin.trim()) {
      setError('Please enter PIN');
      return;
    }

    const success = adminLogin(pin, username);
    if (success) {
      setError('');
      setIsSuccess(true);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
      }, 350);
    } else {
      setError('Invalid Admin User Name or PIN. Please try again.');
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between items-center p-4 sm:p-6 text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-hidden font-sans">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Spacer to balance vertical centering */}
      <div className="hidden sm:block h-2" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md my-auto">
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          
          {/* Header with Small Logo Icon */}
          <div className="flex flex-col items-center text-center pb-5 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 flex items-center justify-center p-1.5 shadow-md ring-1 ring-blue-400/30 mb-3">
              <USMSLogo className="w-6 h-6" />
            </div>
            
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
              Universal School Management System
            </h1>
            
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide">
              <span>School Administrator</span>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed max-w-sm">
              Universal School Management System requires authenticated administrator login before granting access. All school records, student registers, staff payroll, examination computation, and broadsheets are consolidated inside the Master Dashboard.
            </p>
          </div>

          {/* Form Body: Admin User Name before PIN */}
          <form onSubmit={handleLogin} className="space-y-4 pt-5">
            
            {error && (
              <div className="p-3 bg-red-950/70 border border-red-800/80 rounded-xl flex items-center gap-2 text-xs text-red-300 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {isSuccess && (
              <div className="p-3 bg-green-950/70 border border-green-800/80 rounded-xl flex items-center gap-2 text-xs text-green-300 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-400" />
                <span>Access granted. Loading Master Dashboard...</span>
              </div>
            )}

            {/* 1. Admin User Name Field (Before PIN) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin User Name
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
                  placeholder="Enter Admin User Name"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-inner"
                />
              </div>
            </div>

            {/* 2. Admin PIN Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Master Administrator PIN
                </label>
                <span className="text-[11px] text-slate-500 font-mono">PIN / Security Code</span>
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
                  placeholder="Enter PIN"
                  autoFocus
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-base tracking-widest font-mono text-center font-bold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                  tabIndex={-1}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Touch / Click Numeric Keypad */}
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

            {/* Unlock Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-yellow-300" />
                <span>Login to Master Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Requested Login Screen Footer */}
      <footer className="relative z-10 w-full max-w-xl mt-6 pt-4 border-t border-slate-800/80 text-center space-y-2.5 text-slate-400">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-emerald-400 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Protected by Master Admin Security</span>
        </div>
        
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-slate-300">
            Developed by: <span className="text-white font-bold">JADSL ICT Unit Community Centre, Gboko</span>
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Universal School Management System (USMS) &bull; Standalone Edition &copy; 2026 JADSL ICT Unit Community Centre, Gboko &bull; Tel: <a href="tel:070677978" className="text-blue-400 hover:underline font-mono">070677978</a> &bull; WhatsApp: <a href="https://wa.me/2348071119766" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-mono">08071119766</a>
          </p>
        </div>
      </footer>

    </div>
  );
};
