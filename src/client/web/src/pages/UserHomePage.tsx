import React, { useEffect, useState } from 'react';
import { getCurrentUser, logout, removeToken, handleAuthError } from '../services/auth';
import { User } from '../types/auth';
import ProfileSettings from '../components/ProfileSettings';
import ProductManager from '../components/ProductManager';

const UserHomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err: any) {
        setError(handleAuthError(err));
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          removeToken();
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (!confirmLogout) return;
    
    try {
      await logout();
      removeToken();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout even if API call fails
      removeToken();
      window.location.href = '/login';
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: '60px',
            height: '60px',
            border: '6px solid #f3f3f3',
            borderTop: '6px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '1rem', color: '#666', fontSize: '1.1rem' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
          <h2 style={{ color: '#dc3545' }}>Authentication Error</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>{error}</p>
          <a 
            href="/login" 
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="user-home" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1.5rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#007bff' }}>IdeaCheck Dashboard</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              Welcome back, {user?.full_name || user?.email}!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              {user?.email}
            </span>
            <button 
              onClick={() => setShowProfileModal(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                color: '#007bff',
                border: '1px solid #007bff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#007bff';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#007bff';
              }}
            >
              👤 Profile
            </button>
            <button 
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Product Management Section */}
        <ProductManager />

        {/* Profile Settings Modal */}
        {showProfileModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setShowProfileModal(false)}>
            <div 
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '0',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                borderBottom: '1px solid #eee'
              }}>
                <h2 style={{ margin: 0, color: '#007bff' }}>Profile Settings</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#666',
                    padding: '0',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {user && (
                  <ProfileSettings 
                    user={user} 
                    onUserUpdate={(updatedUser) => {
                      handleUserUpdate(updatedUser);
                      setShowProfileModal(false);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Footer */}
        <footer style={{
          marginTop: '2rem',
          padding: '1rem',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          <p>Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
        </footer>
      </div>
    </div>
  );
};

export default UserHomePage;