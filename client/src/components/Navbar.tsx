import React from 'react';
import { Link } from '@tanstack/react-router';
import { NavbarProps } from '../types/api';
import '../styles/navbar.css';

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            Auth App
          </Link>
          <ul className="navbar-nav">
            {user ? (
              <>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button 
                    onClick={onLogout}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#666', 
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 