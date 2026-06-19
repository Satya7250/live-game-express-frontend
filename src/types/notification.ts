import type { ApiResponse, User } from "@/types/auth";

export type NotificationType = "FRIEND_REQUEST" | "GAME_INVITE" | "SYSTEM" | string;

export interface Notification {
  _id: string;
  recipient: string;
  sender: User;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    requestId?: string;
    senderId?: string;
    receiverId?: string;
    roomCode?: string;
    [key: string]: unknown;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponseData {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type GetNotificationsResponse = ApiResponse<NotificationsResponseData>;
export type UnreadCountResponse = ApiResponse<{ count: number }>;
export type MarkReadResponse = ApiResponse<Notification>;
export type MarkAllReadResponse = ApiResponse<null>;
export type DeleteNotificationResponse = ApiResponse<null>;
