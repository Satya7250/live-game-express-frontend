import type { CreateRoomDto, LeaveRoomDeletedResult, Room } from "@/types/room";
import type { TicTacToeGame } from "@/types/tic-tac-toe";
import type { FriendUser, IncomingFriendRequest, SentFriendRequest } from "@/types/friend";

export type SocketConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";

export interface SocketErrorPayload {
  message: string;
}

export interface RoomCreatedPayload {
  room: Room;
}

export interface RoomJoinedPayload {
  room: Room;
}

export interface RoomLeftPayload {
  result: Room | LeaveRoomDeletedResult;
}

export interface RoomUpdatedPayload {
  room: Room;
}

export interface RoomStartedPayload {
  room: Room;
}

export interface TicTacToeGamePayload {
  game: TicTacToeGame;
}

export interface TicTacToeGameEndedPayload {
  reason: string;
}

export interface RoomJoinPayload {
  roomCode: string;
}

export interface RoomLeavePayload {
  roomCode: string;
}

export interface RoomStartPayload {
  roomCode: string;
}

export interface TicTacToeStartPayload {
  roomCode: string;
}

export interface TicTacToeMovePayload {
  roomCode: string;
  position: number;
}

export interface TicTacToeRestartPayload {
  roomCode: string;
}

// Friend-related types
export interface FriendRequestReceivedPayload {
  _id: string;
  sender: FriendUser;
  receiver: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequestAcceptedPayload {
  _id: string;
  sender?: FriendUser;
  receiver?: FriendUser;
  status: "accepted";
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequestRejectedPayload {
  requestId: string;
}

export interface FriendRequestCanceledPayload {
  requestId: string;
}

export interface FriendRemovedPayload {
  friendId: string;
}

export interface ClientToServerEvents {
  "room:create": (data: CreateRoomDto) => void;
  "room:join": (data: RoomJoinPayload) => void;
  "room:leave": (data: RoomLeavePayload) => void;
  "room:start": (data: RoomStartPayload) => void;
  "ttt:start": (data: TicTacToeStartPayload) => void;
  "ttt:move": (data: TicTacToeMovePayload) => void;
  "ttt:restart": (data: TicTacToeRestartPayload) => void;
}

export interface ServerToClientEvents {
  "room:created": (data: RoomCreatedPayload) => void;
  "room:joined": (data: RoomJoinedPayload) => void;
  "room:left": (data: RoomLeftPayload) => void;
  "room:updated": (data: RoomUpdatedPayload) => void;
  "room:started": (data: RoomStartedPayload) => void;
  "room:error": (data: SocketErrorPayload) => void;
  "ttt:started": (data: TicTacToeGamePayload) => void;
  "ttt:update": (data: TicTacToeGamePayload) => void;
  "ttt:restarted": (data: TicTacToeGamePayload) => void;
  "ttt:gameEnded": (data: TicTacToeGameEndedPayload) => void;
  "ttt:error": (data: SocketErrorPayload) => void;
  // Friend events
  "friend:requestReceived": (data: FriendRequestReceivedPayload) => void;
  "friend:requestAccepted": (data: FriendRequestAcceptedPayload) => void;
  "friend:requestRejected": (data: FriendRequestRejectedPayload) => void;
  "friend:requestCanceled": (data: FriendRequestCanceledPayload) => void;
  "friend:removed": (data: FriendRemovedPayload) => void;
}

export type AppSocket = import("socket.io-client").Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;
