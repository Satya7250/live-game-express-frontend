import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string()
    .email("Please enter a valid email")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(
      8,
      "Password must contain at least 8 characters"
    ),

  role: z.enum([
    "player",
    "developer",
  ]),

  phone: z.string().optional(),

  avatar: z.string().optional(),

  address: z
    .string()
    .max(100)
    .optional(),

  bio: z
    .string()
    .max(100)
    .optional(),
});

export type SignupFormData =
  z.infer<typeof signupSchema>;