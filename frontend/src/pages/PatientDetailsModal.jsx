import React from 'react';
import Modal from '../components/Modal';

export default function PatientDetailsModal({ isOpen, onClose, patient }) {
  if (!patient) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Patient Information File" maxWidth="600px">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 700
          }}
        >
          {patient.name?.charAt(0) || 'P'}
        </div>
        <div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
            {patient.name}
          </h4>
          <span style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>
            Patient ID: {patient.id}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="detail-row">
          <span className="detail-label">Age & Gender:</span>
          <span className="detail-value">{patient.age} years old • {patient.gender}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email Address:</span>
          <span className="detail-value">{patient.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Phone Number:</span>
          <span className="detail-value">{patient.phone}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Residential Address:</span>
          <span className="detail-value">{patient.address}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Registration Date:</span>
          <span className="detail-value">{new Date(patient.createdAt).toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Last Updated:</span>
          <span className="detail-value">{new Date(patient.updatedAt).toLocaleString()}</span>
        </div>
      </div>

      {patient.bills && patient.bills.length > 0 && (
        <div>
          <h5 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Associated Invoices</h5>
          <div className="table-responsive">
            <table className="data-table" style={{ fontSize: '13px' }}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {patient.bills.map((b) => (
                  <tr key={b.id}>
                    <td>{b.description}</td>
                    <td>₹{Number(b.totalAmount).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${b.paymentStatus?.toLowerCase()}`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
