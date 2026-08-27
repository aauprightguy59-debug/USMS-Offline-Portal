import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  SchoolProfile,
  Student,
  Staff,
  PaymentVoucher,
  ExamScore,
  SchoolClass,
  StudentTermAssessment,
  GradeConfig,
  TermType,
  AdminConfig,
  UserRole,
  UserSession,
  ClassTimetable,
  TimetableSlot,
  TimetablePeriod
} from '../types';
import {
  DEFAULT_SCHOOL_PROFILE,
  DEFAULT_CLASSES,
  DEFAULT_STAFF,
  DEFAULT_STUDENTS,
  DEFAULT_EXAM_SCORES,
  DEFAULT_TERM_ASSESSMENTS,
  DEFAULT_PERIODS,
  DEFAULT_TIMETABLES,
  DEMO_STAFF,
  DEMO_STUDENTS
} from '../data/defaultData';
import { calculateGrade } from '../utils/computations';

interface SchoolContextType {
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;
  
  classes: SchoolClass[];
  addClass: (cls: Omit<SchoolClass, 'id'>) => void;
  updateClass: (id: string, cls: Partial<SchoolClass>) => void;
  deleteClass: (id: string) => void;

  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  bulkAddStudents: (newStudents: Partial<Student>[]) => number;
  generateNextAdmissionNo: () => string;

