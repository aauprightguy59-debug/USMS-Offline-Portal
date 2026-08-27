import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { MasterAdminLogin } from './components/MasterAdminLogin';
import { MasterAdminSetup } from './components/MasterAdminSetup';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { StudentsView } from './components/StudentsView';
import { TimetableManagementView } from './components/TimetableManagementView';
import { ExamScoresView } from './components/ExamScoresView';
import { ReportCardViewer } from './components/ReportCardViewer';
import { AnalyticsView } from './components/AnalyticsView';
import { StaffPayrollView } from './components/StaffPayrollView';
import { SettingsView } from './components/SettingsView';

// Modals
import { AdmissionModal } from './components/AdmissionModal';
import { StudentExcelModal } from './components/StudentExcelModal';
import { StudentIDCardModal } from './components/StudentIDCardModal';
import { StaffModal } from './components/StaffModal';
import { PaymentVoucherModal } from './components/PaymentVoucherModal';
import { PrintableVoucher } from './components/PrintableVoucher';
import { AdminAuthModal } from './components/AdminAuthModal';
import { Student, Staff, PaymentVoucher } from './types';

const MainApp: React.FC = () => {
  const { schoolProfile, exportDatabaseJSON, isAdminAuthenticated, currentUser, activeTab, setActiveTab } = useSchool();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Admin Security Auth Modal
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);

  // Modal States
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);

  const [isIDCardModalOpen, setIsIDCardModalOpen] = useState(false);
  const [studentsForIDCards, setStudentsForIDCards] = useState<Student[]>([]);

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<Staff | null>(null);

  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [activePrintVoucher, setActivePrintVoucher] = useState<PaymentVoucher | null>(null);

  // If administrator is not authenticated, require Master Administrator Login before accessing USMS
  if (!schoolProfile.adminConfig || !schoolProfile.isConfigured) {
    return <MasterAdminSetup />;
  }

  if (!isAdminAuthenticated) {
    return <MasterAdminLogin onLoginSuccess={() => setActiveTab('dashboard')} />;
  }

  // Student Admission handlers
  const handleOpenAdmission = (student?: Student) => {
    setStudentToEdit(student || null);
    setIsAdmissionModalOpen(true);
  };

  const handleOpenIDCards = (students: Student[]) => {
    setStudentsForIDCards(students);
    setIsIDCardModalOpen(true);
  };

  // Staff handlers
  const handleOpenStaffModal = (staff?: Staff) => {
    if (currentUser?.role !== 'master') return;
    setStaffToEdit(staff || null);
    setIsStaffModalOpen(true);
  };

  const handleOpenPrintVoucher = (voucher: PaymentVoucher) => {
    setActivePrintVoucher(voucher);
  };

  const handleOpenAdminAuth = (onSuccessCallback?: () => void) => {
    setPendingAuthAction(() => onSuccessCallback || (() => setActiveTab('settings')));
    setIsAdminAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAdminAuthModalOpen(false);
    if (pendingAuthAction) {
      pendingAuthAction();
      setPendingAuthAction(null);
    }
  };

  const handleNavigateTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      
      {/* Bento Sidebar: Fixed Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        onOpenBackup={exportDatabaseJSON}
        onOpenAdminAuth={() => handleOpenAdminAuth()}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Bento Header with USMS Logo & Master Admin Status */}
        <Header
          onOpenAdmission={() => handleOpenAdmission()}
          onOpenExcelUpload={() => setIsExcelUploadOpen(true)}
          onOpenBackup={exportDatabaseJSON}
          onOpenAdminAuth={() => handleOpenAdminAuth()}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Content Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-[1600px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={handleNavigateTab}
              onOpenAdmission={() => handleOpenAdmission()}
              onOpenExcelUpload={() => setIsExcelUploadOpen(true)}
              onOpenStaffModal={() => handleOpenStaffModal()}
              onOpenVoucherModal={() => setIsVoucherModalOpen(true)}
              onOpenPrintVoucher={handleOpenPrintVoucher}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              onOpenAdmission={handleOpenAdmission}
              onOpenExcelUpload={() => setIsExcelUploadOpen(true)}
              onOpenIDCardModal={handleOpenIDCards}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableManagementView />
          )}

          {activeTab === 'exams' && <ExamScoresView />}

          {activeTab === 'reports' && <ReportCardViewer />}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'staff' && (
            <StaffPayrollView
              onOpenStaffModal={handleOpenStaffModal}
              onOpenVoucherModal={() => setIsVoucherModalOpen(true)}
              onOpenPrintVoucher={handleOpenPrintVoucher}
            />
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>

        {/* Footer */}
        <Footer onOpenBackup={exportDatabaseJSON} />
      </div>

      {/* Modals & Dialogs */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => {
          setIsAdminAuthModalOpen(false);
          setPendingAuthAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      <AdmissionModal
        isOpen={isAdmissionModalOpen}
        onClose={() => {
          setIsAdmissionModalOpen(false);
          setStudentToEdit(null);
        }}
        studentToEdit={studentToEdit}
      />

      <StudentExcelModal
        isOpen={isExcelUploadOpen}
        onClose={() => setIsExcelUploadOpen(false)}
      />

      <StudentIDCardModal
        isOpen={isIDCardModalOpen}
        onClose={() => {
          setIsIDCardModalOpen(false);
          setStudentsForIDCards([]);
        }}
        studentsToPrint={studentsForIDCards}
      />

      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => {
          setIsStaffModalOpen(false);
          setStaffToEdit(null);
        }}
        staffToEdit={staffToEdit}
      />

      <PaymentVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onVoucherCreated={(v) => setActivePrintVoucher(v)}
      />

      <PrintableVoucher
        voucher={activePrintVoucher}
        onClose={() => setActivePrintVoucher(null)}
      />

    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainApp />
    </SchoolProvider>
  );
}
