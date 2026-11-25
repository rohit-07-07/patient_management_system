import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { fetchDashboardSummary } from '../store/dashboardSlice';
import { logout } from '../store/authSlice';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalPatients, totalBills, totalPaidAmount, totalPendingAmount, recentPatients, loading, error } =
    useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div>
      <Topbar title="Hospital Overview" />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h2 className="page-heading">Executive Dashboard</h2>
            <p className="page-subheading">Live operational metrics and clinical statistics</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/patients" className="btn btn-secondary">
              Manage Patients
            </Link>
            <Link to="/billing" className="btn btn-primary">
              Billing & Invoices
            </Link>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Patients</span>
              <span className="stat-value">{loading ? '...' : totalPatients}</span>
            </div>
            <div className="stat-icon blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Invoices Issued</span>
              <span className="stat-value">{loading ? '...' : totalBills}</span>
            </div>
            <div className="stat-icon indigo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Settled Revenue</span>
              <span className="stat-value">₹{loading ? '...' : totalPaidAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="stat-icon green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Pending Balance</span>
              <span className="stat-value">₹{loading ? '...' : totalPendingAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="stat-icon amber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recently Admitted Patients</h3>
            <Link to="/patients" className="btn btn-secondary btn-sm">
              View All Patients
            </Link>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age / Gender</th>
                  <th>Contact Phone</th>
                  <th>Email Address</th>
                  <th>Admission Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients && recentPatients.length > 0 ? (
                  recentPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td style={{ fontWeight: 600 }}>{patient.name}</td>
                      <td>
                        {patient.age} yrs • {patient.gender}
                      </td>
                      <td>{patient.phone}</td>
                      <td style={{ color: 'var(--text-subtle)' }}>{patient.email}</td>
                      <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      {loading ? 'Retrieving patient records...' : 'No patient records found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
