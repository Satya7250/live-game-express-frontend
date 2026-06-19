import type { ApiResponse, User } from "@/types/auth";

export interface Conversation {
  _id: string;
  type: "private" | "group";
  participants: User[];
  lastMessage: string | null;
  lastMessageSender: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageDto {
  conversationId: string;
  content: string;
}

export interface ChatTypingPayload {
  conversationId: string;
  userId: string;
}

export interface ChatNewMessagePayload {
  message: Message;
}

export interface CreateConversationDto {
  participantId: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ConversationsResponseData {
  conversations: Conversation[];
  pagination: PaginationMeta;
}

export interface MessagesResponseData {
  messages: Message[];
  pagination: PaginationMeta;
}

export type CreateConversationResponse = ApiResponse<Conversation>;
export type GetConversationsResponse = ApiResponse<ConversationsResponseData>;
export type SendMessageResponse = ApiResponse<{ message: Message; conversation: Conversation }>;
export type GetMessagesResponse = ApiResponse<MessagesResponseData>;
