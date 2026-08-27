export type SchoolType = 'nursery_primary' | 'secondary' | 'combined' | 'tertiary';

export type TermType = '1st Term' | '2nd Term' | '3rd Term';

// Academic Sessions range from 2024/2025 through 2050/2051
export const ACADEMIC_SESSIONS: string[] = Array.from({ length: 27 }, (_, i) => {
  const startYear = 2024 + i;
  return `${startYear}/${startYear + 1}`;
});

export interface GradeConfig {
  grade: string;
  minScore: number;
  maxScore: number;
  point: number;
  remark: string;
  color: string;
}

export interface AssessmentWeights {
  ca1Max: number; // e.g. 10
  ca2Max: number; // e.g. 10
  ca3Max: number; // e.g. 10 (or assignment/project)
  examMax: number; // e.g. 70
}

export interface AdminConfig {
  username: string;
  pin: string;
  securityQuestion?: string;
  securityAnswer?: string;
  isPinSet?: boolean;
}

export type UserRole = 'master' | 'teacher' | 'admin';

export interface UserSession {
  username: string;
  displayName: string;
  role: UserRole;
  staffId?: string;
}

export interface SchoolProfile {
  id: string;
  name: string;
  motto: string;
  schoolType: SchoolType;
  address: string;
  phone: string;
  email: string;
  regNumber: string; // Govt approval or registration no.
  principalName: string;
  principalSignatureUrl?: string;
  bursarName: string;
  session: string; // e.g. "2025/2026"
  currentTerm: TermType;
  nextTermResumptionDate: string;
  nextTermFee?: string;
  logoUrl?: string;
  stampUrl?: string;
  gradingScheme: GradeConfig[];
  assessmentWeights: AssessmentWeights;
  templateStyle: 'classic' | 'modern' | 'prestige';
  admissionPrefix: string; // e.g. "USMS" or "GBK"
  isConfigured: boolean;
  adminConfig?: AdminConfig;
}

export interface Student {
  id: string;
  admissionNo: string;
  surname: string;
  firstname: string;
  otherName?: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  age: number;
  currentClass: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  parentAddress: string;
  enrolledSubjects: string[];
  admissionDate: string;
  photoUrl?: string;
  status: 'Active' | 'Graduated' | 'Transferred' | 'Suspended';
  notes?: string;
}

export interface Staff {
  id: string;
  staffId: string;
  fullName: string;
  role: 'Principal' | 'Vice Principal' | 'Class Teacher' | 'Subject Teacher' | 'Bursar' | 'Admin' | 'Security' | 'Driver' | 'Cleaner' | 'Other';
  assignedClass?: string;
  subjectsTaught?: string[];
  phone: string;
  email?: string;
  qualification: string;
  employmentDate: string;
  basicSalary: number;
  allowances: { title: string; amount: number }[];
  deductions: { title: string; amount: number }[];
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  loginUsername?: string;
  loginPin?: string;
}

export interface PaymentVoucher {
  id: string;
  voucherNo: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  month: string;
  year: string;
  session: string;
  term: TermType;
  paymentDate: string;
  basicSalary: number;
  allowances: { title: string; amount: number }[];
  deductions: { title: string; amount: number }[];
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Cheque';
  bankName: string;
  accountNumber: string;
  preparedBy: string;
  approvedBy: string;
  status: 'Paid' | 'Pending' | 'Approved';
  remarks?: string;
}

export interface ExamScore {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  subject: string;
  session: string;
  term: TermType;
  ca1: number;
  ca2: number;
  ca3: number;
  exam: number;
  totalScore: number;
  grade: string;
  remark: string;
  subjectPosition?: number;
}

export interface BehaviorTraits {
  punctuality: number; // 1-5
  neatness: number;
  politeness: number;
  honesty: number;
  leadership: number;
  attentiveness: number;
}

export interface PsychomotorTraits {
  handwriting: number; // 1-5
  sports: number;
  crafts: number;
  speechFluency: number;
}

export interface StudentTermAssessment {
  studentId: string;
  session: string;
  term: TermType;
  className: string;
  presentDays: number;
  totalDays: number;
  behaviorTraits: BehaviorTraits;
  psychomotorTraits: PsychomotorTraits;
  teacherRemarks: string;
  principalRemarks: string;
  nextTermFee?: string;
}

export interface SubjectStat {
  subject: string;
  ca: number;
  exam: number;
  total: number;
  grade: string;
  remark: string;
  classHighest: number;
  classLowest: number;
  classAverage: number;
  position: number;
}

export interface ComputedReportCard {
  student: Student;
  session: string;
  term: TermType;
  className: string;
  subjects: SubjectStat[];
  totalMarksObtained: number;
  totalPossibleMarks: number;
  overallAverage: number;
  classPosition: number;
  totalStudentsInClass: number;
  gpa: number;
  attendance: {
    presentDays: number;
    totalDays: number;
  };
  behaviorTraits: BehaviorTraits;
  psychomotorTraits: PsychomotorTraits;
  teacherRemarks: string;
  principalRemarks: string;
  nextTermFee?: string;
  nextTermResumptionDate: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  category: 'Nursery' | 'Primary' | 'Junior Secondary' | 'Senior Secondary' | 'Other';
  classTeacher?: string;
  subjects: string[];
}

export type ClassInfo = SchoolClass;

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface TimetablePeriod {
  id: string;
  periodNumber: number; // 0 for assembly, 1-8 for classes, -1 for break
  name: string; // "Morning Assembly", "Period 1", "Snack Break", etc.
  startTime: string; // "08:00"
  endTime: string; // "08:45"
  isBreak?: boolean;
  isAssembly?: boolean;
}

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  periodNumber: number;
  subject: string;
  teacherId?: string;
  teacherName?: string;
  room?: string; // "Room 2B", "Science Lab", "ICT Center"
  color?: string;
  notes?: string;
}

export interface ClassTimetable {
  id: string;
  className: string;
  session: string;
  term: TermType;
  slots: TimetableSlot[];
  periodsConfig: TimetablePeriod[];
  lastUpdated: string;
  classTeacher?: string;
  room?: string;
  notes?: string;
}

