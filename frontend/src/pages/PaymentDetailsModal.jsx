import React from 'react';
import Modal from '../components/Modal';

export default function PaymentDetailsModal({ isOpen, onClose, bill }) {
  if (!bill) return null;

  const payment = bill.payments && bill.payments.length > 0 ? bill.payments[bill.payments.length - 1] : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Razorpay Settlement Details" maxWidth="560px">
      <div style={{ marginBottom: '20px' }}>
        <div className="detail-row">
          <span className="detail-label">Associated Bill:</span>
          <span className="detail-value">{bill.description}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Patient:</span>
          <span className="detail-value">{bill.patient?.name || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Settlement Amount:</span>
          <span className="detail-value" style={{ fontWeight: 700 }}>
            ₹{Number(bill.totalAmount).toFixed(2)}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Gateway Status:</span>
          <span className="detail-value">
            <span className={`badge ${bill.paymentStatus?.toLowerCase()}`}>
              {bill.paymentStatus}
            </span>
          </span>
        </div>

        {payment ? (
          <>
            <div className="detail-row">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value" style={{ fontFamily: 'monospace' }}>
                {payment.razorpayOrderId}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment ID:</span>
              <span className="detail-value" style={{ fontFamily: 'monospace' }}>
                {payment.razorpayPaymentId || 'Pending Checkout'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">HMAC Signature:</span>
              <span
                className="detail-value"
                style={{ fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all' }}
              >
                {payment.razorpaySignature || 'Awaiting Verification'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Transaction Time:</span>
              <span className="detail-value">
                {new Date(payment.createdAt).toLocaleString()}
              </span>
            </div>
          </>
        ) : (
          <div style={{ padding: '16px 0', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
            No payment transaction has been initiated yet for this invoice.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
