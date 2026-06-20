"use client";

import React, { Suspense, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { 
  MessageCircle, 
  Send, 
  Users, 
  Loader2, 
  Circle, 
  Plus
} from "lucide-react";
import { toast } from "sonner";

import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";
import { useFriends } from "@/hooks/useFriends";
import { sendTypingSocket, sendStopTypingSocket } from "@/services/chat.service";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Message } from "@/types/chat";

function formatTime(dateString: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return "";
  }
}

// 1. Memoized MessageBubble component
interface MessageBubbleProps {
  msg: Message;
  isOwn: boolean;
  onResend?: (tempId: string) => void;
}

const MessageBubble = React.memo(function MessageBubble({ msg, isOwn, onResend }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-2.5 max-w-[75%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
        {!isOwn && (
          <Avatar className="size-8 shrink-0 mt-0.5 border border-border/60">
            <AvatarImage src={msg.sender.avatar} alt={msg.sender.name} />
            <AvatarFallback className="bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 text-white font-medium text-xs">
              {msg.sender.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="min-w-0">
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm relative ${
              isOwn
                ? "bg-primary/20 text-white border border-primary/30 rounded-tr-none shadow-[0_4px_12px_rgba(220,38,38,0.1)] pr-8"
                : "bg-background/40 text-neutral-200 border border-white/5 rounded-tl-none shadow-sm"
            }`}
          >
            <p className="break-words leading-relaxed">{msg.content}</p>
            {isOwn && msg.status && (
              <span className="absolute right-2 bottom-1.5 text-[8px] select-none text-neutral-400/80">
                {msg.status === "sending" && "..."}
                {msg.status === "sent" && "✓"}
                {msg.status === "failed" && (
                  <button
                    type="button"
                    onClick={() => onResend?.(msg._id)}
                    className="text-red-500 hover:text-red-400 font-bold hover:underline cursor-pointer"
                    title="Click to retry"
                  >
                    ⚠ Retry
                  </button>
                )}
              </span>
            )}
          </div>
          <span className="text-[10px] text-neutral-500 px-1 mt-1 block">
            {formatTime(msg.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
});

// 2. ChatHeader component
function ChatHeader() {
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const conversations = useChatStore((state) => state.conversations);
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const currentUserId = useAuthStore((state) => state.user?._id);

  const activeConversation = useMemo(() => 
    conversations.find((c) => c._id === activeConversationId),
    [conversations, activeConversationId]
  );

  const activeRecipient = useMemo(() => {
    if (!activeConversation) return null;
    return activeConversation.participants.find((p) => p._id !== currentUserId);
  }, [activeConversation, currentUserId]);

  const isOnline = activeRecipient ? onlineUsers[activeRecipient._id] : false;

  return (
    <div className="p-4 border-b border-border/40 flex items-center justify-between bg-background/25 shrink-0">
      <div className="flex items-center gap-3">
        <Avatar className="size-10 border border-border/60">
          <AvatarImage src={activeRecipient?.avatar} alt={activeRecipient?.name} />
          <AvatarFallback className="bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 text-white font-medium text-xs">
            {activeRecipient?.name?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-bold text-sm text-white">{activeRecipient?.name}</h4>
          <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
            {isOnline ? (
              <>
                <Circle className="size-2 fill-emerald-500 text-emerald-500" />
                Online
              </>
            ) : (
              <>
                <Circle className="size-2 fill-neutral-500 text-neutral-500" />
                Offline
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. ConversationList component
function ConversationList({ onSelect }: { onSelect: (id: string) => void }) {
  const conversations = useChatStore((state) => state.conversations);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const typingUsers = useChatStore((state) => state.typingUsers);
  const loadingConversations = useChatStore((state) => state.loadingConversations);
  const currentUserId = useAuthStore((state) => state.user?._id);
  const { friends } = useFriends();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const startConversationWithFriend = useChatStore((state) => state.startConversationWithFriend);

  const handleStartChat = async (friendId: string) => {
    setDialogOpen(false);
    const conversationId = await startConversationWithFriend(friendId);
    if (conversationId) {
      toast.success("Conversation started");
    } else {
      toast.error("Failed to create conversation");
    }
  };

  const getRecipient = useCallback((conv: typeof conversations[0]) => {
    return conv.participants.find((p) => p._id !== currentUserId);
  }, [currentUserId]);

  return (
    <div className="w-full sm:w-80 border-r border-border/40 flex flex-col shrink-0 bg-background/20 h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border/40 flex items-center justify-between">
        <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
          <MessageCircle className="size-4 text-primary" />
          Chats
        </h3>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost" className="size-8 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white">
              <Plus className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border/45 max-w-md bg-popover">
            <DialogHeader>
              <DialogTitle className="text-white font-bold text-lg">New Chat</DialogTitle>
              <DialogDescription className="text-neutral-400 text-sm mt-1">
                Select a friend from your list to start a private conversation.
              </DialogDescription>
            </DialogHeader>

            {/* List of Friends */}
            <div className="space-y-3 max-h-60 overflow-y-auto pt-2">
              {friends.length === 0 ? (
                <div className="text-center py-6 text-sm text-neutral-400">
                  No friends found. Go to Friends tab to add players.
                </div>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend._id}
                    onClick={() => void handleStartChat(friend._id)}
                    className="glass-card flex items-center justify-between p-3 border border-border/40 hover:border-primary/20 cursor-pointer transition-all hover:transform-none hover:shadow-none bg-background/10"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-9 border border-border/60">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback className="bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 text-white font-medium text-xs">
                          {friend.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-white">{friend.name}</p>
                        <p className="text-xs text-neutral-400 truncate max-w-[200px]">
                          {friend.email}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="btn-gaming bg-primary hover:bg-primary/95 text-white font-semibold shadow-md shadow-red-900/10 border-0 h-8">Chat</Button>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Conversations Feed */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loadingConversations && conversations.length === 0 ? (
          <div className="flex flex-col gap-2 p-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="size-10 rounded-full bg-neutral-800 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/2 bg-neutral-800 animate-pulse rounded" />
                  <div className="h-3 w-3/4 bg-neutral-800 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-2">
            <Users className="size-8 text-neutral-500" />
            <p className="text-sm font-bold text-white">No active chats</p>
            <p className="text-xs text-neutral-400 max-w-[200px]">
              Click the plus icon to start a conversation with a friend.
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const recipient = getRecipient(conv);
            const isActive = conv._id === activeConversationId;
            const isOnline = recipient ? onlineUsers[recipient._id] : false;
            const typingList = typingUsers[conv._id] || [];

            return (
              <div
                key={conv._id}
                onClick={() => onSelect(conv._id)}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border relative ${
                  isActive 
                    ? "bg-primary/10 text-white border-primary/20 shadow-[inset_0_0_8px_rgba(220,38,38,0.08)]" 
                    : "hover:bg-white/5 border-transparent text-neutral-300"
                }`}
              >
                {/* Recipient Avatar */}
                <div className="relative shrink-0 mt-0.5">
                  <Avatar className="size-10 border border-border/60">
                    <AvatarImage src={recipient?.avatar} alt={recipient?.name} />
                    <AvatarFallback className="bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 text-white font-medium text-xs">
                      {recipient?.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Status dot */}
                  {isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#090708] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  )}
                </div>

                {/* Body info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-sm text-neutral-100 truncate">
                      {recipient?.name || "Group"}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>

                  <p className="text-xs truncate text-neutral-400">
                    {typingList.length > 0 ? (
                      <span className="text-emerald-400 font-semibold italic animate-pulse">typing...</span>
                    ) : (
                      conv.lastMessage || "No messages yet"
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// 4. MessageList component
function MessageList() {
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const loadingMessages = useChatStore((state) => state.loadingMessages);
  const resendMessage = useChatStore((state) => state.resendMessage);
  const currentUserId = useAuthStore((state) => state.user?._id);

  // Retrieve message array with granular selector to block unrelated re-renders
  const activeMessages = useChatStore(
    (state) => (activeConversationId ? state.messages[activeConversationId] || [] : [])
  );

  const conversations = useChatStore((state) => state.conversations);
  const activeConversation = useMemo(() => 
    conversations.find((c) => c._id === activeConversationId),
    [conversations, activeConversationId]
  );

  const typingUsers = useChatStore((state) => state.typingUsers);
  const activeRecipient = useMemo(() => {
    if (!activeConversation) return null;
    return activeConversation.participants.find((p) => p._id !== currentUserId);
  }, [activeConversation, currentUserId]);

  const activeRecipientTyping = useMemo(() => {
    return activeConversationId ? typingUsers[activeConversationId] || [] : [];
  }, [activeConversationId, typingUsers]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const pageRef = useRef(1);
  const prevScrollHeightRef = useRef<number | null>(null);
  const prevActiveConversationId = useRef<string | null>(null);
  const lastMessageCountRef = useRef(0);

  // Helper to scroll to bottom of the container
  const scrollToBottom = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // Reset pagination state when conversation changes
  useEffect(() => {
    if (activeConversationId !== prevActiveConversationId.current) {
      pageRef.current = 1;
      setHasMore(true);
      setLoadingMore(false);
      prevScrollHeightRef.current = null;
      prevActiveConversationId.current = activeConversationId;
      lastMessageCountRef.current = 0;
      
      // Allow DOM rendering to update layout, then scroll to bottom
      const timer = setTimeout(scrollToBottom, 50);
      return () => clearTimeout(timer);
    }
  }, [activeConversationId, scrollToBottom]);

  // Handle smart auto scroll on new messages
  useEffect(() => {
    if (!activeConversationId) return;

    const container = containerRef.current;
    if (!container) return;

    const currentCount = activeMessages.length;
    const prevCount = lastMessageCountRef.current;
    lastMessageCountRef.current = currentCount;

    // Only scroll if messages actually grew (or conversation changed)
    if (currentCount <= prevCount) return;

    const lastMsg = activeMessages[activeMessages.length - 1];
    const isOwn = lastMsg?.sender._id === currentUserId;

    // Detect if user is near bottom
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;

    if (isOwn || isNearBottom) {
      scrollToBottom();
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  }, [activeMessages, currentUserId, activeConversationId, scrollToBottom]);

  // Adjust scroll position after loading older messages (pagination)
  useEffect(() => {
    const container = containerRef.current;
    if (container && prevScrollHeightRef.current !== null) {
      const scrollHeightDiff = container.scrollHeight - prevScrollHeightRef.current;
      container.scrollTop = scrollHeightDiff;
      prevScrollHeightRef.current = null;
      setLoadingMore(false);
    }
  }, [activeMessages]);

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (!container) return;

    // Hide scroll button if scrolled to bottom manually
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (isNearBottom) {
      setShowScrollButton(false);
    }

    // Load older messages if scrolled near the top
    if (container.scrollTop <= 10 && !loadingMore && hasMore && !loadingMessages && activeConversationId) {
      setLoadingMore(true);
      prevScrollHeightRef.current = container.scrollHeight;
      
      const nextPage = pageRef.current + 1;
      try {
        const fetchMessages = useChatStore.getState().fetchMessages;
        await fetchMessages(activeConversationId, nextPage);
        pageRef.current = nextPage;
        
        const currentMessages = useChatStore.getState().messages[activeConversationId] || [];
        if (currentMessages.length === activeMessages.length) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to load older messages:", err);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  if (loadingMessages && activeMessages.length === 0) {
    return (
      <div className="flex-1 flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="flex-1 relative flex flex-col min-h-0 bg-background/5">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {loadingMore && (
          <div className="flex justify-center py-2">
            <Loader2 className="size-4 animate-spin text-neutral-500" />
          </div>
        )}

        {activeMessages.map((msg) => {
          const isOwn = msg.sender._id === currentUserId;
          return (
            <MessageBubble
              key={msg._id}
              msg={msg}
              isOwn={isOwn}
              onResend={resendMessage}
            />
          );
        })}

        {/* Recipient Typing Indicator */}
        {activeRecipientTyping.length > 0 && (
          <div className="flex justify-start">
            <div className="flex gap-2.5 max-w-[70%] flex-row">
              <Avatar className="size-8 shrink-0 mt-0.5 border border-border/60">
                <AvatarImage src={activeRecipient?.avatar} alt={activeRecipient?.name} />
                <AvatarFallback className="bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 text-white font-medium text-xs">
                  {activeRecipient?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="bg-background/40 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1 shadow-sm">
                <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce shrink-0" style={{ animationDelay: '0ms' }} />
                <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce shrink-0" style={{ animationDelay: '150ms' }} />
                <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce shrink-0" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Scroll Badge */}
      {showScrollButton && (
        <button
          type="button"
          onClick={() => {
            scrollToBottom();
            setShowScrollButton(false);
          }}
          className="absolute bottom-4 right-4 bg-primary text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg border-0 hover:bg-primary/90 flex items-center gap-1.5 transition-all z-20 animate-bounce cursor-pointer"
        >
          New Messages ↓
        </button>
      )}
    </div>
  );
}

// 5. MessageInput component (Manages local state, debounces typing events)
function MessageInput() {
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const sendNewMessage = useChatStore((state) => state.sendNewMessage);
  
  const [inputMsg, setInputMsg] = useState("");
  const [sending, setSending] = useState(false);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Stop typing on chat switch
  useEffect(() => {
    if (isTypingRef.current && activeConversationId) {
      sendStopTypingSocket(activeConversationId);
    }
    isTypingRef.current = false;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setInputMsg("");
  }, [activeConversationId]);

  const handleTyping = () => {
    if (!activeConversationId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTypingSocket(activeConversationId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      sendStopTypingSocket(activeConversationId);
    }, 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeConversationId || sending) return;

    const content = inputMsg.trim();
    setInputMsg("");

    // Clear typing states instantly
    if (isTypingRef.current) {
      isTypingRef.current = false;
      sendStopTypingSocket(activeConversationId);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setSending(true);
    try {
      await sendNewMessage(content);
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-3 border-t border-border/40 bg-background/25 flex items-center gap-2 shrink-0">
      <Input
        value={inputMsg}
        onChange={(e) => {
          setInputMsg(e.target.value);
          handleTyping();
        }}
        placeholder="Type your message..."
        disabled={sending}
        className="flex-1 rounded-xl h-10 px-4 border-white/10 bg-background/30 focus-visible:ring-primary/20 text-white"
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={!inputMsg.trim() || sending}
        className="btn-gaming bg-primary hover:bg-primary/95 text-white shadow-md shadow-red-900/10 rounded-xl size-10 shrink-0 border-0"
      >
        {sending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
      </Button>
    </form>
  );
}

// Main ChatContent component
function ChatContent() {
  const searchParams = useSearchParams();
  const conversations = useChatStore((state) => state.conversations);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const selectConversation = useChatStore((state) => state.selectConversation);
  const fetchConversations = useChatStore((state) => state.fetchConversations);

  // Parse conversation ID from URL query parameters
  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId && conversations.some((c) => c._id === urlId)) {
      void selectConversation(urlId);
    }
  }, [searchParams, conversations, selectConversation]);

  // Refetch conversations on mount
  useEffect(() => {
    void fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="glass-panel flex h-[calc(100vh-10rem)] w-full overflow-hidden border border-border/45 bg-background/10">
      {/* LEFT SIDEBAR PANEL: CONVERSATIONS LIST */}
      <ConversationList onSelect={(id) => void selectConversation(id)} />

      {/* RIGHT PANEL: CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-background/5 h-full min-w-0">
        {activeConversationId ? (
          <>
            {/* Header: user info */}
            <ChatHeader />

            {/* Messages log */}
            <MessageList />

            {/* Input form */}
            <MessageInput />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-background/40 border border-border/50 shadow-md">
              <MessageCircle className="size-7 text-neutral-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Your Conversations</h3>
              <p className="text-sm text-neutral-400 max-w-[280px] mt-1.5 leading-relaxed">
                Select a user from the conversations list on the left to start sending messages in real-time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center bg-background/50 rounded-2xl border">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
