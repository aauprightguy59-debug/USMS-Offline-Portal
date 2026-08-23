import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Staff, PaymentVoucher } from '../types';
import { X, CreditCard, Check, Calculator, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/computations';

interface PaymentVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoucherCreated?: (voucher: PaymentVoucher) => void;
}

export const PaymentVoucherModal: React.FC<PaymentVoucherModalProps> = ({
  isOpen,
  onClose,
  onVoucherCreated
}) => {
  const { staff, schoolProfile, addPaymentVoucher } = useSchool();

  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [month, setMonth] = useState<string>('August');
  const [year, setYear] = useState<string>('2025');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentVoucher['paymentMethod']>('Bank Transfer');
  const [basicSalary, setBasicSalary] = useState<number>(0);
  const [allowances, setAllowances] = useState<{ title: string; amount: number }[]>([]);
  const [deductions, setDeductions] = useState<{ title: string; amount: number }[]>([]);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [preparedBy, setPreparedBy] = useState(schoolProfile.bursarName ? `${schoolProfile.bursarName} (Bursar)` : 'School Bursar');
  const [approvedBy, setApprovedBy] = useState(schoolProfile.principalName ? `${schoolProfile.principalName} (Principal)` : 'School Principal');
  const [status, setStatus] = useState<PaymentVoucher['status']>('Paid');
  const [remarks, setRemarks] = useState('Monthly staff salary and duty allowances approved.');

  // Set initial selected staff
  useEffect(() => {
    if (staff.length > 0 && !selectedStaffId) {
      handleStaffSelect(staff[0].id);
    }
  }, [staff, selectedStaffId]);

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaffId(staffId);
    const member = staff.find(s => s.id === staffId);
    if (member) {
      setBasicSalary(member.basicSalary || 0);
      setAllowances(member.allowances ? [...member.allowances] : []);
      setDeductions(member.deductions ? [...member.deductions] : []);
      setBankName(member.bankName || '');
      setAccountNumber(member.accountNumber || '');
    }
  };

  if (!isOpen) return null;

  const totalAllowances = allowances.reduce((acc, a) => acc + (Number(a.amount) || 0), 0);
  const grossPay = basicSalary + totalAllowances;
  const totalDeductions = deductions.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  const netPay = Math.max(0, grossPay - totalDeductions);

  const selectedStaffObj = staff.find(s => s.id === selectedStaffId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffObj) {
      alert('Please select a staff member.');
      return;
    }

    const newVoucher = addPaymentVoucher({
      staffId: selectedStaffObj.id,
      staffName: selectedStaffObj.fullName,
      staffRole: selectedStaffObj.role,
      month,
      year,
      session: schoolProfile.session,
      term: schoolProfile.currentTerm,
      paymentDate,
      basicSalary,
      allowances,
      deductions,
      grossPay,
      totalDeductions,
      netPay,
      paymentMethod,
      bankName,
      accountNumber,
      preparedBy,
      approvedBy,
      status,
      remarks
    });

    if (onVoucherCreated) {
      onVoucherCreated(newVoucher);
    }
    onClose();
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Create Staff Salary Payment Voucher
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official school payment voucher with auto-calculated gross pay, deductions and net amount
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          
          {/* Select Staff & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Staff Member *
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => handleStaffSelect(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              >
                {staff.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} — {s.role} ({s.staffId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-medium"
              >
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Salary Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Basic Salary */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <span className="text-[11px] font-bold uppercase text-blue-700 dark:text-blue-300 block">
                Basic Salary (₦)
              </span>
              <input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="mt-2 w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-lg font-bold text-slate-900 dark:text-white text-base"
              />
            </div>

            {/* Total Allowances */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-300 block">
                Total Allowances
              </span>
              <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-2">
                {formatCurrency(totalAllowances)}
              </div>
              <span className="text-[10px] text-emerald-600 mt-1 block">
                {allowances.length} Items (Transport, Teaching, etc.)
              </span>
            </div>

            {/* Total Deductions */}
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <span className="text-[11px] font-bold uppercase text-red-700 dark:text-red-300 block">
                Total Deductions
              </span>
              <div className="text-xl font-extrabold text-red-700 dark:text-red-300 mt-2">
                -{formatCurrency(totalDeductions)}
              </div>
              <span className="text-[10px] text-red-600 mt-1 block">
                {deductions.length} Items (Tax, Welfare, Loans)
              </span>
            </div>
          </div>

          {/* Computed Net Pay Highlight */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 rounded-xl flex items-center justify-between border border-indigo-800">
            <div>
              <span className="text-xs text-indigo-300 uppercase tracking-wider font-semibold block">
                Net Salary Payable
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Gross: {formatCurrency(grossPay)} - Deductions: {formatCurrency(totalDeductions)}
              </p>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              {formatCurrency(netPay)}
            </div>
          </div>

          {/* Payment Method & Bank */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Disbursement Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-medium text-slate-900 dark:text-white"
              >
                <option value="Bank Transfer">Bank Transfer (Direct NIP)</option>
                <option value="Cash">Cash (School Safe / Counter)</option>
                <option value="Cheque">Bank Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Signatories & Approvals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prepared By (Bursary)
              </label>
              <input
                type="text"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Approved By (Principal / Director)
              </label>
              <input
                type="text"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Voucher Notes / Remarks
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          {/* Modal Actions */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Issue Payment Voucher</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
