// Email validation using regex
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  if (password.length > 72) {
    return {
      isValid: false,
      message: 'Password cannot be longer than 72 characters'
    };
  }
  
  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain at least one letter and one number'
    };
  }
  
  return {
    isValid: true,
    message: 'Password is valid'
  };
};

// Form validation utilities
export const getErrorMessage = (field: string, value: string): string => {
  if (!value.trim()) {
    return `${field} is required`;
  }
  
  if (field === 'Email' && !validateEmail(value)) {
    return 'Please enter a valid email address';
  }
  
  if (field === 'Password') {
    const validation = validatePassword(value);
    if (!validation.isValid) {
      return validation.message;
    }
  }
  
  return '';
};