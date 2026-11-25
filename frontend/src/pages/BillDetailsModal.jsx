import React from 'react';
import Modal from '../components/Modal';

export default function BillDetailsModal({ isOpen, onClose, bill, onPayBill }) {
  if (!bill) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invoice Summary" maxWidth="580px">
      <div style={{ padding: '4px 0 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Invoice Number
            </span>
            <h4 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', marginTop: '2px' }}>
              {bill.id}
            </h4>
          </div>
          <span className={`badge ${bill.paymentStatus?.toLowerCase()}`}>
            {bill.paymentStatus}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '18px' }}>
        <div className="detail-row">
          <span className="detail-label">Patient Name:</span>
          <span className="detail-value">{bill.patient?.name || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Contact:</span>
          <span className="detail-value">{bill.patient?.phone || 'N/A'} • {bill.patient?.email || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Service / Treatment:</span>
          <span className="detail-value">{bill.description}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Base Fee:</span>
          <span className="detail-value">₹{Number(bill.amount).toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Tax / GST:</span>
          <span className="detail-value">₹{Number(bill.tax || 0).toFixed(2)}</span>
        </div>
        <div className="detail-row" style={{ fontWeight: 700, fontSize: '15px', color: 'var(--primary)' }}>
          <span className="detail-label" style={{ color: 'var(--primary)' }}>Total Bill Amount:</span>
          <span className="detail-value">₹{Number(bill.totalAmount).toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Issued On:</span>
          <span className="detail-value">{new Date(bill.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {bill.payments && bill.payments.length > 0 && (
        <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
          <h5 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Payment Transaction Record</h5>
          {bill.payments.map((p) => (
            <div key={p.id} style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              <div><strong>Status:</strong> {p.paymentStatus}</div>
              <div><strong>Razorpay Order ID:</strong> {p.razorpayOrderId}</div>
              {p.razorpayPaymentId && <div><strong>Payment ID:</strong> {p.razorpayPaymentId}</div>}
              <div><strong>Recorded At:</strong> {new Date(p.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        {bill.paymentStatus !== 'Paid' && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onPayBill(bill);
            }}
          >
            Proceed to Payment
          </button>
        )}
      </div>
    </Modal>
  );
}
