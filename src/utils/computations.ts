import { GradeConfig, ExamScore, Student, StudentTermAssessment, ComputedReportCard, SubjectStat, SchoolProfile, SchoolClass } from '../types';
import { DEFAULT_GRADING_SCHEME } from '../data/defaultData';

export function calculateGrade(total: number, gradingScheme: GradeConfig[]): { grade: string; remark: string; point: number; color: string } {
  for (const item of gradingScheme) {
    if (total >= item.minScore && total <= item.maxScore) {
      return {
        grade: item.grade,
        remark: item.remark,
        point: item.point,
        color: item.color || '#2563eb'
      };
    }
  }
  // Default fallback
  return { grade: 'F9', remark: 'Fail', point: 0, color: '#dc2626' };
}

export function computeClassSubjectStats(
  scores: ExamScore[],
  className: string,
  session: string,
  term: string,
  gradingScheme: GradeConfig[]
): Map<string, { highest: number; lowest: number; average: number; count: number }> {
  const map = new Map<string, { highest: number; lowest: number; average: number; count: number }>();
  
  const classScores = scores.filter(
    s => s.className === className && s.session === session && s.term === term
  );

  // Group by subject
  const subjectGroups = new Map<string, number[]>();
  for (const sc of classScores) {
    if (!subjectGroups.has(sc.subject)) {
      subjectGroups.set(sc.subject, []);
    }
    subjectGroups.get(sc.subject)!.push(sc.totalScore);
  }

  subjectGroups.forEach((totals, subject) => {
    if (totals.length > 0) {
      const highest = Math.max(...totals);
      const lowest = Math.min(...totals);
      const sum = totals.reduce((a, b) => a + b, 0);
      const average = Math.round((sum / totals.length) * 10) / 10;
      map.set(subject, { highest, lowest, average, count: totals.length });
    }
  });

  return map;
}

export function computeStudentReportCard(
  student: Student,
  allStudentsInClass: Student[],
  allScores: ExamScore[],
  session: string,
  term: string,
  gradingScheme: GradeConfig[] = DEFAULT_GRADING_SCHEME,
  assessmentsMap: Record<string, StudentTermAssessment> = {},
  schoolProfile?: Partial<SchoolProfile>
): ComputedReportCard {
  const studentScores = allScores.filter(
    s => s.studentId === student.id && s.session === session && s.term === term
  );

  const classScores = allScores.filter(
    s => s.className === student.currentClass && s.session === session && s.term === term
  );

  const subjectStatsMap = computeClassSubjectStats(allScores, student.currentClass, session, term, gradingScheme);

  // Compute subject position for each subject
  const subjects: SubjectStat[] = studentScores.map(sc => {
    // find all scores for this subject in class to get position
    const allSubjectScores = classScores
      .filter(s => s.subject === sc.subject)
      .sort((a, b) => b.totalScore - a.totalScore);
    
    let position = 1;
    for (let i = 0; i < allSubjectScores.length; i++) {
      if (allSubjectScores[i].studentId === student.id) {
        position = i + 1;
        break;
      }
    }

    const stat = subjectStatsMap.get(sc.subject) || { highest: sc.totalScore, lowest: sc.totalScore, average: sc.totalScore, count: 1 };
    const gradeInfo = calculateGrade(sc.totalScore, gradingScheme);

    return {
      subject: sc.subject,
      ca: (sc.ca1 || 0) + (sc.ca2 || 0) + (sc.ca3 || 0),
      exam: sc.exam,
      total: sc.totalScore,
      grade: gradeInfo.grade,
      remark: gradeInfo.remark,
      classHighest: stat.highest,
      classLowest: stat.lowest,
      classAverage: stat.average,
      position: position
    };
  });

  // Calculate student total marks & average
  const totalMarksObtained = subjects.reduce((sum, s) => sum + s.total, 0);
  const totalPossibleMarks = subjects.length * 100;
  const overallAverage = subjects.length > 0 ? Math.round((totalMarksObtained / subjects.length) * 100) / 100 : 0;

  // Calculate class rank among all students in class
  // To get reliable rank, compute average for all students in class
  const classAverages = allStudentsInClass.map(st => {
    const stScores = classScores.filter(s => s.studentId === st.id);
    const total = stScores.reduce((acc, sc) => acc + sc.totalScore, 0);
    const avg = stScores.length > 0 ? total / stScores.length : 0;
    return { studentId: st.id, average: avg, total };
  }).sort((a, b) => b.average - a.average || b.total - a.total);

  let classPosition = 1;
  for (let i = 0; i < classAverages.length; i++) {
    if (classAverages[i].studentId === student.id) {
      classPosition = i + 1;
      break;
    }
  }

  // GPA computation
  let totalGradePoints = 0;
  subjects.forEach(sub => {
    const gradeObj = gradingScheme.find(g => g.grade === sub.grade);
    totalGradePoints += gradeObj ? gradeObj.point : 0;
  });
  const gpa = subjects.length > 0 ? Math.round((totalGradePoints / subjects.length) * 100) / 100 : 0;

  // Assessment & behavioral notes
  const savedAssessment = assessmentsMap[student.id] || {
    studentId: student.id,
    session,
    term,
    className: student.currentClass,
    presentDays: 60,
    totalDays: 65,
    behaviorTraits: {
      punctuality: 4,
      neatness: 4,
      politeness: 4,
      honesty: 4,
      leadership: 4,
      attentiveness: 4
    },
    psychomotorTraits: {
      handwriting: 4,
      sports: 4,
      crafts: 4,
      speechFluency: 4
    },
    teacherRemarks: getAutomaticTeacherRemark(overallAverage),
    principalRemarks: getAutomaticPrincipalRemark(overallAverage),
    nextTermFee: schoolProfile?.nextTermFee
  };

  return {
    student,
    session,
    term: term as any,
    className: student.currentClass,
    subjects,
    totalMarksObtained,
    totalPossibleMarks,
    overallAverage,
    classPosition,
    totalStudentsInClass: allStudentsInClass.length || 1,
    gpa,
    attendance: {
      presentDays: savedAssessment.presentDays,
      totalDays: savedAssessment.totalDays
    },
    behaviorTraits: savedAssessment.behaviorTraits,
    psychomotorTraits: savedAssessment.psychomotorTraits,
    teacherRemarks: savedAssessment.teacherRemarks || getAutomaticTeacherRemark(overallAverage),
    principalRemarks: savedAssessment.principalRemarks || getAutomaticPrincipalRemark(overallAverage),
    nextTermFee: savedAssessment.nextTermFee || schoolProfile?.nextTermFee || '₦45,000.00',
    nextTermResumptionDate: schoolProfile?.nextTermResumptionDate || 'To be announced'
  };
}

