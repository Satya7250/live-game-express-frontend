import { z } from "zod";

export const changePasswordSchema =
  z
    .object({
      oldPassword: z
        .string()
        .min(
          8,
          "Current password must be at least 8 characters"
        ),

      newPassword: z
        .string()
        .min(
          8,
          "New password must be at least 8 characters"
        ),

      confirmPassword: z.string(),
    })
    .refine(
      (data) =>
        data.newPassword ===
        data.confirmPassword,
      {
        message:
          "Passwords do not match",
        path: ["confirmPassword"],
      }
    );

export type ChangePasswordFormData =
  z.infer<
    typeof changePasswordSchema
  >;