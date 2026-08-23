import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Student } from '../types';
import { X, UserPlus, Upload, Sparkles, Check, Image as ImageIcon } from 'lucide-react';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null;
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({
  isOpen,
  onClose,
  studentToEdit
}) => {
  const {
    schoolProfile,
    classes,
    addStudent,
    updateStudent,
    generateNextAdmissionNo
  } = useSchool();

  const [admissionNo, setAdmissionNo] = useState('');
  const [surname, setSurname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [otherName, setOtherName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('2013-05-10');
  const [age, setAge] = useState<number>(12);
  const [currentClass, setCurrentClass] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentAddress, setParentAddress] = useState('');
  const [enrolledSubjects, setEnrolledSubjects] = useState<string[]>([]);
  const [admissionDate, setAdmissionDate] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState<'Active' | 'Graduated' | 'Transferred' | 'Suspended'>('Active');
  const [notes, setNotes] = useState('');

  // Calculate age automatically when DOB changes
  useEffect(() => {
    if (dateOfBirth) {
      const birth = new Date(dateOfBirth);
      const now = new Date();
      let calculatedAge = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      if (!isNaN(calculatedAge) && calculatedAge > 0) {
        setAge(calculatedAge);
      }
    }
  }, [dateOfBirth]);

  // Set initial default class
  useEffect(() => {
    if (classes.length > 0 && !currentClass) {
      setCurrentClass(classes[0].name);
      setEnrolledSubjects(classes[0].subjects || []);
    }
  }, [classes, currentClass]);

  // When class changes, populate available subjects
  const handleClassChange = (newClass: string) => {
    setCurrentClass(newClass);
    const matched = classes.find(c => c.name === newClass);
    if (matched && matched.subjects.length > 0) {
      setEnrolledSubjects(matched.subjects);
    }
  };

  // Reset or populate on open
  useEffect(() => {
    if (studentToEdit) {
      setAdmissionNo(studentToEdit.admissionNo);
      setSurname(studentToEdit.surname);
      setFirstname(studentToEdit.firstname);
      setOtherName(studentToEdit.otherName || '');
      setGender(studentToEdit.gender);
      setDateOfBirth(studentToEdit.dateOfBirth);
      setAge(studentToEdit.age);
      setCurrentClass(studentToEdit.currentClass);
      setParentName(studentToEdit.parentName);
      setParentPhone(studentToEdit.parentPhone);
      setParentEmail(studentToEdit.parentEmail || '');
      setParentAddress(studentToEdit.parentAddress);
      setEnrolledSubjects(studentToEdit.enrolledSubjects || []);
      setAdmissionDate(studentToEdit.admissionDate);
      setPhotoUrl(studentToEdit.photoUrl || '');
      setStatus(studentToEdit.status);
      setNotes(studentToEdit.notes || '');
    } else {
      setAdmissionNo(generateNextAdmissionNo());
      setSurname('');
      setFirstname('');
      setOtherName('');
      setGender('Male');
      setDateOfBirth('2013-05-10');
      setAge(12);
      if (classes.length > 0) {
        setCurrentClass(classes[0].name);
        setEnrolledSubjects(classes[0].subjects || []);
      }
      setParentName('');
      setParentPhone('');
      setParentEmail('');
      setParentAddress('');
      setAdmissionDate(new Date().toISOString().split('T')[0]);
      setPhotoUrl('');
      setStatus('Active');
      setNotes('');
    }
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const currentClassObj = classes.find(c => c.name === currentClass);
  const availableClassSubjects = currentClassObj?.subjects || [
    'Mathematics', 'English Language', 'Basic Science', 'Social Studies', 'Civic Education', 'Computer Studies', 'Agricultural Science'
  ];

  const toggleSubject = (sub: string) => {
    if (enrolledSubjects.includes(sub)) {
      setEnrolledSubjects(enrolledSubjects.filter(s => s !== sub));
    } else {
      setEnrolledSubjects([...enrolledSubjects, sub]);
    }
  };

  const selectAllSubjects = () => {
    setEnrolledSubjects(availableClassSubjects);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surname.trim() || !firstname.trim() || !currentClass) {
      alert('Please fill in Student Surname, First Name and Assigned Class.');
      return;
    }

    const payload = {
      admissionNo: admissionNo.trim(),
      surname: surname.trim(),
      firstname: firstname.trim(),
      otherName: otherName.trim(),
      gender,
      dateOfBirth,
      age: Number(age) || 12,
      currentClass,
      parentName: parentName.trim() || 'Parent / Guardian',
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim(),
      parentAddress: parentAddress.trim(),
      enrolledSubjects: enrolledSubjects.length > 0 ? enrolledSubjects : availableClassSubjects,
      admissionDate: admissionDate || new Date().toISOString().split('T')[0],
      photoUrl,
      status,
      notes: notes.trim()
    };

    if (studentToEdit) {
      updateStudent(studentToEdit.id, payload);
    } else {
      addStudent(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {studentToEdit ? 'Edit Student Admission Record' : 'New Student Admission Entry'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Universal School Management System &bull; Official Student Bio-Data
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

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Section 1: Admission & Identity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">
                1. Admission & Personal Details
              </h4>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                Auto-generated Admission Number
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Admission Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-mono font-bold text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setAdmissionNo(generateNextAdmissionNo())}
                    title="Regenerate next sequential admission number"
                    className="absolute right-2 top-2 text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-semibold hover:bg-blue-200"
                  >
                    Auto
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Class *
                </label>
                <select
                  value={currentClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Admission Date
                </label>
                <input
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Names & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Surname (Family Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Terkimbi"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 uppercase font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faith"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Other / Middle Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Msughter"
                  value={otherName}
                  onChange={(e) => setOtherName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Sex, DOB, Age & Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sex / Gender *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Passport Photo
                </label>
                <div className="flex items-center gap-2">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Student"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <label className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer text-center truncate">
                    <Upload className="w-3.5 h-3.5 inline mr-1" /> Browse
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Parents & Contact Info */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">
                2. Parent / Guardian Contact Details
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Parent / Guardian Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elder Joshua Terkimbi"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Parent Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 08031234567"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Parent Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. parent@gmail.com"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Residential / Home Address
              </label>
              <input
                type="text"
                placeholder="e.g. No. 12 Low Cost Housing Estate, Gboko"
                value={parentAddress}
                onChange={(e) => setParentAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Section 3: Subject Enrolment */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">
                3. Enrolled Subjects for {currentClass} ({enrolledSubjects.length} Selected)
              </h4>
              <button
                type="button"
                onClick={selectAllSubjects}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                Select All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              {availableClassSubjects.map(sub => {
                const isSelected = enrolledSubjects.includes(sub);
                return (
                  <label
                    key={sub}
                    onClick={() => toggleSubject(sub)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer border transition select-none ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 text-blue-900 dark:text-blue-200 font-semibold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="truncate">{sub}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Special Notes & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Special Conduct / Medical Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Active debate team member, asthmatic condition"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enrollment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-semibold text-slate-900 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="Transferred">Transferred</option>
                <option value="Suspended">Suspended</option>
              </select>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{studentToEdit ? 'Save Changes' : 'Complete Admission'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
