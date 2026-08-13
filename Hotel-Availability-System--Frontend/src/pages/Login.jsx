import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../lib/validations';
import '../styles/Auth.css';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      const result = await login(data.email, data.password);
      if (result?.user?.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-card">
        <div className="auth-form-side">
          <div className="auth-form-container">
            <h1 className="auth-title">Hello Again!</h1>
            <p className="auth-subtitle">Do you have a account? Login here..</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              <div className="auth-input-group">
                <span className="auth-label">E Mail</span>
                <input type="email" className="auth-input" placeholder="" {...register('email')} autoComplete="email" />
                {errors.email && <span className="auth-field-error">{errors.email.message}</span>}
              </div>
              <div className="auth-input-group">
                <span className="auth-label">Password</span>
                <input type="password" className="auth-input" placeholder="" {...register('password')} autoComplete="current-password" />
                {errors.password && <span className="auth-field-error">{errors.password.message}</span>}
              </div>

              <button type="submit" className="auth-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="auth-footer-text">
              Don't you have account?{' '}
              <Link to="/register" className="auth-link">Create an account</Link>
            </p>
          </div>
        </div>
        <div className="auth-image-side">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=557&h=696&fit=crop"
            alt="Luxury hotel"
            className="auth-image"
          />
        </div>
      </div>
    </div>
  );
}
