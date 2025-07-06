import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { SignupProps, SignupFormData } from '../types/api';
import '../styles/auth.css';

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const { confirmPassword: _confirmPassword, ...signupData } = formData;
      await onSignup.mutateAsync(signupData);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Unable to create account. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up to get started. It’s quick and easy!</p>
        </div>

        {error && <div className="error-message" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} aria-label="Sign up form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-required="true"
              aria-label="Full name"
              disabled={onSignup.isPending}
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              aria-required="true"
              aria-label="Email address"
              disabled={onSignup.isPending}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              aria-required="true"
              aria-label="Password"
              disabled={onSignup.isPending}
              placeholder="Create a password"
            />
            <small className="helper-text">Must be at least 6 characters.</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              aria-required="true"
              aria-label="Confirm password"
              disabled={onSignup.isPending}
              placeholder="Repeat your password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={onSignup.isPending}
            aria-busy={onSignup.isPending}
          >
            {onSignup.isPending ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
          <p>
            <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup; 