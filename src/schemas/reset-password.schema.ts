import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        8,
        "Password must contain at least 8 characters"
      ),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type ResetPasswordFormData =
  z.infer<
    typeof resetPasswordSchema
  >;