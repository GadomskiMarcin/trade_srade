import React, { useState } from 'react';
import { User } from '../types/api';
import '../styles/dashboard.css';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Furniture {
  id: string;
  title: string;
  url: string;
  tags: string[];
  seller: string;
  location: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Mock data - Furniture categories
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

  const mockFurniture: Furniture[] = [
    {
      id: '1',
      title: 'Modern Leather Sofa',
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
      tags: ['Sofa', 'Modern'],
      seller: 'Meblowa Galeria',
      location: 'Warszawa, Mazowieckie'
    },
    {
      id: '2',
      title: 'Vintage Wooden Chair',
      url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop',
      tags: ['Chair', 'Vintage'],
      seller: 'Antykwariat Stary',
      location: 'Kraków, Małopolskie'
    },
    {
      id: '3',
      title: 'Glass Coffee Table',
      url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=300&fit=crop',
      tags: ['Table', 'Modern'],
      seller: 'Nowoczesne Meblarstwo',
      location: 'Wrocław, Dolnośląskie'
    },
    {
      id: '4',
      title: 'Queen Size Bed Frame',
      url: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop',
      tags: ['Bed', 'Modern'],
      seller: 'Sypialnia Plus',
      location: 'Poznań, Wielkopolskie'
    },
    {
      id: '5',
      title: 'Classic Wardrobe',
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      tags: ['Wardrobe', 'Classic'],
      seller: 'Szafa i Komoda',
      location: 'Gdańsk, Pomorskie'
    },
    {
      id: '6',
      title: 'Office Desk',
      url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
      tags: ['Desk', 'Office'],
      seller: 'Biuro Mebli',
      location: 'Łódź, Łódzkie'
    },
    {
      id: '7',
      title: 'Kitchen Cabinet Set',
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      tags: ['Cabinet', 'Kitchen'],
      seller: 'Kuchnia i Jadalnia',
      location: 'Katowice, Śląskie'
    },
    {
      id: '8',
      title: 'Modern Pendant Light',
      url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
      tags: ['Lighting', 'Modern'],
      seller: 'Oświetlenie Nowoczesne',
      location: 'Szczecin, Zachodniopomorskie'
    },
    {
      id: '9',
      title: 'Dining Room Table',
      url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400&h=300&fit=crop',
      tags: ['Table', 'Dining'],
      seller: 'Jadalnia Premium',
      location: 'Lublin, Lubelskie'
    },
    {
      id: '10',
      title: 'Accent Armchair',
      url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop',
      tags: ['Chair', 'Accent'],
      seller: 'Fotel i Kanapa',
      location: 'Białystok, Podlaskie'
    },
    {
      id: '11',
      title: 'Bookshelf Unit',
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      tags: ['Cabinet', 'Storage'],
      seller: 'Regały i Szafki',
      location: 'Kielce, Świętokrzyskie'
    },
    {
      id: '12',
      title: 'Bedside Table',
      url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=300&fit=crop',
      tags: ['Table', 'Bedroom'],
      seller: 'Sypialnia Komplet',
      location: 'Rzeszów, Podkarpackie'
    },
  ];

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(tag => tag !== tagName)
        : [...prev, tagName]
    );
  };

  const filteredFurniture = selectedTags.length > 0
    ? mockFurniture.filter(furniture => 
        furniture.tags.some(tag => selectedTags.includes(tag))
      )
    : mockFurniture;

  return (
    <div className="dashboard">
      {/* Navbar */}
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
              <span className="user-name">{user.name}</span>
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Section */}
      {isSearchOpen && (
        <div className="search-section">
          <div className="search-container">
            <h3>Filter by Category</h3>
            <div className="tags-grid">
              {availableTags.map(tag => (
                <button
                  key={tag.id}
                  className={`tag-btn ${selectedTags.includes(tag.name) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag.name)}
                  style={{ '--tag-color': tag.color } as React.CSSProperties}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button 
                className="clear-filters"
                onClick={() => setSelectedTags([])}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Furniture Grid */}
      <main className="pictures-container">
        <div className="pictures-header">
          <h2>
            {selectedTags.length > 0 
              ? `Showing ${filteredFurniture.length} items in selected categories`
              : 'All Furniture'
            }
          </h2>
        </div>
        
        <div className="pictures-grid">
          {filteredFurniture.map(furniture => (
            <div key={furniture.id} className="picture-card">
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
                  {furniture.tags.map(tag => (
                    <span key={tag} className="picture-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 