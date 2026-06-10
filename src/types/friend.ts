import type { ApiResponse } from "@/types/auth";

export type FriendRequestStatus = "pending" | "accepted" | "rejected";

export interface FriendUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface IncomingFriendRequest {
  _id: string;
  sender: FriendUser;
  receiver: string;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SentFriendRequest {
  _id: string;
  sender: string;
  receiver: FriendUser;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequestRecord {
  _id: string;
  sender: string;
  receiver: string;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SendFriendRequestDto {
  receiverId: string;
}

export interface MessageResponse {
  message: string;
}

export type FriendsResponse = ApiResponse<FriendUser[]>;
export type IncomingRequestsResponse = ApiResponse<IncomingFriendRequest[]>;
export type SentRequestsResponse = ApiResponse<SentFriendRequest[]>;
export type FriendRequestResponse = ApiResponse<FriendRequestRecord>;
export type AcceptedRequestResponse = ApiResponse<IncomingFriendRequest>;
export type MessageApiResponse = ApiResponse<MessageResponse>;
