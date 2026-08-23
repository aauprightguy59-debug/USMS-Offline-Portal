import * as XLSX from 'xlsx';
import { Student, ExamScore, Staff, PaymentVoucher } from '../types';

export function downloadStudentUploadTemplate() {
  const headers = [
    'Surname',
    'Firstname',
    'OtherName',
    'Gender (Male/Female)',
    'DateOfBirth (YYYY-MM-DD)',
    'Age',
    'Class',
    'ParentName',
    'ParentPhone',
    'ParentAddress',
    'EnrolledSubjects (Comma-separated)'
  ];

  const sampleRows = [
    [
      'Terkimbi',
      'Faith',
      'Msughter',
      'Female',
      '2013-05-14',
      12,
      'JSS 1',
      'Elder Terkimbi Joshua',
      '08031234567',
      'Low Cost Housing Estate, Gboko',
      'Mathematics, English Language, Basic Science, Basic Technology, Computer Studies'
    ],
    [
      'Iorwuese',
      'Gideon',
      'Sesugh',
      'Male',
      '2013-02-18',
      12,
      'JSS 1',
      'Engr. Iorwuese Gabriel',
      '08098765432',
      'Akaa Road, Gboko South',
      'Mathematics, English Language, Basic Science, Basic Technology, Computer Studies'
    ]
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Students_Template');
  XLSX.writeFile(wb, 'USMS_Students_Admission_Template.xlsx');
}

export function parseStudentsFromExcel(file: File): Promise<Partial<Student>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (json.length < 2) {
          resolve([]);
          return;
        }

        const rows = json.slice(1);
        const parsedStudents: Partial<Student>[] = [];

        rows.forEach((row) => {
          if (!row || row.length === 0 || !row[0]) return;
          const surname = String(row[0] || '').trim();
          const firstname = String(row[1] || '').trim();
          const otherName = String(row[2] || '').trim();
          const genderRaw = String(row[3] || '').trim().toLowerCase();
          const gender = genderRaw.startsWith('m') ? 'Male' : 'Female';
          const dob = String(row[4] || '').trim();
          const age = Number(row[5]) || 12;
          const currentClass = String(row[6] || '').trim();
          const parentName = String(row[7] || '').trim();
          const parentPhone = String(row[8] || '').trim();
          const parentAddress = String(row[9] || '').trim();
          const subjectsRaw = String(row[10] || '').trim();
          const enrolledSubjects = subjectsRaw
            ? subjectsRaw.split(',').map(s => s.trim()).filter(Boolean)
            : [];

          if (surname && firstname) {
            parsedStudents.push({
              surname,
              firstname,
              otherName,
              gender,
              dateOfBirth: dob || '2013-01-01',
              age,
              currentClass: currentClass || 'JSS 1',
              parentName: parentName || 'Parent / Guardian',
              parentPhone: parentPhone || '',
              parentAddress: parentAddress || '',
              enrolledSubjects,
              status: 'Active',
              admissionDate: new Date().toISOString().split('T')[0]
            });
          }
        });

        resolve(parsedStudents);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function downloadScoreEntryTemplate(className: string, subject: string, studentsInClass: Student[]) {
  const headers = [
    'AdmissionNo',
    'StudentName',
    'Class',
    'Subject',
    'CA 1 (Max 10)',
    'CA 2 (Max 10)',
    'CA 3 (Max 10)',
    'Exam (Max 70)'
  ];

  const rows = studentsInClass.map(st => [
    st.admissionNo,
    `${st.surname} ${st.firstname} ${st.otherName || ''}`.trim(),
    className,
    subject,
    '', // empty CA 1
    '', // empty CA 2
    '', // empty CA 3
    ''  // empty Exam
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Scores_Entry');
  const filename = `ScoreSheet_${className.replace(/\s+/g, '_')}_${subject.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function parseScoresFromExcel(
  file: File,
  className: string,
  subject: string,
  session: string,
  term: any
): Promise<{ admissionNo: string; studentName: string; ca1: number; ca2: number; ca3: number; exam: number }[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (json.length < 2) {
          resolve([]);
          return;
        }

        const rows = json.slice(1);
        const results: { admissionNo: string; studentName: string; ca1: number; ca2: number; ca3: number; exam: number }[] = [];

        rows.forEach(row => {
          if (!row || !row[0]) return;
          const admissionNo = String(row[0] || '').trim();
          const studentName = String(row[1] || '').trim();
          const ca1 = Math.max(0, Math.min(10, Number(row[4]) || 0));
          const ca2 = Math.max(0, Math.min(10, Number(row[5]) || 0));
          const ca3 = Math.max(0, Math.min(10, Number(row[6]) || 0));
          const exam = Math.max(0, Math.min(70, Number(row[7]) || 0));

          if (admissionNo) {
            results.push({
              admissionNo,
              studentName,
              ca1,
              ca2,
              ca3,
              exam
            });
          }
        });

        resolve(results);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function exportBroadSheetToExcel(
  className: string,
  subjects: string[],
  students: Student[],
  scores: ExamScore[],
  session: string,
  term: string
) {
  const header = ['S/N', 'Admission No', 'Student Full Name', 'Sex', ...subjects, 'Total Marks', 'Average (%)', 'Position'];
  
  const classScores = scores.filter(s => s.className === className && s.session === session && s.term === term);

  // Compute student averages for class position
  const studentRowsData = students.map((st) => {
    const studentScores = classScores.filter(s => s.studentId === st.id);
    let totalMarks = 0;
    const subjectMap: Record<string, number> = {};

    subjects.forEach(sub => {
      const match = studentScores.find(s => s.subject === sub);
      const score = match ? match.totalScore : 0;
      subjectMap[sub] = score;
      totalMarks += score;
    });

    const average = subjects.length > 0 ? Math.round((totalMarks / subjects.length) * 10) / 10 : 0;

    return {
      student: st,
      subjectMap,
      totalMarks,
      average
    };
  }).sort((a, b) => b.average - a.average || b.totalMarks - a.totalMarks);

  const rows = studentRowsData.map((data, index) => {
    const st = data.student;
    const subValues = subjects.map(sub => data.subjectMap[sub] > 0 ? data.subjectMap[sub] : '-');
    return [
      index + 1,
      st.admissionNo,
      `${st.surname} ${st.firstname} ${st.otherName || ''}`.trim(),
      st.gender,
      ...subValues,
      data.totalMarks,
      data.average,
      `${index + 1}`
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([
    [`${className} Broad Sheet - Terminal Exam Result (${session} - ${term})`],
    [],
    header,
    ...rows
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'BroadSheet');
  XLSX.writeFile(wb, `BroadSheet_${className.replace(/\s+/g, '_')}_${term.replace(/\s+/g, '_')}.xlsx`);
}

export function exportPayrollToExcel(vouchers: PaymentVoucher[], month: string, year: string) {
  const headers = [
    'Voucher No',
    'Staff Name',
    'Role',
    'Bank Name',
    'Account Number',
    'Basic Salary (₦)',
    'Total Allowances (₦)',
    'Gross Pay (₦)',
    'Total Deductions (₦)',
    'Net Pay (₦)',
    'Status',
    'Payment Date'
  ];

  const rows = vouchers.map(v => [
    v.voucherNo,
    v.staffName,
    v.staffRole,
    v.bankName,
    v.accountNumber,
    v.basicSalary,
    v.allowances.reduce((a, b) => a + b.amount, 0),
    v.grossPay,
    v.totalDeductions,
    v.netPay,
    v.status,
    v.paymentDate
  ]);

  const ws = XLSX.utils.aoa_to_sheet([
    [`Staff Salary Payroll Sheet - ${month} ${year}`],
    [],
    headers,
    ...rows
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Payroll');
  XLSX.writeFile(wb, `Payroll_Summary_${month}_${year}.xlsx`);
}
