import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { User } from '../types/api';
import { useFurniture } from '../hooks/useApi';
import '../styles/dashboard.css';

interface DashboardProps {
  user?: User;
  onLogout: () => void;
  isGuest: boolean;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface OfferType {
  id: string;
  name: string;
  color: string;
  description: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, isGuest }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedOfferType, setSelectedOfferType] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch furniture data with tag filtering
  const { data: furnitureData, isLoading, error, isFetching } = useFurniture(
    selectedTags.length > 0 ? selectedTags : undefined,
    selectedOfferType || undefined
  );

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(tag => tag !== tagName)
        : [...prev, tagName]
    );
  };

  const handleOfferTypeSelect = (offerType: string) => {
    setSelectedOfferType(prev => prev === offerType ? '' : offerType);
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedOfferType('');
  };

  const furniture = furnitureData?.furniture || [];

  // Show error state only if there's an error and no data
  if (error && !furnitureData) {
    return (
      <div className="dashboard">
        <DashboardNavbar user={user} onLogout={onLogout} isGuest={isGuest} />
        <div className="error-message">
          Error loading furniture. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <DashboardNavbar user={user} onLogout={onLogout} isGuest={isGuest} />
      <OfferTypeFilter 
        selectedOfferType={selectedOfferType}
        onOfferTypeSelect={handleOfferTypeSelect}
      />
      <TagFilter 
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        onClearFilters={clearAllFilters}
      />
      <FurnitureGrid 
        furniture={furniture}
        isLoading={isLoading}
        isFetching={isFetching}
        selectedTags={selectedTags}
      />
    </div>
  );
};

// Navbar Component
const DashboardNavbar: React.FC<{
  user?: User;
  onLogout: () => void;
  isGuest: boolean;
}> = ({ user, onLogout, isGuest }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <h1>FurnitureHub</h1>
        </div>
        
        <div className="navbar-actions">
          <button 
            className="search-toggle"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          
          <div className="user-menu">
            {user ? (
              <>
                <span className="user-name">{user.name}</span>
                <button onClick={onLogout} className="logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <span className="guest-label">Guest Mode</span>
                <Link to="/login" className="auth-btn login-btn">
                  Login
                </Link>
                <Link to="/signup" className="auth-btn signup-btn">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Offer Type Filter Component
const OfferTypeFilter: React.FC<{
  selectedOfferType: string;
  onOfferTypeSelect: (offerType: string) => void;
}> = ({ selectedOfferType, onOfferTypeSelect }) => {
  const offerTypes: OfferType[] = [
    { 
      id: '1', 
      name: 'Giveaway', 
      color: '#48bb78',
      description: 'Free items to take'
    },
    { 
      id: '2', 
      name: 'Sell', 
      color: '#667eea',
      description: 'Items for purchase'
    },
    { 
      id: '3', 
      name: 'Free', 
      color: '#ed8936',
      description: 'Free items available'
    },
  ];

  return (
    <div className="offer-type-section">
      <div className="offer-type-container">
        <h3>Filter by Offer Type</h3>
        <div className="offer-types-grid">
          {offerTypes.map(offerType => (
            <button
              key={offerType.id}
              className={`offer-type-btn ${selectedOfferType === offerType.name ? 'selected' : ''}`}
              onClick={() => onOfferTypeSelect(offerType.name)}
              style={{ '--offer-color': offerType.color } as React.CSSProperties}
            >
              <div className="offer-type-content">
                <span className="offer-type-name">{offerType.name}</span>
                <span className="offer-type-description">{offerType.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Tag Filter Component
const TagFilter: React.FC<{
  selectedTags: string[];
  onTagToggle: (tagName: string) => void;
  onClearFilters: () => void;
}> = ({ selectedTags, onTagToggle, onClearFilters }) => {
  const availableTags: Tag[] = [
    { id: '1', name: 'Sofa', color: '#4CAF50' },
    { id: '2', name: 'Chair', color: '#2196F3' },
    { id: '3', name: 'Table', color: '#9C27B0' },
    { id: '4', name: 'Bed', color: '#FF9800' },
    { id: '5', name: 'Wardrobe', color: '#607D8B' },
    { id: '6', name: 'Desk', color: '#795548' },
    { id: '7', name: 'Cabinet', color: '#E91E63' },
    { id: '8', name: 'Lighting', color: '#424242' },
  ];

  return (
    <div className="tag-filter-section">
      <div className="tag-filter-container">
        <h3>Filter by Category</h3>
        <div className="tags-grid">
          {availableTags.map(tag => (
            <button
              key={tag.id}
              className={`tag-btn ${selectedTags.includes(tag.name) ? 'selected' : ''}`}
              onClick={() => onTagToggle(tag.name)}
              style={{ '--tag-color': tag.color } as React.CSSProperties}
            >
              {tag.name}
            </button>
          ))}
        </div>
        {(selectedTags.length > 0) && (
          <button 
            className="clear-filters"
            onClick={onClearFilters}
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};

// Furniture Grid Component
const FurnitureGrid: React.FC<{
  furniture: any[];
  isLoading: boolean;
  isFetching: boolean;
  selectedTags: string[];
}> = ({ furniture, isLoading, isFetching, selectedTags }) => {
  return (
    <main className="pictures-container">
      <div className="pictures-header">
        <h2>
          {selectedTags.length > 0 
            ? `Showing ${furniture.length} items in selected categories`
            : 'All Furniture'
          }
        </h2>
        {/* Subtle loading indicator */}
        {isFetching && (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <span>Updating...</span>
          </div>
        )}
      </div>
      
      <div className="pictures-grid">
        {furniture.map(furnitureItem => (
          <FurnitureCard key={furnitureItem.id} furniture={furnitureItem} />
        ))}
      </div>
      
      {/* Show loading message only on initial load when no data exists */}
      {isLoading && furniture.length === 0 && (
        <div className="loading-message">
          Loading furniture...
        </div>
      )}
    </main>
  );
};

// Furniture Card Component
const FurnitureCard: React.FC<{ furniture: any }> = ({ furniture }) => {
  return (
    <div className="picture-card">
      <div className="picture-image">
        <img src={furniture.url} alt={furniture.title} loading="lazy" />
        <div className="picture-overlay">
          <button className="like-btn" aria-label="Save item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>Save</span>
          </button>
        </div>
      </div>
      <div className="picture-info">
        <h3>{furniture.title}</h3>
        <p className="picture-author">by {furniture.seller}</p>
        <p className="picture-location">{furniture.location}</p>
        <div className="picture-tags">
          {furniture.tags.map((tag: string) => (
            <span key={tag} className="picture-tag">
              {tag}
            </span>
          ))}
        </div>
        {furniture.offerType && (
          <div className="offer-type-badge">
            {furniture.offerType}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 