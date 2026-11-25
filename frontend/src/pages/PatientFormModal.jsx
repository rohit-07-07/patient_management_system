import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../components/Modal';
import { createPatient, updatePatient, clearPatientError } from '../store/patientSlice';

export default function PatientFormModal({ isOpen, onClose, patientToEdit }) {
  const dispatch = useDispatch();
  const { actionLoading, error } = useSelector((state) => state.patients);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        name: patientToEdit.name || '',
        age: patientToEdit.age !== undefined ? patientToEdit.age : '',
        gender: patientToEdit.gender || 'Male',
        phone: patientToEdit.phone || '',
        email: patientToEdit.email || '',
        address: patientToEdit.address || ''
      });
    } else {
      setFormData({
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: ''
      });
    }
    setFieldErrors({});
    dispatch(clearPatientError());
  }, [patientToEdit, isOpen, dispatch]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Patient name is required';
    if (!formData.age && formData.age !== 0) {
      errs.age = 'Age is required';
    } else if (isNaN(formData.age) || Number(formData.age) < 0 || Number(formData.age) > 130) {
      errs.age = 'Provide a realistic age between 0 and 130';
    }
    if (!formData.gender) errs.gender = 'Gender is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Enter a valid email format';
    }
    if (!formData.address.trim()) errs.address = 'Residential address is required';

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      age: parseInt(formData.age, 10)
    };

    let resultAction;
    if (patientToEdit) {
      resultAction = await dispatch(updatePatient({ id: patientToEdit.id, patientData: payload }));
    } else {
      resultAction = await dispatch(createPatient(payload));
    }

    if (!resultAction.error) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={patientToEdit ? 'Edit Patient Record' : 'Register New Patient'}
      maxWidth="560px"
    >
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="patient-name">
            Full Name *
          </label>
          <input
            id="patient-name"
            name="name"
            className="form-control"
            placeholder="e.g. Johnathan Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={actionLoading}
          />
          {fieldErrors.name && <div className="form-error">{fieldErrors.name}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="patient-age">
              Age *
            </label>
            <input
              id="patient-age"
              type="number"
              name="age"
              min="0"
              max="130"
              className="form-control"
              placeholder="e.g. 45"
              value={formData.age}
              onChange={handleChange}
              disabled={actionLoading}
            />
            {fieldErrors.age && <div className="form-error">{fieldErrors.age}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="patient-gender">
              Gender *
            </label>
            <select
              id="patient-gender"
              name="gender"
              className="form-control"
              value={formData.gender}
              onChange={handleChange}
              disabled={actionLoading}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {fieldErrors.gender && <div className="form-error">{fieldErrors.gender}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="patient-phone">
              Phone Number *
            </label>
            <input
              id="patient-phone"
              name="phone"
              className="form-control"
              placeholder="+1-555-0199"
              value={formData.phone}
              onChange={handleChange}
              disabled={actionLoading}
            />
            {fieldErrors.phone && <div className="form-error">{fieldErrors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="patient-email">
              Email Address *
            </label>
            <input
              id="patient-email"
              type="email"
              name="email"
              className="form-control"
              placeholder="patient@domain.com"
              value={formData.email}
              onChange={handleChange}
              disabled={actionLoading}
            />
            {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="patient-address">
            Residential Address *
          </label>
          <textarea
            id="patient-address"
            name="address"
            rows="3"
            className="form-control"
            placeholder="Street address, City, State"
            value={formData.address}
            onChange={handleChange}
            disabled={actionLoading}
          />
          {fieldErrors.address && <div className="form-error">{fieldErrors.address}</div>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={actionLoading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={actionLoading}>
            {actionLoading ? 'Saving Patient...' : patientToEdit ? 'Save Changes' : 'Create Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
