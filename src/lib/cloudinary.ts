import { getCloudinarySignature } from "@/services/cloudinary.service";
import type { CloudinaryUploadResult } from "@/types/cloudinary.types";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const MAX_IMAGE_SIZE =
  5 * 1024 * 1024; // 5 MB

export interface FileValidationError {
  message: string;
}

export function validateImageFile(
  file: File
): FileValidationError | null {
  if (
    !ALLOWED_IMAGE_TYPES.includes(file.type)
  ) {
    return {
      message:
        "Invalid file type. Only JPG, PNG and WEBP images are allowed.",
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      message:
        "File too large. Maximum allowed size is 5 MB.",
    };
  }

  return null;
}

export async function uploadImageToCloudinary(
  file: File
): Promise<string> {
  const validationError =
    validateImageFile(file);

  if (validationError) {
    throw new Error(validationError.message);
  }

  const signatureResponse =
    await getCloudinarySignature();

  if (!signatureResponse.success) {
    throw new Error(
      "Failed to generate upload signature"
    );
  }

  const {
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder,
  } = signatureResponse.data;

  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append(
    "timestamp",
    timestamp.toString()
  );
  formData.append("signature", signature);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Cloudinary upload failed"
    );
  }

  const uploadResult =
    result as CloudinaryUploadResult;

  if (!uploadResult.secure_url) {
    throw new Error(
      "Cloudinary response missing secure URL"
    );
  }

  return uploadResult.secure_url;
}