import React, { useState, useMemo } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Student, ComputedReportCard } from '../types';
import { computeStudentReportCard } from '../utils/computations';
import { PrintableReportCard } from './PrintableReportCard';
import {
  FileText,
  Printer,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Users,
  CheckCircle2
} from 'lucide-react';

export const ReportCardViewer: React.FC = () => {
  const {
    schoolProfile,
    classes,
    students,
    examScores,
    saveScoresBatch
  } = useSchool();

  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.name || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isBulkPrintMode, setIsBulkPrintMode] = useState<boolean>(false);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  // Behavioral sliders override state
  const [traitsOverride, setTraitsOverride] = useState<{
    punctuality: number;
    neatness: number;
    politeness: number;
    honesty: number;
    leadership: number;
    attentiveness: number;
    handwriting: number;
    sports: number;
    crafts: number;
    speechFluency: number;
    teacherRemarks: string;
    principalRemarks: string;
    presentDays: number;
    totalDays: number;
  }>({
    punctuality: 5,
    neatness: 5,
    politeness: 5,
    honesty: 5,
    leadership: 4,
    attentiveness: 5,
    handwriting: 4,
    sports: 5,
    crafts: 4,
    speechFluency: 5,
    teacherRemarks: 'A very disciplined and studious pupil with exceptional academic aptitude.',
    principalRemarks: 'Promoted with outstanding distinction.',
    presentDays: 118,
    totalDays: 120
  });

  const studentsInClass = useMemo(() => {
    return students.filter(s => s.currentClass === selectedClass && s.status === 'Active');
  }, [students, selectedClass]);

  // Set default student if none selected
  React.useEffect(() => {
    if (studentsInClass.length > 0) {
      if (!selectedStudentId || !studentsInClass.some(s => s.id === selectedStudentId)) {
        setSelectedStudentId(studentsInClass[0].id);
      }
    }
  }, [studentsInClass, selectedStudentId]);

  const activeStudent = studentsInClass.find(s => s.id === selectedStudentId);

  // Compute report card for active student
  const activeReportCard: ComputedReportCard | null = useMemo(() => {
    if (!activeStudent) return null;
    const computed = computeStudentReportCard(
      activeStudent,
      examScores,
      studentsInClass,
      schoolProfile.session,
      schoolProfile.currentTerm,
      schoolProfile.gradingScheme
    );

    // Apply custom overrides
    computed.behaviorTraits = {
      punctuality: traitsOverride.punctuality,
      neatness: traitsOverride.neatness,
      politeness: traitsOverride.politeness,
      honesty: traitsOverride.honesty,
      leadership: traitsOverride.leadership,
      attentiveness: traitsOverride.attentiveness
    };

    computed.psychomotorTraits = {
      handwriting: traitsOverride.handwriting,
      sports: traitsOverride.sports,
      crafts: traitsOverride.crafts,
      speechFluency: traitsOverride.speechFluency
    };

    computed.teacherRemarks = traitsOverride.teacherRemarks || computed.teacherRemarks;
    computed.principalRemarks = traitsOverride.principalRemarks || computed.principalRemarks;
    computed.attendance = {
      presentDays: traitsOverride.presentDays,
      totalDays: traitsOverride.totalDays
    };

    return computed;
  }, [activeStudent, examScores, studentsInClass, schoolProfile, traitsOverride]);

  // Compute all report cards for bulk print
  const allClassReportCards: ComputedReportCard[] = useMemo(() => {
    if (!isBulkPrintMode) return [];
    return studentsInClass.map(st => {
      return computeStudentReportCard(
        st,
        examScores,
        studentsInClass,
        schoolProfile.session,
        schoolProfile.currentTerm,
        schoolProfile.gradingScheme
      );
    });
  }, [isBulkPrintMode, studentsInClass, examScores, schoolProfile]);

  const handlePrint = () => {
    window.print();
  };

  const handleNextStudent = () => {
    const currentIndex = studentsInClass.findIndex(s => s.id === selectedStudentId);
    if (currentIndex < studentsInClass.length - 1) {
      setSelectedStudentId(studentsInClass[currentIndex + 1].id);
    }
  };

  const handlePrevStudent = () => {
    const currentIndex = studentsInClass.findIndex(s => s.id === selectedStudentId);
    if (currentIndex > 0) {
      setSelectedStudentId(studentsInClass[currentIndex - 1].id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar (Hidden on print) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Student Terminal Report Cards & Computation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Session: <strong>{schoolProfile.session}</strong> &bull; Term: <strong>{schoolProfile.currentTerm}</strong> &bull; Template: <strong className="capitalize">{schoolProfile.templateStyle || 'Prestige Ivory'}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer border ${
              isCustomizing
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{isCustomizing ? 'Hide Behavioral Editor' : 'Edit Remarks & Traits'}</span>
          </button>

          <button
            onClick={() => {
              setIsBulkPrintMode(!isBulkPrintMode);
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              isBulkPrintMode
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isBulkPrintMode ? 'Switch to Single Student' : `View All Class Cards (${studentsInClass.length})`}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print {isBulkPrintMode ? 'Whole Class' : 'Report Card'}</span>
          </button>
        </div>
      </div>

      {/* Class & Student Selector Navigation (Hidden on print) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        
        {/* Class Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase text-slate-500">Class:</span>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
            }}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {classes.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Student Switcher (If not bulk mode) */}
        {!isBulkPrintMode && studentsInClass.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={handlePrevStudent}
              disabled={studentsInClass.findIndex(s => s.id === selectedStudentId) <= 0}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-900 dark:text-white max-w-xs truncate"
            >
              {studentsInClass.map((st, idx) => (
                <option key={st.id} value={st.id}>
                  {idx + 1}. {st.surname} {st.firstname} ({st.admissionNo})
                </option>
              ))}
            </select>

            <button
              onClick={handleNextStudent}
              disabled={studentsInClass.findIndex(s => s.id === selectedStudentId) >= studentsInClass.length - 1}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Customizable Behavioral & Remarks Drawer (Hidden on print) */}
      {isCustomizing && (
        <div className="bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-2xl p-5 space-y-4 print:hidden animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Affective Domain, Psychomotor & Custom Comments Editor
            </h4>
            <span className="text-slate-500 text-[11px]">
              Editing for: <strong className="text-blue-600">{activeStudent?.surname} {activeStudent?.firstname}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Affective Sliders */}
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block border-b pb-1">
                Affective Domain (Rating 1 - 5)
              </span>

              {(['punctuality', 'neatness', 'politeness', 'honesty', 'leadership', 'attentiveness'] as const).map(trait => (
                <div key={trait} className="flex items-center justify-between gap-2">
                  <span className="capitalize text-slate-600 dark:text-slate-300">{trait}:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={traitsOverride[trait]}
                      onChange={(e) => setTraitsOverride({ ...traitsOverride, [trait]: Number(e.target.value) })}
                      className="w-20 accent-blue-600 cursor-pointer"
                    />
                    <span className="font-bold text-slate-900 dark:text-white w-3 text-right">{traitsOverride[trait]}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Psychomotor Sliders */}
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block border-b pb-1">
                Psychomotor Skills (Rating 1 - 5)
              </span>

              {(['handwriting', 'sports', 'crafts', 'speechFluency'] as const).map(trait => (
                <div key={trait} className="flex items-center justify-between gap-2">
                  <span className="capitalize text-slate-600 dark:text-slate-300">{trait.replace(/([A-Z])/g, ' $1')}:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={traitsOverride[trait]}
                      onChange={(e) => setTraitsOverride({ ...traitsOverride, [trait]: Number(e.target.value) })}
                      className="w-20 accent-blue-600 cursor-pointer"
                    />
                    <span className="font-bold text-slate-900 dark:text-white w-3 text-right">{traitsOverride[trait]}</span>
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">Days Present / Total:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={traitsOverride.presentDays}
                    onChange={(e) => setTraitsOverride({ ...traitsOverride, presentDays: Number(e.target.value) })}
                    className="w-12 px-1.5 py-0.5 border rounded text-center text-xs font-bold"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={traitsOverride.totalDays}
                    onChange={(e) => setTraitsOverride({ ...traitsOverride, totalDays: Number(e.target.value) })}
                    className="w-12 px-1.5 py-0.5 border rounded text-center text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Custom Remarks */}
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block border-b pb-1">
                Custom Endorsement Comments
              </span>

              <div>
                <label className="block text-[10px] text-slate-500 font-semibold mb-1">Form Teacher's Remark</label>
                <textarea
                  rows={2}
                  value={traitsOverride.teacherRemarks}
                  onChange={(e) => setTraitsOverride({ ...traitsOverride, teacherRemarks: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-semibold mb-1">Principal's General Remark</label>
                <textarea
                  rows={2}
                  value={traitsOverride.principalRemarks}
                  onChange={(e) => setTraitsOverride({ ...traitsOverride, principalRemarks: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Main Printable Presentation Canvas */}
      <div className="py-4">
        {isBulkPrintMode ? (
          <div className="space-y-8">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 print:hidden flex items-center justify-between">
              <span>Showing all {allClassReportCards.length} student report cards for class <strong>{selectedClass}</strong>. Press "Print Whole Class" to output a complete multi-page document.</span>
            </div>
            {allClassReportCards.map((rc) => (
              <PrintableReportCard
                key={rc.student.id}
                reportCard={rc}
                schoolProfile={schoolProfile}
              />
            ))}
          </div>
        ) : activeReportCard ? (
          <PrintableReportCard
            reportCard={activeReportCard}
            schoolProfile={schoolProfile}
          />
        ) : (
          <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            No students found in {selectedClass}. Please admit students or select another class.
          </div>
        )}
      </div>

    </div>
  );
};
