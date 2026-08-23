import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  TrendingUp,
  UserPlus,
  ArrowRight,
  HardDrive,
  Trophy,
  Sparkles,
  CreditCard,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Users,
  Briefcase,
  Search,
  Filter,
  Layers,
  Printer,
  ShieldCheck,
  Calendar,
  DollarSign,
  Receipt,
  LogOut,
  GraduationCap,
  Building,
  Clock,
  Eye
} from 'lucide-react';
import { computePerformanceAnalytics, formatCurrency } from '../utils/computations';
import { PaymentVoucher, Student, Staff } from '../types';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenAdmission: () => void;
  onOpenExcelUpload: () => void;
  onOpenStaffModal: () => void;
  onOpenVoucherModal: () => void;
  onOpenPrintVoucher?: (voucher: PaymentVoucher) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  onOpenAdmission,
  onOpenExcelUpload,
  onOpenStaffModal,
  onOpenVoucherModal,
  onOpenPrintVoucher
}) => {
  const {
    schoolProfile,
    students,
    staff,
    classes,
    examScores,
    paymentVouchers,
    timetables,
    exportDatabaseJSON,
    adminLogout
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [recordsTab, setRecordsTab] = useState<'all' | 'students' | 'staff' | 'vouchers'>('all');
  const [classFilter, setClassFilter] = useState('all');

  const classNames = classes.map(c => c.name);
  const analytics = computePerformanceAnalytics(
    students,
    examScores,
    classNames,
    schoolProfile.session,
    schoolProfile.currentTerm,
    schoolProfile.gradingScheme
  );

  const activeStudents = students.filter(s => s.status === 'Active');
  const maleStudents = activeStudents.filter(s => s.gender === 'Male').length;
  const femaleStudents = activeStudents.filter(s => s.gender === 'Female').length;

  const totalMonthlyPayroll = staff.reduce((sum, s) => {
    const allowances = s.allowances?.reduce((a, b) => a + Number(b.amount || 0), 0) || 0;
    const deductions = s.deductions?.reduce((a, b) => a + Number(b.amount || 0), 0) || 0;
    return sum + (Number(s.basicSalary || 0) + allowances - deductions);
  }, 0);

  // Next calculated admission number
  const nextAdmNum = `USMS-${schoolProfile.session.slice(0, 4)}-${String(students.length + 1).padStart(4, '0')}`;

  // Top leaderboard records
  const leaderboard = analytics.overallBestStudents.slice(0, 3);

  // Search filtering across records
  const q = searchQuery.toLowerCase().trim();

  const filteredStudents = activeStudents.filter(st => {
    const matchesClass = classFilter === 'all' || st.currentClass === classFilter;
    const matchesQ = !q ||
      st.admissionNo.toLowerCase().includes(q) ||
      st.surname.toLowerCase().includes(q) ||
      st.firstname.toLowerCase().includes(q) ||
      st.currentClass.toLowerCase().includes(q);
    return matchesClass && matchesQ;
  });

  const filteredStaff = staff.filter(st => {
    return !q ||
      st.fullName.toLowerCase().includes(q) ||
      st.role.toLowerCase().includes(q) ||
      (st.staffId && st.staffId.toLowerCase().includes(q));
  });

  const filteredVouchers = paymentVouchers.filter(v => {
    return !q ||
      v.staffName.toLowerCase().includes(q) ||
      v.voucherNo.toLowerCase().includes(q) ||
      v.month.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5 pb-10">
      
      {/* Master Administrator Privilege Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-yellow-400 flex-shrink-0 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                Administrator Master Dashboard
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-mono">
                Full Privileges Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Logged in as <strong className="text-yellow-300 font-mono">{schoolProfile.adminConfig?.username || 'admin'}</strong> &bull; Complete administrative authority over student enrollment, staff payroll, timetable scheduling, continuous assessments, and financial vouchers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('settings')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/10 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>School Setup</span>
          </button>

          <button
            id="btn-dashboard-lock-session"
            type="button"
            onClick={() => adminLogout()}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Session</span>
          </button>
        </div>
      </div>

      {/* Top 4 Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Enrolled Students */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col justify-between hover:border-blue-300 transition">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {activeStudents.length}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {maleStudents} Male &bull; {femaleStudents} Female ({classes.length} Classes)
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
            <span className="font-mono text-slate-400">Next: {nextAdmNum}</span>
            <button
              onClick={() => setActiveTab('students')}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
            >
              Registry &rarr;
            </button>
          </div>
        </div>

        {/* Metric 2: Staff & Payroll */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col justify-between hover:border-purple-300 transition">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Staff & Payroll
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {staff.length}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              {formatCurrency(totalMonthlyPayroll)} / mo
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">{paymentVouchers.length} Vouchers</span>
            <button
              onClick={() => setActiveTab('staff')}
              className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
            >
              Staff List &rarr;
            </button>
          </div>
        </div>

        {/* Metric 3: Weekly Timetables */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col justify-between hover:border-teal-300 transition">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Class Timetables
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {timetables.length}
            </div>
            <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
              {schoolProfile.currentTerm} Active Matrix
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">1st, 2nd & 3rd Term</span>
            <button
              onClick={() => setActiveTab('timetable')}
              className="text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
            >
              Schedule &rarr;
            </button>
          </div>
        </div>

        {/* Metric 4: Examination & CA */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Exam & CA Scores
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {examScores.length}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Terminal Score Records Computed
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Top Avg: {leaderboard[0]?.average || 0}%</span>
            <button
              onClick={() => setActiveTab('exams')}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              Broadsheet &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* Quick Action Command Buttons Row */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Master Administrator Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          
          <button
            onClick={onOpenAdmission}
            className="p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-xl text-left transition group cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">Admit Student</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Auto generated ID</span>
          </button>

          <button
            onClick={onOpenStaffModal}
            className="p-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 rounded-xl text-left transition group cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">Register Staff</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Academic & Non-teach</span>
          </button>

          <button
            onClick={onOpenVoucherModal}
            className="p-3 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 rounded-xl text-left transition group cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-amber-600 dark:text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">Create Voucher</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Monthly payment sheet</span>
          </button>

          <button
            onClick={() => setActiveTab('timetable')}
            className="p-3 bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/20 dark:hover:bg-teal-900/40 border border-teal-200 dark:border-teal-800 rounded-xl text-left transition group cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">Weekly Timetable</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">All terms schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('exams')}
            className="p-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 rounded-xl text-left transition group cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">Enter Exam Scores</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">CA 1, 2, 3 & Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className="p-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-left transition group cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">Print Report Cards</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Batch transcript sheets</span>
          </button>

        </div>
      </div>

      {/* Consolidated Master Records Explorer & Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-5">
        
        {/* Explorer Header with Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>All School Records & Registry</span>
              <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                {recordsTab === 'all' || recordsTab === 'students' ? activeStudents.length : ''}
                {recordsTab === 'staff' ? staff.length : ''}
                {recordsTab === 'vouchers' ? paymentVouchers.length : ''} Records
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live administrator lookup across student admissions, staff database, and payment records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anything (name, ID, class, role)..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs w-48 sm:w-64 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Class Filter if in students or all */}
            {(recordsTab === 'all' || recordsTab === 'students') && (
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <option value="all">All Classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            )}

            {/* Export JSON button */}
            <button
              onClick={exportDatabaseJSON}
              title="Download Full Database Archive"
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-600 transition flex items-center gap-1.5 cursor-pointer"
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Backup</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 pt-3 border-b border-slate-100 dark:border-slate-700 overflow-x-auto pb-2">
          <button
            onClick={() => setRecordsTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              recordsTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            All Students ({filteredStudents.length})
          </button>
          <button
            onClick={() => setRecordsTab('staff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              recordsTab === 'staff'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Staff Registry ({filteredStaff.length})
          </button>
          <button
            onClick={() => setRecordsTab('vouchers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              recordsTab === 'vouchers'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Payment Vouchers ({filteredVouchers.length})
          </button>
        </div>

        {/* Tab 1 / Default: Students Record Table */}
        {(recordsTab === 'all' || recordsTab === 'students') && (
          <div className="overflow-x-auto pt-3">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-3 py-2.5">Admission No.</th>
                  <th className="px-3 py-2.5">Full Name</th>
                  <th className="px-3 py-2.5">Class</th>
                  <th className="px-3 py-2.5">Gender</th>
                  <th className="px-3 py-2.5">Parent Contact</th>
                  <th className="px-3 py-2.5 text-center">Term Avg %</th>
                  <th className="px-3 py-2.5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredStudents.slice(0, 10).map((st) => {
                  const stScores = examScores.filter(
                    s => s.studentId === st.id && s.session === schoolProfile.session && s.term === schoolProfile.currentTerm
                  );
                  const avg = stScores.length > 0
                    ? Math.round((stScores.reduce((sum, s) => sum + s.totalScore, 0) / stScores.length) * 10) / 10
                    : 0;

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition">
                      <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-slate-400 text-xs font-bold">
                        {st.admissionNo}
                      </td>
                      <td className="px-3 py-2.5 font-bold text-slate-900 dark:text-white">
                        {st.surname} {st.firstname} {st.otherName || ''}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                          {st.currentClass}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400 text-xs">
                        {st.gender}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400 text-xs">
                        <span className="block font-medium">{st.parentName || '—'}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{st.parentPhone || ''}</span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          avg >= 70
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            : avg >= 50
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                            : avg > 0
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                        }`}>
                          {avg > 0 ? `${avg}%` : 'Pending'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right space-x-2">
                        <button
                          onClick={() => setActiveTab('reports')}
                          className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer text-xs"
                        >
                          Report Card
                        </button>
                        <button
                          onClick={() => setActiveTab('students')}
                          className="text-slate-600 dark:text-slate-400 font-medium hover:underline cursor-pointer text-xs"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-8 text-center text-xs text-slate-400">
                      No student records match your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {Math.min(10, filteredStudents.length)} of {activeStudents.length} Students</span>
              <button
                onClick={() => setActiveTab('students')}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Open Full Student Registry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Staff Registry Table */}
        {recordsTab === 'staff' && (
          <div className="overflow-x-auto pt-3">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-3 py-2.5">Staff ID</th>
                  <th className="px-3 py-2.5">Staff Name</th>
                  <th className="px-3 py-2.5">Designation / Role</th>
                  <th className="px-3 py-2.5">Assigned Class / Subjects</th>
                  <th className="px-3 py-2.5">Phone Contact</th>
                  <th className="px-3 py-2.5 text-right">Basic Salary</th>
                  <th className="px-3 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredStaff.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition">
                    <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-slate-400 font-bold text-xs">
                      {st.staffId || 'STAFF'}
                    </td>
                    <td className="px-3 py-2.5 font-bold text-slate-900 dark:text-white">
                      {st.fullName}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-[10px] font-bold border border-purple-200 dark:border-purple-800">
                        {st.role}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">
                      {st.assignedClass ? `Class Teacher: ${st.assignedClass}` : (st.subjectsTaught?.join(', ') || 'General')}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-slate-400">
                      {st.phone}
                    </td>
                    <td className="px-3 py-2.5 font-mono font-bold text-slate-900 dark:text-white text-right">
                      {formatCurrency(st.basicSalary)}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => setActiveTab('staff')}
                        className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer text-xs"
                      >
                        Manage Staff &rarr;
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredStaff.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-8 text-center text-xs text-slate-400">
                      No staff records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Payment Vouchers Table */}
        {recordsTab === 'vouchers' && (
          <div className="overflow-x-auto pt-3">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-3 py-2.5">Voucher No.</th>
                  <th className="px-3 py-2.5">Staff Name</th>
                  <th className="px-3 py-2.5">Month / Period</th>
                  <th className="px-3 py-2.5">Method & Bank</th>
                  <th className="px-3 py-2.5 text-right">Gross Pay</th>
                  <th className="px-3 py-2.5 text-right">Net Payable</th>
                  <th className="px-3 py-2.5 text-right">Print</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition">
                    <td className="px-3 py-2.5 font-mono text-amber-600 dark:text-amber-400 font-bold">
                      {v.voucherNo}
                    </td>
                    <td className="px-3 py-2.5 font-bold text-slate-900 dark:text-white">
                      {v.staffName}
                      <span className="block text-[10px] text-slate-400 font-normal">{v.staffRole}</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">
                      {v.month} {v.year}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">
                      <span className="font-medium">{v.paymentMethod}</span>
                      {v.bankName && <span className="block text-[10px] text-slate-400">{v.bankName} - {v.accountNumber}</span>}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-right text-slate-700 dark:text-slate-300">
                      {formatCurrency(v.grossPay)}
                    </td>
                    <td className="px-3 py-2.5 font-mono font-bold text-right text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(v.netPay)}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => onOpenPrintVoucher ? onOpenPrintVoucher(v) : setActiveTab('staff')}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer transition shadow-xs"
                      >
                        Print Voucher
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredVouchers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-8 text-center text-xs text-slate-400">
                      No payment vouchers generated yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
