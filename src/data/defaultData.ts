import {
  SchoolProfile,
  Student,
  Staff,
  ExamScore,
  SchoolClass,
  StudentTermAssessment,
  GradeConfig,
  TimetablePeriod,
  ClassTimetable
} from '../types';

export const DEFAULT_GRADING_SCHEME: GradeConfig[] = [
  { grade: 'A1', minScore: 75, maxScore: 100, point: 5.0, remark: 'Distinction / Excellent', color: '#16a34a' },
  { grade: 'B2', minScore: 70, maxScore: 74, point: 4.0, remark: 'Very Good', color: '#2563eb' },
  { grade: 'B3', minScore: 65, maxScore: 69, point: 3.5, remark: 'Good', color: '#0284c7' },
  { grade: 'C4', minScore: 60, maxScore: 64, point: 3.0, remark: 'Credit', color: '#d97706' },
  { grade: 'C5', minScore: 55, maxScore: 59, point: 2.5, remark: 'Credit', color: '#d97706' },
  { grade: 'C6', minScore: 50, maxScore: 54, point: 2.0, remark: 'Credit', color: '#ca8a04' },
  { grade: 'D7', minScore: 45, maxScore: 49, point: 1.5, remark: 'Pass', color: '#ea580c' },
  { grade: 'E8', minScore: 40, maxScore: 44, point: 1.0, remark: 'Pass', color: '#ea580c' },
  { grade: 'F9', minScore: 0, maxScore: 39, point: 0.0, remark: 'Fail', color: '#dc2626' },
];

export const DEFAULT_CLASSES: SchoolClass[] = [
  {
    id: 'cls-n1',
    name: 'Nursery 1',
    category: 'Nursery',
    classTeacher: '',
    subjects: ['Numeracy', 'Literacy', 'Rhymes & Songs', 'Basic Science', 'Handwriting', 'Creative Art', 'Social Habits']
  },
  {
    id: 'cls-n2',
    name: 'Nursery 2',
    category: 'Nursery',
    classTeacher: '',
    subjects: ['Numeracy', 'Literacy', 'Rhymes & Songs', 'Basic Science', 'Handwriting', 'Creative Art', 'Social Habits']
  },
  {
    id: 'cls-p1',
    name: 'Primary 1',
    category: 'Primary',
    classTeacher: '',
    subjects: ['Mathematics', 'English Language', 'Basic Science', 'Social Studies', 'Quantitative Reasoning', 'Verbal Reasoning', 'CRS/IRS', 'Creative Art']
  },
  {
    id: 'cls-p3',
    name: 'Primary 3',
    category: 'Primary',
    classTeacher: '',
    subjects: ['Mathematics', 'English Language', 'Basic Science', 'Social Studies', 'Quantitative Reasoning', 'Verbal Reasoning', 'Civic Education', 'Agricultural Science']
  },
  {
    id: 'cls-p5',
    name: 'Primary 5',
    category: 'Primary',
    classTeacher: '',
    subjects: ['Mathematics', 'English Language', 'Basic Science', 'Social Studies', 'Quantitative Reasoning', 'Verbal Reasoning', 'Civic Education', 'Agricultural Science', 'Computer Studies']
  },
  {
    id: 'cls-j1',
    name: 'JSS 1',
    category: 'Junior Secondary',
    classTeacher: '',
    subjects: ['Mathematics', 'English Language', 'Basic Science', 'Basic Technology', 'Social Studies', 'Civic Education', 'Business Studies', 'Agricultural Science', 'Computer Studies', 'CRS/IRS', 'Physical & Health Education']
  },
  {
    id: 'cls-j2',
    name: 'JSS 2',
    category: 'Junior Secondary',
    classTeacher: '',
    subjects: ['Mathematics', 'English Language', 'Basic Science', 'Basic Technology', 'Social Studies', 'Civic Education', 'Business Studies', 'Agricultural Science', 'Computer Studies', 'CRS/IRS', 'Physical & Health Education']
  },
  {
    id: 'cls-j3',
    name: 'JSS 3',
    category: 'Junior Secondary',
    classTeacher: '',
    subjects: ['Mathematics', 'English Language', 'Basic Science', 'Basic Technology', 'Social Studies', 'Civic Education', 'Business Studies', 'Agricultural Science', 'Computer Studies', 'CRS/IRS', 'Physical & Health Education']
  },
  {
    id: 'cls-s1s',
    name: 'SSS 1 Science',
    category: 'Senior Secondary',
    classTeacher: '',
    subjects: ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Civic Education', 'Agricultural Science', 'Computer Studies', 'Economics']
  },
  {
    id: 'cls-s1a',
    name: 'SSS 1 Arts/Comm',
    category: 'Senior Secondary',
    classTeacher: '',
    subjects: ['Mathematics', 'English Language', 'Literature in English', 'Government', 'Economics', 'Civic Education', 'Commerce', 'CRS/IRS', 'Financial Accounting']
  },
  {
    id: 'cls-s2s',
    name: 'SSS 2 Science',
    category: 'Senior Secondary',
    classTeacher: '',
    subjects: ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Further Mathematics', 'Civic Education', 'Agricultural Science', 'Computer Studies']
  },
  {
    id: 'cls-s3s',
    name: 'SSS 3 Science',
    category: 'Senior Secondary',
    classTeacher: '',
    subjects: ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Civic Education', 'Further Mathematics', 'Agricultural Science', 'Computer Studies']
  }
];

