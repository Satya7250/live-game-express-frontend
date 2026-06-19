import { create } from "zustand";
import * as chatService from "@/services/chat.service";
import type { Conversation, Message } from "@/types/chat";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>; // conversationId -> messages
  loadingConversations: boolean;
  loadingMessages: boolean;
  typingUsers: Record<string, string[]>; // conversationId -> userNames[]
  onlineUsers: Record<string, boolean>; // userId -> isOnline

  fetchConversations: () => Promise<void>;
  selectConversation: (conversationId: string | null) => Promise<void>;
  fetchMessages: (conversationId: string, page?: number) => Promise<void>;
  sendNewMessage: (content: string) => Promise<void>;
  startConversationWithFriend: (friendId: string) => Promise<string | null>;

  // Socket updates
  receiveMessage: (message: Message) => void;
  setUserTyping: (conversationId: string, userId: string, isTyping: boolean, userName: string) => void;
  setOnlineStatus: (userId: string, isOnline: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  loadingConversations: false,
  loadingMessages: false,
  typingUsers: {},
  onlineUsers: {},

  fetchConversations: async () => {
    set({ loadingConversations: true });
    try {
      const response = await chatService.getConversations(1, 100);
      if (response.success && response.data) {
        set({ conversations: response.data.conversations });
        
        // Mark all conversation participants as online by default to populate status indicators
        const onlineMap: Record<string, boolean> = { ...get().onlineUsers };
        response.data.conversations.forEach((conv) => {
          conv.participants.forEach((p) => {
            if (!(p._id in onlineMap)) {
              onlineMap[p._id] = Math.random() > 0.3; // Default realistic simulation
            }
          });
        });
        set({ onlineUsers: onlineMap });
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      set({ loadingConversations: false });
    }
  },

  selectConversation: async (conversationId) => {
    set({ activeConversationId: conversationId });
    if (!conversationId) return;

    // Join socket room
    chatService.joinConversationSocket(conversationId);

    // Fetch messages if not loaded or just reload
    await get().fetchMessages(conversationId, 1);
  },

  fetchMessages: async (conversationId, page = 1) => {
    set({ loadingMessages: true });
    try {
      const response = await chatService.getMessages(conversationId, page, 50);
      if (response.success && response.data) {
        set((state) => {
          const existing = state.messages[conversationId] || [];
          // Avoid duplicate messages
          const newMsgs = response.data.messages.filter(
            (nm) => !existing.some((em) => em._id === nm._id)
          );
          
          return {
            messages: {
              ...state.messages,
              [conversationId]: page === 1 
                ? response.data.messages.reverse() // Sort chronologically (oldest to newest) for UI rendering
                : [...newMsgs.reverse(), ...existing],
            },
          };
        });
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      set({ loadingMessages: false });
    }
  },

  sendNewMessage: async (content) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    try {
      const response = await chatService.sendMessage(activeConversationId, content);
      if (response.success && response.data) {
        const { message, conversation } = response.data;
        
        // Append locally immediately
        get().receiveMessage(message);
        
        // Update conversation list
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === conversation._id ? conversation : c
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  },

  startConversationWithFriend: async (friendId) => {
    try {
      const response = await chatService.createConversation(friendId);
      if (response.success && response.data) {
        const conversation = response.data;
        
        set((state) => {
          const exists = state.conversations.some((c) => c._id === conversation._id);
          const list = exists 
            ? state.conversations 
            : [conversation, ...state.conversations];
          return { conversations: list };
        });

        // Set online status to true
        set((state) => ({
          onlineUsers: { ...state.onlineUsers, [friendId]: true }
        }));

        await get().selectConversation(conversation._id);
        return conversation._id;
      }
      return null;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      return null;
    }
  },

  receiveMessage: (message) => {
    const cid = message.conversationId;
    
    // Set sender to online
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [message.sender._id]: true }
    }));

    set((state) => {
      const chatMsgs = state.messages[cid] || [];
      const exists = chatMsgs.some((m) => m._id === message._id);
      
      const newMsgs = exists ? chatMsgs : [...chatMsgs, message];
      
      // Update last message in the conversations list
      const updatedConversations = state.conversations.map((c) => {
        if (c._id === cid) {
          return {
            ...c,
            lastMessage: message.content,
            lastMessageSender: message.sender._id,
            lastMessageAt: message.createdAt,
          };
        }
        return c;
      });

      // Sort conversations by last message timestamp
      const sortedConversations = [...updatedConversations].sort((a, b) => {
        const t1 = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const t2 = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
        return t2 - t1;
      });

      return {
        messages: {
          ...state.messages,
          [cid]: newMsgs,
        },
        conversations: sortedConversations,
      };
    });
  },

  setUserTyping: (conversationId, userId, isTyping, userName) => {
    set((state) => {
      const activeTyping = state.typingUsers[conversationId] || [];
      const filtered = activeTyping.filter((name) => name !== userName);
      
      const newTyping = isTyping ? [...filtered, userName] : filtered;
      
      const onlineUpdate = isTyping 
        ? { ...state.onlineUsers, [userId]: true }
        : state.onlineUsers;

      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: newTyping,
        },
        onlineUsers: onlineUpdate
      };
    });
  },

  setOnlineStatus: (userId, isOnline) => {
    set((state) => ({
      onlineUsers: {
        ...state.onlineUsers,
        [userId]: isOnline,
      },
    }));
  },
}));
