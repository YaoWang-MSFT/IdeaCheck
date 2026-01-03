import React, { useState, useEffect } from 'react';
import { login, signup, setToken, isAuthenticated, handleAuthError } from '../services/auth';
import { LoginRequest, SignupRequest } from '../types/auth';
import { getErrorMessage, validatePassword } from '../utils/validation';

const LoginPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginForm, setLoginForm] = useState<LoginRequest>({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState<SignupRequest>({
    email: '',
    full_name: '',
    password: ''
  });

  // Form validation errors
  const [loginErrors, setLoginErrors] = useState<{[key: string]: string}>({});
  const [signupErrors, setSignupErrors] = useState<{[key: string]: string}>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      window.location.href = '/dashboard';
    }
  }, []);

  // Clear messages when switching modes
  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setSuccessMessage('');
    setLoginErrors({});
    setSignupErrors({});
  };

  // Validation functions
  const validateLoginForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    const emailError = getErrorMessage('Email', loginForm.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = getErrorMessage('Password', loginForm.password);
    if (passwordError) errors.password = passwordError;
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    const emailError = getErrorMessage('Email', signupForm.email);
    if (emailError) errors.email = emailError;
    
    const nameError = getErrorMessage('Full Name', signupForm.full_name);
    if (nameError) errors.full_name = nameError;
    
    const passwordValidation = validatePassword(signupForm.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }
    
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateLoginForm()) return;
    
    setLoading(true);
    try {
      const response = await login(loginForm);
      setToken(response.access_token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!validateSignupForm()) return;
    
    setLoading(true);
    try {
      await signup(signupForm);
      setSuccessMessage('Registration successful! Please log in with your new account.');
      setSignupForm({ email: '', full_name: '', password: '' });
      // Switch to login mode after successful registration
      setTimeout(() => {
        setIsLoginMode(true);
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Update form fields
  const updateLoginField = (field: keyof LoginRequest, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (loginErrors[field]) {
      setLoginErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateSignupField = (field: keyof SignupRequest, value: string) => {
    setSignupForm(prev => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (signupErrors[field]) {
      setSignupErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="login-page" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem 0' 
    }}>
      <div className="container" style={{ maxWidth: '400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>IdeaCheck</h1>
          <p style={{ color: '#666' }}>
            {isLoginMode ? 'Welcome back! Please sign in.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Auth Card */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem'
        }}>
          {/* Mode Toggle */}
          <div style={{
            display: 'flex',
            marginBottom: '2rem',
            borderBottom: '1px solid #eee'
          }}>
            <button
              onClick={() => isLoginMode || switchMode()}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                background: 'none',
                borderBottom: isLoginMode ? '2px solid #007bff' : '2px solid transparent',
                color: isLoginMode ? '#007bff' : '#666',
                fontWeight: isLoginMode ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
            <button
              onClick={() => !isLoginMode || switchMode()}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                background: 'none',
                borderBottom: !isLoginMode ? '2px solid #007bff' : '2px solid transparent',
                color: !isLoginMode ? '#007bff' : '#666',
                fontWeight: !isLoginMode ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              Sign Up
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

          {successMessage && (
            <div style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              background: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
              color: '#155724'
            }}>
              {successMessage}
            </div>
          )}

          {/* Login Form */}
          {isLoginMode && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => updateLoginField('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: loginErrors.email ? '1px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter your email"
                  disabled={loading}
                />
                {loginErrors.email && (
                  <small style={{ color: '#dc3545', display: 'block', marginTop: '0.25rem' }}>
                    {loginErrors.email}
                  </small>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => updateLoginField('password', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: loginErrors.password ? '1px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                {loginErrors.password && (
                  <small style={{ color: '#dc3545', display: 'block', marginTop: '0.25rem' }}>
                    {loginErrors.password}
                  </small>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: loading ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {!isLoginMode && (
            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => updateSignupField('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: signupErrors.email ? '1px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter your email"
                  disabled={loading}
                />
                {signupErrors.email && (
                  <small style={{ color: '#dc3545', display: 'block', marginTop: '0.25rem' }}>
                    {signupErrors.email}
                  </small>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={signupForm.full_name}
                  onChange={(e) => updateSignupField('full_name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: signupErrors.full_name ? '1px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
                {signupErrors.full_name && (
                  <small style={{ color: '#dc3545', display: 'block', marginTop: '0.25rem' }}>
                    {signupErrors.full_name}
                  </small>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={signupForm.password}
                  onChange={(e) => updateSignupField('password', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: signupErrors.password ? '1px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  placeholder="Create a password"
                  disabled={loading}
                />
                {signupErrors.password && (
                  <small style={{ color: '#dc3545', display: 'block', marginTop: '0.25rem' }}>
                    {signupErrors.password}
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
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: loading ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <a 
            href="/" 
            style={{ 
              color: '#666', 
              textDecoration: 'none',
              fontSize: '0.9rem' 
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;