import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, removeToken, getCurrentUser } from '../services/auth';
import { User } from '../types/auth';

const Header: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        setLoggedIn(true);
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          // If user data fetch fails, token might be invalid
          removeToken();
          setLoggedIn(false);
          setUser(null);
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header style={{ 
      background: 'white', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none',
              color: '#007bff',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            IdeaCheck
          </Link>
        </div>
        
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {loggedIn && user ? (
            <>
              <span style={{ 
                color: '#666', 
                fontSize: '0.9rem',
                marginRight: '0.5rem'
              }}>
                Welcome, {user.full_name || user.email}
              </span>
              <Link 
                to="/dashboard" 
                className="btn btn-outline"
                style={{ fontSize: '0.9rem' }}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ fontSize: '0.9rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-primary"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;