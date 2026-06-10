import { z } from "zod";

export const sendFriendRequestSchema = z.object({
  receiverId: z
    .string()
    .trim()
    .length(24, "User ID must be a 24-character MongoDB ObjectId")
    .regex(/^[a-fA-F0-9]{24}$/, "User ID must be a valid hexadecimal ObjectId"),
});

export type SendFriendRequestFormData = z.infer<
  typeof sendFriendRequestSchema
>;
