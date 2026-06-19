import api from "@/lib/axios";
import type {
  DeleteNotificationResponse,
  GetNotificationsResponse,
  MarkAllReadResponse,
  MarkReadResponse,
  UnreadCountResponse,
} from "@/types/notification";

export const getNotifications = async (
  page = 1,
  limit = 20
): Promise<GetNotificationsResponse> => {
  const { data } = await api.get<GetNotificationsResponse>("/notifications", {
    params: { page, limit },
  });
  return data;
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const { data } = await api.get<UnreadCountResponse>("/notifications/unread-count");
  return data;
};

export const markAsRead = async (
  notificationId: string
): Promise<MarkReadResponse> => {
  const { data } = await api.patch<MarkReadResponse>(
    `/notifications/read/${encodeURIComponent(notificationId)}`
  );
  return data;
};

export const markAllAsRead = async (): Promise<MarkAllReadResponse> => {
  const { data } = await api.patch<MarkAllReadResponse>("/notifications/read-all");
  return data;
};

export const deleteNotification = async (
  notificationId: string
): Promise<DeleteNotificationResponse> => {
  const { data } = await api.delete<DeleteNotificationResponse>(
    `/notifications/${encodeURIComponent(notificationId)}`
  );
  return data;
};
