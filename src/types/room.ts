import type { ApiResponse } from "@/types/auth";

export type RoomStatus = "waiting" | "playing" | "finished";

export type GameType = "tic-tac-toe" | "rock-paper-scissors";

export interface RoomPlayer {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Room {
  _id: string;
  name: string;
  roomCode: string;
  owner: RoomPlayer;
  players: RoomPlayer[];
  maxPlayers: number;
  status: RoomStatus;
  gameType: GameType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomDto {
  name: string;
  gameType: GameType;
  maxPlayers: number;
}

export interface JoinRoomDto {
  roomCode: string;
}

export interface RoomPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MyRoomsData {
  rooms: Room[];
  pagination: RoomPagination;
}

export interface LeaveRoomDeletedResult {
  message: string;
}

export type MyRoomsResponse = ApiResponse<MyRoomsData>;
export type RoomResponse = ApiResponse<Room>;
export type LeaveRoomResponse = ApiResponse<Room | LeaveRoomDeletedResult>;
