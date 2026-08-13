import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { ownerRegisterSchema } from '../lib/validations';
import './HotelOwnerRegister.css';

export default function HotelOwnerRegister() {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(ownerRegisterSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      await authRegister({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'owner',
      });
      navigate('/hotel-owner-login?registered=1');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  return (
    <div className="hor-page">
      <div className="hor-bg">
        <div className="hor-center">
          <div className="hor-content">
            <h1 className="hor-title">Register as Hotel Owner</h1>
            <p className="hor-subtitle">Join our platform and reach thousands of travelers</p>
            <p className="hor-login-text">
              Already registered? <Link to="/hotel-owner-login" className="hor-login-link">Login here</Link>
            </p>

            <div className="hor-card">
              <div className="hor-card-header">
                <div className="hor-card-title">Create Your Account</div>
                <div className="hor-card-desc">Enter your details to get started. You can add your hotel from the dashboard after registration.</div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="hor-form-body">
                <div className="hor-field hor-field-full">
                  <label className="hor-label">Full Name *</label>
                  <input className="hor-input" placeholder="John Doe" {...register('name')} />
                  {errors.name && <span className="hor-error">{errors.name.message}</span>}
                </div>
                <div className="hor-field hor-field-full">
                  <label className="hor-label">Email *</label>
                  <input className="hor-input" placeholder="owner@hotel.com" {...register('email')} />
                  {errors.email && <span className="hor-error">{errors.email.message}</span>}
                </div>
                <div className="hor-field hor-field-full">
                  <label className="hor-label">Mobile Number *</label>
                  <input type="tel" className="hor-input" placeholder="+94 77 123 4567" {...register('phone')} />
                  {errors.phone && <span className="hor-error">{errors.phone.message}</span>}
                </div>
                <div className="hor-field hor-field-full">
                  <label className="hor-label">Password *</label>
                  <input type="password" className="hor-input" placeholder="Enter a strong password" {...register('password')} />
                  <span className="hor-hint">Min 8 characters with uppercase, lowercase, number &amp; special character</span>
                  {errors.password && <span className="hor-error">{errors.password.message}</span>}
                </div>
                <div className="hor-field hor-field-full">
                  <label className="hor-label">Confirm Password *</label>
                  <input type="password" className="hor-input" placeholder="Re-enter your password" {...register('confirmPassword')} />
                  {errors.confirmPassword && <span className="hor-error">{errors.confirmPassword.message}</span>}
                </div>

                {error && <div className="hor-error">{error}</div>}
                <div className="hor-actions">
                  <button type="submit" className="hor-btn hor-btn-complete hor-btn-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}