  staff: Staff[];
  addStaff: (staffMember: Omit<Staff, 'id'>) => Staff;
  updateStaff: (id: string, staffMember: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  paymentVouchers: PaymentVoucher[];
  addPaymentVoucher: (voucher: Omit<PaymentVoucher, 'id' | 'voucherNo'>) => PaymentVoucher;
  updatePaymentVoucher: (id: string, voucher: Partial<PaymentVoucher>) => void;
  deletePaymentVoucher: (id: string) => void;

  examScores: ExamScore[];
  saveScoresBatch: (scores: { studentId: string; studentName: string; admissionNo: string; className: string; subject: string; session: string; term: TermType; ca1: number; ca2: number; ca3: number; exam: number }[]) => void;
  updateScore: (id: string, updates: Partial<ExamScore>) => void;

  termAssessments: Record<string, StudentTermAssessment>;
  saveStudentAssessment: (assessment: StudentTermAssessment) => void;

  // Timetable Operations
  timetables: ClassTimetable[];
  saveTimetable: (timetable: ClassTimetable) => void;
  getTimetable: (className: string, session: string, term: TermType) => ClassTimetable | undefined;
  deleteTimetable: (id: string) => void;
  generateDefaultTimetable: (className: string, session: string, term: TermType) => ClassTimetable;

  // Session & Term Switchers
  setActiveSession: (session: string) => void;
  setActiveTerm: (term: TermType) => void;

  // Admin Security Operations
  isAdminAuthenticated: boolean;
  currentUser: UserSession | null;
  adminLogin: (pin: string, username?: string) => boolean;
  adminLogout: () => void;
  updateAdminCredentials: (credentials: Partial<AdminConfig>) => void;

  // Backup and Restore
  exportDatabaseBackup: () => void;
  exportDatabaseJSON: () => void;
  importDatabaseBackup: (jsonContent: string) => boolean;
  resetToDemoData: () => void;
  clearAllData: () => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'usms_school_profile_v2',
  CLASSES: 'usms_classes_v2',
  STUDENTS: 'usms_students_v2',
  STAFF: 'usms_staff_v2',
  VOUCHERS: 'usms_vouchers_v2',
  SCORES: 'usms_scores_v2',
  ASSESSMENTS: 'usms_assessments_v2',
  TIMETABLES: 'usms_timetables_v2',
  ADMIN_AUTH: 'usms_admin_auth_session',
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Admin Auth State (Session based)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = sessionStorage.getItem('usms_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Load from local storage or clean defaults
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.adminConfig) {
          parsed.isConfigured = false;
        } else if (!parsed.adminConfig.isPinSet &&
          ['1234', '12345678', '12345678Admin'].includes(parsed.adminConfig.pin)) {
          delete parsed.adminConfig;
          parsed.isConfigured = false;
        }
        return parsed;
      }
      return DEFAULT_SCHOOL_PROFILE;
    } catch {
      return DEFAULT_SCHOOL_PROFILE;
    }
  });

  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
      return saved ? JSON.parse(saved) : DEFAULT_CLASSES;
    } catch {
      return DEFAULT_CLASSES;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
    } catch {
      return DEFAULT_STUDENTS;
    }
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      return saved ? JSON.parse(saved) : DEFAULT_STAFF;
    } catch {
      return DEFAULT_STAFF;
    }
  });

  const [paymentVouchers, setPaymentVouchers] = useState<PaymentVoucher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOUCHERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [examScores, setExamScores] = useState<ExamScore[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCORES);
      return saved ? JSON.parse(saved) : DEFAULT_EXAM_SCORES;
    } catch {
      return DEFAULT_EXAM_SCORES;
    }
  });

  const [termAssessments, setTermAssessments] = useState<Record<string, StudentTermAssessment>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      return saved ? JSON.parse(saved) : DEFAULT_TERM_ASSESSMENTS;
    } catch {
      return DEFAULT_TERM_ASSESSMENTS;
    }
  });

  const [timetables, setTimetables] = useState<ClassTimetable[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLES);
      return saved ? JSON.parse(saved) : DEFAULT_TIMETABLES;
    } catch {
      return DEFAULT_TIMETABLES;
    }
  });

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(schoolProfile));
    } catch (e) {
      console.error('Save profile error:', e);
    }
  }, [schoolProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    } catch (e) {
      console.error('Save classes error:', e);
    }
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Save students error:', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
    } catch (e) {
      console.error('Save staff error:', e);
    }
  }, [staff]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(paymentVouchers));
    } catch (e) {
      console.error('Save vouchers error:', e);
    }
  }, [paymentVouchers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(examScores));
    } catch (e) {
      console.error('Save scores error:', e);
    }
  }, [examScores]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(termAssessments));
    } catch (e) {
      console.error('Save assessments error:', e);
    }
  }, [termAssessments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMETABLES, JSON.stringify(timetables));
    } catch (e) {
      console.error('Save timetables error:', e);
    }
  }, [timetables]);

  // Admin Auth Methods
  const adminLogin = (pin: string, username?: string): boolean => {
    const configuredPin = schoolProfile.adminConfig?.pin;
    const configuredUsername = schoolProfile.adminConfig?.username;

    if (!configuredPin || !configuredUsername) return false;

    const isPinCorrect = pin.trim() === configuredPin.trim();
    const isUserCorrect = !username || username.trim().toLowerCase() === configuredUsername.trim().toLowerCase();

    if (isPinCorrect && isUserCorrect) {
      const user: UserSession = { username: configuredUsername, displayName: 'Master Administrator', role: 'master' };
      setIsAdminAuthenticated(true);
      setCurrentUser(user);
      try {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        sessionStorage.setItem('usms_current_user', JSON.stringify(user));
      } catch {}
      return true;
    }
    const staffAccount = staff.find(member =>
      member.status === 'Active' &&
      member.loginUsername?.trim().toLowerCase() === username?.trim().toLowerCase() &&
      member.loginPin?.trim() === pin.trim()
    );
    if (staffAccount) {
      const role: UserRole = staffAccount.role === 'Class Teacher' || staffAccount.role === 'Subject Teacher' ? 'teacher' : 'admin';
      const user: UserSession = { username: staffAccount.loginUsername!, displayName: staffAccount.fullName, role, staffId: staffAccount.id };
      setIsAdminAuthenticated(true);
      setCurrentUser(user);
      try {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        sessionStorage.setItem('usms_current_user', JSON.stringify(user));
      } catch {}
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      sessionStorage.removeItem('usms_current_user');
      localStorage.removeItem('usms_admin_remember');
    } catch {}
  };

  const updateAdminCredentials = (credentials: Partial<AdminConfig>) => {
    setSchoolProfile(prev => ({
      ...prev,
      adminConfig: {
        ...(prev.adminConfig || {}),
        ...credentials,
        isPinSet: true
      }
    }));
  };

  // Profile operations
  const updateSchoolProfile = (profile: Partial<SchoolProfile>) => {
    setSchoolProfile(prev => ({ ...prev, ...profile }));
  };

  const setActiveSession = (session: string) => {
    setSchoolProfile(prev => ({ ...prev, session }));
  };

  const setActiveTerm = (currentTerm: TermType) => {
    setSchoolProfile(prev => ({ ...prev, currentTerm }));
  };

  // Class operations
  const addClass = (cls: Omit<SchoolClass, 'id'>) => {
    const newClass: SchoolClass = {
      ...cls,
      id: `cls-${Date.now()}`
    };
    setClasses(prev => [...prev, newClass]);
  };

  const updateClass = (id: string, updates: Partial<SchoolClass>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // Admission generator
  const generateNextAdmissionNo = () => {
    const prefix = schoolProfile.admissionPrefix || 'USMS';
    const year = schoolProfile.session ? schoolProfile.session.split('/')[0] : new Date().getFullYear();
    const currentCount = students.length + 1;
    const padded = String(currentCount).padStart(3, '0');
    return `${prefix}/${year}/${padded}`;
  };

  // Student operations
  const addStudent = (studentData: Omit<Student, 'id'>): Student => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      admissionNo: studentData.admissionNo || generateNextAdmissionNo()
    };
    setStudents(prev => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const bulkAddStudents = (newStudentsList: Partial<Student>[]): number => {
    const prefix = schoolProfile.admissionPrefix || 'USMS';
    const year = schoolProfile.session ? schoolProfile.session.split('/')[0] : new Date().getFullYear();
    let currentCount = students.length;

    const added: Student[] = [];
    newStudentsList.forEach(item => {
      if (!item.surname || !item.firstname) return;
      currentCount++;
      const admissionNo = item.admissionNo || `${prefix}/${year}/${String(currentCount).padStart(3, '0')}`;
      
      const newSt: Student = {
        id: `std-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        admissionNo,
        surname: item.surname,
        firstname: item.firstname,
        otherName: item.otherName || '',
        gender: (item.gender === 'Female' ? 'Female' : 'Male') as 'Male' | 'Female',
        dateOfBirth: item.dateOfBirth || '2012-01-01',
        age: Number(item.age) || 12,
        currentClass: item.currentClass || (classes[0]?.name || 'JSS 1'),
        parentName: item.parentName || 'Parent / Guardian',
        parentPhone: item.parentPhone || '',
        parentEmail: item.parentEmail || '',
        parentAddress: item.parentAddress || schoolProfile.address || '',
        enrolledSubjects: item.enrolledSubjects && item.enrolledSubjects.length > 0
          ? item.enrolledSubjects
          : (classes.find(c => c.name === item.currentClass)?.subjects || ['Mathematics', 'English Language']),
        admissionDate: item.admissionDate || new Date().toISOString().split('T')[0],
        photoUrl: item.photoUrl || '',
        status: (item.status as any) || 'Active',
        notes: item.notes || ''
      };
      added.push(newSt);
    });

    if (added.length > 0) {
      setStudents(prev => [...added, ...prev]);
    }
    return added.length;
  };

  // Staff operations
  const addStaff = (staffData: Omit<Staff, 'id'>): Staff => {
    const nextNum = staff.length + 1;
    const year = new Date().getFullYear();
    const generatedStaffId = `STAFF/${year}/${String(nextNum).padStart(3, '0')}`;

    const newStaff: Staff = {
      ...staffData,
      id: `stf-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      staffId: staffData.staffId || generatedStaffId
    };
    setStaff(prev => [newStaff, ...prev]);
    return newStaff;
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff(prev => prev.map(st => st.id === id ? { ...st, ...updates } : st));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(st => st.id !== id));
  };

  // Payment Vouchers operations
  const addPaymentVoucher = (voucherData: Omit<PaymentVoucher, 'id' | 'voucherNo'>): PaymentVoucher => {
    const year = new Date().getFullYear();
    const month = new Date().toLocaleString('default', { month: '2-digit' });
    const count = paymentVouchers.length + 1;
    const voucherNo = `PV/${year}/${month}/${String(count).padStart(3, '0')}`;

    const newVoucher: PaymentVoucher = {
      ...voucherData,
      id: `vch-${Date.now()}`,
      voucherNo
    };

    setPaymentVouchers(prev => [newVoucher, ...prev]);
    return newVoucher;
  };

  const updatePaymentVoucher = (id: string, updates: Partial<PaymentVoucher>) => {
    setPaymentVouchers(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deletePaymentVoucher = (id: string) => {
    setPaymentVouchers(prev => prev.filter(v => v.id !== id));
  };

  // Exam Score operations
  const saveScoresBatch = (scores: { studentId: string; studentName: string; admissionNo: string; className: string; subject: string; session: string; term: TermType; ca1: number; ca2: number; ca3: number; exam: number }[]) => {
    setExamScores(prev => {
      const updated = [...prev];
      scores.forEach(s => {
        const total = Math.min(100, Math.max(0, s.ca1 + s.ca2 + s.ca3 + s.exam));
        const gradeInfo = calculateGrade(total, schoolProfile.gradingScheme);
        const existingIdx = updated.findIndex(
          item => item.studentId === s.studentId &&
                  item.subject === s.subject &&
                  item.session === s.session &&
                  item.term === s.term
        );

        const record: ExamScore = {
          id: existingIdx >= 0 ? updated[existingIdx].id : `sc-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          studentId: s.studentId,
          studentName: s.studentName,
          admissionNo: s.admissionNo,
          className: s.className,
          subject: s.subject,
          session: s.session,
          term: s.term,
          ca1: s.ca1,
          ca2: s.ca2,
          ca3: s.ca3,
          exam: s.exam,
          totalScore: total,
          grade: gradeInfo.grade,
          remark: gradeInfo.remark
        };

        if (existingIdx >= 0) {
          updated[existingIdx] = record;
        } else {
          updated.push(record);
        }
      });
      return updated;
    });
  };

  const updateScore = (id: string, updates: Partial<ExamScore>) => {
    setExamScores(prev => prev.map(sc => {
      if (sc.id === id) {
        const merged = { ...sc, ...updates };
        const total = Math.min(100, Math.max(0, (merged.ca1 || 0) + (merged.ca2 || 0) + (merged.ca3 || 0) + (merged.exam || 0)));
        const gradeInfo = calculateGrade(total, schoolProfile.gradingScheme);
        return {
          ...merged,
          totalScore: total,
          grade: gradeInfo.grade,
          remark: gradeInfo.remark
        };
      }
      return sc;
    }));
  };

  // Assessment operations
  const saveStudentAssessment = (assessment: StudentTermAssessment) => {
    setTermAssessments(prev => ({
      ...prev,
      [assessment.studentId]: assessment
    }));
  };

  // Timetable Operations
  const saveTimetable = (timetable: ClassTimetable) => {
    setTimetables(prev => {
      const idx = prev.findIndex(t => t.id === timetable.id || (t.className === timetable.className && t.session === timetable.session && t.term === timetable.term));
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...timetable, lastUpdated: new Date().toISOString() };
        return updated;
      } else {
        return [...prev, { ...timetable, lastUpdated: new Date().toISOString() }];
      }
    });
  };

  const getTimetable = (className: string, session: string, term: TermType): ClassTimetable | undefined => {
    return timetables.find(t => t.className === className && t.session === session && t.term === term);
  };

  const deleteTimetable = (id: string) => {
    setTimetables(prev => prev.filter(t => t.id !== id));
  };

  const generateDefaultTimetable = (className: string, session: string, term: TermType): ClassTimetable => {
    const classObj = classes.find(c => c.name === className);
    const subjects = classObj?.subjects || ['Mathematics', 'English Language', 'Basic Science', 'Social Studies', 'Computer Studies'];
    const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    const slots: TimetableSlot[] = [];
    let subIdx = 0;

    days.forEach(day => {
      // 8 periods per day
      for (let p = 1; p <= 8; p++) {
        const subject = subjects[subIdx % subjects.length];
        const assignedTeacher = staff.find(st => st.subjectsTaught?.includes(subject) || st.assignedClass === className);
        
        slots.push({
          id: `slot-${day}-${p}-${Date.now()}`,
          day,
          periodNumber: p,
          subject,
          teacherId: assignedTeacher?.id,
          teacherName: assignedTeacher?.fullName || classObj?.classTeacher || 'Subject Teacher',
          room: `Room ${className}`
        });
        subIdx++;
      }
    });

    const newTimetable: ClassTimetable = {
      id: `tt-${className.replace(/\s+/g, '_')}-${session.replace('/', '_')}-${term.replace(/\s+/g, '_')}`,
      className,
      session,
      term,
      slots,
      periodsConfig: DEFAULT_PERIODS,
      lastUpdated: new Date().toISOString(),
      classTeacher: classObj?.classTeacher || ''
    };

    saveTimetable(newTimetable);
    return newTimetable;
  };

  // Backup and Restore
  const exportDatabaseBackup = () => {
    const fullBackup = {
      version: 'USMS-2.6',
      exportedAt: new Date().toISOString(),
      companyCredit: 'JADSL ICT Unit Community Centre, Gboko. Phone: 07067797854, WhatsApp: 08071119766',
      schoolProfile,
      classes,
      students,
      staff,
      paymentVouchers,
      examScores,
      termAssessments,
      timetables
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const dateStr = new Date().toISOString().split('T')[0];
    const safeSchoolName = (schoolProfile.name || 'USMS').replace(/\s+/g, '_');
    downloadAnchor.setAttribute('download', `USMS_Database_Backup_${safeSchoolName}_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDatabaseBackup = (jsonContent: string): boolean => {
    try {
      const data = JSON.parse(jsonContent);
      if (data.schoolProfile) setSchoolProfile(data.schoolProfile);
      if (data.classes) setClasses(data.classes);
      if (data.students) setStudents(data.students);
      if (data.staff) setStaff(data.staff);
      if (data.paymentVouchers) setPaymentVouchers(data.paymentVouchers);
      if (data.examScores) setExamScores(data.examScores);
      if (data.termAssessments) setTermAssessments(data.termAssessments);
      if (data.timetables) setTimetables(data.timetables);
      return true;
    } catch (e) {
      console.error('Failed to import database:', e);
      return false;
    }
  };

  const resetToDemoData = () => {
    setSchoolProfile(DEFAULT_SCHOOL_PROFILE);
    setClasses(DEFAULT_CLASSES);
    setStudents(DEMO_STUDENTS);
    setStaff(DEMO_STAFF);
    setExamScores([]);
    setTermAssessments({});
    setPaymentVouchers([]);
    setTimetables([]);
  };

  const clearAllData = () => {
    setStudents([]);
    setStaff([]);
    setExamScores([]);
    setTermAssessments({});
    setPaymentVouchers([]);
    setTimetables([]);
    setSchoolProfile(prev => ({ ...prev, isConfigured: true }));
  };

  return (
    <SchoolContext.Provider
      value={{
        schoolProfile,
        updateSchoolProfile,
        classes,
        addClass,
        updateClass,
        deleteClass,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        bulkAddStudents,
        generateNextAdmissionNo,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        paymentVouchers,
        addPaymentVoucher,
        updatePaymentVoucher,
        deletePaymentVoucher,
        examScores,
        saveScoresBatch,
        updateScore,
        termAssessments,
        saveStudentAssessment,
        timetables,
        saveTimetable,
        getTimetable,
        deleteTimetable,
        generateDefaultTimetable,
        setActiveSession,
        setActiveTerm,
        isAdminAuthenticated,
        currentUser,
        adminLogin,
        adminLogout,
        updateAdminCredentials,
        exportDatabaseBackup,
        exportDatabaseJSON: exportDatabaseBackup,
        importDatabaseBackup,
        resetToDemoData,
        clearAllData,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
