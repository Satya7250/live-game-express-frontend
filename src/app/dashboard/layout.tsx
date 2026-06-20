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
      <style dangerouslySetInnerHTML={{ __html: `
        /* Sidebar inner positioning and clipping logic */
        [data-slot="sidebar-inner"] {
          position: relative !important;
          overflow: hidden !important;
        }

        /* FIRE THEME OVERRIDES (when html.dark is set) */
        html.dark {
          --background: #0d0400 !important;
          --foreground: #ffffff !important;
          --card: rgba(22, 4, 0, 0.45) !important;
          --card-foreground: #ffffff !important;
          --primary: #ff4500 !important;
          --border: rgba(255, 69, 0, 0.15) !important;
          --sidebar: #0a0300 !important;
          --sidebar-border: rgba(255, 69, 0, 0.15) !important;
          --sidebar-accent: rgba(255, 69, 0, 0.05) !important;
          --sidebar-accent-foreground: #ffffff !important;
          --muted: rgba(255, 69, 0, 0.05) !important;
          --muted-foreground: #cbd5e1 !important;
          --chart-1: #ff4500 !important;
          --chart-2: #ff6a00 !important;
          --chart-3: #ffcc00 !important;
          --chart-4: #ff8c00 !important;
          --chart-5: #ff4500 !important;
        }

        html.dark body {
          background-color: #0d0400 !important;
          background-image: radial-gradient(circle at 10% 20%, rgba(255, 69, 0, 0.04) 0%, transparent 40%),
                            radial-gradient(circle at 90% 80%, rgba(255, 106, 0, 0.04) 0%, transparent 40%) !important;
        }

        /* Input field visibility overrides for Fire Theme */
        html.dark input, html.dark textarea, html.dark select, html.dark [data-slot="input"] {
          background: rgba(255, 69, 0, 0.03) !important;
          border: 1px solid rgba(255, 69, 0, 0.25) !important;
          color: #ffffff !important;
        }
        html.dark input:focus, html.dark textarea:focus, html.dark select:focus {
          border-color: rgba(255, 106, 0, 0.6) !important;
          box-shadow: 0 0 10px rgba(255, 69, 0, 0.25) !important;
        }

        /* Tic-Tac-Toe Game Grid overrides for Fire Theme */
        html.dark .grid-cols-3 > button {
          border-color: rgba(255, 69, 0, 0.25) !important;
          background-color: rgba(22, 4, 0, 0.45) !important;
        }
        html.dark .grid-cols-3 > button:hover {
          border-color: rgba(255, 106, 0, 0.5) !important;
          background-color: rgba(255, 69, 0, 0.08) !important;
        }

        /* Border & divider visibility overrides for Fire Theme */
        html.dark border,
        html.dark .border,
        html.dark .border-border\\/40,
        html.dark .border-border\\/30,
        html.dark .border-white\\/10 {
          border-color: rgba(255, 69, 0, 0.2) !important;
        }
        html.dark .border-b,
        html.dark .border-t,
        html.dark .border-l,
        html.dark .border-r {
          border-color: rgba(255, 69, 0, 0.15) !important;
        }

        /* Welcome banner Fire theme adjustment */
        html.dark div:has(> #theme-banner-canvas) {
          background: linear-gradient(135deg, rgba(13, 4, 0, 0.9), rgba(255, 69, 0, 0.15), rgba(13, 4, 0, 0.9)) !important;
          border-color: rgba(255, 69, 0, 0.2) !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 69, 0, 0.05) !important;
        }

        html.dark div:has(> #theme-banner-canvas) .bg-red-600\\/10 {
          background-color: rgba(255, 69, 0, 0.15) !important;
        }
        html.dark div:has(> #theme-banner-canvas) .bg-red-800\\/5 {
          background-color: rgba(255, 106, 0, 0.1) !important;
        }

        /* Active Nav Item left border flickering (Fire theme) */
        @keyframes borderFlicker {
          0%, 100% { opacity: 0.7; }
          25% { opacity: 0.85; }
          45% { opacity: 0.72; }
          65% { opacity: 0.95; }
          80% { opacity: 0.78; }
          90% { opacity: 1.0; }
        }

        html.dark .relative.px-1 > div.absolute.left-0 {
          animation: borderFlicker 0.5s infinite alternate;
          background-color: #ff4500 !important;
          box-shadow: 0 0 8px #ff4500, 0 0 15px rgba(255, 69, 0, 0.6) !important;
        }

        html.dark [data-slot="sidebar-menu-button"][data-active="true"] {
          background-color: rgba(255, 69, 0, 0.08) !important;
          border-color: rgba(255, 69, 0, 0.15) !important;
          color: #ffcc00 !important;
        }
        html.dark [data-slot="sidebar-menu-button"][data-active="true"] svg {
          color: #ff4500 !important;
        }

        /* Inactive sidebar buttons color fixes for Fire Theme */
        html.dark [data-slot="sidebar"] [data-slot="sidebar-menu-button"]:not([data-active="true"]) {
          color: #cbd5e1 !important;
        }
        html.dark [data-slot="sidebar"] [data-slot="sidebar-menu-button"]:not([data-active="true"]) svg {
          color: #94a3b8 !important;
        }
        html.dark [data-slot="sidebar"] [data-slot="sidebar-menu-button"]:not([data-active="true"]):hover {
          color: #ffffff !important;
          background-color: rgba(255, 69, 0, 0.08) !important;
        }
        html.dark [data-slot="sidebar"] [data-slot="sidebar-menu-button"]:not([data-active="true"]):hover svg {
          color: #ff8c00 !important;
        }

        /* Stat Cards pulsing ember glow (Fire theme) */
        @keyframes emberGlow {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 0px rgba(255, 69, 0, 0);
            border-color: rgba(255, 69, 0, 0.1);
          }
          50% {
            box-shadow: 0 4px 25px rgba(0, 0, 0, 0.5), 0 0 10px 1px rgba(255, 69, 0, 0.35);
            border-color: rgba(255, 106, 0, 0.5);
          }
        }

        html.dark .glass-card:hover {
          animation: emberGlow 2.5s infinite ease-in-out !important;
          transform: translateY(-2px);
          border-color: rgba(255, 106, 0, 0.5) !important;
        }

        /* CTA shimmer sweep (Fire theme) */
        @keyframes fireShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        html.dark .btn-gaming {
          background: linear-gradient(90deg, #ff4500, #ff8c00, #ffcc00, #ff8c00, #ff4500) !important;
          background-size: 400% 100% !important;
          animation: fireShimmer 3s infinite linear !important;
          border: none !important;
          box-shadow: 0 4px 15px rgba(255, 69, 0, 0.3) !important;
          color: #ffffff !important;
        }

        /* OCEAN THEME OVERRIDES (when html:not(.dark) is set) */
        html:not(.dark) {
          --background: #00060f !important;
          --foreground: #f0f8ff !important;
          --card: rgba(0, 15, 36, 0.45) !important;
          --card-foreground: #ffffff !important;
          --primary: #00b4d8 !important;
          --border: rgba(0, 180, 216, 0.15) !important;
          --sidebar: #00040a !important;
          --sidebar-border: rgba(0, 180, 216, 0.15) !important;
          --sidebar-accent: rgba(0, 180, 216, 0.05) !important;
          --sidebar-accent-foreground: #ffffff !important;
          --muted: rgba(0, 180, 216, 0.05) !important;
          --muted-foreground: #94a3b8 !important;
          --chart-1: #00b4d8 !important;
          --chart-2: #0096c7 !important;
          --chart-3: #7fdbff !important;
          --chart-4: #0077b6 !important;
          --chart-5: #00b4d8 !important;
        }

        html:not(.dark) body {
          background-color: #00060f !important;
          background-image: radial-gradient(circle at 10% 20%, rgba(0, 180, 216, 0.05) 0%, transparent 40%),
                            radial-gradient(circle at 90% 80%, rgba(0, 119, 182, 0.05) 0%, transparent 40%) !important;
          color: #f0f8ff !important;
        }

        /* Input field visibility overrides for Ocean Theme */
        html:not(.dark) input, html:not(.dark) textarea, html:not(.dark) select, html:not(.dark) [data-slot="input"] {
          background: rgba(0, 180, 216, 0.03) !important;
          border: 1px solid rgba(0, 180, 216, 0.25) !important;
          color: #ffffff !important;
        }
        html:not(.dark) input:focus, html:not(.dark) textarea:focus, html:not(.dark) select:focus {
          border-color: rgba(127, 219, 255, 0.6) !important;
          box-shadow: 0 0 10px rgba(0, 180, 216, 0.25) !important;
        }

        /* Tic-Tac-Toe Game Grid overrides for Ocean Theme */
        html:not(.dark) .grid-cols-3 > button {
          border-color: rgba(0, 180, 216, 0.25) !important;
          background-color: rgba(0, 15, 36, 0.45) !important;
        }
        html:not(.dark) .grid-cols-3 > button:hover {
          border-color: rgba(127, 219, 255, 0.5) !important;
          background-color: rgba(0, 180, 216, 0.08) !important;
        }

        /* Border & divider visibility overrides for Ocean Theme */
        html:not(.dark) border,
        html:not(.dark) .border,
        html:not(.dark) .border-border\\/40,
        html:not(.dark) .border-border\\/30,
        html:not(.dark) .border-white\\/10 {
          border-color: rgba(0, 180, 216, 0.2) !important;
        }
        html:not(.dark) .border-b,
        html:not(.dark) .border-t,
        html:not(.dark) .border-l,
        html:not(.dark) .border-r {
          border-color: rgba(0, 180, 216, 0.15) !important;
        }

        /* Welcome banner Ocean theme adjustment */
        html:not(.dark) div:has(> #theme-banner-canvas) {
          background: linear-gradient(135deg, rgba(0, 6, 15, 0.9), rgba(0, 180, 216, 0.12), rgba(0, 6, 15, 0.9)) !important;
          border-color: rgba(0, 180, 216, 0.2) !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 180, 216, 0.05) !important;
        }

        html:not(.dark) div:has(> #theme-banner-canvas) .bg-red-600\\/10 {
          background-color: rgba(0, 180, 216, 0.15) !important;
        }
        html:not(.dark) div:has(> #theme-banner-canvas) .bg-red-800\\/5 {
          background-color: rgba(0, 119, 182, 0.1) !important;
        }

        /* Sidebar texts color fixes for Ocean Theme */
        html:not(.dark) [data-slot="sidebar-header"] span,
        html:not(.dark) [data-slot="sidebar"] span,
        html:not(.dark) [data-slot="sidebar"] svg,
        html:not(.dark) [data-slot="sidebar"] a,
        html:not(.dark) header h1 {
          color: #e2e8f0 !important;
        }

        /* Active Nav Item slow breathing glow in cyan (Ocean theme) */
        @keyframes oceanBorderBreath {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 4px rgba(0, 180, 216, 0.4); }
          50% { opacity: 1.0; box-shadow: 0 0 12px rgba(0, 180, 216, 0.8); }
        }

        html:not(.dark) .relative.px-1 > div.absolute.left-0 {
          animation: oceanBorderBreath 3s infinite ease-in-out;
          background-color: #00b4d8 !important;
        }

        html:not(.dark) [data-slot="sidebar-menu-button"][data-active="true"] {
          background-color: rgba(0, 180, 216, 0.08) !important;
          border-color: rgba(0, 180, 216, 0.15) !important;
          color: #7fdbff !important;
        }
        html:not(.dark) [data-slot="sidebar-menu-button"][data-active="true"] svg {
          color: #00b4d8 !important;
        }

        /* Inactive sidebar buttons color fixes for Ocean Theme */
        html:not(.dark) [data-slot="sidebar"] [data-slot="sidebar-menu-button"]:not([data-active="true"]) {
          color: #cbd5e1 !important;
        }
        html:not(.dark) [data-slot="sidebar"] [data-slot="sidebar-menu-button"]:not([data-active="true"]) svg {
          color: #94a3b8 !important;
        }
        html:not(.dark) [data-slot="sidebar"] [data-slot="sidebar-menu-button"]:not([data-active="true"]):hover {
          color: #ffffff !important;
          background-color: rgba(0, 180, 216, 0.08) !important;
        }
        html:not(.dark) [data-slot="sidebar"] [data-slot="sidebar-menu-button"]:not([data-active="true"]):hover svg {
          color: #7fdbff !important;
        }

        /* Stat Cards ripple pulse on hover in cyan (Ocean theme) */
        @keyframes oceanRipple {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0px rgba(0, 180, 216, 0.5);
            border-color: rgba(0, 180, 216, 0.6);
            opacity: 1;
          }
          100% {
            transform: scale(1.04);
            box-shadow: 0 0 0 12px rgba(0, 180, 216, 0);
            border-color: rgba(0, 180, 216, 0);
            opacity: 0;
          }
        }

        /* Glassmorphic custom overrides for Cards in Ocean Mode (Light theme, but dark navy base) */
        html:not(.dark) .rounded-xl.border.bg-card,
        html:not(.dark) .rounded-2xl.border.bg-card,
        html:not(.dark) .border.bg-background\\/50,
        html:not(.dark) [data-slot="card"],
        html:not(.dark) .glass-card {
          background: rgba(0, 15, 36, 0.45) !important;
          backdrop-filter: blur(16px) saturate(120%) !important;
          border: 1px solid rgba(0, 180, 216, 0.12) !important;
          border-top: 1px solid rgba(0, 180, 216, 0.22) !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;
          position: relative;
        }

        html:not(.dark) .glass-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 1.5px solid #00b4d8;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
        }

        html:not(.dark) .glass-card:hover::after {
          animation: oceanRipple 1.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
          opacity: 1;
        }

        html:not(.dark) .glass-card:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 180, 216, 0.4) !important;
        }

        /* CTA wave-shimmer sweep (Ocean theme) */
        @keyframes oceanShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        html:not(.dark) .btn-gaming {
          background: linear-gradient(90deg, #0077b6, #00b4d8, #7fdbff, #00b4d8, #0077b6) !important;
          background-size: 400% 100% !important;
          animation: oceanShimmer 3s infinite linear !important;
          border: none !important;
          box-shadow: 0 4px 15px rgba(0, 180, 216, 0.3) !important;
          color: #ffffff !important;
        }

        /* Make sure text elements have readable colors on the ocean background */
        html:not(.dark) .text-muted-foreground,
        html:not(.dark) .text-neutral-400 {
          color: #94a3b8 !important;
        }
        html:not(.dark) .text-neutral-300 {
          color: #cbd5e1 !important;
        }
        html:not(.dark) [data-slot="card"] p,
        html:not(.dark) [data-slot="card"] span {
          color: #cbd5e1 !important;
        }
      ` }} />
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