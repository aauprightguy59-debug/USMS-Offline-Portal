import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Student, ExamScore } from '../types';
import {
  FileSpreadsheet,
  Download,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { calculateGrade } from '../utils/computations';
import { exportBroadSheetToExcel } from '../utils/excelHelper';
import { ScoreExcelModal } from './ScoreExcelModal';

export const ExamScoresView: React.FC = () => {
  const {
    schoolProfile,
    classes,
    students,
    examScores,
    saveScoresBatch
  } = useSchool();

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local grid state for speed editing
  const [gridData, setGridData] = useState<Record<string, { ca1: number; ca2: number; ca3: number; exam: number }>>({});

  // Initialize selected class
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].name);
    }
  }, [classes, selectedClass]);

  const currentClassObj = classes.find(c => c.name === selectedClass);
  const availableSubjects = currentClassObj?.subjects || [
    'Mathematics', 'English Language', 'Basic Science', 'Social Studies'
  ];

  // Initialize selected subject
  useEffect(() => {
    if (availableSubjects.length > 0) {
      if (!selectedSubject || !availableSubjects.includes(selectedSubject)) {
        setSelectedSubject(availableSubjects[0]);
      }
    }
  }, [availableSubjects, selectedSubject]);

  const studentsInClass = students.filter(s => s.currentClass === selectedClass && s.status === 'Active');

  // Populate grid data from existing stored exam scores
  useEffect(() => {
    if (!selectedClass || !selectedSubject) return;

    const newGrid: Record<string, { ca1: number; ca2: number; ca3: number; exam: number }> = {};
    
    studentsInClass.forEach(st => {
      const match = examScores.find(
        s => s.studentId === st.id &&
             s.subject === selectedSubject &&
             s.session === schoolProfile.session &&
             s.term === schoolProfile.currentTerm
      );

      if (match) {
        newGrid[st.id] = {
          ca1: match.ca1 || 0,
          ca2: match.ca2 || 0,
          ca3: match.ca3 || 0,
          exam: match.exam || 0
        };
      } else {
        newGrid[st.id] = { ca1: 0, ca2: 0, ca3: 0, exam: 0 };
      }
    });

    setGridData(newGrid);
  }, [selectedClass, selectedSubject, studentsInClass.length, examScores.length, schoolProfile.session, schoolProfile.currentTerm]);

  const handleScoreChange = (studentId: string, field: 'ca1' | 'ca2' | 'ca3' | 'exam', value: string) => {
    const num = Math.max(0, Number(value) || 0);
    const max = field === 'exam' ? 70 : 10;
    const clamped = Math.min(max, num);

    setGridData(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { ca1: 0, ca2: 0, ca3: 0, exam: 0 }),
        [field]: clamped
      }
    }));
  };

  const handleSaveAll = () => {
    const batch = studentsInClass.map(st => {
      const row = gridData[st.id] || { ca1: 0, ca2: 0, ca3: 0, exam: 0 };
      return {
        studentId: st.id,
        studentName: `${st.surname} ${st.firstname}`,
        admissionNo: st.admissionNo,
        className: selectedClass,
        subject: selectedSubject,
        session: schoolProfile.session,
        term: schoolProfile.currentTerm,
        ca1: row.ca1,
        ca2: row.ca2,
        ca3: row.ca3,
        exam: row.exam
      };
    });

    saveScoresBatch(batch);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const handleExportBroadSheet = () => {
    if (!selectedClass) return;
    exportBroadSheetToExcel(
      selectedClass,
      availableSubjects,
      studentsInClass,
      examScores,
      schoolProfile.session,
      schoolProfile.currentTerm
    );
  };

  // Quick stats calculation
  let totalScoreSum = 0;
  let highestScore = 0;
  let scoredCount = 0;

  studentsInClass.forEach(st => {
    const row = gridData[st.id] || { ca1: 0, ca2: 0, ca3: 0, exam: 0 };
    const total = row.ca1 + row.ca2 + row.ca3 + row.exam;
    if (total > 0) {
      scoredCount++;
      totalScoreSum += total;
      if (total > highestScore) highestScore = total;
    }
  });

  const subjectAverage = scoredCount > 0 ? Math.round((totalScoreSum / scoredCount) * 10) / 10 : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Continuous Assessment & Examination Computation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Session: <strong className="text-blue-600 dark:text-blue-400">{schoolProfile.session}</strong> &bull; Term: <strong className="text-blue-600 dark:text-blue-400">{schoolProfile.currentTerm}</strong>
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsExcelModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload from Excel</span>
          </button>

          <button
            onClick={handleExportBroadSheet}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Class Broad Sheet</span>
          </button>
        </div>
      </div>

      {/* Selectors & Summary Strip */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          {/* Class Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              1. Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl font-bold text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
            >
              {classes.map(c => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              2. Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl font-bold text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
            >
              {availableSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Quick Metrics */}
          <div className="sm:col-span-2 flex items-center justify-between gap-4 bg-blue-50/50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-200 dark:border-blue-900">
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">Class Subject Avg</span>
              <strong className="text-lg font-black text-blue-700 dark:text-blue-300">
                {subjectAverage}%
              </strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">Highest Score</span>
              <strong className="text-lg font-black text-emerald-600">
                {highestScore}/100
              </strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">Enrolled Students</span>
              <strong className="text-lg font-black text-slate-900 dark:text-white">
                {studentsInClass.length}
              </strong>
            </div>
          </div>
        </div>

        {/* Weights Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>CA 1: <strong>10 Marks</strong></span>
            <span>CA 2: <strong>10 Marks</strong></span>
            <span>CA 3: <strong>10 Marks</strong></span>
            <span>Terminal Exam: <strong>70 Marks</strong></span>
            <span className="text-blue-600 font-bold">Total: 100 Marks</span>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Scores Saved & Grades Computed!
              </span>
            )}
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save {selectedSubject} Scores</span>
            </button>
          </div>
        </div>

      </div>

      {/* Spreadsheet Score Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-3 px-3 font-bold uppercase w-12">#</th>
                <th className="py-3 px-3 font-bold uppercase">Adm No</th>
                <th className="py-3 px-3 font-bold uppercase">Student Full Name</th>
                <th className="py-3 px-3 font-bold uppercase text-center w-24">CA 1 (10)</th>
                <th className="py-3 px-3 font-bold uppercase text-center w-24">CA 2 (10)</th>
                <th className="py-3 px-3 font-bold uppercase text-center w-24">CA 3 (10)</th>
                <th className="py-3 px-3 font-bold uppercase text-center w-28">Exam (70)</th>
                <th className="py-3 px-3 font-bold uppercase text-center w-24">Total (100)</th>
                <th className="py-3 px-3 font-bold uppercase text-center w-20">Grade</th>
                <th className="py-3 px-3 font-bold uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
              {studentsInClass.length > 0 ? (
                studentsInClass.map((st, index) => {
                  const row = gridData[st.id] || { ca1: 0, ca2: 0, ca3: 0, exam: 0 };
                  const total = (row.ca1 || 0) + (row.ca2 || 0) + (row.ca3 || 0) + (row.exam || 0);
                  const gradeInfo = calculateGrade(total, schoolProfile.gradingScheme);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                      <td className="py-3 px-3 text-slate-400 font-mono font-medium">
                        {index + 1}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {st.admissionNo}
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 dark:text-white font-bold block uppercase">
                          {st.surname} {st.firstname}
                        </strong>
                        <span className="text-[11px] text-slate-500">{st.gender} &bull; {st.age} yrs</span>
                      </td>
                      
                      {/* CA 1 */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={row.ca1 || ''}
                          placeholder="0"
                          onChange={(e) => handleScoreChange(st.id, 'ca1', e.target.value)}
                          className="w-16 px-2 py-1.5 text-center font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      {/* CA 2 */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={row.ca2 || ''}
                          placeholder="0"
                          onChange={(e) => handleScoreChange(st.id, 'ca2', e.target.value)}
                          className="w-16 px-2 py-1.5 text-center font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      {/* CA 3 */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={row.ca3 || ''}
                          placeholder="0"
                          onChange={(e) => handleScoreChange(st.id, 'ca3', e.target.value)}
                          className="w-16 px-2 py-1.5 text-center font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      {/* Exam */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="70"
                          value={row.exam || ''}
                          placeholder="0"
                          onChange={(e) => handleScoreChange(st.id, 'exam', e.target.value)}
                          className="w-20 px-2 py-1.5 text-center font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      {/* Total Score Computed */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-lg font-black text-sm ${
                          total >= 75
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : total >= 50
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                            : total >= 40
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {total}
                        </span>
                      </td>

                      {/* Grade Letter */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className="px-2 py-0.5 rounded font-black text-xs text-white"
                          style={{ backgroundColor: gradeInfo.color }}
                        >
                          {gradeInfo.grade}
                        </span>
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {gradeInfo.remark}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    No active students enrolled in <strong>{selectedClass}</strong>. Go to "Student Admissions" to admit students.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Save Bar */}
        {studentsInClass.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              * Total marks are computed automatically as: (CA 1 + CA 2 + CA 3) + Exam = 100%
            </span>

            <button
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Compute All {selectedSubject} Scores</span>
            </button>
          </div>
        )}
      </div>

      {/* Excel Modal */}
      {isExcelModalOpen && (
        <ScoreExcelModal
          isOpen={isExcelModalOpen}
          onClose={() => setIsExcelModalOpen(false)}
          className={selectedClass}
          subject={selectedSubject}
          studentsInClass={studentsInClass}
        />
      )}

    </div>
  );
};
