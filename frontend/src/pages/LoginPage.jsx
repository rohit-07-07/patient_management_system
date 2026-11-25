import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearAuthError } from '../store/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email format';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser(formData));
  };

  const handleFillDemo = () => {
    setFormData({
      email: 'admin@hospital.com',
      password: 'admin123'
    });
    setFieldErrors({});
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon" style={{ width: '48px', height: '48px', fontSize: '22px', marginBottom: '12px' }}>
            CP
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-main)' }}>
            CarePulse Medical
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-subtle)', marginTop: '4px' }}>
            Hospital & Patient Management System
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="e.g. admin@hospital.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
            />
            {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
            />
            {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '10.5px', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
          >
            Auto-fill Default Admin Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
