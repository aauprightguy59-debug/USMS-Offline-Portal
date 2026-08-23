import React from 'react';
import { Student } from '../types';
import { useSchool } from '../context/SchoolContext';
import { X, Printer, GraduationCap, ShieldCheck, Phone, MapPin } from 'lucide-react';

interface StudentIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentsToPrint: Student[];
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({
  isOpen,
  onClose,
  studentsToPrint
}) => {
  const { schoolProfile } = useSchool();

  if (!isOpen || studentsToPrint.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:static print:bg-white">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 print:shadow-none print:border-none print:max-h-none print:max-w-none">
        
        {/* Header (Hidden on print) */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 rounded-t-2xl print:hidden">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Print Official Student Identity Cards ({studentsToPrint.length})
            </h3>
            <p className="text-xs text-slate-500">
              Ready for single or multi-card sheet printing on cardstock or standard A4 paper
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print ID Cards</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Canvas */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-900 print:bg-white print:p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
            {studentsToPrint.map((st) => (
              <div
                key={st.id}
                className="w-full max-w-[360px] bg-white border-2 border-slate-800 rounded-2xl overflow-hidden shadow-lg print:shadow-none print:border-2 text-slate-900 relative print:break-inside-avoid mb-4"
                style={{ height: '225px' }}
              >
                {/* ID Card Top Band */}
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-2.5 flex items-center justify-between border-b-2 border-amber-400">
                  <div className="flex items-center gap-2">
                    {schoolProfile.logoUrl ? (
                      <img
                        src={schoolProfile.logoUrl}
                        alt="Logo"
                        className="w-8 h-8 rounded-full bg-white p-0.5 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                    )}
                    <div className="leading-tight">
                      <h4 className="text-[11px] font-extrabold uppercase tracking-tight truncate max-w-[210px]">
                        {schoolProfile.name}
                      </h4>
                      <p className="text-[8px] text-amber-300 italic truncate max-w-[210px]">
                        "{schoolProfile.motto || 'Excellence & Discipline'}"
                      </p>
                    </div>
                  </div>
                  <span className="text-[8px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded uppercase">
                    Student
                  </span>
                </div>

                {/* ID Card Body */}
                <div className="p-3 flex items-start gap-3">
                  {/* Photo Box */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-20 h-24 rounded-lg bg-slate-200 border-2 border-blue-900 overflow-hidden flex items-center justify-center shadow-inner">
                      {st.photoUrl ? (
                        <img src={st.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-1">
                          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto" />
                          <span className="text-[8px] text-slate-400 font-semibold uppercase">Passport</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] text-slate-600 font-bold mt-1 uppercase">
                      {st.gender}
                    </span>
                  </div>

                  {/* Student Details */}
                  <div className="flex-1 min-w-0 space-y-1 text-left text-[11px]">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-semibold block">Full Name:</span>
                      <strong className="text-xs text-blue-950 font-black uppercase tracking-tight block truncate">
                        {st.surname}, {st.firstname} {st.otherName || ''}
                      </strong>
                    </div>

                    <div className="grid grid-cols-2 gap-1 pt-0.5">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase font-semibold block">Adm No:</span>
                        <strong className="text-[11px] font-mono font-black text-blue-900 block truncate">
                          {st.admissionNo}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase font-semibold block">Class:</span>
                        <strong className="text-[11px] font-bold text-slate-800 block truncate">
                          {st.currentClass}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-0.5">
                      <span className="text-[8px] text-slate-500 uppercase font-semibold block">Parent / Guardian:</span>
                      <p className="text-[10px] text-slate-700 font-medium truncate">
                        {st.parentName} ({st.parentPhone || 'N/A'})
                      </p>
                    </div>
                  </div>
                </div>

                {/* ID Card Bottom Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-slate-100 border-t border-slate-300 px-3 py-1 flex items-center justify-between text-[8px] text-slate-600">
                  <span>Session: <strong>{schoolProfile.session}</strong></span>
                  <span className="font-semibold text-blue-900">Universal School System</span>
                  <span className="text-slate-500">Sign: ____________</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
