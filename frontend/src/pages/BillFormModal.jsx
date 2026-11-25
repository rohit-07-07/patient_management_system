import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../components/Modal';
import { createBill, updateBill, clearBillingError } from '../store/billingSlice';
import { fetchPatients } from '../store/patientSlice';

export default function BillFormModal({ isOpen, onClose, billToEdit }) {
  const dispatch = useDispatch();
  const { actionLoading, error } = useSelector((state) => state.billing);
  const { items: patients } = useSelector((state) => state.patients);

  const [formData, setFormData] = useState({
    patientId: '',
    description: '',
    amount: '',
    tax: '0',
    paymentStatus: 'Pending'
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchPatients());
      dispatch(clearBillingError());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (billToEdit) {
      setFormData({
        patientId: billToEdit.patientId || '',
        description: billToEdit.description || '',
        amount: billToEdit.amount || '',
        tax: billToEdit.tax !== undefined ? billToEdit.tax : '0',
        paymentStatus: billToEdit.paymentStatus || 'Pending'
      });
    } else {
      setFormData({
        patientId: patients.length > 0 ? patients[0].id : '',
        description: '',
        amount: '',
        tax: '0',
        paymentStatus: 'Pending'
      });
    }
    setFieldErrors({});
  }, [billToEdit, isOpen, patients]);

  const totalAmount = (
    (parseFloat(formData.amount) || 0) + (parseFloat(formData.tax) || 0)
  ).toFixed(2);

  const validate = () => {
    const errs = {};
    if (!formData.patientId) errs.patientId = 'Please select a patient';
    if (!formData.description.trim()) errs.description = 'Service description is required';
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      errs.amount = 'Amount must be a positive number';
    }
    if (isNaN(formData.tax) || Number(formData.tax) < 0) {
      errs.tax = 'Tax cannot be negative';
    }

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
      patientId: formData.patientId,
      description: formData.description,
      amount: parseFloat(formData.amount),
      tax: parseFloat(formData.tax) || 0,
      paymentStatus: formData.paymentStatus
    };

    let resultAction;
    if (billToEdit) {
      resultAction = await dispatch(updateBill({ id: billToEdit.id, billData: payload }));
    } else {
      resultAction = await dispatch(createBill(payload));
    }

    if (!resultAction.error) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={billToEdit ? 'Edit Medical Invoice' : 'Generate New Bill'}
      maxWidth="540px"
    >
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="bill-patient">
            Select Patient *
          </label>
          <select
            id="bill-patient"
            name="patientId"
            className="form-control"
            value={formData.patientId}
            onChange={handleChange}
            disabled={actionLoading || !!billToEdit}
          >
            <option value="">-- Choose Patient --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.phone})
              </option>
            ))}
          </select>
          {fieldErrors.patientId && <div className="form-error">{fieldErrors.patientId}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="bill-desc">
            Treatment / Service Description *
          </label>
          <input
            id="bill-desc"
            name="description"
            className="form-control"
            placeholder="e.g. General Consultation & Blood Analysis"
            value={formData.description}
            onChange={handleChange}
            disabled={actionLoading}
          />
          {fieldErrors.description && <div className="form-error">{fieldErrors.description}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="bill-amount">
              Base Amount (₹) *
            </label>
            <input
              id="bill-amount"
              type="number"
              step="0.01"
              min="1"
              name="amount"
              className="form-control"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              disabled={actionLoading}
            />
            {fieldErrors.amount && <div className="form-error">{fieldErrors.amount}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bill-tax">
              Tax Amount (₹)
            </label>
            <input
              id="bill-tax"
              type="number"
              step="0.01"
              min="0"
              name="tax"
              className="form-control"
              placeholder="0.00"
              value={formData.tax}
              onChange={handleChange}
              disabled={actionLoading}
            />
            {fieldErrors.tax && <div className="form-error">{fieldErrors.tax}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="bill-status">
              Payment Status
            </label>
            <select
              id="bill-status"
              name="paymentStatus"
              className="form-control"
              value={formData.paymentStatus}
              onChange={handleChange}
              disabled={actionLoading}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Total Payable</label>
            <div
              style={{
                padding: '9px 13px',
                backgroundColor: '#f1f5f9',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                color: 'var(--text-main)',
                fontSize: '15px'
              }}
            >
              ₹{totalAmount}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={actionLoading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={actionLoading}>
            {actionLoading ? 'Saving...' : billToEdit ? 'Update Bill' : 'Issue Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
