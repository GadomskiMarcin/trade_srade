import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { LoginProps, LoginFormData, TemporaryUserFormData } from '../types/api';
import '../styles/auth.css';

const Login: React.FC<LoginProps> = ({ onLogin, onTemporaryUser }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [tempUserData, setTempUserData] = useState<TemporaryUserFormData>({
    name: ''
  });
  const [showTemporaryForm, setShowTemporaryForm] = useState(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTempUserChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTempUserData({
      ...tempUserData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    try {
      await onLogin.mutateAsync(formData);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Unable to sign in. Please check your credentials and try again.');
    }
  };

  const handleTemporarySubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!tempUserData.name.trim()) {
      setError('Please enter your name to continue as a guest.');
      return;
    }

    try {
      await onTemporaryUser.mutateAsync(tempUserData);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Unable to start guest session. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sign In</h1>
          <p>Access your account or try our app as a guest.</p>
        </div>

        {error && <div className="error-message" role="alert">{error}</div>}

        {!showTemporaryForm ? (
          <>
            <form onSubmit={handleSubmit} aria-label="Sign in form">
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
                  disabled={onLogin.isPending}
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
                  autoComplete="current-password"
                  aria-required="true"
                  aria-label="Password"
                  disabled={onLogin.isPending}
                />
                <small className="helper-text">Password is case-sensitive.</small>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={onLogin.isPending}
                aria-busy={onLogin.isPending}
              >
                {onLogin.isPending ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="guest-section">
              <p className="guest-description">
                Want to explore without creating an account?
              </p>
              <button 
                type="button"
                className="btn btn-secondary guest-btn"
                onClick={() => setShowTemporaryForm(true)}
                disabled={onLogin.isPending || onTemporaryUser.isPending}
                aria-label="Continue as guest"
              >
                Continue as Guest
              </button>
            </div>

            <div className="auth-footer">
              <p>
                Don&apos;t have an account?{' '}
                <Link to="/signup">Create one</Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleTemporarySubmit} aria-label="Guest access form">
              <div className="form-group">
                <label htmlFor="tempName">Your Name</label>
                <input
                  type="text"
                  id="tempName"
                  name="name"
                  value={tempUserData.name}
                  onChange={handleTempUserChange}
                  required
                  aria-required="true"
                  aria-label="Your name"
                  disabled={onTemporaryUser.isPending}
                  placeholder="Enter your name to continue as guest"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={onTemporaryUser.isPending}
                aria-busy={onTemporaryUser.isPending}
              >
                {onTemporaryUser.isPending ? 'Starting guest session…' : 'Continue as Guest'}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button 
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowTemporaryForm(false)}
              disabled={onLogin.isPending || onTemporaryUser.isPending}
              aria-label="Back to sign in"
            >
              Back to Sign In
            </button>

            <div className="auth-footer">
              <p>
                Don&apos;t have an account?{' '}
                <Link to="/signup">Create one</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login; 