export function getAutomaticTeacherRemark(average: number): string {
  if (average >= 85) return 'An excellent and phenomenal result. Maintained extraordinary concentration and consistency throughout the term.';
  if (average >= 75) return 'Very brilliant and commendable performance. Keep sustaining this high intellectual drive.';
  if (average >= 65) return 'Good academic achievement. Has the potential for even higher distinction with more focused study.';
  if (average >= 50) return 'Satisfactory outcome, but more effort and active classroom participation are advised next term.';
  if (average >= 40) return 'A weak pass. Must sit up and take remedial coaching in difficult subjects next term.';
  return 'Poor performance. Needs earnest parental supervision and intensive academic assistance.';
}

export function getAutomaticPrincipalRemark(average: number): string {
  if (average >= 85) return 'Outstanding academic laureate! A proud representative of the school.';
  if (average >= 75) return 'Very impressive terminal result. Keep it up!';
  if (average >= 65) return 'A commendable achievement. Work harder to attain distinction.';
  if (average >= 50) return 'Promoted on average standing. Greater seriousness is required.';
  if (average >= 40) return 'Fair performance. Needs significant academic boost.';
  return 'Unsatisfactory result. Repeat or seek special remedial program.';
}

export interface BestSubjectRecord {
  subject: string;
  className: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  score: number;
  grade: string;
}

export interface BestClassRecord {
  className: string;
  first: { student: Student; average: number; total: number; subjectsCount: number } | null;
  second: { student: Student; average: number; total: number; subjectsCount: number } | null;
  third: { student: Student; average: number; total: number; subjectsCount: number } | null;
  totalStudents: number;
}

export interface OverallSchoolBest {
  student: Student;
  className: string;
  average: number;
  totalMarks: number;
  subjectsCount: number;
}

