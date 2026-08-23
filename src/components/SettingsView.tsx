import React, { useState, useRef } from 'react';
import { useSchool } from '../context/SchoolContext';
import { SchoolProfile, ClassInfo, AdminConfig, TermType, ACADEMIC_SESSIONS } from '../types';
import {
  Settings,
  Building,
  Upload,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  Sliders,
  Database,
  Download,
  FileCode,
  Layers,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Shield,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  FileText,
  LogOut
} from 'lucide-react';
import { USMSLogo } from './USMSLogo';

export const SettingsView: React.FC = () => {
  const {
    schoolProfile,
    updateSchoolProfile,
    classes,
    addClass,
    deleteClass,
    resetToDemoData,
    clearAllData,
    exportDatabaseJSON,
    importDatabaseBackup,
    isAdminAuthenticated,
    adminLogout,
    updateAdminCredentials
  } = useSchool();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<SchoolProfile>({ ...schoolProfile });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCategory, setNewClassCategory] = useState<ClassInfo['category']>('Junior Secondary');

  // Admin PIN management state
  const [adminUsername, setAdminUsername] = useState(schoolProfile.adminConfig?.username || 'admin');
  const [newPin, setNewPin] = useState(schoolProfile.adminConfig?.pin || '1234');
  const [confirmPin, setConfirmPin] = useState(schoolProfile.adminConfig?.pin || '1234');
  const [showPin, setShowPin] = useState(false);
  const [pinChangeMsg, setPinChangeMsg] = useState('');
  const [pinError, setPinError] = useState('');

  // Sync state if context changes
  React.useEffect(() => {
    setFormData({ ...schoolProfile });
    if (schoolProfile.adminConfig) {
      setAdminUsername(schoolProfile.adminConfig.username || 'admin');
      setNewPin(schoolProfile.adminConfig.pin || '1234');
      setConfirmPin(schoolProfile.adminConfig.pin || '1234');
    }
  }, [schoolProfile]);

  const handleInputChange = (field: keyof SchoolProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'stampUrl' | 'principalSignatureUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim()) {
      setPinError('PIN cannot be empty');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }
    updateAdminCredentials({
      username: adminUsername.trim() || 'admin',
      pin: newPin.trim(),
      isPinSet: true
    });
    setPinError('');
    setPinChangeMsg('Admin PIN updated successfully!');
    setTimeout(() => setPinChangeMsg(''), 3000);
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    addClass({
      name: newClassName.trim(),
      category: newClassCategory,
      subjects: [
        'Mathematics',
        'English Language',
        'Basic Science',
        'Social Studies',
        'Civic Education',
        'Agricultural Science',
        'Computer Studies',
        'CRS/IRS'
      ]
    });

    setNewClassName('');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const success = importDatabaseBackup(reader.result as string);
        if (success) {
          alert('Database restored successfully from backup!');
        } else {
          alert('Invalid backup file format. Please upload a valid USMS JSON backup.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (window.confirm('⚠️ FACTORY RESET / CLEAN SLATE:\n\nAre you sure you want to delete all students, staff, examination scores, and timetables? This resets the system to a clean, empty state ready for fresh school data.')) {
      clearAllData();
      alert('All records have been cleared. The system is now in a clean default state.');
    }
  };

  const handleLoadDemo = () => {
    if (window.confirm('Load sample demonstration data for testing? (You can clear it at any time).')) {
      resetToDemoData();
      alert('Sample test data loaded.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-800 flex-shrink-0">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              System Setup & Configuration
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Master Admin
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize school profile, branding, report templates, security credentials, and offline storage.
            </p>
          </div>
        </div>

        {isAdminAuthenticated && (
          <button
            onClick={adminLogout}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-600 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Lock Admin Session</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-4 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 text-green-800 dark:text-green-300 text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600" />
          <span>School setup settings and profile saved successfully!</span>
        </div>
      )}

      {/* Main Configuration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. SCHOOL PROFILE & BRANDING */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Building className="w-4 h-4 text-blue-600" />
            <span>1. School Profile, Identity & Branding</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Logo, Stamp & Signature Uploads */}
            <div className="space-y-4">
              
              {/* School Logo */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/30 text-center">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Official School Logo
                </label>
                <div className="w-24 h-24 mx-auto rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden mb-3 relative group shadow-inner">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Logo Preview"
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <USMSLogo className="w-14 h-14 opacity-80" />
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'logoUrl')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-xs font-semibold border border-blue-200 dark:border-blue-800 transition cursor-pointer"
                >
                  Upload Logo
                </button>
              </div>

              {/* School Stamp */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/30 text-center">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Official School Stamp
                </label>
                <div className="w-20 h-20 mx-auto rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden mb-2 text-slate-400 text-xs">
                  {formData.stampUrl ? (
                    <img src={formData.stampUrl} alt="Stamp" className="w-full h-full object-contain p-1" />
                  ) : (
                    <span>No Stamp</span>
                  )}
                </div>
                <input
                  ref={stampInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'stampUrl')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => stampInputRef.current?.click()}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded text-xs font-semibold transition cursor-pointer"
                >
                  Upload Stamp
                </button>
              </div>

            </div>

            {/* Core School Info */}
            <div className="md:col-span-2 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  School Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Universal Comprehensive Academy"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold text-sm focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  School Motto / Slogan
                </label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={(e) => handleInputChange('motto', e.target.value)}
                  placeholder="e.g. Knowledge, Integrity & Excellence"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    School Category
                  </label>
                  <select
                    value={formData.schoolType}
                    onChange={(e) => handleInputChange('schoolType', e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value="combined">Comprehensive / Combined (Nursery - SSS)</option>
                    <option value="secondary">Secondary School Only (JSS 1 - SSS 3)</option>
                    <option value="primary">Primary School Only (Primary 1 - 6)</option>
                    <option value="nursery">Nursery / Creche Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Admission Number Prefix
                  </label>
                  <input
                    type="text"
                    value={formData.admissionPrefix}
                    onChange={(e) => handleInputChange('admissionPrefix', e.target.value.toUpperCase())}
                    placeholder="e.g. USMS or CMCA"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono uppercase font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Physical School Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="e.g. No. 14 Gboko Road, Gboko, Benue State"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Official Phone Number(s)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="e.g. 07067797854, 08071119766"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Official School Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="e.g. admin@school.edu.ng"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ACADEMIC SESSION, TERM & REPORT STYLES */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>2. Academic Session, Current Term & Report Sheet Template</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Active Academic Session *
              </label>
              <select
                value={formData.session}
                onChange={(e) => handleInputChange('session', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {ACADEMIC_SESSIONS.map((sess) => (
                  <option key={sess} value={sess}>
                    {sess} Academic Session
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Current Term *
              </label>
              <select
                value={formData.currentTerm}
                onChange={(e) => handleInputChange('currentTerm', e.target.value as TermType)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold text-xs"
              >
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Report Sheet Style
              </label>
              <select
                value={formData.templateStyle || 'prestige'}
                onChange={(e) => handleInputChange('templateStyle', e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold text-xs"
              >
                <option value="prestige">Prestige Academic Layout (Standard)</option>
                <option value="classic">Classic Royal Blue Layout</option>
                <option value="modern">Modern Minimalist Layout</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Principal / Head Teacher Name
              </label>
              <input
                type="text"
                value={formData.principalName || ''}
                onChange={(e) => handleInputChange('principalName', e.target.value)}
                placeholder="e.g. Dr. (Mrs.) Bridget A. Tyover"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                School Bursar / Finance Officer
              </label>
              <input
                type="text"
                value={formData.bursarName || ''}
                onChange={(e) => handleInputChange('bursarName', e.target.value)}
                placeholder="e.g. Mr. Solomon K. Bem"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Next Term Resumption Date
              </label>
              <input
                type="date"
                value={formData.nextTermResumptionDate || ''}
                onChange={(e) => handleInputChange('nextTermResumptionDate', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Next Term School Fee (Optional)
              </label>
              <input
                type="text"
                value={formData.nextTermFee || ''}
                onChange={(e) => handleInputChange('nextTermFee', e.target.value)}
                placeholder="e.g. ₦45,000.00"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. CLASS MANAGEMENT */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>3. School Classes & Levels ({classes.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {classes.map(c => (
              <div
                key={c.id}
                className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between"
              >
                <div>
                  <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                    {c.name}
                  </strong>
                  <span className="text-[10px] text-slate-500">{c.category} &bull; {c.subjects.length} Subjects</span>
                </div>

                {classes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteClass(c.id)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add New Class Form */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="New class name (e.g. SSS 3 Arts)"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
            <select
              value={newClassCategory}
              onChange={(e) => setNewClassCategory(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
            >
              <option value="Nursery">Nursery</option>
              <option value="Primary">Primary</option>
              <option value="Junior Secondary">Junior Secondary</option>
              <option value="Senior Secondary">Senior Secondary</option>
            </select>
            <button
              type="button"
              onClick={handleAddClass}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" /> Add Class
            </button>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save School Profile & Settings</span>
          </button>
        </div>

      </form>

      {/* ========================================================================= */}
      {/* 4. ADMIN SECURITY CREDENTIALS (MASTER PIN) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Shield className="w-4 h-4 text-blue-600" />
          <span>4. Master Admin Security Credentials & PIN</span>
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure the Master PIN used to lock and safeguard School Setup, system configurations, and administrative functions from unauthorized access.
        </p>

        {pinChangeMsg && (
          <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2 text-xs text-green-700 dark:text-green-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>{pinChangeMsg}</span>
          </div>
        )}

        {pinError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300 font-semibold">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>{pinError}</span>
          </div>
        )}

        <form onSubmit={handleSavePin} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Admin Username
            </label>
            <input
              type="text"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              New Master PIN
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter new PIN"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Confirm Master PIN
            </label>
            <div className="flex gap-2">
              <input
                type={showPin ? 'text' : 'password'}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Confirm PIN"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white tracking-widest"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex-shrink-0 cursor-pointer shadow-sm"
              >
                Update PIN
              </button>
            </div>
          </div>
        </form>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Active Session: <strong className="text-slate-800 dark:text-slate-200">{adminUsername}</strong> (Master Privilege)
          </div>
          <button
            id="btn-settings-logout-session"
            type="button"
            onClick={() => adminLogout()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white rounded-lg text-xs font-bold border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock / Logout Admin Session</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. OFFLINE BACKUP, CLEAN SLATE & FACTORY RESET */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Database className="w-4 h-4 text-amber-500" />
          <span>5. Standalone Data Management, Backup & Clean Reset</span>
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          USMS operates 100% locally on your computer with offline persistence. You can download a complete backup JSON file or reset to a clean default state.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          
          {/* Export JSON */}
          <button
            type="button"
            onClick={exportDatabaseJSON}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Database Backup (.json)</span>
          </button>

          {/* Import JSON */}
          <input
            ref={backupInputRef}
            type="file"
            accept=".json"
            onChange={handleImportBackup}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => backupInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-600 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Restore Backup (.json)</span>
          </button>

          {/* Load Sample Demo Data */}
          <button
            type="button"
            onClick={handleLoadDemo}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800 cursor-pointer ml-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>Load Sample Demo Data</span>
          </button>

          {/* Clean Slate / Reset All */}
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 rounded-xl text-xs font-bold border border-red-200 dark:border-red-800 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Clean Slate / Clear All Entries</span>
          </button>

        </div>
      </div>

    </div>
  );
};
