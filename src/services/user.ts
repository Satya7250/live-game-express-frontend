import api from "@/lib/axios";
import type { ApiResponse, User } from "@/types/auth";
import type {
  DeleteAccountDto,
  UpdateProfileDto,
} from "@/types/user";

export const getProfile = async (): Promise<ApiResponse<User>> => {
  const { data } = await api.get<ApiResponse<User>>("/user/profile");
  return data;
};

export const updateProfile = async (
  payload: UpdateProfileDto
): Promise<ApiResponse<User>> => {
  const { data } = await api.patch<ApiResponse<User>>(
    "/user/profile",
    payload
  );
  return data;
};

export const deleteAccount = async (
  payload: DeleteAccountDto
): Promise<ApiResponse> => {
  const { data } = await api.delete<ApiResponse>("/user/account", {
    data: payload,
  });
  return data;
};
