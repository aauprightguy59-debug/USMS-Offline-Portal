import React, { useState, useMemo } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  Calendar,
  Clock,
  BookOpen,
  User,
  Plus,
  Trash2,
  Printer,
  Download,
  Sparkles,
  Copy,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Edit3,
  Search,
  Filter,
  Save,
  X,
  RefreshCw,
  School,
  Share2
} from 'lucide-react';
import { USMSLogo } from './USMSLogo';
import {
  TermType,
  DayOfWeek,
  TimetableSlot,
  TimetablePeriod,
  ClassTimetable
} from '../types';
import { DEFAULT_PERIODS } from '../data/defaultData';
import * as XLSX from 'xlsx';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TERMS: TermType[] = ['1st Term', '2nd Term', '3rd Term'];

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800',
  'English Language': 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800',
  'Basic Science': 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-800',
  'Basic Technology': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800',
  'Physics': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-800',
  'Chemistry': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800',
  'Biology': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800',
  'Social Studies': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-800',
  'Civic Education': 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-200 dark:border-cyan-800',
  'Computer Studies': 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-800',
  'Business Studies': 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-800',
  'Agricultural Science': 'bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/40 dark:text-lime-200 dark:border-lime-800',
  'Economics': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-800',
  'Government': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-900/40 dark:text-fuchsia-200 dark:border-fuchsia-800',
  'CRS/IRS': 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/40 dark:text-violet-200 dark:border-violet-800',
  'Literature in English': 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-800',
  'Physical & Health Education': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800',
  'Creative Art': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-800',
  'Numeracy': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800',
  'Literacy': 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800'
};

const getSubjectColor = (subject: string) => {
  return SUBJECT_COLORS[subject] || 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
};