export const DEFAULT_PERIODS: TimetablePeriod[] = [
  { id: 'p-0', periodNumber: 0, name: 'Morning Devotion / Assembly', startTime: '07:45', endTime: '08:15', isAssembly: true },
  { id: 'p-1', periodNumber: 1, name: 'Period 1', startTime: '08:15', endTime: '09:00' },
  { id: 'p-2', periodNumber: 2, name: 'Period 2', startTime: '09:00', endTime: '09:45' },
  { id: 'p-3', periodNumber: 3, name: 'Period 3', startTime: '09:45', endTime: '10:30' },
  { id: 'p-b1', periodNumber: -1, name: 'Snack Break', startTime: '10:30', endTime: '11:00', isBreak: true },
  { id: 'p-4', periodNumber: 4, name: 'Period 4', startTime: '11:00', endTime: '11:45' },
  { id: 'p-5', periodNumber: 5, name: 'Period 5', startTime: '11:45', endTime: '12:30' },
  { id: 'p-6', periodNumber: 6, name: 'Period 6', startTime: '12:30', endTime: '01:15' },
  { id: 'p-b2', periodNumber: -2, name: 'Lunch & Recreation', startTime: '01:15', endTime: '01:50', isBreak: true },
  { id: 'p-7', periodNumber: 7, name: 'Period 7', startTime: '01:50', endTime: '02:30' },
  { id: 'p-8', periodNumber: 8, name: 'Period 8 & Closing Prep', startTime: '02:30', endTime: '03:10' }
];

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  id: 'sch-001',
  name: 'Universal School Management System',
  motto: 'Knowledge, Character & Excellence',
  schoolType: 'combined',
  address: 'Gboko, Benue State, Nigeria',
  phone: '07067797854, 08071119766',
  email: 'admin@usms.edu.ng',
  regNumber: 'MOE/GBK/2024/001',
  principalName: 'Principal / School Head',
  principalSignatureUrl: '',
  bursarName: 'Bursar / Accounts Officer',
  session: '2024/2025',
  currentTerm: '1st Term',
  nextTermResumptionDate: '',
  nextTermFee: '',
  logoUrl: '',
  stampUrl: '',
  gradingScheme: DEFAULT_GRADING_SCHEME,
  assessmentWeights: {
    ca1Max: 10,
    ca2Max: 10,
    ca3Max: 10,
    examMax: 70
  },
  templateStyle: 'prestige',
  admissionPrefix: 'USMS',
  isConfigured: true,
  adminConfig: {
    username: 'admin',
    pin: '12345678',
    securityQuestion: 'Master Security Verification',
    securityAnswer: '12345678',
    isPinSet: false
  }
};

