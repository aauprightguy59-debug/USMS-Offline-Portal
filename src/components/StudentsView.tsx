import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Student } from '../types';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  CreditCard,
  Edit2,
  Trash2,
  Phone,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { downloadStudentUploadTemplate } from '../utils/excelHelper';

interface StudentsViewProps {
  onOpenAdmission: (student?: Student) => void;
  onOpenExcelUpload: () => void;
  onOpenIDCardModal: (students: Student[]) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  onOpenAdmission,
  onOpenExcelUpload,
  onOpenIDCardModal
}) => {
  const { students, classes, deleteStudent, schoolProfile } = useSchool();

  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Filter students
  const filteredStudents = students.filter(st => {
    const matchesClass = selectedClass === 'all' || st.currentClass === selectedClass;
    const matchesGender = selectedGender === 'all' || st.gender === selectedGender;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query ||
      st.admissionNo.toLowerCase().includes(query) ||
      st.surname.toLowerCase().includes(query) ||
      st.firstname.toLowerCase().includes(query) ||
      (st.otherName && st.otherName.toLowerCase().includes(query)) ||
      st.parentName.toLowerCase().includes(query) ||
      st.parentPhone.includes(query);

    return matchesClass && matchesGender && matchesQuery;
  });

  const toggleSelectStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const selectAllFiltered = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handlePrintSelectedCards = () => {
    const target = students.filter(s => selectedStudents.includes(s.id));
    if (target.length === 0) {
      alert('Please select one or more students using the checkboxes to print their ID cards.');
      return;
    }
    onOpenIDCardModal(target);
  };

  const handlePrintClassCards = () => {
    if (filteredStudents.length === 0) {
      alert('No students found in the current filter to print.');
      return;
    }
    onOpenIDCardModal(filteredStudents);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete student "${name}"? This action cannot be undone.`)) {
      deleteStudent(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action Buttons */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Student Admission & Records Management
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {students.length} Total Enrolled Students &bull; Session {schoolProfile.session}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-add-student-modal"
            onClick={() => onOpenAdmission()}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Admission</span>
          </button>

          <button
            id="btn-excel-upload-modal"
            onClick={onOpenExcelUpload}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel Bulk Upload</span>
          </button>

          <button
            onClick={downloadStudentUploadTemplate}
            title="Download Excel Admission Template"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition border border-slate-200 dark:border-slate-600 cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrintClassCards}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow transition cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Print ID Cards</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, admission no, parent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-semibold">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Classes ({classes.length})</option>
              {classes.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-semibold">Sex:</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {selectedStudents.length > 0 && (
            <button
              onClick={handlePrintSelectedCards}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Print Selected ({selectedStudents.length})
            </button>
          )}
        </div>

      </div>

      {/* Students Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                    onChange={selectAllFiltered}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                </th>
                <th className="py-3 px-3 font-bold uppercase">Adm No</th>
                <th className="py-3 px-3 font-bold uppercase">Student Name</th>
                <th className="py-3 px-3 font-bold uppercase">Class</th>
                <th className="py-3 px-3 font-bold uppercase">Sex</th>
                <th className="py-3 px-3 font-bold uppercase">Age</th>
                <th className="py-3 px-3 font-bold uppercase">Parent / Contact</th>
                <th className="py-3 px-3 font-bold uppercase">Subjects</th>
                <th className="py-3 px-3 font-bold uppercase">Status</th>
                <th className="py-3 px-3 font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => {
                  const isSelected = selectedStudents.includes(st.id);
                  const fullName = `${st.surname} ${st.firstname} ${st.otherName || ''}`.trim();
                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition ${
                        isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectStudent(st.id)}
                          className="rounded text-blue-600 focus:ring-0"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {st.admissionNo}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          {st.photoUrl ? (
                            <img
                              src={st.photoUrl}
                              alt="Avatar"
                              className="w-8 h-8 rounded-full object-cover border border-slate-300"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                              {st.surname[0]}{st.firstname[0]}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white uppercase block">
                              {st.surname}
                            </span>
                            <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                              {st.firstname} {st.otherName || ''}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-semibold">
                          {st.currentClass}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {st.gender}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {st.age} yrs
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">
                          {st.parentName}
                        </div>
                        {st.parentPhone && (
                          <div className="text-slate-500 text-[11px] flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5" /> {st.parentPhone}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                          {st.enrolledSubjects ? st.enrolledSubjects.length : 0} Subjects
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {st.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Print ID Card"
                            onClick={() => onOpenIDCardModal([st])}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                          >
                            <CreditCard className="w-4 h-4 text-amber-600" />
                          </button>
                          <button
                            title="Edit Student Record"
                            onClick={() => onOpenAdmission(st)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            title="Delete Record"
                            onClick={() => handleDelete(st.id, fullName)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <p className="font-semibold">No students found matching your criteria</p>
                    <p className="text-xs mt-1">Click "New Admission" or "Excel Bulk Upload" to add students.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
