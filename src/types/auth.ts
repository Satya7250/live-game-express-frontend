export type UserRole = "player" | "developer";

export interface SignupDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;

  phone?: string;
  avatar?: string;
  address?: string;
  bio?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;

  phone?: string;
  avatar?: string;
  address?: string;
  bio?: string;

  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = ApiResponse<LoginData>;

export type MeResponse = ApiResponse<User>;