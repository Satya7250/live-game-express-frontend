import api from "@/lib/axios";
import type {
  SignupDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  LoginResponse,
  ApiResponse,
  User,
} from "@/types/auth";

export const register = async (
  payload: SignupDto
): Promise<ApiResponse<User>> => {
  const { data } = await api.post<ApiResponse<User>>(
    "/auth/register",
    payload
  );

  return data;
};

export const login = async (
  payload: LoginDto
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>(
    "/auth/login",
    payload
  );

  return data;
};

export const forgotPassword = async (
  payload: ForgotPasswordDto
): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>(
    "/auth/forgot-password",
    payload
  );

  return data;
};

export const resetPassword = async (
  token: string,
  payload: ResetPasswordDto
): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>(
    `/auth/reset-password/${token}`,
    payload
  );

  return data;
};

export const logout = async (): Promise<ApiResponse> => {
  const { data } = await api.post<ApiResponse>(
    "/auth/logout"
  );

  return data;
};

export const getMe = async (): Promise<ApiResponse<User>> => {
  const { data } = await api.get<ApiResponse<User>>(
    "/auth/me"
  );

  return data;
};

export const refreshToken = async () => {
  const { data } = await api.post(
    "/auth/refresh-token"
  );

  return data;
};

export const changePassword =
  async (payload: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const { data } =
      await api.post(
        "/auth/change-password",
        payload
      );

    return data;
  };