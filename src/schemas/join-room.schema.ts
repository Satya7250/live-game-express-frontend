import { z } from "zod";

export const joinRoomSchema = z.object({
  roomCode: z
    .string()
    .trim()
    .toUpperCase()
    .length(6, "Room code must be exactly 6 characters"),
});

export type JoinRoomFormData = z.infer<typeof joinRoomSchema>;
