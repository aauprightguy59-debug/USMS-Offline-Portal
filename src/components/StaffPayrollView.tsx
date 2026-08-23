import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Staff, PaymentVoucher } from '../types';
import {
  Briefcase,
  UserPlus,
  CreditCard,
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Edit2,
  Trash2,
  Phone,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { formatCurrency } from '../utils/computations';
import { exportPayrollToExcel } from '../utils/excelHelper';

interface StaffPayrollViewProps {
  onOpenStaffModal: (staff?: Staff) => void;
  onOpenVoucherModal: () => void;
  onOpenPrintVoucher: (voucher: PaymentVoucher) => void;
}

export const StaffPayrollView: React.FC<StaffPayrollViewProps> = ({
  onOpenStaffModal,
  onOpenVoucherModal,
  onOpenPrintVoucher
}) => {
  const { staff, paymentVouchers, deleteStaff, deletePaymentVoucher, schoolProfile } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'staff' | 'vouchers'>('staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const filteredStaff = staff.filter(s => {
    const matchesRole = selectedRole === 'all' || s.role === selectedRole;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query ||
      s.fullName.toLowerCase().includes(query) ||
      s.staffId.toLowerCase().includes(query) ||
      s.phone.includes(query) ||
      (s.assignedClass && s.assignedClass.toLowerCase().includes(query));
    return matchesRole && matchesQuery;
  });

  const filteredVouchers = paymentVouchers.filter(v => {
    const query = searchQuery.toLowerCase().trim();
    return !query ||
      v.staffName.toLowerCase().includes(query) ||
      v.voucherNo.toLowerCase().includes(query) ||
      v.month.toLowerCase().includes(query);
  });

  const totalMonthlyPayroll = staff.reduce((acc, s) => {
    const allowances = s.allowances?.reduce((a, b) => a + b.amount, 0) || 0;
    const deductions = s.deductions?.reduce((a, b) => a + b.amount, 0) || 0;
    return acc + (s.basicSalary + allowances - deductions);
  }, 0);

  const handleExportPayroll = () => {
    if (paymentVouchers.length === 0) {
      alert('No payment vouchers generated yet to export.');
      return;
    }
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear().toString();
    exportPayrollToExcel(paymentVouchers, currentMonth, currentYear);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete staff member "${name}"?`)) {
      deleteStaff(id);
    }
  };

  const handleDeleteVoucher = (id: string, no: string) => {
    if (confirm(`Are you sure you want to remove payment voucher "${no}"?`)) {
      deletePaymentVoucher(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              School Staff Directory & Payroll Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {staff.length} Staff Members &bull; Total Estimated Monthly Payroll: <strong className="text-purple-600 dark:text-purple-400">{formatCurrency(totalMonthlyPayroll)}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenStaffModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Staff</span>
          </button>

          <button
            onClick={onOpenVoucherModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Generate Payment Voucher</span>
          </button>

          <button
            onClick={handleExportPayroll}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Payroll (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700/60 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('staff')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'staff'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Staff Directory ({staff.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('vouchers')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'vouchers'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-500" />
            <span>Payment Vouchers ({paymentVouchers.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={activeSubTab === 'staff' ? "Search staff name, ID, role..." : "Search voucher no, staff name..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Subtab 1: Staff Directory Table */}
      {activeSubTab === 'staff' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3 px-3 font-bold uppercase">Staff ID</th>
                  <th className="py-3 px-3 font-bold uppercase">Full Name</th>
                  <th className="py-3 px-3 font-bold uppercase">Role / Position</th>
                  <th className="py-3 px-3 font-bold uppercase">Assigned Class / Subjects</th>
                  <th className="py-3 px-3 font-bold uppercase">Phone</th>
                  <th className="py-3 px-3 font-bold uppercase">Basic Pay</th>
                  <th className="py-3 px-3 font-bold uppercase">Net Est.</th>
                  <th className="py-3 px-3 font-bold uppercase">Bank Info</th>
                  <th className="py-3 px-3 font-bold uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                {filteredStaff.map((s) => {
                  const allowances = s.allowances?.reduce((a, b) => a + b.amount, 0) || 0;
                  const deductions = s.deductions?.reduce((a, b) => a + b.amount, 0) || 0;
                  const estNet = s.basicSalary + allowances - deductions;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                      <td className="py-3 px-3 font-mono font-bold text-purple-600 dark:text-purple-400">
                        {s.staffId}
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 dark:text-white font-bold block">
                          {s.fullName}
                        </strong>
                        <span className="text-[11px] text-slate-500">{s.qualification}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 font-semibold text-[11px]">
                          {s.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {s.assignedClass && (
                          <div className="text-blue-600 font-semibold">{s.assignedClass}</div>
                        )}
                        <div className="text-slate-500 text-[11px] truncate max-w-xs">
                          {s.subjectsTaught && s.subjectsTaught.length > 0 ? s.subjectsTaught.join(', ') : '—'}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {s.phone}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {formatCurrency(s.basicSalary)}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(estNet)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">{s.bankName}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{s.accountNumber}</div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Edit Staff"
                            onClick={() => onOpenStaffModal(s)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4 text-purple-600" />
                          </button>
                          <button
                            title="Delete Staff"
                            onClick={() => handleDeleteStaff(s.id, s.fullName)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Payment Vouchers Table */}
      {activeSubTab === 'vouchers' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3 px-3 font-bold uppercase">Voucher No</th>
                  <th className="py-3 px-3 font-bold uppercase">Staff Name</th>
                  <th className="py-3 px-3 font-bold uppercase">Role</th>
                  <th className="py-3 px-3 font-bold uppercase">Period</th>
                  <th className="py-3 px-3 font-bold uppercase">Gross Pay</th>
                  <th className="py-3 px-3 font-bold uppercase">Deductions</th>
                  <th className="py-3 px-3 font-bold uppercase">Net Paid</th>
                  <th className="py-3 px-3 font-bold uppercase">Method</th>
                  <th className="py-3 px-3 font-bold uppercase">Status</th>
                  <th className="py-3 px-3 font-bold uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                {filteredVouchers.length > 0 ? (
                  filteredVouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                      <td className="py-3 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {v.voucherNo}
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 dark:text-white font-bold block">
                          {v.staffName}
                        </strong>
                        <span className="text-[10px] text-slate-500">Date: {v.paymentDate}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {v.staffRole}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {v.month} {v.year}
                      </td>
                      <td className="py-3 px-3 text-slate-800 dark:text-slate-200">
                        {formatCurrency(v.grossPay)}
                      </td>
                      <td className="py-3 px-3 text-red-600">
                        -{formatCurrency(v.totalDeductions)}
                      </td>
                      <td className="py-3 px-3 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatCurrency(v.netPay)}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {v.paymentMethod}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Print Payment Voucher"
                            onClick={() => onOpenPrintVoucher(v)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg font-bold text-xs cursor-pointer transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print</span>
                          </button>
                          <button
                            title="Delete Voucher"
                            onClick={() => handleDeleteVoucher(v.id, v.voucherNo)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-500">
                      No payment vouchers generated yet. Click "Generate Payment Voucher" to issue salary slips.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
