export interface RegisterRequest {
  fullName: string;
  userName: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  selectedRoles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    userId: string;
    userName: string;
    userRoles: string[];
    roleName: string[];
    customerId?: string;
    adminId?: string;
    techCompanyId?: string;
    deliveryPersonId?: string;
    cartId?: string;
    wishListId?: string;
    pcAssemblyId?: string | null;
    expiresAt?: string;
  };
}

export interface UserProfile {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  address: string;
  phoneNumber: string;
  registrationDate: string;
  lastLoginDate?: string;
  isActive: boolean;
  roles: string[];
}