// Clean Default Slate (No mock/existing data)
export const DEFAULT_STUDENTS: Student[] = [];
export const DEFAULT_STAFF: Staff[] = [];
export const DEFAULT_EXAM_SCORES: ExamScore[] = [];
export const DEFAULT_TERM_ASSESSMENTS: Record<string, StudentTermAssessment> = {};
export const DEFAULT_TIMETABLES: ClassTimetable[] = [];

// Optional Demo Fixtures (Accessible via Settings -> "Load Sample Demo Data" if user explicitly wants to explore)
export const DEMO_STAFF: Staff[] = [
  {
    id: 'stf-001',
    staffId: 'STAFF/2024/001',
    fullName: 'Dr. (Mrs.) Bridget A. Tyover',
    role: 'Principal',
    phone: '07067797854',
    email: 'principal@usms.edu.ng',
    qualification: 'Ph.D Educational Admin, M.Ed, B.Sc.Ed',
    employmentDate: '2020-09-01',
    basicSalary: 180000,
    allowances: [
      { title: 'Responsibility Allowance', amount: 35000 },
      { title: 'Housing Allowance', amount: 25000 }
    ],
    deductions: [
      { title: 'Tax (PAYE)', amount: 12000 },
      { title: 'Staff Welfare', amount: 3000 }
    ],
    bankName: 'First Bank of Nigeria',
    accountNumber: '3089451234',
    accountName: 'Bridget Tyover',
    status: 'Active'
  },
  {
    id: 'stf-002',
    staffId: 'STAFF/2024/002',
    fullName: 'Mr. David Aondover',
    role: 'Class Teacher',
    assignedClass: 'JSS 1',
    subjectsTaught: ['Mathematics', 'Computer Studies'],
    phone: '08034567890',
    email: 'david.aondover@usms.edu.ng',
    qualification: 'B.Sc. Mathematics / Computer Science',
    employmentDate: '2021-01-15',
    basicSalary: 95000,
    allowances: [
      { title: 'Teaching Allowance', amount: 12000 },
      { title: 'Class Teacher Allowance', amount: 8000 }
    ],
    deductions: [
      { title: 'Tax (PAYE)', amount: 6500 }
    ],
    bankName: 'Zenith Bank',
    accountNumber: '2118745620',
    accountName: 'David Aondover',
    status: 'Active'
  }
];

export const DEMO_STUDENTS: Student[] = [
  {
    id: 'std-001',
    admissionNo: 'USMS/2024/001',
    surname: 'Aondover',
    firstname: 'Paul',
    otherName: 'Terkimbi',
    gender: 'Male',
    dateOfBirth: '2011-04-12',
    age: 13,
    currentClass: 'JSS 1',
    parentName: 'Engr. Terver Aondover',
    parentPhone: '08031234567',
    parentAddress: 'No. 8 High Level, Gboko',
    enrolledSubjects: ['Mathematics', 'English Language', 'Basic Science', 'Basic Technology', 'Social Studies', 'Civic Education', 'Business Studies', 'Agricultural Science', 'Computer Studies', 'CRS/IRS'],
    admissionDate: '2024-09-08',
    status: 'Active'
  },
  {
    id: 'std-002',
    admissionNo: 'USMS/2024/002',
    surname: 'Adah',
    firstname: 'Mary',
    otherName: 'Ngoundu',
    gender: 'Female',
    dateOfBirth: '2011-08-20',
    age: 13,
    currentClass: 'JSS 1',
    parentName: 'Dr. John Adah',
    parentPhone: '08029876543',
    parentAddress: 'Ahmadu Bello Way, Gboko',
    enrolledSubjects: ['Mathematics', 'English Language', 'Basic Science', 'Basic Technology', 'Social Studies', 'Civic Education', 'Business Studies', 'Agricultural Science', 'Computer Studies', 'CRS/IRS'],
    admissionDate: '2024-09-08',
    status: 'Active'
  }
];
