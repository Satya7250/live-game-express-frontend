import api from "@/lib/axios";
import type {
  UpdateProfileDto,
  DeleteAccountDto,
} from "@/types/user";

export const getProfile = async () => {
  const { data } = await api.get(
    "/user/profile"
  );

  return data;
};

export const updateProfile = async (
  payload: UpdateProfileDto
) => {
  const { data } = await api.patch(
    "/user/profile",
    payload
  );

  return data;
};

export const deleteAccount = async (
  payload: DeleteAccountDto
) => {
  const { data } = await api.delete(
    "/user/account",
    {
      data: payload,
    }
  );

  return data;
};