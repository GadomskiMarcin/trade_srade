import React from 'react';
import { ProfileProps } from '../types/api';
import '../styles/profile.css';

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Profile</h1>
          <p>Your account information</p>
        </div>

        <div className="profile-info">
          <div className="profile-item">
            <span className="profile-label">Name:</span>
            <span className="profile-value">{user.name}</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{user.email}</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">User ID:</span>
            <span className="profile-value">{user.id}</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Member Since:</span>
            <span className="profile-value">{formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 