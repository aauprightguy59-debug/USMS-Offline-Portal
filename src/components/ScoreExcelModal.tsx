import React, { useState, useRef } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Student, TermType } from '../types';
import { downloadScoreEntryTemplate, parseScoresFromExcel } from '../utils/excelHelper';
import { X, FileSpreadsheet, Download, Upload, CheckCircle2, AlertTriangle, Users } from 'lucide-react';

interface ScoreExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  subject: string;
  studentsInClass: Student[];
}

export const ScoreExcelModal: React.FC<ScoreExcelModalProps> = ({
  isOpen,
  onClose,
  className,
  subject,
  studentsInClass
}) => {
  const { schoolProfile, saveScoresBatch } = useSchool();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<{ admissionNo: string; studentName: string; ca1: number; ca2: number; ca3: number; exam: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setSuccessCount(null);
    setIsLoading(true);

    try {
      const results = await parseScoresFromExcel(
        selectedFile,
        className,
        subject,
        schoolProfile.session,
        schoolProfile.currentTerm
      );

      if (results.length === 0) {
        setError('No valid student score rows found in the uploaded file. Please use the downloaded template.');
        setParsedRows([]);
      } else {
        setParsedRows(results);
      }
    } catch (err: any) {
      setError(`Failed to read score spreadsheet: ${err.message || 'Parsing error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyScores = () => {
    if (parsedRows.length === 0) return;

    const formattedBatch: any[] = [];

    parsedRows.forEach(row => {
      // Find matching student by admission number
      const matched = studentsInClass.find(s => s.admissionNo.toLowerCase() === row.admissionNo.toLowerCase());
      if (matched) {
        formattedBatch.push({
          studentId: matched.id,
          studentName: `${matched.surname} ${matched.firstname}`,
          admissionNo: matched.admissionNo,
          className,
          subject,
          session: schoolProfile.session,
          term: schoolProfile.currentTerm,
          ca1: row.ca1,
          ca2: row.ca2,
          ca3: row.ca3,
          exam: row.exam
        });
      }
    });

    if (formattedBatch.length === 0) {
      setError('None of the admission numbers in the Excel matched students in this class.');
      return;
    }

    saveScoresBatch(formattedBatch);
    setSuccessCount(formattedBatch.length);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const handleDownloadTemplate = () => {
    downloadScoreEntryTemplate(className, subject, studentsInClass);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Excel Score Entry: {className} &bull; {subject}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload Continuous Assessment & Exam marks from spreadsheet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Step 1: Download Pre-filled Template */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm">
                Step 1: Download Class Score Sheet (.xlsx)
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                Contains all {studentsInClass.length} students in <strong>{className}</strong> with Admission Numbers.
              </p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-sm whitespace-nowrap cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Excel Template</span>
            </button>
          </div>

          {/* Step 2: Upload */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              Step 2: Upload Completed Score File
            </h4>
            
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-900/30">
              <Upload className="w-10 h-10 text-blue-500 mb-2" />
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {file ? file.name : 'Select or Drop Score Sheet (.xlsx / .csv)'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Reads CA1, CA2, CA3 and Exam scores for auto computation
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Feedback */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successCount !== null && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Successfully saved and computed scores for {successCount} students!</span>
            </div>
          )}

          {/* Parsed Preview */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                Parsed Scores for {parsedRows.length} Students
              </span>

              <div className="max-h-52 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-700/50 sticky top-0">
                    <tr className="text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2 px-3">Adm No</th>
                      <th className="py-2 px-3">Student Name</th>
                      <th className="py-2 px-3">CA 1</th>
                      <th className="py-2 px-3">CA 2</th>
                      <th className="py-2 px-3">CA 3</th>
                      <th className="py-2 px-3">Exam</th>
                      <th className="py-2 px-3">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                        <td className="py-2 px-3 font-mono font-bold text-blue-600">{r.admissionNo}</td>
                        <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">{r.studentName}</td>
                        <td className="py-2 px-3">{r.ca1}</td>
                        <td className="py-2 px-3">{r.ca2}</td>
                        <td className="py-2 px-3">{r.ca3}</td>
                        <td className="py-2 px-3">{r.exam}</td>
                        <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                          {r.ca1 + r.ca2 + r.ca3 + r.exam}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
          >
            Cancel
          </button>
          
          <button
            type="button"
            disabled={parsedRows.length === 0 || isLoading || successCount !== null}
            onClick={handleApplyScores}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Scores to Database</span>
          </button>
        </div>

      </div>
    </div>
  );
};
