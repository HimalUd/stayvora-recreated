import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../lib/validations';
import './HotelOwnerLogin.css';

export default function HotelOwnerLogin() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      const res = await login(data.email, data.password);
      if (res?.user?.role !== 'owner') {
        setError('Access denied. Owner account required.');
        await logout();
      } else {
        navigate('/hotel-owner-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="hol-page">
      <div className="hol-container">
        <div className="hol-card">
          <div className="hol-header">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="18" y="5.33" width="32" height="53.33" rx="2" stroke="#2563EB" strokeWidth="5.33"/>
              <rect x="5.33" y="32" width="10.67" height="26.67" rx="1.33" stroke="#2563EB" strokeWidth="5.33"/>
              <rect x="48" y="24" width="10.67" height="34.67" rx="1.33" stroke="#2563EB" strokeWidth="5.33"/>
            </svg>
          </div>
          <h1 className="hol-title">Hotel Owner Login</h1>
          <p className="hol-subtitle">Access your hotel dashboard</p>

          <form className="hol-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="hol-field">
              <label className="hol-label">Hotel Email</label>
              <div className="hol-input-wrap">
                <svg className="hol-input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1.33" y="2.67" width="13.33" height="10.67" rx="1.33" stroke="#99A1AF" strokeWidth="1.33"/>
                  <rect x="1.33" y="4.67" width="13.33" height="4" stroke="#99A1AF" strokeWidth="1.33"/>
                </svg>
                <input type="email" className="hol-input" placeholder="your-hotel@example.com" {...register('email')} required />
              </div>
              {errors.email && <p className="hol-error">{errors.email.message}</p>}
            </div>

            <div className="hol-field">
              <label className="hol-label">Password</label>
              <div className="hol-input-wrap">
                <svg className="hol-input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2.67" y="7.33" width="10.67" height="7.33" rx="1.33" stroke="#99A1AF" strokeWidth="1.33"/>
                  <rect x="5.33" y="4" width="5.33" height="4" rx="2.67" stroke="#99A1AF" strokeWidth="1.33"/>
                </svg>
                <input type="password" className="hol-input" placeholder="Enter your password" {...register('password')} required />
              </div>
              {errors.password && <p className="hol-error">{errors.password.message}</p>}
            </div>

            {error && <p className="hol-error">{error}</p>}

            <button type="submit" className="hol-submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Login to Dashboard'}</button>
          </form>

          <p className="hol-register-text">
            Don't have an account? <Link to="/hotel-owner-register" className="hol-register-link">Register your hotel</Link>
          </p>

          <Link to="/" className="hol-back">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
