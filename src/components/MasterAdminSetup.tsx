import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { USMSLogo } from './USMSLogo';
import { Building2, KeyRound, ShieldCheck } from 'lucide-react';

export const MasterAdminSetup: React.FC = () => {
  const { updateSchoolProfile, updateAdminCredentials } = useSchool();
  const [schoolName, setSchoolName] = useState('');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!schoolName.trim() || !username.trim() || !pin.trim()) {
      setError('School name, administrator username, and PIN are required.');
      return;
    }
    if (pin.trim() !== confirmPin.trim()) {
      setError('PIN entries do not match.');
      return;
    }
    updateSchoolProfile({ name: schoolName.trim(), isConfigured: true });
    updateAdminCredentials({ username: username.trim(), pin: pin.trim(), securityAnswer: pin.trim() });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-center border-b border-slate-800 pb-5 mb-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-900 flex items-center justify-center p-3 mb-3 ring-2 ring-blue-400/30">
            <USMSLogo className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-white">Set Up Your School</h1>
          <p className="text-xs text-slate-400 mt-2">Create the first Master Administrator account before anyone can sign in.</p>
        </div>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-950 border border-red-800 text-xs text-red-300">{error}</div>}
        <div className="space-y-4">
          <label className="block text-xs font-semibold">School name<input value={schoolName} onChange={event => setSchoolName(event.target.value)} placeholder="e.g. Excellence College" className="mt-1 w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white" /></label>
          <label className="block text-xs font-semibold">Master Administrator username<input value={username} onChange={event => setUsername(event.target.value)} placeholder="Create a username" className="mt-1 w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white" /></label>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-xs font-semibold">Master PIN<input type="password" value={pin} onChange={event => setPin(event.target.value)} placeholder="Create a PIN" className="mt-1 w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white" /></label>
            <label className="block text-xs font-semibold">Confirm PIN<input type="password" value={confirmPin} onChange={event => setConfirmPin(event.target.value)} placeholder="Repeat the PIN" className="mt-1 w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white" /></label>
          </div>
        </div>
        <button type="submit" className="mt-6 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4" /> Create Master Administrator</button>
        <div className="mt-4 flex justify-center gap-4 text-[11px] text-slate-500"><span><Building2 className="inline w-3 h-3 mr-1" />School identity</span><span><KeyRound className="inline w-3 h-3 mr-1" />Private credentials</span></div>
      </form>
    </div>
  );
};
