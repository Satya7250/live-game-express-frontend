import { z } from "zod";

const gameTypeValues = ["tic-tac-toe", "rock-paper-scissors"] as const;

export const createRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Room name is required")
    .max(50, "Room name cannot exceed 50 characters"),
  gameType: z.enum(gameTypeValues, {
    message: "Please select a game type",
  }),
  maxPlayers: z
    .number({
      message: "Max players is required",
    })
    .int("Max players must be a whole number")
    .min(2, "At least 2 players are required")
    .max(10, "Maximum 10 players allowed"),
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
