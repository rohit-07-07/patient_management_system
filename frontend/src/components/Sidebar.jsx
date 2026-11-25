import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">CP</div>
        <div>
          <div className="brand-title">CarePulse</div>
          <div className="brand-subtitle">Clinical Management</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
          Dashboard
        </NavLink>

        <NavLink
          to="/patients"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Patients
        </NavLink>

        <NavLink
          to="/billing"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          Billing & Payments
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <span className="user-name">{user?.name || 'Dr. Rajesh Sharma'}</span>
          <span className="user-role">{user?.email || 'admin@hospital.com'}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Sign out">
          Logout
        </button>
      </div>
    </aside>
  );
}
