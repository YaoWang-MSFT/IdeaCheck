export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ApiError {
  detail: string;
}

export interface MessageResponse {
  message: string;
}