export function computePerformanceAnalytics(
  students: Student[],
  scores: ExamScore[],
  classes: (string | SchoolClass)[],
  session: string,
  term: string,
  gradingScheme: GradeConfig[] = DEFAULT_GRADING_SCHEME
): {
  subjectChampionsByClass: Record<string, BestSubjectRecord[]>;
  subjectChampions: BestSubjectRecord[];
  classMeritList: BestClassRecord[];
  overallSchoolBest: OverallSchoolBest[];
  overallBestStudents: {
    studentId: string;
    studentName: string;
    admissionNo: string;
    className: string;
    average: number;
    totalMarks: number;
    gpa: number;
  }[];
  overallStats: {
    totalStudents: number;
    distinctionCount: number; // >= 75%
    creditCount: number;      // 50-74%
    passCount: number;        // 40-49%
    failCount: number;        // < 40%
    averageSchoolScore: number;
  };
} {
  const subjectChampionsByClass: Record<string, BestSubjectRecord[]> = {};
  const allSubjectChampionsList: BestSubjectRecord[] = [];
  const classMeritList: BestClassRecord[] = [];
  const allStudentAverages: OverallSchoolBest[] = [];

  let distinctionCount = 0;
  let creditCount = 0;
  let passCount = 0;
  let failCount = 0;
  let totalCalculatedAverages = 0;
  let sumSchoolAverages = 0;

  const classNames = classes.map(c => typeof c === 'string' ? c : c.name);

  classNames.forEach(className => {
    const classStudents = students.filter(s => s.currentClass === className && s.status === 'Active');
    const classScores = scores.filter(s => s.className === className && s.session === session && s.term === term);

    // 1. Subject Champions in this class
    const subjectsInClass = Array.from(new Set(classScores.map(s => s.subject)));
    const champions: BestSubjectRecord[] = [];

    subjectsInClass.forEach(sub => {
      const subScores = classScores.filter(s => s.subject === sub).sort((a, b) => b.totalScore - a.totalScore);
      if (subScores.length > 0) {
        const top = subScores[0];
        const gradeInfo = calculateGrade(top.totalScore, gradingScheme);
        const record = {
          subject: sub,
          className,
          studentId: top.studentId,
          studentName: top.studentName,
          admissionNo: top.admissionNo,
          score: top.totalScore,
          grade: gradeInfo.grade
        };
        champions.push(record);
        allSubjectChampionsList.push(record);
      }
    });

    subjectChampionsByClass[className] = champions;

    // 2. Class merit ranking
    const studentPerformance = classStudents.map(st => {
      const stScores = classScores.filter(s => s.studentId === st.id);
      const total = stScores.reduce((acc, sc) => acc + sc.totalScore, 0);
      const average = stScores.length > 0 ? Math.round((total / stScores.length) * 100) / 100 : 0;
      
      if (stScores.length > 0) {
        totalCalculatedAverages++;
        sumSchoolAverages += average;
        if (average >= 75) distinctionCount++;
        else if (average >= 50) creditCount++;
        else if (average >= 40) passCount++;
        else failCount++;

        allStudentAverages.push({
          student: st,
          className: st.currentClass,
          average,
          totalMarks: total,
          subjectsCount: stScores.length
        });
      }

      return {
        student: st,
        average,
        total,
        subjectsCount: stScores.length
      };
    }).filter(sp => sp.subjectsCount > 0)
      .sort((a, b) => b.average - a.average || b.total - a.total);

    classMeritList.push({
      className,
      first: studentPerformance[0] || null,
      second: studentPerformance[1] || null,
      third: studentPerformance[2] || null,
      totalStudents: classStudents.length
    });
  });

  // Sort overall best students across all classes
  const overallSchoolBest = [...allStudentAverages].sort((a, b) => b.average - a.average || b.totalMarks - a.totalMarks).slice(0, 10);

  const overallBestStudents = [...allStudentAverages]
    .sort((a, b) => b.average - a.average || b.totalMarks - a.totalMarks)
    .map(item => {
      const studentClassScores = scores.filter(s => s.studentId === item.student.id && s.session === session && s.term === term);
      let totalPts = 0;
      studentClassScores.forEach(sc => {
        const g = gradingScheme.find(gs => gs.grade === sc.grade);
        totalPts += g ? g.point : 0;
      });
      const gpa = studentClassScores.length > 0 ? Math.round((totalPts / studentClassScores.length) * 100) / 100 : 0;

      return {
        studentId: item.student.id,
        studentName: `${item.student.surname} ${item.student.firstname}`,
        admissionNo: item.student.admissionNo,
        className: item.className,
        average: item.average,
        totalMarks: item.totalMarks,
        gpa
      };
    });

  return {
    subjectChampionsByClass,
    subjectChampions: allSubjectChampionsList,
    classMeritList,
    overallSchoolBest,
    overallBestStudents,
    overallStats: {
      totalStudents: students.filter(s => s.status === 'Active').length,
      distinctionCount,
      creditCount,
      passCount,
      failCount,
      averageSchoolScore: totalCalculatedAverages > 0 ? Math.round((sumSchoolAverages / totalCalculatedAverages) * 10) / 10 : 0
    }
  };
}

export function formatOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(amount).replace('NGN', '₦');
}
