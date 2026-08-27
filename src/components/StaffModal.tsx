import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Staff } from '../types';
import { X, Briefcase, Plus, Trash2, Check } from 'lucide-react';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit?: Staff | null;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  staffToEdit
}) => {
  const { classes, addStaff, updateStaff } = useSchool();

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Staff['role']>('Class Teacher');
  const [assignedClass, setAssignedClass] = useState('');
  const [subjectsTaught, setSubjectsTaught] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('');
  const [employmentDate, setEmploymentDate] = useState('');
  const [basicSalary, setBasicSalary] = useState<number>(85000);
  const [allowances, setAllowances] = useState<{ title: string; amount: number }[]>([
    { title: 'Teaching Allowance', amount: 10000 },
    { title: 'Transport Allowance', amount: 8000 }
  ]);
  const [deductions, setDeductions] = useState<{ title: string; amount: number }[]>([
    { title: 'Tax (PAYE)', amount: 5000 },
    { title: 'Staff Welfare', amount: 2000 }
  ]);
  const [bankName, setBankName] = useState('First Bank of Nigeria');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Terminated'>('Active');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPin, setLoginPin] = useState('');

  useEffect(() => {
    if (staffToEdit) {
      setFullName(staffToEdit.fullName);
      setRole(staffToEdit.role);
      setAssignedClass(staffToEdit.assignedClass || '');
      setSubjectsTaught(staffToEdit.subjectsTaught || []);
      setPhone(staffToEdit.phone);
      setEmail(staffToEdit.email || '');
      setQualification(staffToEdit.qualification);
      setEmploymentDate(staffToEdit.employmentDate);
      setBasicSalary(staffToEdit.basicSalary);
      setAllowances(staffToEdit.allowances || []);
      setDeductions(staffToEdit.deductions || []);
      setBankName(staffToEdit.bankName);
      setAccountNumber(staffToEdit.accountNumber);
      setAccountName(staffToEdit.accountName);
      setStatus(staffToEdit.status);
      setLoginUsername(staffToEdit.loginUsername || '');
      setLoginPin(staffToEdit.loginPin || '');
    } else {
      setFullName('');
      setRole('Class Teacher');
      setAssignedClass(classes[0]?.name || '');
      setSubjectsTaught(['Mathematics']);
      setPhone('');
      setEmail('');
      setQualification('B.Ed / B.Sc.Ed');
      setEmploymentDate(new Date().toISOString().split('T')[0]);
      setBasicSalary(90000);
      setAllowances([
        { title: 'Teaching Allowance', amount: 10000 },
        { title: 'Transport Allowance', amount: 8000 }
      ]);
      setDeductions([
        { title: 'Tax (PAYE)', amount: 5000 },
        { title: 'Staff Welfare', amount: 2000 }
      ]);
      setBankName('First Bank of Nigeria');
      setAccountNumber('');
      setAccountName('');
      setStatus('Active');
      setLoginUsername('');
      setLoginPin('');
    }
  }, [staffToEdit, isOpen, classes]);

  if (!isOpen) return null;

  const addAllowanceRow = () => {
    setAllowances([...allowances, { title: 'New Allowance', amount: 5000 }]);
  };

  const removeAllowanceRow = (index: number) => {
    setAllowances(allowances.filter((_, i) => i !== index));
  };

  const updateAllowance = (index: number, field: 'title' | 'amount', value: any) => {
    const updated = [...allowances];
    updated[index] = { ...updated[index], [field]: field === 'amount' ? Number(value) || 0 : value };
    setAllowances(updated);
  };

  const addDeductionRow = () => {
    setDeductions([...deductions, { title: 'Loan / Deduction', amount: 3000 }]);
  };

  const removeDeductionRow = (index: number) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  const updateDeduction = (index: number, field: 'title' | 'amount', value: any) => {
    const updated = [...deductions];
    updated[index] = { ...updated[index], [field]: field === 'amount' ? Number(value) || 0 : value };
    setDeductions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert('Please fill in Staff Full Name and Phone Number.');
      return;
    }

    const payload = {
      staffId: staffToEdit ? staffToEdit.staffId : '',
      fullName: fullName.trim(),
      role,
      assignedClass: role === 'Class Teacher' ? assignedClass : undefined,
      subjectsTaught,
      phone: phone.trim(),
      email: email.trim(),
      qualification: qualification.trim(),
      employmentDate,
      basicSalary: Number(basicSalary) || 0,
      allowances,
      deductions,
      bankName,
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim() || fullName.trim(),
      status,
      loginUsername: loginUsername.trim() || undefined,
      loginPin: loginPin.trim() || undefined
    };

    if (staffToEdit) {
      updateStaff(staffToEdit.id, payload);
    } else {
      addStaff(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {staffToEdit ? 'Edit School Staff & Salary Profile' : 'Add New School Staff Member'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Staff biodata, assigned teaching subjects, banking information & payroll setup
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Section 1: Biodata & Role */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 pb-1.5">
              1. Staff Information & Designation
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name (with Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. David Aondover or Dr. (Mrs) Bridget Tyover"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Staff Role / Position *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Principal">Principal / Head Teacher</option>
                  <option value="Vice Principal">Vice Principal</option>
                  <option value="Class Teacher">Class Teacher</option>
                  <option value="Subject Teacher">Subject Teacher</option>
                  <option value="Bursar">Bursar / Accountant</option>
                  <option value="Admin">Administrative Officer</option>
                  <option value="Security">Security Personnel</option>
                  <option value="Driver">School Driver</option>
                  <option value="Cleaner">Support / Cleaner</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {role === 'Class Teacher' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Class Master
                  </label>
                  <select
                    value={assignedClass}
                    onChange={(e) => setAssignedClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-medium text-slate-900 dark:text-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 08034567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. staff@school.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.Sc.Ed, NCE, HND"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 p-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Portal Username</label>
                <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="Optional staff login username" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Portal PIN</label>
                <input type="password" value={loginPin} onChange={(e) => setLoginPin(e.target.value)} placeholder="Optional staff login PIN" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" />
              </div>
              <p className="sm:col-span-2 text-[11px] text-blue-700 dark:text-blue-300">Create credentials here to let this active staff member sign in. Class Teacher and Subject Teacher accounts receive teacher access.</p>
            </div>
          </div>

          {/* Section 2: Salary & Allowances / Deductions */}
          <div className="space-y-4 pt-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 pb-1.5">
              2. Salary, Allowances & Monthly Deductions
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Basic Salary (₦) *
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full sm:w-64 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-bold text-slate-900 dark:text-white text-base"
              />
            </div>

            {/* Allowances Builder */}
            <div className="space-y-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300 uppercase">
                  Monthly Allowances
                </span>
                <button
                  type="button"
                  onClick={addAllowanceRow}
                  className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Allowance
                </button>
              </div>

              {allowances.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateAllowance(idx, 'title', e.target.value)}
                    placeholder="Allowance Title"
                    className="flex-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs"
                  />
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateAllowance(idx, 'amount', e.target.value)}
                    placeholder="Amount"
                    className="w-28 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => removeAllowanceRow(idx)}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Deductions Builder */}
            <div className="space-y-2 bg-red-50/50 dark:bg-red-950/20 p-3.5 rounded-xl border border-red-200 dark:border-red-900">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-red-800 dark:text-red-300 uppercase">
                  Monthly Deductions (PAYE, Welfare, Loans)
                </span>
                <button
                  type="button"
                  onClick={addDeductionRow}
                  className="text-xs text-red-700 dark:text-red-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Deduction
                </button>
              </div>

              {deductions.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateDeduction(idx, 'title', e.target.value)}
                    placeholder="Deduction Title"
                    className="flex-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs"
                  />
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateDeduction(idx, 'amount', e.target.value)}
                    placeholder="Amount"
                    className="w-28 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeDeductionRow(idx)}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Bank Details */}
          <div className="space-y-4 pt-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700 pb-1.5">
              3. Bank Payment & Disbursal Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. First Bank / Zenith / UBA"
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
                  maxLength={10}
                  placeholder="e.g. 2118745620"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  placeholder="Account Holder Name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{staffToEdit ? 'Save Staff Updates' : 'Add Staff Member'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
