import React, { useState, useRef } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Student } from '../types';
import { downloadStudentUploadTemplate, parseStudentsFromExcel } from '../utils/excelHelper';
import { X, FileSpreadsheet, Download, Upload, CheckCircle2, AlertTriangle, Users } from 'lucide-react';

interface StudentExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentExcelModal: React.FC<StudentExcelModalProps> = ({ isOpen, onClose }) => {
  const { bulkAddStudents } = useSchool();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [parsedStudents, setParsedStudents] = useState<Partial<Student>[]>([]);
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
      const results = await parseStudentsFromExcel(selectedFile);
      if (results.length === 0) {
        setError('No valid student rows found in the uploaded file. Please make sure to use the template format.');
        setParsedStudents([]);
      } else {
        setParsedStudents(results);
      }
    } catch (err: any) {
      setError(`Failed to read Excel file: ${err.message || 'Unknown parsing error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (parsedStudents.length === 0) return;
    const count = bulkAddStudents(parsedStudents);
    setSuccessCount(count);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const resetState = () => {
    setFile(null);
    setParsedStudents([]);
    setError(null);
    setSuccessCount(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Bulk Student Admission via Excel (.xlsx / .csv)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload entire classes or mass student admissions in seconds without typing one by one
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetState();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Step 1: Download Template */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm">
                Step 1: Download Standard Excel Template
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                Pre-formatted columns: Surname, Firstname, Gender, Age, Class, Parent Contact, Subjects.
              </p>
            </div>
            <button
              onClick={downloadStudentUploadTemplate}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-sm whitespace-nowrap cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Template (.xlsx)</span>
            </button>
          </div>

          {/* Step 2: Upload File */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              Step 2: Upload Completed Spreadsheet
            </h4>
            
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-900/30">
              <Upload className="w-10 h-10 text-emerald-500 mb-2" />
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {file ? file.name : 'Click to Browse or Drag & Drop Excel File here'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv)
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

          {/* Feedback Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successCount !== null && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Successfully enrolled {successCount} new students! Assigning automated admission numbers...</span>
            </div>
          )}

          {/* Preview Table */}
          {parsedStudents.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Previewing {parsedStudents.length} Students Ready to Admit
                </span>
                <span className="text-[11px] text-slate-500">
                  Admission numbers will be auto-generated sequentially
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-700/50 sticky top-0">
                    <tr className="text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Surname</th>
                      <th className="py-2 px-3">Firstname</th>
                      <th className="py-2 px-3">Sex</th>
                      <th className="py-2 px-3">Age</th>
                      <th className="py-2 px-3">Class</th>
                      <th className="py-2 px-3">Parent Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                    {parsedStudents.map((st, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                        <td className="py-2 px-3 text-slate-400 font-mono">{i + 1}</td>
                        <td className="py-2 px-3 font-bold text-slate-900 dark:text-white uppercase">{st.surname}</td>
                        <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{st.firstname}</td>
                        <td className="py-2 px-3">{st.gender}</td>
                        <td className="py-2 px-3">{st.age} yrs</td>
                        <td className="py-2 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-semibold">
                            {st.currentClass}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-500">{st.parentPhone || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 rounded-b-2xl">
          <button
            type="button"
            onClick={() => {
              resetState();
              onClose();
            }}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
          >
            Cancel
          </button>
          
          <button
            type="button"
            disabled={parsedStudents.length === 0 || isLoading || successCount !== null}
            onClick={handleImport}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Admit {parsedStudents.length} Students</span>
          </button>
        </div>

      </div>
    </div>
  );
};
