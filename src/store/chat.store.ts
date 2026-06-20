import { create } from "zustand";
import * as chatService from "@/services/chat.service";
import { ensureSocketConnected } from "@/services/socket.service";
import { useAuthStore } from "@/store/auth.store";
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
  resendMessage: (tempId: string) => Promise<void>;
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
          conv.participants.forEach((p: any) => {
            const pid = typeof p === "string" ? p : (p?._id || p?.id);
            if (pid && !(pid in onlineMap)) {
              onlineMap[pid] = Math.random() > 0.3; // Default realistic simulation
            }
          });
        });
        set({ onlineUsers: onlineMap });

        // Join socket rooms for all conversations to receive real-time updates
        try {
          await ensureSocketConnected();
          response.data.conversations.forEach((conv) => {
            chatService.joinConversationSocket(conv._id);
          });
        } catch (error) {
          console.warn("Failed to join all conversation socket rooms:", error);
        }
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

    // Mark recipient as online immediately when selected
    const currentUser = useAuthStore.getState().user;
    const activeConv = get().conversations.find((c) => c._id === conversationId);
    const recipientPart = activeConv?.participants.find((p: any) => {
      const pid = typeof p === "string" ? p : (p?._id || p?.id);
      return pid && pid !== currentUser?._id;
    });
    const recipientId = recipientPart ? (typeof recipientPart === "string" ? recipientPart : (recipientPart._id || (recipientPart as any).id)) : null;
    if (recipientId) {
      set((state) => ({
        onlineUsers: { ...state.onlineUsers, [recipientId]: true }
      }));
    }

    // Join socket room after ensuring connection is active to prevent race condition
    try {
      await ensureSocketConnected();
      chatService.joinConversationSocket(conversationId);
    } catch (error) {
      console.error("Failed to connect socket to join conversation room:", error);
    }

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
          
          // Combine existing messages and newly fetched messages
          const combined = [...existing, ...response.data.messages];
          
          // De-duplicate by message ID
          const uniqueMap = new Map<string, Message>();
          combined.forEach((msg) => {
            uniqueMap.set(msg._id, msg);
          });
          const uniqueMsgs = Array.from(uniqueMap.values());
          
          // Sort chronologically: oldest message first, newest message last
          uniqueMsgs.sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return timeA - timeB;
          });
          
          return {
            messages: {
              ...state.messages,
              [conversationId]: uniqueMsgs,
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

    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    // Mark recipient as online immediately when sending a message
    const activeConv = get().conversations.find((c) => c._id === activeConversationId);
    const recipientPart = activeConv?.participants.find((p: any) => {
      const pid = typeof p === "string" ? p : (p?._id || p?.id);
      return pid && pid !== currentUser?._id;
    });
    const recipientId = recipientPart ? (typeof recipientPart === "string" ? recipientPart : (recipientPart._id || (recipientPart as any).id)) : null;
    if (recipientId) {
      set((state) => ({
        onlineUsers: { ...state.onlineUsers, [recipientId]: true }
      }));
    }

    // Generate a unique temporary ID for the optimistic update
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const optimisticMessage: Message = {
      _id: tempId,
      conversationId: activeConversationId,
      sender: currentUser,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "sending",
    };

    // Insert optimistic message immediately
    set((state) => {
      const chatMsgs = state.messages[activeConversationId] || [];
      return {
        messages: {
          ...state.messages,
          [activeConversationId]: [...chatMsgs, optimisticMessage],
        },
      };
    });

    try {
      const response = await chatService.sendMessage(activeConversationId, content);
      if (response.success && response.data) {
        const { message, conversation } = response.data;
        
        // Replace optimistic message with the server-confirmed message
        set((state) => {
          const chatMsgs = state.messages[activeConversationId] || [];
          const updatedMsgs = chatMsgs.map((m) =>
            m._id === tempId ? { ...message, status: "sent" as const } : m
          );
          
          // Update conversation list last message fields
          const updatedConversations = state.conversations.map((c) =>
            c._id === conversation._id ? conversation : c
          );
          
          return {
            messages: {
              ...state.messages,
              [activeConversationId]: updatedMsgs,
            },
            conversations: updatedConversations,
          };
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Update optimistic message status to failed
      set((state) => {
        const chatMsgs = state.messages[activeConversationId] || [];
        const updatedMsgs = chatMsgs.map((m) =>
          m._id === tempId ? { ...m, status: "failed" as const } : m
        );
        return {
          messages: {
            ...state.messages,
            [activeConversationId]: updatedMsgs,
          },
        };
      });
      throw error;
    }
  },

  resendMessage: async (tempId) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    const chatMsgs = get().messages[activeConversationId] || [];
    const msgToResend = chatMsgs.find((m) => m._id === tempId);
    if (!msgToResend) return;

    // Set status to sending again
    set((state) => {
      const msgs = state.messages[activeConversationId] || [];
      const updated = msgs.map((m) =>
        m._id === tempId ? { ...m, status: "sending" as const } : m
      );
      return {
        messages: {
          ...state.messages,
          [activeConversationId]: updated,
        },
      };
    });

    try {
      const response = await chatService.sendMessage(activeConversationId, msgToResend.content);
      if (response.success && response.data) {
        const { message, conversation } = response.data;
        
        // Replace optimistic message with server-confirmed message
        set((state) => {
          const msgs = state.messages[activeConversationId] || [];
          const updated = msgs.map((m) =>
            m._id === tempId ? { ...message, status: "sent" as const } : m
          );
          const updatedConversations = state.conversations.map((c) =>
            c._id === conversation._id ? conversation : c
          );
          return {
            messages: {
              ...state.messages,
              [activeConversationId]: updated,
            },
            conversations: updatedConversations,
          };
        });
      }
    } catch (error) {
      console.error("Failed to resend message:", error);
      set((state) => {
        const msgs = state.messages[activeConversationId] || [];
        const updated = msgs.map((m) =>
          m._id === tempId ? { ...m, status: "failed" as const } : m
        );
        return {
          messages: {
            ...state.messages,
            [activeConversationId]: updated,
          },
        };
      });
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

    // If the conversation is not in our list, fetch conversations to load it in real-time
    const convExists = get().conversations.some((c) => c._id === cid);
    if (!convExists) {
      void get().fetchConversations();
    }

    set((state) => {
      const chatMsgs = state.messages[cid] || [];
      const currentUserId = useAuthStore.getState().user?._id;
      const isOwn = message.sender._id === currentUserId;
      
      const exists = chatMsgs.some((m) => m._id === message._id);
      
      let newMsgs: Message[] = [];
      if (exists) {
        newMsgs = chatMsgs;
      } else {
        // If it's our own message, check if there's an optimistic sending/failed message we can reconcile with.
        let reconciled = false;
        if (isOwn) {
          const optimisticIndex = chatMsgs.findIndex(
            (m) =>
              (m.status === "sending" || m.status === "failed") &&
              m.content === message.content &&
              Math.abs(new Date(message.createdAt).getTime() - new Date(m.createdAt).getTime()) < 20000
          );
          
          if (optimisticIndex !== -1) {
            newMsgs = [...chatMsgs];
            newMsgs[optimisticIndex] = { ...message, status: "sent" };
            reconciled = true;
          }
        }
        
        if (!reconciled) {
          newMsgs = [...chatMsgs, message];
        }
      }
      
      // De-duplicate in case of race conditions
      const uniqueMap = new Map<string, Message>();
      newMsgs.forEach((msg) => {
        uniqueMap.set(msg._id, msg);
      });
      const sortedUniqueMsgs = Array.from(uniqueMap.values());
      
      // Sort chronologically (oldest message first, newest message last)
      sortedUniqueMsgs.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeA - timeB;
      });
      
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
          [cid]: sortedUniqueMsgs,
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
