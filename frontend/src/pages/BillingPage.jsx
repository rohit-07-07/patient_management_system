import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Topbar from '../components/Topbar';
import BillFormModal from './BillFormModal';
import BillDetailsModal from './BillDetailsModal';
import PaymentDetailsModal from './PaymentDetailsModal';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  fetchBills,
  fetchBillById,
  deleteBill,
  updateBillStatusLocally
} from '../store/billingSlice';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  clearPaymentState
} from '../store/paymentSlice';

export default function BillingPage() {
  const dispatch = useDispatch();
  const { items, loading, actionLoading, error } = useSelector((state) => state.billing);
  const { loading: paymentLoading, error: paymentError, paymentStatus } = useSelector(
    (state) => state.payment
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [billToEdit, setBillToEdit] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBillForDetails, setSelectedBillForDetails] = useState(null);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState(null);
  const [billToDelete, setBillToDelete] = useState(null);
  const [statusNotification, setStatusNotification] = useState(null);

  useEffect(() => {
    dispatch(fetchBills());
  }, [dispatch]);

  const handleOpenAdd = () => {
    setBillToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (bill) => {
    setBillToEdit(bill);
    setIsFormOpen(true);
  };

  const handleOpenDetails = (bill) => {
    setSelectedBillForDetails(bill);
    setIsDetailsOpen(true);
  };

  const handleOpenPaymentDetails = (bill) => {
    setSelectedBillForPayment(bill);
    setIsPaymentDetailsOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!billToDelete) return;
    await dispatch(deleteBill(billToDelete.id));
    setBillToDelete(null);
  };

  const handlePayBill = async (bill) => {
    setStatusNotification(null);
    dispatch(clearPaymentState());

    const result = await dispatch(createRazorpayOrder(bill.id));
    if (result.error) {
      setStatusNotification({ type: 'danger', message: result.payload || 'Failed to initiate payment' });
      return;
    }

    const orderData = result.payload;

    if (window.Razorpay) {
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'CarePulse Medical Hospital',
        description: orderData.billDescription,
        order_id: orderData.orderId,
        prefill: {
          name: orderData.patientName,
          email: orderData.patientEmail,
          contact: orderData.patientPhone
        },
        theme: {
          color: '#0284c7'
        },
        handler: async (response) => {
          const verifyResult = await dispatch(
            verifyRazorpayPayment({
              billId: bill.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            })
          );

          if (!verifyResult.error) {
            dispatch(updateBillStatusLocally({ billId: bill.id, status: 'Paid' }));
            dispatch(fetchBills());
            setStatusNotification({
              type: 'success',
              message: `Payment successful! Bill ID #${bill.id.slice(0, 8)} marked as Paid.`
            });
          } else {
            setStatusNotification({
              type: 'danger',
              message: verifyResult.payload || 'Payment verification failed'
            });
          }
        },
        modal: {
          ondismiss: () => {
            setStatusNotification({
              type: 'danger',
              message: 'Payment window was closed or cancelled by user.'
            });
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', (resp) => {
        setStatusNotification({
          type: 'danger',
          message: `Payment Failed: ${resp.error.description || 'Transaction error'}`
        });
      });
      rzpInstance.open();
    } else {
      const mockPaymentId = `pay_${Date.now()}`;
      const mockSignature = `demo_sig_${Date.now()}`;
      const verifyResult = await dispatch(
        verifyRazorpayPayment({
          billId: bill.id,
          razorpayOrderId: orderData.orderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: mockSignature
        })
      );

      if (!verifyResult.error) {
        dispatch(updateBillStatusLocally({ billId: bill.id, status: 'Paid' }));
        dispatch(fetchBills());
        setStatusNotification({
          type: 'success',
          message: `Test Checkout simulated! Bill #${bill.id.slice(0, 8)} marked as Paid.`
        });
      }
    }
  };

  return (
    <div>
      <Topbar title="Billing & Invoices" />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h2 className="page-heading">Financial Invoices</h2>
            <p className="page-subheading">Track treatments, billing records, and online Razorpay settlements</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create New Bill
          </button>
        </div>

        {statusNotification && (
          <div className={`alert alert-${statusNotification.type}`}>
            {statusNotification.message}
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}
        {paymentError && <div className="alert alert-danger">{paymentError}</div>}

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bill ID</th>
                    <th>Patient Name</th>
                    <th>Description</th>
                    <th>Base (₹)</th>
                    <th>Tax (₹)</th>
                    <th>Total (₹)</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items && items.length > 0 ? (
                    items.map((bill) => (
                      <tr key={bill.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '12.5px', color: 'var(--text-subtle)' }}>
                          {bill.id.slice(0, 8)}...
                        </td>
                        <td style={{ fontWeight: 600 }}>{bill.patient?.name || 'Unassigned'}</td>
                        <td>{bill.description}</td>
                        <td>₹{Number(bill.amount).toFixed(2)}</td>
                        <td>₹{Number(bill.tax || 0).toFixed(2)}</td>
                        <td style={{ fontWeight: 700 }}>₹{Number(bill.totalAmount).toFixed(2)}</td>
                        <td>
                          <span className={`badge ${bill.paymentStatus?.toLowerCase()}`}>
                            {bill.paymentStatus}
                          </span>
                        </td>
                        <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                            {bill.paymentStatus !== 'Paid' ? (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handlePayBill(bill)}
                                disabled={paymentLoading}
                                title="Process Online Payment via Razorpay"
                              >
                                {paymentLoading ? 'Processing...' : 'Pay Bill'}
                              </button>
                            ) : (
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleOpenPaymentDetails(bill)}
                                title="View Payment Details"
                              >
                                Payment Info
                              </button>
                            )}
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenDetails(bill)}
                              title="View Full Bill Details"
                            >
                              View
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEdit(bill)}
                              title="Edit Bill"
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => setBillToDelete(bill)}
                              title="Delete Bill"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="empty-state">
                        {loading ? 'Loading invoices...' : 'No invoices generated yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <BillFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        billToEdit={billToEdit}
      />

      <BillDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        bill={selectedBillForDetails}
        onPayBill={handlePayBill}
      />

      <PaymentDetailsModal
        isOpen={isPaymentDetailsOpen}
        onClose={() => setIsPaymentDetailsOpen(false)}
        bill={selectedBillForPayment}
      />

      <ConfirmDialog
        isOpen={!!billToDelete}
        onClose={() => setBillToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Invoice"
        message={`Are you sure you want to delete bill #${billToDelete?.id.slice(0, 8)}? This action cannot be reversed.`}
        confirmText="Confirm Delete"
        loading={actionLoading}
      />
    </div>
  );
}
