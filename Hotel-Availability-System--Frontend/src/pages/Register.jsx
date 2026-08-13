import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../lib/validations';
import '../styles/Auth.css';
import './Register.css';

export default function Register() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'traveler' },
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      const { confirmPassword, ...payload } = data;
      await authRegister(payload);
      navigate(payload.role === 'owner' ? '/hotel-owner-login?registered=1' : '/login?registered=1');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page register-page">
      <div className="auth-card register-card-layout">
        <div className="auth-image-side">
          <img
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=557&h=696&fit=crop"
            alt="Travel destination"
            className="auth-image"
          />
        </div>
        <div className="auth-form-side">
          <div className="auth-form-container">
            <h1 className="auth-title">Hello Again!</h1>
            <p className="auth-subtitle">Do you haven't a account? create a account here..</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              <div className="auth-input-group">
                <span className="auth-label">Full Name</span>
                <input type="text" className="auth-input" placeholder="" {...register('name')} autoComplete="name" />
                {errors.name && <span className="auth-field-error">{errors.name.message}</span>}
              </div>
              <div className="auth-input-group">
                <span className="auth-label">E Mail</span>
                <input type="email" className="auth-input" placeholder="" {...register('email')} autoComplete="email" />
                {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
              </div>
              <div className="auth-input-group">
                <span className="auth-label">Password</span>
                <input type="password" className="auth-input" placeholder="" {...register('password')} autoComplete="new-password" />
                {errors.password && <span className="auth-field-error">{errors.password.message}</span>}
              </div>
              <div className="auth-input-group">
                <span className="auth-label">Confirm Password</span>
                <input type="password" className="auth-input" placeholder="" {...register('confirmPassword')} autoComplete="new-password" />
                {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword.message}</span>}
              </div>
              <div className="auth-input-group">
                <span className="auth-label">Phone Number</span>
                <input type="tel" className="auth-input" placeholder="" {...register('phone')} autoComplete="tel" />
              </div>
              <div className="auth-input-group">
                <span className="auth-label">I am a</span>
                <select className="auth-input auth-select" {...register('role')}>
                  <option value="traveler">Traveler</option>
                  <option value="owner">Hotel Owner</option>
                </select>
              </div>

              <button type="submit" className="auth-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create an Account'}
              </button>
            </form>

            <p className="auth-footer-text">
              Do you have account?{' '}
              <Link to="/login" className="auth-link">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