export const TimetableManagementView: React.FC = () => {
  const {
    schoolProfile,
    classes,
    staff,
    timetables,
    saveTimetable,
    getTimetable,
    deleteTimetable,
    generateDefaultTimetable
  } = useSchool();

  // Active Selectors
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.name || 'JSS 1');
  const [selectedTerm, setSelectedTerm] = useState<TermType>(schoolProfile.currentTerm || '1st Term');
  const [selectedSession, setSelectedSession] = useState<string>(schoolProfile.session || '2024/2025');

  // View Mode: 'builder' | 'print'
  const [viewMode, setViewMode] = useState<'builder' | 'print'>('builder');

  // Slot Editing State
  const [editingCell, setEditingCell] = useState<{ day: DayOfWeek; periodNumber: number; currentSlot?: TimetableSlot } | null>(null);
  const [slotSubject, setSlotSubject] = useState('');
  const [slotTeacherId, setSlotTeacherId] = useState('');
  const [slotRoom, setSlotRoom] = useState('');
  const [slotNotes, setSlotNotes] = useState('');

  // Copy modal
  const [copySourceTerm, setCopySourceTerm] = useState<TermType>('1st Term');
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // Filter or search
  const [filterTeacher, setFilterTeacher] = useState<string>('all');

  // Current Class Timetable object
  const currentTimetable = useMemo(() => {
    return getTimetable(selectedClass, selectedSession, selectedTerm);
  }, [getTimetable, selectedClass, selectedSession, selectedTerm, timetables]);

  const periods = currentTimetable?.periodsConfig || DEFAULT_PERIODS;

  // Selected class object
  const currentClassObj = classes.find(c => c.name === selectedClass);
  const classSubjects = currentClassObj?.subjects || ['Mathematics', 'English Language', 'Basic Science'];

  // Handle opening slot editor
  const handleOpenEditSlot = (day: DayOfWeek, periodNumber: number) => {
    const existing = currentTimetable?.slots.find(s => s.day === day && s.periodNumber === periodNumber);
    setEditingCell({ day, periodNumber, currentSlot: existing });
    setSlotSubject(existing?.subject || classSubjects[0] || '');
    setSlotTeacherId(existing?.teacherId || '');
    setSlotRoom(existing?.room || `Room ${selectedClass}`);
    setSlotNotes(existing?.notes || '');
  };

  // Handle saving single slot
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCell) return;

    const selectedTeacher = staff.find(st => st.id === slotTeacherId);

    const newSlot: TimetableSlot = {
      id: editingCell.currentSlot?.id || `slot-${Date.now()}`,
      day: editingCell.day,
      periodNumber: editingCell.periodNumber,
      subject: slotSubject,
      teacherId: slotTeacherId || undefined,
      teacherName: selectedTeacher?.fullName || undefined,
      room: slotRoom,
      notes: slotNotes
    };

    const existingSlots = currentTimetable?.slots || [];
    const filteredSlots = existingSlots.filter(
      s => !(s.day === editingCell.day && s.periodNumber === editingCell.periodNumber)
    );

    const updatedTimetable: ClassTimetable = {
      id: currentTimetable?.id || `tt-${selectedClass.replace(/\s+/g, '_')}-${selectedSession.replace('/', '_')}-${selectedTerm.replace(/\s+/g, '_')}`,
      className: selectedClass,
      session: selectedSession,
      term: selectedTerm,
      slots: [...filteredSlots, newSlot],
      periodsConfig: periods,
      lastUpdated: new Date().toISOString(),
      classTeacher: currentClassObj?.classTeacher
    };

    saveTimetable(updatedTimetable);
    setEditingCell(null);
  };

  // Handle clearing single slot
  const handleClearSlot = (day: DayOfWeek, periodNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentTimetable) return;

    const filteredSlots = currentTimetable.slots.filter(
      s => !(s.day === day && s.periodNumber === periodNumber)
    );

    saveTimetable({
      ...currentTimetable,
      slots: filteredSlots,
      lastUpdated: new Date().toISOString()
    });
  };

  // Smart Auto-Generate
  const handleAutoGenerate = () => {
    if (currentTimetable && currentTimetable.slots.length > 0) {
      if (!window.confirm(`Generate smart schedule for ${selectedClass} (${selectedTerm})? This will replace current entries.`)) {
        return;
      }
    }
    generateDefaultTimetable(selectedClass, selectedSession, selectedTerm);
  };

  // Copy schedule from another term
  const handleCopyFromTerm = () => {
    const source = getTimetable(selectedClass, selectedSession, copySourceTerm);
    if (!source || source.slots.length === 0) {
      alert(`No schedule found in ${copySourceTerm} for ${selectedClass} to copy.`);
      return;
    }

    const copiedTimetable: ClassTimetable = {
      id: `tt-${selectedClass.replace(/\s+/g, '_')}-${selectedSession.replace('/', '_')}-${selectedTerm.replace(/\s+/g, '_')}`,
      className: selectedClass,
      session: selectedSession,
      term: selectedTerm,
      slots: source.slots.map(s => ({ ...s, id: `slot-${Date.now()}-${Math.random()}` })),
      periodsConfig: source.periodsConfig,
      lastUpdated: new Date().toISOString(),
      classTeacher: currentClassObj?.classTeacher
    };

    saveTimetable(copiedTimetable);
    setIsCopyModalOpen(false);
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (!currentTimetable || currentTimetable.slots.length === 0) {
      alert('Please populate the timetable before exporting.');
      return;
    }

    const rows: any[] = [];

    // Header info
    rows.push({ Period: `${schoolProfile.name} - Official Class Timetable` });
    rows.push({ Period: `Class: ${selectedClass} | Term: ${selectedTerm} | Session: ${selectedSession}` });
    rows.push({}); // Empty row

    // Table Header
    const teachingPeriods = periods.filter(p => !p.isAssembly && !p.isBreak);
    const tableHeader: Record<string, string> = { Period: 'Period / Time' };
    DAYS.forEach(d => { tableHeader[d] = d; });
    rows.push(tableHeader);

    // Populate rows
    periods.forEach(p => {
      if (p.isAssembly) {
        rows.push({
          Period: `${p.name} (${p.startTime} - ${p.endTime})`,
          Monday: 'Devotion',
          Tuesday: 'Devotion',
          Wednesday: 'Devotion',
          Thursday: 'Devotion',
          Friday: 'Devotion'
        });
      } else if (p.isBreak) {
        rows.push({
          Period: `--- ${p.name} (${p.startTime} - ${p.endTime}) ---`,
          Monday: 'BREAK',
          Tuesday: 'BREAK',
          Wednesday: 'BREAK',
          Thursday: 'BREAK',
          Friday: 'BREAK'
        });
      } else {
        const rowData: Record<string, string> = {
          Period: `P${p.periodNumber} (${p.startTime} - ${p.endTime})`
        };

        DAYS.forEach(d => {
          const slot = currentTimetable.slots.find(s => s.day === d && s.periodNumber === p.periodNumber);
          if (slot) {
            rowData[d] = `${slot.subject}${slot.teacherName ? ` [${slot.teacherName}]` : ''}`;
          } else {
            rowData[d] = '—';
          }
        });

        rows.push(rowData);
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${selectedClass} Timetable`);
    XLSX.writeFile(workbook, `Timetable_${selectedClass}_${selectedTerm}_${selectedSession.replace('/', '-')}.xlsx`);
  };

  // Conflict Checker: Detect if any teacher is assigned to multiple classes at the same day & period
  const conflicts = useMemo(() => {
    const conflictList: { teacherName: string; day: DayOfWeek; periodNumber: number; classes: string[] }[] = [];
    
    // Group all active timetables in current term & session
    const activeTermTimetables = timetables.filter(t => t.term === selectedTerm && t.session === selectedSession);

    DAYS.forEach(day => {
      for (let p = 1; p <= 8; p++) {
        const teacherClassMap: Record<string, string[]> = {};

        activeTermTimetables.forEach(tt => {
          const slot = tt.slots.find(s => s.day === day && s.periodNumber === p);
          if (slot && slot.teacherName && slot.teacherName !== 'Subject Teacher') {
            if (!teacherClassMap[slot.teacherName]) {
              teacherClassMap[slot.teacherName] = [];
            }
            teacherClassMap[slot.teacherName].push(tt.className);
          }
        });

        Object.entries(teacherClassMap).forEach(([teacher, classList]) => {
          if (classList.length > 1) {
            conflictList.push({
              teacherName: teacher,
              day,
              periodNumber: p,
              classes: classList
            });
          }
        });
      }
    });

    return conflictList;
  }, [timetables, selectedTerm, selectedSession]);

  return (
    <div className="space-y-5">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-800">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Timetable Management
              <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                Term Designer
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Design, customize, schedule, and print class timetables across 1st, 2nd, and 3rd Terms.
            </p>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={handleAutoGenerate}
            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Smart Auto-Fill</span>
          </button>

          <button
            onClick={() => setIsCopyModalOpen(true)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-600 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy From Term</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-600 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'builder' ? 'print' : 'builder')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'print'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-800 dark:bg-slate-900 text-white hover:bg-slate-700'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{viewMode === 'print' ? 'Back to Editor' : 'Printable Timetable'}</span>
          </button>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Left: Term Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start">
          {TERMS.map(term => (
            <button
              key={term}
              onClick={() => setSelectedTerm(term)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedTerm === term
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {term}
            </button>
          ))}
        </div>

        {/* Right: Class & Session Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold px-3 py-1.5 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {classes.map(c => (
                <option key={c.id} value={c.name}>{c.name} ({c.category})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Session:</span>
            <input
              type="text"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              placeholder="e.g. 2024/2025"
              className="w-24 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold px-2 py-1.5 text-slate-900 dark:text-white text-center focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {currentTimetable && (
            <button
              onClick={() => {
                if (window.confirm(`Clear timetable for ${selectedClass} (${selectedTerm})?`)) {
                  deleteTimetable(currentTimetable.id);
                }
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
              title="Delete Class Timetable"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Conflict Warnings (if any) */}
      {conflicts.length > 0 && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Schedule Conflict Detected across classes:</p>
            <ul className="mt-1 list-disc list-inside space-y-0.5 text-[11px]">
              {conflicts.map((c, i) => (
                <li key={i}>
                  <strong>{c.teacherName}</strong> is assigned to multiple classes (
                  <span className="font-semibold">{c.classes.join(', ')}</span>) on{' '}
                  <span className="underline">{c.day} Period {c.periodNumber}</span>.
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: INTERACTIVE BUILDER MATRIX */}
      {/* ========================================================================= */}
      {viewMode === 'builder' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{selectedClass} &bull; {selectedTerm} Timetable Grid</span>
                {currentClassObj?.classTeacher && (
                  <span className="text-[11px] text-slate-500 font-normal">
                    (Form Master: <strong className="text-slate-700 dark:text-slate-300">{currentClassObj.classTeacher}</strong>)
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click any cell to edit subject, teacher, and classroom venue.
              </p>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Active Slots: {currentTimetable?.slots.length || 0}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 5 Days Scheduled
              </span>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs uppercase font-bold">
                  <th className="p-3 w-40 border-r border-slate-200 dark:border-slate-700">Time / Period</th>
                  {DAYS.map(day => (
                    <th key={day} className="p-3 text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-xs">
                {periods.map(period => {
                  if (period.isAssembly) {
                    return (
                      <tr key={period.id} className="bg-blue-50/50 dark:bg-blue-950/20 text-slate-700 dark:text-slate-300">
                        <td className="p-3 border-r border-slate-200 dark:border-slate-700 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>{period.startTime} - {period.endTime}</span>
                          </div>
                          <span className="text-[10px] text-blue-600 font-bold block">{period.name}</span>
                        </td>
                        <td colSpan={5} className="p-3 text-center font-bold text-blue-900 dark:text-blue-300 tracking-wider uppercase text-[11px] bg-blue-50/70 dark:bg-blue-900/20">
                          🔔 Morning Devotion, Roll Call & School Assembly
                        </td>
                      </tr>
                    );
                  }

                  if (period.isBreak) {
                    return (
                      <tr key={period.id} className="bg-amber-50/40 dark:bg-amber-950/20 text-slate-700 dark:text-slate-300">
                        <td className="p-2.5 border-r border-slate-200 dark:border-slate-700 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{period.startTime} - {period.endTime}</span>
                          </div>
                          <span className="text-[10px] text-amber-600 font-bold block">{period.name}</span>
                        </td>
                        <td colSpan={5} className="p-2.5 text-center font-bold text-amber-800 dark:text-amber-300 tracking-wider uppercase text-[11px] bg-amber-50/60 dark:bg-amber-900/20">
                          ☕ {period.name} & Recreation
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={period.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/20 transition">
                      
                      {/* Period Time Column */}
                      <td className="p-3 border-r border-slate-200 dark:border-slate-700 font-medium bg-slate-50/30 dark:bg-slate-900/20">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          Period {period.periodNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {period.startTime} - {period.endTime}
                        </span>
                      </td>

                      {/* Day Columns */}
                      {DAYS.map(day => {
                        const slot = currentTimetable?.slots.find(
                          s => s.day === day && s.periodNumber === period.periodNumber
                        );

                        return (
                          <td
                            key={day}
                            onClick={() => handleOpenEditSlot(day, period.periodNumber)}
                            className="p-2 border-r border-slate-200 dark:border-slate-700 last:border-r-0 align-top cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition group relative min-h-[70px]"
                          >
                            {slot ? (
                              <div className={`p-2 rounded-lg border text-xs flex flex-col justify-between h-full shadow-xs transition-all group-hover:ring-1 group-hover:ring-blue-400 ${getSubjectColor(slot.subject)}`}>
                                <div className="flex items-start justify-between gap-1">
                                  <span className="font-bold leading-tight line-clamp-2">
                                    {slot.subject}
                                  </span>
                                  <button
                                    onClick={(e) => handleClearSlot(day, period.periodNumber, e)}
                                    title="Remove Slot"
                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition p-0.5 rounded cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>

                                <div className="mt-2 pt-1 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] opacity-90">
                                  <span className="truncate max-w-[90px] font-medium">
                                    {slot.teacherName || 'Teacher'}
                                  </span>
                                  {slot.room && (
                                    <span className="text-[9px] px-1 py-0.2 bg-white/40 dark:bg-black/20 rounded font-mono truncate max-w-[60px]">
                                      {slot.room}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="h-full min-h-[56px] border border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-400 group-hover:border-blue-400 group-hover:text-blue-600 transition text-[11px] font-medium bg-slate-50/30 dark:bg-slate-900/10">
                                <span className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                                  <Plus className="w-3 h-3" /> Assign
                                </span>
                              </div>
                            )}
                          </td>
                        );
                      })}

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {(!currentTimetable || currentTimetable.slots.length === 0) && (
            <div className="p-8 text-center bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                No Timetable Schedule for {selectedClass} ({selectedTerm})
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Click "Smart Auto-Fill" to automatically generate a complete weekly timetable or click any slot in the grid to schedule subjects manually.
              </p>
              <button
                onClick={handleAutoGenerate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Generate Smart Timetable</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: PRINTABLE OFFICIAL A4 TIMETABLE */}
      {/* ========================================================================= */}
      {viewMode === 'print' && (
        <div className="bg-white text-slate-900 rounded-xl border border-slate-300 shadow-md p-6 sm:p-8 max-w-5xl mx-auto print:border-none print:shadow-none print:p-0">
          
          {/* Print controls bar (hidden when actually printing) */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 print:hidden">
            <button
              onClick={() => setViewMode('builder')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              &larr; Back to Timetable Editor
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Timetable (Ctrl + P)</span>
            </button>
          </div>

          {/* Printable Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4">
            <div className="w-16 h-16 flex-shrink-0">
              {schoolProfile.logoUrl ? (
                <img src={schoolProfile.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <USMSLogo className="w-16 h-16" />
              )}
            </div>

            <div className="text-center flex-1 px-4">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 font-serif">
                {schoolProfile.name}
              </h1>
              <p className="text-xs text-slate-700 italic font-serif">
                "{schoolProfile.motto}"
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {schoolProfile.address} &bull; Tel: {schoolProfile.phone}
              </p>
              <div className="inline-block mt-1.5 px-3 py-0.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded">
                Official Master Class Timetable &bull; {selectedTerm} ({selectedSession})
              </div>
            </div>

            <div className="w-16 h-16 flex items-center justify-center border border-slate-300 rounded text-center text-[10px] text-slate-400 font-mono">
              STAMP / SEAL
            </div>
          </div>

          {/* Sub Header Specs */}
          <div className="flex items-center justify-between text-xs font-semibold py-2 px-3 bg-slate-100 rounded border border-slate-300 mb-4">
            <span><strong>CLASS:</strong> {selectedClass}</span>
            <span><strong>FORM MASTER:</strong> {currentClassObj?.classTeacher || 'Not Assigned'}</span>
            <span><strong>TERM:</strong> {selectedTerm}</span>
            <span><strong>SESSION:</strong> {selectedSession}</span>
          </div>

          {/* Printable Table */}
          <table className="w-full border-collapse border border-slate-900 text-xs">
            <thead>
              <tr className="bg-slate-200 border-b border-slate-900 font-bold">
                <th className="border border-slate-900 p-2 text-left w-32">TIME / PERIOD</th>
                {DAYS.map(d => (
                  <th key={d} className="border border-slate-900 p-2 text-center uppercase">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map(p => {
                if (p.isAssembly) {
                  return (
                    <tr key={p.id} className="bg-slate-100 border-b border-slate-900">
                      <td className="border border-slate-900 p-2 font-bold">
                        {p.startTime} - {p.endTime}
                      </td>
                      <td colSpan={5} className="border border-slate-900 p-2 text-center font-bold tracking-wider uppercase text-[11px]">
                        🔔 DEVOTION & SCHOOL ASSEMBLY
                      </td>
                    </tr>
                  );
                }

                if (p.isBreak) {
                  return (
                    <tr key={p.id} className="bg-slate-100 border-b border-slate-900">
                      <td className="border border-slate-900 p-1.5 font-bold">
                        {p.startTime} - {p.endTime}
                      </td>
                      <td colSpan={5} className="border border-slate-900 p-1.5 text-center font-bold tracking-wider uppercase text-[10px]">
                        ☕ {p.name}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={p.id} className="border-b border-slate-900">
                    <td className="border border-slate-900 p-2 bg-slate-50 font-medium">
                      <strong>Period {p.periodNumber}</strong>
                      <div className="text-[10px] text-slate-600">{p.startTime} - {p.endTime}</div>
                    </td>
                    {DAYS.map(day => {
                      const slot = currentTimetable?.slots.find(
                        s => s.day === day && s.periodNumber === p.periodNumber
                      );
                      return (
                        <td key={day} className="border border-slate-900 p-2 text-center align-top">
                          {slot ? (
                            <div>
                              <div className="font-bold text-slate-900 leading-tight">
                                {slot.subject}
                              </div>
                              {slot.teacherName && (
                                <div className="text-[10px] text-slate-600 mt-0.5">
                                  ({slot.teacherName})
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-10 mt-8 text-center text-xs">
            <div>
              <div className="border-b border-slate-900 pb-1 font-semibold">
                {currentClassObj?.classTeacher || 'Form Master'}
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-1">
                Class Teacher Signature
              </span>
            </div>
            <div>
              <div className="border-b border-slate-900 pb-1 font-semibold">
                Dean of Studies / Academic Coordinator
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-1">
                Timetable Committee
              </span>
            </div>
            <div>
              <div className="border-b border-slate-900 pb-1 font-semibold">
                {schoolProfile.principalName}
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-1">
                Principal / Head of School
              </span>
            </div>
          </div>

          <div className="text-center pt-6 mt-6 border-t border-slate-200 text-[10px] text-slate-400">
            Powered by Universal School Management System (USMS) &bull; JADSL ICT Unit Community Centre, Gboko
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT SINGLE PERIOD SLOT */}
      {/* ========================================================================= */}
      {editingCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">
                  Schedule {editingCell.day} &bull; Period {editingCell.periodNumber}
                </h4>
                <p className="text-[11px] text-blue-100">
                  {selectedClass} ({selectedTerm})
                </p>
              </div>
              <button
                onClick={() => setEditingCell(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="p-5 space-y-4">
              
              {/* Subject Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Subject Name *
                </label>
                <select
                  value={slotSubject}
                  onChange={(e) => setSlotSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold px-3 py-2 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Select Subject --</option>
                  {classSubjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                  <option value="Physical Education">Physical Education / Games</option>
                  <option value="Library Studies">Library Studies</option>
                  <option value="Creative Workshop">Creative Workshop / Crafts</option>
                  <option value="Quiz & Debate">Quiz & Debate</option>
                </select>
              </div>

              {/* Teacher Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Assigned Teacher
                </label>
                <select
                  value={slotTeacherId}
                  onChange={(e) => setSlotTeacherId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold px-3 py-2 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- Form Teacher / General --</option>
                  {staff.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Classroom / Venue */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Classroom / Laboratory / Venue
                </label>
                <input
                  type="text"
                  value={slotRoom}
                  onChange={(e) => setSlotRoom(e.target.value)}
                  placeholder="e.g. Science Lab, ICT Center, Classroom 2B"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs px-3 py-2 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Special Instructions / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={slotNotes}
                  onChange={(e) => setSlotNotes(e.target.value)}
                  placeholder="e.g. Practical experiment or Quiz"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs px-3 py-2 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCell(null)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Slot</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: COPY TIMETABLE FROM OTHER TERM */}
      {/* ========================================================================= */}
      {isCopyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden p-5">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              Copy Timetable Schedule
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Duplicate timetable configuration from a previous term into <strong>{selectedTerm}</strong> for {selectedClass}.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Source Term:
                </label>
                <select
                  value={copySourceTerm}
                  onChange={(e) => setCopySourceTerm(e.target.value as TermType)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold p-2.5"
                >
                  {TERMS.filter(t => t !== selectedTerm).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCopyModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCopyFromTerm}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow cursor-pointer"
                >
                  Copy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
