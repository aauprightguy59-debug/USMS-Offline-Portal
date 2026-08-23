import React from 'react';
import { PaymentVoucher } from '../types';
import { useSchool } from '../context/SchoolContext';
import { X, Printer, GraduationCap, CheckCircle2, ShieldCheck, Phone, MapPin } from 'lucide-react';
import { formatCurrency } from '../utils/computations';

interface PrintableVoucherProps {
  voucher: PaymentVoucher | null;
  onClose: () => void;
}

export const PrintableVoucher: React.FC<PrintableVoucherProps> = ({ voucher, onClose }) => {
  const { schoolProfile } = useSchool();

  if (!voucher) return null;

  const handlePrint = () => {
    window.print();
  };

  const renderSlip = (slipType: 'ORIGINAL (BURSARY / SCHOOL COPY)' | 'DUPLICATE (STAFF SALARY SLIP)') => {
    return (
      <div className="bg-white border-2 border-slate-800 rounded-xl p-5 text-slate-900 shadow-sm print:shadow-none mb-6 relative">
        {/* Slip Watermark / Label */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-3">
            {schoolProfile.logoUrl ? (
              <img
                src={schoolProfile.logoUrl}
                alt="Logo"
                className="w-12 h-12 rounded-full object-cover border border-slate-300"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
            )}
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900">
                {schoolProfile.name}
              </h2>
              <p className="text-[10px] text-slate-600 italic">
                "{schoolProfile.motto || 'Knowledge & Discipline'}"
              </p>
              <p className="text-[9px] text-slate-500">
                {schoolProfile.address} &bull; Tel: {schoolProfile.phone}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-2 py-0.5 bg-slate-900 text-white text-[9px] font-bold rounded uppercase tracking-wider">
              {slipType}
            </span>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1">
              VOUCHER NO: <span className="text-blue-700">{voucher.voucherNo}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Date: {voucher.paymentDate}
            </div>
          </div>
        </div>

        {/* Staff & Payment Details Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-300 p-2.5 rounded-lg text-xs mb-3">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Payee / Staff Name:</span>
            <strong className="text-slate-900 uppercase font-black">{voucher.staffName}</strong>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Staff Role:</span>
            <strong className="text-slate-800">{voucher.staffRole}</strong>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Period:</span>
            <strong className="text-slate-800">{voucher.month} {voucher.year}</strong>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Session & Term:</span>
            <strong className="text-slate-800">{voucher.session} ({voucher.term})</strong>
          </div>
        </div>

        {/* Earnings & Deductions Breakdown Tables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
          {/* Earnings / Gross */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 font-bold uppercase text-[10px] text-slate-700 border-b border-slate-300 flex justify-between">
              <span>Earnings / Allowances</span>
              <span>Amount (₦)</span>
            </div>
            <div className="p-2.5 space-y-1 divide-y divide-slate-100">
              <div className="flex justify-between py-1 text-slate-700">
                <span>Basic Salary</span>
                <strong className="text-slate-900">{formatCurrency(voucher.basicSalary)}</strong>
              </div>
              {voucher.allowances.map((al, idx) => (
                <div key={idx} className="flex justify-between py-0.5 text-slate-600 text-[11px]">
                  <span>{al.title}</span>
                  <span>{formatCurrency(al.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1.5 font-bold text-slate-900 border-t border-slate-200">
                <span>Gross Earnings</span>
                <span>{formatCurrency(voucher.grossPay)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 font-bold uppercase text-[10px] text-slate-700 border-b border-slate-300 flex justify-between">
              <span>Statutory & Welfare Deductions</span>
              <span>Amount (₦)</span>
            </div>
            <div className="p-2.5 space-y-1 divide-y divide-slate-100">
              {voucher.deductions.map((ded, idx) => (
                <div key={idx} className="flex justify-between py-1 text-slate-600 text-[11px]">
                  <span>{ded.title}</span>
                  <span className="text-red-600">-{formatCurrency(ded.amount)}</span>
                </div>
              ))}
              {voucher.deductions.length === 0 && (
                <div className="py-2 text-slate-400 italic text-center text-[10px]">
                  No statutory deductions applied
                </div>
              )}
              <div className="flex justify-between pt-1.5 font-bold text-red-700 border-t border-slate-200">
                <span>Total Deductions</span>
                <span>-{formatCurrency(voucher.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Salary Payable Box */}
        <div className="bg-slate-100 border-2 border-slate-800 rounded-lg p-2.5 flex flex-col sm:flex-row items-center justify-between text-xs mb-3 gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-600 block">
              Payment Method: {voucher.paymentMethod} {voucher.bankName ? `(${voucher.bankName} - ${voucher.accountNumber})` : ''}
            </span>
            <p className="text-[10px] text-slate-500 italic">
              Remarks: {voucher.remarks || 'Salary approved and disbursed.'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-600 block">NET SALARY PAID:</span>
            <strong className="text-base sm:text-lg font-black text-slate-950">
              {formatCurrency(voucher.netPay)}
            </strong>
          </div>
        </div>

        {/* Signatures Row */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-dashed border-slate-300 text-[10px]">
          <div>
            <span className="text-slate-500 block">Prepared by (Bursar):</span>
            <div className="h-6 border-b border-slate-400 mt-1"></div>
            <strong className="text-slate-800 block mt-1">{voucher.preparedBy}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Approved by (Principal):</span>
            <div className="h-6 border-b border-slate-400 mt-1"></div>
            <strong className="text-slate-800 block mt-1">{voucher.approvedBy}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Received by (Staff Signature):</span>
            <div className="h-6 border-b border-slate-400 mt-1"></div>
            <strong className="text-slate-800 block mt-1">{voucher.staffName}</strong>
          </div>
        </div>

        {/* Tiny System Credit Footnote */}
        <div className="mt-3 pt-1 border-t border-slate-200 text-[8px] text-slate-400 flex items-center justify-between">
          <span>Universal School Management System (USMS)</span>
          <span>Company Credit: JADSL ICT Unit Community Centre, Gboko (070677978)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:static print:bg-white">
      <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 print:shadow-none print:border-none print:max-h-none print:max-w-none">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between rounded-t-2xl print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Official Staff Payment Voucher ({voucher.voucherNo})
              </h3>
              <p className="text-xs text-slate-500">
                Print dual-receipt (Bursary School Copy + Staff Copy) on standard A4 paper
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Voucher</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Canvas */}
        <div className="p-6 overflow-y-auto flex-1 print:p-0 print:overflow-visible">
          {renderSlip('ORIGINAL (BURSARY / SCHOOL COPY)')}
          
          <div className="border-b-2 border-dashed border-slate-400 my-4 text-center text-xs text-slate-400 font-mono print:block hidden">
            &bull; &bull; &bull; TEAR HERE &bull; &bull; &bull;
          </div>

          {renderSlip('DUPLICATE (STAFF SALARY SLIP)')}
        </div>

      </div>
    </div>
  );
};
