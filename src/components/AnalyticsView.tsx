import React, { useState, useMemo } from 'react';
import { useSchool } from '../context/SchoolContext';
import { computePerformanceAnalytics, formatOrdinal } from '../utils/computations';
import {
  Trophy,
  Award,
  Crown,
  Medal,
  Star,
  Download,
  Printer,
  Sparkles,
  TrendingUp,
  GraduationCap,
  Users,
  ChevronRight
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const AnalyticsView: React.FC = () => {
  const { schoolProfile, classes, students, examScores } = useSchool();

  const [activeTab, setActiveTab] = useState<'overall' | 'classChamps' | 'subjectChamps'>('overall');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

  const analytics = useMemo(() => {
    return computePerformanceAnalytics(
      students,
      examScores,
      classes,
      schoolProfile.session,
      schoolProfile.currentTerm
    );
  }, [students, examScores, classes, schoolProfile]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportMeritList = () => {
    const wb = XLSX.utils.book_new();

    // 1. Overall School Merit Sheet
    const overallData = analytics.overallBestStudents.map((s, idx) => ({
      'Merit Position': idx + 1,
      'Student Name': s.studentName,
      'Admission No': s.admissionNo,
      'Class': s.className,
      'Total Marks': s.totalMarks,
      'Average (%)': `${s.average}%`,
      'GPA': s.gpa,
      'Session': schoolProfile.session,
      'Term': schoolProfile.currentTerm
    }));
    const ws1 = XLSX.utils.json_to_sheet(overallData);
    XLSX.utils.book_append_sheet(wb, ws1, 'School-wide Merit Roll');

    // 2. Subject Champions Sheet
    const subjectData = analytics.subjectChampions.map(sc => ({
      'Class': sc.className,
      'Subject': sc.subject,
      'Top Student': sc.studentName,
      'Admission No': sc.admissionNo,
      'Score (100)': sc.score,
      'Grade': sc.grade
    }));
    const ws2 = XLSX.utils.json_to_sheet(subjectData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Subject Champions');

    XLSX.writeFile(wb, `${schoolProfile.name.replace(/\s+/g, '_')}_Merit_List_${schoolProfile.session}.xlsx`);
  };

  const filteredSubjectChampions = analytics.subjectChampions.filter(sc => {
    return selectedClassFilter === 'all' || sc.className === selectedClassFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shadow-md">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Academic Excellence & Performance Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              School-wide overall best scholars &bull; Class champions &bull; Best in each subject
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportMeritList}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Merit List (.xlsx)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Honours Roll</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700/60 p-1.5 rounded-xl w-full sm:w-fit print:hidden">
        <button
          onClick={() => setActiveTab('overall')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'overall'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-500" />
          <span>School-Wide Best Scholars</span>
        </button>

        <button
          onClick={() => setActiveTab('subjectChamps')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'subjectChamps'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Medal className="w-4 h-4 text-blue-500" />
          <span>Best by Subject & Class</span>
        </button>

        <button
          onClick={() => setActiveTab('classChamps')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'classChamps'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Star className="w-4 h-4 text-emerald-500" />
          <span>Class Champions</span>
        </button>
      </div>

      {/* Print Document Title (Shown only in print) */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-xl font-black uppercase">{schoolProfile.name}</h1>
        <p className="text-xs italic font-semibold">"{schoolProfile.motto}"</p>
        <h2 className="text-base font-extrabold uppercase mt-2 text-blue-900">
          OFFICIAL ACADEMIC HONOURS ROLL & MERIT LIST
        </h2>
        <p className="text-xs font-semibold text-slate-600">
          Academic Session: {schoolProfile.session} &bull; Term: {schoolProfile.currentTerm}
        </p>
      </div>

      {/* Tab 1: School-Wide Overall Best */}
      {activeTab === 'overall' && (
        <div className="space-y-6">
          
          {/* Top 3 Podium Cards */}
          {analytics.overallBestStudents.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* 2nd Place */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center relative overflow-hidden order-2 md:order-1">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-400"></div>
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-black text-lg mb-2 shadow-inner">
                  2nd
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {analytics.overallBestStudents[1].studentName}
                </h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  {analytics.overallBestStudents[1].className}
                </span>
                <div className="mt-3 text-xl font-black text-slate-800 dark:text-slate-100">
                  {analytics.overallBestStudents[1].average}%
                </div>
                <span className="text-[11px] text-slate-500">
                  {analytics.overallBestStudents[1].totalMarks} Total Marks
                </span>
              </div>

              {/* 1st Place (Valedictorian / School Best) */}
              <div className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-800 rounded-2xl p-6 border-2 border-amber-400 shadow-lg flex flex-col items-center text-center relative overflow-hidden order-1 md:order-2 transform md:-translate-y-2">
                <div className="absolute top-2 right-2 p-1 bg-amber-400 text-slate-950 rounded-full">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl mb-2 shadow-md">
                  1st
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full mb-1">
                  Overall School Valedictorian
                </span>
                <h3 className="font-black text-slate-950 dark:text-white text-lg">
                  {analytics.overallBestStudents[0].studentName}
                </h3>
                <span className="text-xs text-amber-700 dark:text-amber-400 font-bold">
                  Class: {analytics.overallBestStudents[0].className} &bull; Adm: {analytics.overallBestStudents[0].admissionNo}
                </span>
                <div className="mt-3 text-3xl font-black text-emerald-600">
                  {analytics.overallBestStudents[0].average}%
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                  {analytics.overallBestStudents[0].totalMarks} Total Marks &bull; GPA {analytics.overallBestStudents[0].gpa}
                </span>
              </div>

              {/* 3rd Place */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center relative overflow-hidden order-3">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-700"></div>
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-black text-lg mb-2 shadow-inner">
                  3rd
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {analytics.overallBestStudents[2].studentName}
                </h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  {analytics.overallBestStudents[2].className}
                </span>
                <div className="mt-3 text-xl font-black text-slate-800 dark:text-slate-100">
                  {analytics.overallBestStudents[2].average}%
                </div>
                <span className="text-[11px] text-slate-500">
                  {analytics.overallBestStudents[2].totalMarks} Total Marks
                </span>
              </div>

            </div>
          )}

          {/* Full School-Wide Ranking Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Complete School-Wide Academic Merit Ranking ({analytics.overallBestStudents.length} Students)</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b">
                  <tr>
                    <th className="py-3 px-3 font-bold uppercase w-16 text-center">Rank</th>
                    <th className="py-3 px-3 font-bold uppercase">Adm No</th>
                    <th className="py-3 px-3 font-bold uppercase">Student Name</th>
                    <th className="py-3 px-3 font-bold uppercase">Class</th>
                    <th className="py-3 px-3 font-bold uppercase text-center">Total Score</th>
                    <th className="py-3 px-3 font-bold uppercase text-center">Average %</th>
                    <th className="py-3 px-3 font-bold uppercase text-center">GPA</th>
                    <th className="py-3 px-3 font-bold uppercase">Honours Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                  {analytics.overallBestStudents.map((st, idx) => (
                    <tr key={st.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                          idx === 0
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-900 font-bold'
                            : idx === 2
                            ? 'bg-amber-200 text-amber-950 font-bold'
                            : 'text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-600">
                        {st.admissionNo}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white uppercase">
                        {st.studentName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-semibold">
                          {st.className}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                        {st.totalMarks}
                      </td>
                      <td className="py-3 px-3 text-center font-black text-emerald-600 text-sm">
                        {st.average}%
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                        {st.gpa}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.average >= 75
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : st.average >= 60
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {st.average >= 80 ? 'Principal\'s Honours' : st.average >= 70 ? 'Distinction' : 'Merit'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Best by Subject in Each Class */}
      {activeTab === 'subjectChamps' && (
        <div className="space-y-4">
          
          {/* Class Filter */}
          <div className="flex items-center gap-2 print:hidden">
            <span className="text-xs font-bold text-slate-500">Filter by Class:</span>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold"
            >
              <option value="all">All Classes</option>
              {classes.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Subject Champions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredSubjectChampions.map((champ, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-[10px] font-bold rounded">
                      {champ.className}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded">
                      Grade: {champ.grade}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {champ.subject}
                  </h3>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">
                      Best Student / Champion:
                    </span>
                    <strong className="text-xs uppercase font-black text-slate-900 dark:text-white block truncate">
                      {champ.studentName}
                    </strong>
                    <span className="text-[10px] font-mono text-blue-600 font-bold">
                      {champ.admissionNo}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Highest Score</span>
                  <strong className="text-lg font-black text-emerald-600">
                    {champ.score}/100
                  </strong>
                </div>
              </div>
            ))}
          </div>

          {filteredSubjectChampions.length === 0 && (
            <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-2xl">
              No score records found for this class. Enter CA & Exam scores in the "Exams & CA" module.
            </div>
          )}

        </div>
      )}

      {/* Tab 3: Class Champions */}
      {activeTab === 'classChamps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map(c => {
            const classStudents = analytics.overallBestStudents.filter(s => s.className === c.name);
            const top3 = classStudents.slice(0, 3);

            return (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {c.name} Top Champions
                    </h3>
                    <p className="text-xs text-slate-500">{c.category} &bull; {classStudents.length} Students</p>
                  </div>
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs">
                    Class Arm
                  </span>
                </div>

                <div className="space-y-2.5">
                  {top3.length > 0 ? (
                    top3.map((st, i) => (
                      <div
                        key={st.studentId}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                            i === 0 ? 'bg-amber-400 text-slate-950' : i === 1 ? 'bg-slate-300 text-slate-900' : 'bg-amber-200 text-amber-950'
                          }`}>
                            {i + 1}
                          </div>
                          <div>
                            <strong className="text-xs font-bold text-slate-900 dark:text-white block uppercase">
                              {st.studentName}
                            </strong>
                            <span className="text-[10px] font-mono text-slate-500">{st.admissionNo}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black text-emerald-600">{st.average}%</div>
                          <span className="text-[10px] text-slate-500">{st.totalMarks} pts</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">No students with computed scores in this class.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
