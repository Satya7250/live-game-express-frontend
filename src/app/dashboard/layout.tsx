"use client"

import { useEffect } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSocket } from "@/hooks/useSocket";
import { useNotificationStore } from "@/store/notification.store";
import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";
import { onSocketEvent } from "@/services/socket.service";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected } = useSocket();

  // Load initial states on mount
  useEffect(() => {
    void useNotificationStore.getState().fetchUnreadCount();
    void useNotificationStore.getState().fetchNotifications(1, 20);
    void useChatStore.getState().fetchConversations();
  }, []);

  // Set up global socket listeners when socket connection is active
  useEffect(() => {
    if (!isConnected) return;

    // Chat events listeners
    const unsubscribeNewMessage = onSocketEvent(
      "chat:new-message",
      (data) => {
        const state = useChatStore.getState();
        state.receiveMessage(data.message);

        // Notify user if chat is in background
        const currentUserId = useAuthStore.getState().user?._id;
        if (
          data.message.sender._id !== currentUserId &&
          state.activeConversationId !== data.message.conversationId
        ) {
          toast.info(`New message from ${data.message.sender.name}`, {
            description: data.message.content.length > 50 
              ? `${data.message.content.substring(0, 50)}...`
              : data.message.content,
          });
        }
      }
    );

    const unsubscribeChatTyping = onSocketEvent(
      "chat:typing",
      (data) => {
        const { conversations } = useChatStore.getState();
        const conv = conversations.find((c) => c._id === data.conversationId);
        const user = conv?.participants.find((p) => p._id === data.userId);
        const userName = user?.name || "Someone";
        useChatStore.getState().setUserTyping(data.conversationId, data.userId, true, userName);
      }
    );

    const unsubscribeChatStopTyping = onSocketEvent(
      "chat:stop-typing",
      (data) => {
        const { conversations } = useChatStore.getState();
        const conv = conversations.find((c) => c._id === data.conversationId);
        const user = conv?.participants.find((p) => p._id === data.userId);
        const userName = user?.name || "Someone";
        useChatStore.getState().setUserTyping(data.conversationId, data.userId, false, userName);
      }
    );

    // Notification events listeners
    const unsubscribeNewNotification = onSocketEvent(
      "notification:new",
      (data) => {
        useNotificationStore.getState().addNotification(data);
        toast.info(data.title || "New Notification", {
          description: data.message,
        });
      }
    );

    const unsubscribeReadNotification = onSocketEvent(
      "notification:read",
      (data) => {
        useNotificationStore.getState().setNotificationRead(data);
      }
    );

    const unsubscribeAllReadNotifications = onSocketEvent(
      "notification:all-read",
      () => {
        useNotificationStore.getState().setAllRead();
      }
    );

    const unsubscribeDeletedNotification = onSocketEvent(
      "notification:deleted",
      (data) => {
        useNotificationStore.getState().removeNotification(data.notificationId);
      }
    );

    return () => {
      unsubscribeNewMessage();
      unsubscribeChatTyping();
      unsubscribeChatStopTyping();
      unsubscribeNewNotification();
      unsubscribeReadNotification();
      unsubscribeAllReadNotifications();
      unsubscribeDeletedNotification();
    };
  }, [isConnected]);

  return (
    <ProtectedRoute>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}