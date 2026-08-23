import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { USMSLogo } from './USMSLogo';
import { Shield, Lock, KeyRound, AlertCircle, CheckCircle2, ArrowRight, Eye, EyeOff, X } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Administrator Access Required',
  description = 'For security reasons, School Setup and Administrative configurations require administrator authentication.'
}) => {
  const { adminLogin, schoolProfile } = useSchool();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setError('Please enter the Admin PIN');
      return;
    }

    const success = adminLogin(pin);
    if (success) {
      setError('');
      setIsSuccessAnim(true);
      setTimeout(() => {
        setIsSuccessAnim(false);
        setPin('');
        onSuccess();
      }, 400);
    } else {
      setError('Incorrect Master Admin PIN. Access Denied.');
    }
  };

  const handleQuickDigit = (digit: string) => {
    if (pin.length < 16) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 relative flex flex-col items-center text-center">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center p-1.5 backdrop-blur-md ring-1 ring-yellow-400/40 shadow-inner mb-2.5">
            <USMSLogo className="w-6 h-6" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[11px] font-bold tracking-wider uppercase border border-yellow-400/30 mb-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>USMS Security Gateway</span>
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-blue-200 mt-1 max-w-xs leading-relaxed">
            {description}
          </p>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {isSuccessAnim && (
            <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/60 rounded-xl flex items-center gap-2.5 text-xs text-green-700 dark:text-green-300">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-500" />
              <span>Access Granted! Redirecting...</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Master Admin PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Enter Master Admin PIN"
                autoFocus
                className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base tracking-widest font-mono text-center font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick On-Screen PIN Pad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                type="button"
                key={num}
                onClick={() => handleQuickDigit(num)}
                className="py-2.5 text-sm font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/80 dark:border-slate-700 transition cursor-pointer active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPin('')}
              className="py-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 rounded-xl border border-slate-200/80 dark:border-slate-700 transition cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleQuickDigit('0')}
              className="py-2.5 text-sm font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/80 dark:border-slate-700 transition cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="py-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 rounded-xl border border-slate-200/80 dark:border-slate-700 transition cursor-pointer"
            >
              &larr; Del
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Admin Setup</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition cursor-pointer"
              >
                Cancel & Return
              </button>
            )}
          </div>

          {/* Security Note */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Default System PIN: <strong className="font-mono text-blue-600 dark:text-blue-400">1234</strong>
              <br />
              <span className="text-[10px] text-slate-400">
                You can change this PIN anytime in System Setup &rarr; Security Settings.
              </span>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
};
