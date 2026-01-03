import React, { useState } from 'react';
import { User, UserUpdate, ChangePasswordRequest } from '../types/auth';
import { updateUserProfile, changePassword } from '../services/users';
import { handleAuthError } from '../services/auth';
import { getErrorMessage, validatePassword } from '../utils/validation';

interface ProfileSettingsProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Profile form state
  const [profileForm, setProfileForm] = useState<UserUpdate>({
    email: user.email,
    full_name: user.full_name || ''
  });
  const [profileErrors, setProfileErrors] = useState<{[key: string]: string}>({});

  // Password form state
  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    current_password: '',
    new_password: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<{[key: string]: string}>({});

  // Validate profile form
  const validateProfileForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    const emailError = getErrorMessage('Email', profileForm.email || '');
    if (emailError) errors.email = emailError;
    
    const nameError = getErrorMessage('Full Name', profileForm.full_name || '');
    if (nameError) errors.full_name = nameError;
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!passwordForm.current_password) {
      errors.current_password = 'Current password is required';
    }
    
    const passwordValidation = validatePassword(passwordForm.new_password);
    if (!passwordValidation.isValid) {
      errors.new_password = passwordValidation.message;
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!validateProfileForm()) return;
    
    setLoading(true);
    try {
      const updatedUser = await updateUserProfile(profileForm);
      onUserUpdate(updatedUser);
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!validatePasswordForm()) return;
    
    setLoading(true);
    try {
      await changePassword(passwordForm);
      setMessage('Password changed successfully!');
      setPasswordForm({ current_password: '', new_password: '' });
    } catch (err: any) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const updateProfileField = (field: keyof UserUpdate, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
    if (profileErrors[field]) {
      setProfileErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updatePasswordField = (field: keyof ChangePasswordRequest, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3 style={{ marginBottom: '2rem' }}>Profile Settings</h3>
      
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        marginBottom: '2rem',
        borderBottom: '1px solid #eee'
      }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'profile' ? '2px solid #007bff' : '2px solid transparent',
            color: activeTab === 'profile' ? '#007bff' : '#666',
            fontWeight: activeTab === 'profile' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('password')}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'password' ? '2px solid #007bff' : '2px solid transparent',
            color: activeTab === 'password' ? '#007bff' : '#666',
            fontWeight: activeTab === 'password' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          Change Password
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24'
        }}>
          {error}
        </div>
      )}

      {message && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724'
        }}>
          {message}
        </div>
      )}

      {/* Profile Information Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileUpdate}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Email Address
            </label>
            <input
              type="email"
              value={profileForm.email || ''}
              onChange={(e) => updateProfileField('email', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: profileErrors.email ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              disabled={loading}
            />
            {profileErrors.email && (
              <small style={{ color: '#dc3545', display: 'block', marginTop: '0.25rem' }}>
                {profileErrors.email}
              </small>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Full Name
            </label>
            <input
              type="text"
              value={profileForm.full_name || ''}
              onChange={(e) => updateProfileField('full_name', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: profileErrors.full_name ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              disabled={loading}
            />
            {profileErrors.full_name && (
              <small style={{ color: '#dc3545', display: 'block', marginTop: '0.25rem' }}>
                {profileErrors.full_name}
              </small>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordChange}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.current_password}
              onChange={(e) => updatePasswordField('current_password', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: passwordErrors.current_password ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              disabled={loading}
            />
            {passwordErrors.current_password && (
              <small style={{ color: '#dc3545', display: 'block', marginTop: '0.25rem' }}>
                {passwordErrors.current_password}
              </small>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.new_password}
              onChange={(e) => updatePasswordField('new_password', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: passwordErrors.new_password ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              disabled={loading}
            />
            {passwordErrors.new_password && (
              <small style={{ color: '#dc3545', display: 'block', marginTop: '0.25rem' }}>
                {passwordErrors.new_password}
              </small>
            )}
            <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
              Password must be at least 8 characters with letters and numbers
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileSettings;