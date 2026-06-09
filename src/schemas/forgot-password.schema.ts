import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .transform((email) => email.toLowerCase()),
});

export type ForgotPasswordFormData =
  z.infer<typeof forgotPasswordSchema>;