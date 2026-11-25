import React from 'react';
import { useSelector } from 'react-redux';

export default function Topbar({ title }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-right">
        <span style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>
          Session Active: <strong>{user?.name || 'Dr. Rajesh Sharma'}</strong>
        </span>
      </div>
    </header>
  );
}
