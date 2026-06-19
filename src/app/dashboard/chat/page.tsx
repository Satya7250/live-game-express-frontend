"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { 
  MessageCircle, 
  Send, 
  Users, 
  Loader2, 
  Circle, 
  Smile,
  Plus
} from "lucide-react";
import { toast } from "sonner";

import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";
import { useFriends } from "@/hooks/useFriends";
import { sendTypingSocket, sendStopTypingSocket } from "@/services/chat.service";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function formatTime(dateString: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return "";
  }
}

function ChatContent() {
  const searchParams = useSearchParams();
  const currentUserId = useAuthStore((state) => state.user?._id);
  const { friends } = useFriends();
  
  const {
    conversations,
    activeConversationId,
    messages,
    loadingConversations,
    loadingMessages,
    typingUsers,
    onlineUsers,
    fetchConversations,
    selectConversation,
    sendNewMessage,
    startConversationWithFriend,
  } = useChatStore();

  const [inputMsg, setInputMsg] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

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

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Trigger scroll to bottom on message load or new message
  useEffect(() => {
    if (activeConversationId) {
      // Delay slightly to allow layout calculations
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, activeConversationId, scrollToBottom]);

  // Typing notification handler
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

    // Clear typing indicator instantly
    if (isTypingRef.current) {
      isTypingRef.current = false;
      sendStopTypingSocket(activeConversationId);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setSending(true);
    try {
      await sendNewMessage(inputMsg.trim());
      setInputMsg("");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleStartChat = async (friendId: string) => {
    setDialogOpen(false);
    const conversationId = await startConversationWithFriend(friendId);
    if (conversationId) {
      toast.success("Conversation started");
    } else {
      toast.error("Failed to create conversation");
    }
  };

  // Get active conversation object
  const activeConversation = conversations.find(
    (c) => c._id === activeConversationId
  );

  // Find recipient user details
  const getRecipient = (conv: typeof conversations[0]) => {
    return conv.participants.find((p) => p._id !== currentUserId);
  };

  const activeRecipient = activeConversation ? getRecipient(activeConversation) : null;
  const activeRecipientTyping = activeConversationId ? typingUsers[activeConversationId] || [] : [];
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  return (
    <div className="flex h-[calc(100vh-10rem)] w-full rounded-2xl border bg-background/50 backdrop-blur-[2px] overflow-hidden">
      
      {/* LEFT SIDEBAR PANEL: CONVERSATIONS LIST */}
      <div className="w-full sm:w-80 border-r flex flex-col shrink-0 bg-muted/10 h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-base flex items-center gap-1.5">
            <MessageCircle className="size-4 text-primary" />
            Chats
          </h3>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="size-8 rounded-full">
                <Plus className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>New Chat</DialogTitle>
                <DialogDescription>
                  Select a friend from your list to start a private conversation.
                </DialogDescription>
              </DialogHeader>

              {/* List of Friends */}
              <div className="space-y-3 max-h-60 overflow-y-auto pt-2">
                {friends.length === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    No friends found. Go to Friends tab to add players.
                  </div>
                ) : (
                  friends.map((friend) => (
                    <div
                      key={friend._id}
                      onClick={() => void handleStartChat(friend._id)}
                      className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-9 border">
                          <AvatarImage src={friend.avatar} alt={friend.name} />
                          <AvatarFallback className="bg-primary/20 text-xs">
                            {friend.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">{friend.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {friend.email}
                          </p>
                        </div>
                      </div>
                      <Button size="sm">Chat</Button>
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
                  <div className="size-10 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-2">
              <Users className="size-8 text-muted-foreground/50" />
              <p className="text-sm font-semibold">No active chats</p>
              <p className="text-xs text-muted-foreground max-w-[200px]">
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
                  onClick={() => selectConversation(conv._id)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "hover:bg-muted/30 text-foreground"
                  }`}
                >
                  {/* Recipient Avatar */}
                  <div className="relative shrink-0 mt-0.5">
                    <Avatar className="size-10 border border-border/20">
                      <AvatarImage src={recipient?.avatar} alt={recipient?.name} />
                      <AvatarFallback className={isActive ? "bg-background/20 text-white text-xs" : "bg-primary/10 text-xs"}>
                        {recipient?.name?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Status dot */}
                    {isOnline && (
                      <span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-emerald-500`} />
                    )}
                  </div>

                  {/* Body info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-semibold text-sm truncate">
                        {recipient?.name || "Group"}
                      </span>
                      <span className={`text-[10px] ${isActive ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                        {formatTime(conv.lastMessageAt)}
                      </span>
                    </div>

                    <p className={`text-xs truncate ${isActive ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                      {typingList.length > 0 ? (
                        <span className="text-emerald-500 font-semibold italic animate-pulse">typing...</span>
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

      {/* RIGHT PANEL: CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-background/30 h-full">
        {activeConversationId ? (
          <>
            {/* Header: user info */}
            <div className="p-4 border-b flex items-center justify-between bg-muted/5 shrink-0">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 border">
                  <AvatarImage src={activeRecipient?.avatar} alt={activeRecipient?.name} />
                  <AvatarFallback className="bg-primary/10">
                    {activeRecipient?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-sm">{activeRecipient?.name}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {onlineUsers[activeRecipient?._id || ""] ? (
                      <>
                        <Circle className="size-2 fill-emerald-500 text-emerald-500" />
                        Online
                      </>
                    ) : (
                      <>
                        <Circle className="size-2 fill-muted-foreground text-muted-foreground" />
                        Offline
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages && activeMessages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  {activeMessages.map((msg) => {
                    const isOwn = msg.sender._id === currentUserId;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex gap-2 max-w-[70%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                          {!isOwn && (
                            <Avatar className="size-8 shrink-0 mt-0.5 border">
                              <AvatarImage src={msg.sender.avatar} alt={msg.sender.name} />
                              <AvatarFallback className="bg-primary/10 text-xs">
                                {msg.sender.name?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <div
                              className={`rounded-2xl px-4 py-2.5 text-sm ${
                                isOwn
                                  ? "bg-primary text-primary-foreground rounded-tr-none shadow-sm"
                                  : "bg-muted text-foreground rounded-tl-none border"
                              }`}
                            >
                              <p className="break-words leading-relaxed">{msg.content}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground px-1 mt-1 block">
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Recipient Typing Indicator */}
                  {activeRecipientTyping.length > 0 && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 max-w-[70%] flex-row">
                        <Avatar className="size-8 shrink-0 mt-0.5 border">
                          <AvatarImage src={activeRecipient?.avatar} alt={activeRecipient?.name} />
                          <AvatarFallback className="bg-primary/10 text-xs">
                            {activeRecipient?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted border rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce shrink-0" style={{ animationDelay: '0ms' }} />
                          <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce shrink-0" style={{ animationDelay: '150ms' }} />
                          <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce shrink-0" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={void handleSendMessage} className="p-3 border-t bg-muted/5 flex items-center gap-2 shrink-0">
              <Input
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={handleTyping}
                placeholder="Type your message..."
                disabled={sending}
                className="flex-1 rounded-xl h-10 px-4 focus-visible:ring-primary/30"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!inputMsg.trim() || sending}
                className="rounded-xl size-10 shrink-0 bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm transition-colors"
              >
                {sending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted/60 border border-border/50 shadow-sm">
              <MessageCircle className="size-7 text-muted-foreground/80" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Your Conversations</h3>
              <p className="text-sm text-muted-foreground max-w-[280px] mt-1">
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
