import React from 'react';
import '../styles/loading.css';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="loading-spinner">
            <div className={`spinner ${size}`}></div>
            <h1 className="loading-message">{message}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 