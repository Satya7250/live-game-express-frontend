import api from "@/lib/axios";
import { emitSocketEvent } from "@/lib/socket";
import type {
  CreateConversationResponse,
  GetConversationsResponse,
  GetMessagesResponse,
  SendMessageResponse,
} from "@/types/chat";

export const createConversation = async (
  participantId: string
): Promise<CreateConversationResponse> => {
  const { data } = await api.post<CreateConversationResponse>(
    "/chat/conversations",
    { participantId }
  );
  return data;
};

export const getConversations = async (
  page = 1,
  limit = 20
): Promise<GetConversationsResponse> => {
  const { data } = await api.get<GetConversationsResponse>("/chat/conversations", {
    params: { page, limit },
  });
  return data;
};

export const sendMessage = async (
  conversationId: string,
  content: string
): Promise<SendMessageResponse> => {
  const { data } = await api.post<SendMessageResponse>("/chat/messages", {
    conversationId,
    content,
  });
  return data;
};

export const getMessages = async (
  conversationId: string,
  page = 1,
  limit = 50
): Promise<GetMessagesResponse> => {
  const { data } = await api.get<GetMessagesResponse>(
    `/chat/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      params: { page, limit },
    }
  );
  return data;
};

// Real-time socket emissions
export const joinConversationSocket = (conversationId: string): void => {
  emitSocketEvent("chat:join-conversation", { conversationId });
};

export const sendTypingSocket = (conversationId: string): void => {
  emitSocketEvent("chat:typing", { conversationId });
};

export const sendStopTypingSocket = (conversationId: string): void => {
  emitSocketEvent("chat:stop-typing", { conversationId });
};
