import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginFormData =
  z.infer<typeof loginSchema>;