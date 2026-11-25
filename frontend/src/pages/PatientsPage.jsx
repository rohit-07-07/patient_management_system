import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Topbar from '../components/Topbar';
import PatientFormModal from './PatientFormModal';
import PatientDetailsModal from './PatientDetailsModal';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  fetchPatients,
  fetchPatientById,
  deletePatient,
  setSearchTerm,
  setSelectedGender
} from '../store/patientSlice';

export default function PatientsPage() {
  const dispatch = useDispatch();
  const { items, loading, actionLoading, error, searchTerm, selectedGender, selectedPatient } =
    useSelector((state) => state.patients);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchPatients({ search: searchTerm, gender: selectedGender }));
  }, [dispatch, searchTerm, selectedGender]);

  const handleOpenAdd = () => {
    setPatientToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (patient) => {
    setPatientToEdit(patient);
    setIsFormOpen(true);
  };

  const handleOpenDetails = (patient) => {
    dispatch(fetchPatientById(patient.id));
    setIsDetailsOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;
    await dispatch(deletePatient(patientToDelete.id));
    setPatientToDelete(null);
  };

  return (
    <div>
      <Topbar title="Patient Registry" />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h2 className="page-heading">Patient Records</h2>
            <p className="page-subheading">Manage admissions, demographics, and clinical directory</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Patient
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card">
          <div className="card-body">
            <div className="filter-bar">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search patients by name or email..."
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                />
              </div>

              <div style={{ minWidth: '180px' }}>
                <select
                  className="form-control"
                  value={selectedGender}
                  onChange={(e) => dispatch(setSelectedGender(e.target.value))}
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Registered</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items && items.length > 0 ? (
                    items.map((patient) => (
                      <tr key={patient.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '12.5px', color: 'var(--text-subtle)' }}>
                          {patient.id.slice(0, 8)}...
                        </td>
                        <td style={{ fontWeight: 600 }}>{patient.name}</td>
                        <td>{patient.age}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.phone}</td>
                        <td>{patient.email}</td>
                        <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenDetails(patient)}
                              title="View Patient Details"
                            >
                              View
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEdit(patient)}
                              title="Edit Patient Info"
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => setPatientToDelete(patient)}
                              title="Delete Patient"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        {loading ? 'Fetching patients...' : 'No patients match your search criteria.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <PatientFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        patientToEdit={patientToEdit}
      />

      <PatientDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        patient={selectedPatient}
      />

      <ConfirmDialog
        isOpen={!!patientToDelete}
        onClose={() => setPatientToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient Record"
        message={`Are you sure you want to delete "${patientToDelete?.name}"? All associated bills will also be permanently removed.`}
        confirmText="Confirm Delete"
        loading={actionLoading}
      />
    </div>
  );
}
