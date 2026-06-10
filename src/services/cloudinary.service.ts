import api from "@/lib/axios";
import type { CloudinaryApiResponse } from "@/types/cloudinary.types";

export async function getCloudinarySignature(): Promise<CloudinaryApiResponse> {
  const { data } =
    await api.get<CloudinaryApiResponse>(
      "/user/cloudinary-signature"
    );

  return data;
}