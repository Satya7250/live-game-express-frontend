import { z } from "zod";

const optionalText = z.string().optional().or(z.literal(""));

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  phone: optionalText.refine(
    (value) => !value || /^[+]?[\d\s()-]{7,20}$/.test(value),
    "Please enter a valid phone number"
  ),

  avatar: z
    .union([
      z.string().url("Please upload a valid profile image"),
      z.literal(""),
    ])
    .optional(),

  address: z
    .string()
    .max(100, "Address cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),

  bio: z
    .string()
    .max(100, "Bio cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
