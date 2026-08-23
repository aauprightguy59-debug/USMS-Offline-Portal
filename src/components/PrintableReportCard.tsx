import React from 'react';
import { ComputedReportCard, SchoolProfile } from '../types';
import { formatOrdinal, formatCurrency } from '../utils/computations';
import { GraduationCap, Award, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PrintableReportCardProps {
  reportCard: ComputedReportCard;
  schoolProfile: SchoolProfile;
}

export const PrintableReportCard: React.FC<PrintableReportCardProps> = ({
  reportCard,
  schoolProfile
}) => {
  const {
    student,
    session,
    term,
    className,
    subjects,
    totalMarksObtained,
    totalPossibleMarks,
    overallAverage,
    classPosition,
    totalStudentsInClass,
    gpa,
    attendance,
    behaviorTraits,
    psychomotorTraits,
    teacherRemarks,
    principalRemarks,
    nextTermFee,
    nextTermResumptionDate
  } = reportCard;

  const template = schoolProfile.templateStyle || 'prestige';

  return (
    <div className="w-full max-w-[850px] mx-auto bg-white text-slate-900 border-2 border-slate-900 rounded-xl p-6 sm:p-8 shadow-md print:shadow-none print:border-2 print:p-6 print:m-0 print:max-w-none print:w-full print:break-after-page text-xs leading-tight mb-8">
      
      {/* 1. Official School Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            {schoolProfile.logoUrl ? (
              <img
                src={schoolProfile.logoUrl}
                alt="School Crest"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-slate-900 p-1"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center p-2 text-center">
                <GraduationCap className="w-10 h-10 text-amber-400 mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider">OFFICIAL CREST</span>
              </div>
            )}
          </div>

          {/* School Titles */}
          <div className="flex-1 text-center space-y-1">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 font-serif">
              {schoolProfile.name}
            </h1>
            <p className="text-xs italic font-semibold text-slate-700">
              "{schoolProfile.motto || 'Knowledge, Integrity & Excellence'}"
            </p>
            <p className="text-[11px] text-slate-600">
              {schoolProfile.address}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 text-[10px] text-slate-500 font-medium pt-0.5">
              <span>Tel: {schoolProfile.phone}</span>
              <span>&bull;</span>
              <span>Email: {schoolProfile.email || 'info@school.edu.ng'}</span>
              <span>&bull;</span>
              <span>Govt Approval No: <strong>{schoolProfile.regNumber || 'Approved Standard'}</strong></span>
            </div>
            <div className="inline-block mt-1 px-4 py-1 bg-slate-900 text-white font-extrabold uppercase tracking-widest text-[11px] rounded">
              STUDENT TERMINAL EXAMINATION REPORT SHEET
            </div>
          </div>

          {/* Student Passport Photo Box */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-20 h-24 rounded-lg border-2 border-slate-900 overflow-hidden bg-slate-100 flex items-center justify-center shadow-inner">
              {student.photoUrl ? (
                <img src={student.photoUrl} alt="Student" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-1 text-slate-400">
                  <GraduationCap className="w-6 h-6 mx-auto" />
                  <span className="text-[8px] font-bold uppercase block mt-1">Passport</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 2. Student Bio-Data & Term Details Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-300 p-3 rounded-lg mb-4 text-[11px]">
        <div>
          <span className="text-[9px] uppercase font-bold text-slate-500 block">Student's Full Name:</span>
          <strong className="text-xs uppercase font-black text-slate-900 block truncate">
            {student.surname}, {student.firstname} {student.otherName || ''}
          </strong>
        </div>
        <div>
          <span className="text-[9px] uppercase font-bold text-slate-500 block">Admission Number:</span>
          <strong className="text-xs font-mono font-black text-blue-900 block">
            {student.admissionNo}
          </strong>
        </div>
        <div>
          <span className="text-[9px] uppercase font-bold text-slate-500 block">Current Class / Arm:</span>
          <strong className="text-xs font-bold text-slate-900 block">
            {className}
          </strong>
        </div>
        <div>
          <span className="text-[9px] uppercase font-bold text-slate-500 block">Gender & Age:</span>
          <strong className="text-slate-800 block">
            {student.gender} &bull; {student.age} Years
          </strong>
        </div>

        <div className="pt-1">
          <span className="text-[9px] uppercase font-bold text-slate-500 block">Academic Session:</span>
          <strong className="text-slate-900 font-bold">{session}</strong>
        </div>
        <div className="pt-1">
          <span className="text-[9px] uppercase font-bold text-slate-500 block">Term:</span>
          <strong className="text-slate-900 font-bold">{term}</strong>
        </div>
        <div className="pt-1">
          <span className="text-[9px] uppercase font-bold text-slate-500 block">Attendance:</span>
          <strong className="text-slate-900 font-bold">
            {attendance.presentDays} / {attendance.totalDays} Days
          </strong>
        </div>
        <div className="pt-1">
          <span className="text-[9px] uppercase font-bold text-slate-500 block">Class Enrollment:</span>
          <strong className="text-slate-900 font-bold">{totalStudentsInClass} Students</strong>
        </div>
      </div>

      {/* 3. Academic Performance Table */}
      <div className="border border-slate-900 rounded-lg overflow-hidden mb-4">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-bold text-center text-[10px]">
              <th className="py-2 px-2.5 text-left">Subject</th>
              <th className="py-2 px-1.5 w-12">CA (30)</th>
              <th className="py-2 px-1.5 w-12">Exam (70)</th>
              <th className="py-2 px-1.5 w-14 bg-slate-800">Total (100)</th>
              <th className="py-2 px-1.5 w-12">Grade</th>
              <th className="py-2 px-1 w-12">Class High</th>
              <th className="py-2 px-1 w-12">Class Low</th>
              <th className="py-2 px-1 w-12">Class Avg</th>
              <th className="py-2 px-1.5 w-12">Pos</th>
              <th className="py-2 px-2 text-left">Teacher's Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            {subjects.length > 0 ? (
              subjects.map((sub, idx) => (
                <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="py-1.5 px-2.5 font-bold text-slate-900">
                    {sub.subject}
                  </td>
                  <td className="py-1.5 px-1.5 text-center text-slate-700">{sub.ca}</td>
                  <td className="py-1.5 px-1.5 text-center text-slate-700">{sub.exam}</td>
                  <td className="py-1.5 px-1.5 text-center font-black text-slate-950 bg-slate-100/80">
                    {sub.total}
                  </td>
                  <td className="py-1.5 px-1.5 text-center font-bold text-slate-900">
                    {sub.grade}
                  </td>
                  <td className="py-1.5 px-1 text-center text-slate-500">{sub.classHighest}</td>
                  <td className="py-1.5 px-1 text-center text-slate-500">{sub.classLowest}</td>
                  <td className="py-1.5 px-1 text-center text-slate-600 font-medium">{sub.classAverage}</td>
                  <td className="py-1.5 px-1.5 text-center font-bold text-blue-900">
                    {formatOrdinal(sub.position)}
                  </td>
                  <td className="py-1.5 px-2 text-slate-700 italic text-[10px]">
                    {sub.remark}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-4 text-center text-slate-500 italic">
                  No exam scores recorded for this student in {term} {session}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Terminal Performance Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 text-white p-3 rounded-lg mb-4 text-center">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
            Total Marks Obtained
          </span>
          <strong className="text-sm sm:text-base font-black text-amber-400">
            {totalMarksObtained} / {totalPossibleMarks}
          </strong>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
            Terminal Average
          </span>
          <strong className="text-sm sm:text-base font-black text-emerald-400">
            {overallAverage}%
          </strong>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
            Overall Class Position
          </span>
          <strong className="text-sm sm:text-base font-black text-yellow-300">
            {formatOrdinal(classPosition)} of {totalStudentsInClass}
          </strong>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
            Grade Point Avg (GPA)
          </span>
          <strong className="text-sm sm:text-base font-black text-white">
            {gpa} / 5.0
          </strong>
        </div>
      </div>

      {/* 5. Affective & Psychomotor Behavioral Evaluation Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-[10px]">
        
        {/* Affective Traits (1-5) */}
        <div className="border border-slate-300 rounded-lg overflow-hidden">
          <div className="bg-slate-100 px-2.5 py-1 font-bold uppercase text-slate-800 border-b border-slate-300 flex justify-between">
            <span>A. Affective Domain (Behavior)</span>
            <span>Rating (1 - 5)</span>
          </div>
          <div className="p-2 grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-600">Punctuality:</span>
              <strong className="text-slate-900 font-bold">{behaviorTraits.punctuality} / 5</strong>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-600">Neatness:</span>
              <strong className="text-slate-900 font-bold">{behaviorTraits.neatness} / 5</strong>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-600">Politeness:</span>
              <strong className="text-slate-900 font-bold">{behaviorTraits.politeness} / 5</strong>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-600">Honesty:</span>
              <strong className="text-slate-900 font-bold">{behaviorTraits.honesty} / 5</strong>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-600">Leadership:</span>
              <strong className="text-slate-900 font-bold">{behaviorTraits.leadership} / 5</strong>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-600">Attentiveness:</span>
              <strong className="text-slate-900 font-bold">{behaviorTraits.attentiveness} / 5</strong>
            </div>
          </div>
        </div>

        {/* Psychomotor Traits (1-5) */}
        <div className="border border-slate-300 rounded-lg overflow-hidden">
          <div className="bg-slate-100 px-2.5 py-1 font-bold uppercase text-slate-800 border-b border-slate-300 flex justify-between">
            <span>B. Psychomotor Skills</span>
            <span>Rating (1 - 5)</span>
          </div>
          <div className="p-2 grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-600">Handwriting:</span>
              <strong className="text-slate-900 font-bold">{psychomotorTraits.handwriting} / 5</strong>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-600">Sports & Games:</span>
              <strong className="text-slate-900 font-bold">{psychomotorTraits.sports} / 5</strong>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-600">Crafts / Tech Skill:</span>
              <strong className="text-slate-900 font-bold">{psychomotorTraits.crafts} / 5</strong>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-600">Speech Fluency:</span>
              <strong className="text-slate-900 font-bold">{psychomotorTraits.speechFluency} / 5</strong>
            </div>
          </div>
        </div>

      </div>

      {/* 6. Remarks & Endorsements */}
      <div className="space-y-2 border border-slate-300 p-3 rounded-lg mb-4 text-[11px]">
        <div>
          <span className="font-bold text-slate-900 uppercase text-[10px]">Class Teacher's Remark:</span>
          <p className="text-slate-800 italic mt-0.5 pl-2 border-l-2 border-slate-400">
            "{teacherRemarks || 'A very commendable terminal performance.'}"
          </p>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <span className="font-bold text-slate-900 uppercase text-[10px]">Principal's General Remark:</span>
          <p className="text-slate-800 italic mt-0.5 pl-2 border-l-2 border-blue-600">
            "{principalRemarks || 'Promoted with commendation.'}"
          </p>
        </div>
      </div>

      {/* 7. Next Term Resumption, Fees & Stamp Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-2 border-t-2 border-slate-900 text-[10px]">
        <div>
          <div className="bg-slate-50 border border-slate-300 p-2 rounded">
            <span className="text-slate-500 font-bold uppercase block text-[9px]">Next Term Begins:</span>
            <strong className="text-slate-900 text-xs block">{nextTermResumptionDate || 'To be communicated'}</strong>
            <span className="text-slate-500 font-bold uppercase block text-[9px] mt-1">Next Term Fees:</span>
            <strong className="text-slate-900 text-xs block">{nextTermFee || '₦45,000.00'}</strong>
          </div>
        </div>

        <div className="text-center">
          <div className="w-24 h-16 mx-auto border border-dashed border-slate-400 rounded flex flex-col items-center justify-center p-1 text-slate-400">
            <ShieldCheck className="w-5 h-5 text-slate-400" />
            <span className="text-[8px] uppercase font-bold">Official School Stamp</span>
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="h-8 border-b border-slate-600 w-40 ml-auto"></div>
          <strong className="text-slate-900 font-bold block">
            {schoolProfile.principalName || 'School Principal'}
          </strong>
          <span className="text-slate-500 text-[9px] block">Principal's Signature & Date</span>
        </div>
      </div>

      {/* Grading Key Footer & Company Credit */}
      <div className="mt-4 pt-2 border-t border-slate-200 text-[8px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1">
        <div>
          <strong>Grading Key:</strong> A1 (75-100% Distinction), B2 (70-74% Very Good), B3 (65-69% Good), C4-C6 (50-64% Credit), D7-E8 (40-49% Pass), F9 (0-39% Fail)
        </div>
        <div className="text-right">
          USMS &bull; Software Credit: <strong>JADSL ICT Unit Community Centre, Gboko (07067797854)</strong>
        </div>
      </div>

    </div>
  );
};
