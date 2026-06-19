import { create } from "zustand";
import * as notificationService from "@/services/notification.service";
import type { Notification } from "@/types/notification";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  page: number;
  totalPages: number;
  
  fetchUnreadCount: () => Promise<number>;
  fetchNotifications: (page?: number, limit?: number, append?: boolean) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  
  // Real-time socket actions
  addNotification: (notification: Notification) => void;
  setNotificationRead: (notification: Notification) => void;
  setAllRead: () => void;
  removeNotification: (notificationId: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  page: 1,
  totalPages: 1,

  fetchUnreadCount: async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success && response.data) {
        set({ unreadCount: response.data.count });
        return response.data.count;
      }
      return 0;
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      return 0;
    }
  },

  fetchNotifications: async (page = 1, limit = 20, append = false) => {
    set({ loading: true });
    try {
      const response = await notificationService.getNotifications(page, limit);
      if (response.success && response.data) {
        set((state) => ({
          notifications: append
            ? [...state.notifications, ...response.data.notifications]
            : response.data.notifications,
          page: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        set((state) => {
          const updated = state.notifications.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          );
          const wasUnread = state.notifications.find((n) => n._id === notificationId && !n.isRead);
          return {
            notifications: updated,
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          };
        });
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        }));
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const response = await notificationService.deleteNotification(notificationId);
      if (response.success) {
        set((state) => {
          const wasUnread = state.notifications.find((n) => n._id === notificationId && !n.isRead);
          return {
            notifications: state.notifications.filter((n) => n._id !== notificationId),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          };
        });
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  },

  // Socket updates
  addNotification: (notification) => {
    set((state) => {
      // Avoid duplicate listing
      if (state.notifications.some((n) => n._id === notification._id)) {
        return {};
      }
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    });
  },

  setNotificationRead: (notification) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n._id === notification._id ? { ...n, isRead: true } : n
      );
      const wasUnread = state.notifications.find((n) => n._id === notification._id && !n.isRead);
      return {
        notifications: updated,
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
  },

  setAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (notificationId) => {
    set((state) => {
      const wasUnread = state.notifications.find((n) => n._id === notificationId && !n.isRead);
      return {
        notifications: state.notifications.filter((n) => n._id !== notificationId),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
  },
}));
