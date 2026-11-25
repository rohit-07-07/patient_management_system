import React from 'react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  loading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="420px">
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '22px' }}>
        {message}
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
