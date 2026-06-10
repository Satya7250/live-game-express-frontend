import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  phone: z.string().optional().or(z.literal("")),

  avatar: z.string().optional().or(z.literal("")),

  address: z.string().optional().or(z.literal("")),

  bio: z
    .string()
    .max(100, "Bio cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type ProfileFormData =
  z.infer<typeof profileSchema>;

export type DeleteAccountFormData =
  z.infer<typeof deleteAccountSchema>;