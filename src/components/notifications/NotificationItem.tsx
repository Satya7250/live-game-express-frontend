"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Bell, 
  Check, 
  Gamepad2, 
  Trash2, 
  UserPlus, 
  X, 
  Loader2, 
  Info 
} from "lucide-react";
import { toast } from "sonner";

import { useNotificationStore } from "@/store/notification.store";
import { useFriends } from "@/hooks/useFriends";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Notification } from "@/types/notification";

interface NotificationItemProps {
  notification: Notification;
}

// Simple time-ago fallback since we don't know if date-fns is installed
function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return "";
  }
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead, deleteNotification } = useNotificationStore();
  const { acceptRequest, rejectRequest } = useFriends();
  
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleMarkRead = async () => {
    if (notification.isRead) return;
    await markAsRead(notification._id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteLoading(true);
    try {
      await deleteNotification(notification._id);
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAcceptFriend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const requestId = notification.data?.requestId as string;
    if (!requestId) return;

    setActionLoading(true);
    try {
      await acceptRequest(requestId);
      // Mark notification as read upon action
      await markAsRead(notification._id);
    } catch {
      // Errors are toasted in the useFriends hook
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectFriend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const requestId = notification.data?.requestId as string;
    if (!requestId) return;

    setActionLoading(true);
    try {
      await rejectRequest(requestId);
      // Mark notification as read upon action
      await markAsRead(notification._id);
    } catch {
      // Errors are toasted in the useFriends hook
    } finally {
      setActionLoading(false);
    }
  };

  // Icon type mapping
  const getIcon = () => {
    switch (notification.type) {
      case "FRIEND_REQUEST":
        return <UserPlus className="size-4 text-violet-500" />;
      case "GAME_INVITE":
        return <Gamepad2 className="size-4 text-pink-500" />;
      default:
        return <Info className="size-4 text-sky-500" />;
    }
  };

  return (
    <div
      onClick={handleMarkRead}
      className={`group relative flex items-start gap-4 rounded-xl border p-4 transition-all hover:bg-muted/30 cursor-pointer ${
        notification.isRead 
          ? "border-border bg-background/50 text-muted-foreground" 
          : "border-primary/20 bg-primary/5 text-foreground ring-1 ring-primary/5"
      }`}
    >
      {/* Icon Badge */}
      <div className="relative shrink-0 mt-0.5">
        <Avatar className="size-10 border">
          <AvatarImage src={notification.sender?.avatar} alt={notification.sender?.name} />
          <AvatarFallback className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium text-xs">
            {notification.sender?.name?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-background border shadow-sm">
          {getIcon()}
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 pr-8 space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm truncate">{notification.title}</h4>
          {!notification.isRead && (
            <span className="size-2 rounded-full bg-destructive shrink-0" />
          )}
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {notification.message}
        </p>

        {/* Time and Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(notification.createdAt)}
          </span>

          {/* Type-Specific Action Panels */}
          {!notification.isRead && notification.type === "FRIEND_REQUEST" && (
            <div className="flex items-center gap-2">
              <Button
                size="xs"
                variant="default"
                disabled={actionLoading}
                onClick={handleAcceptFriend}
                className="h-7 gap-1 px-2.5 font-medium"
              >
                {actionLoading ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Check className="size-3" />
                )}
                Accept
              </Button>
              <Button
                size="xs"
                variant="outline"
                disabled={actionLoading}
                onClick={handleRejectFriend}
                className="h-7 gap-1 px-2.5 font-medium hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="size-3" />
                Ignore
              </Button>
            </div>
          )}

          {notification.type === "GAME_INVITE" && notification.data?.roomCode && (
            <Button
              asChild
              size="xs"
              variant="default"
              className="h-7 gap-1 px-2.5 font-medium bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 border-0"
            >
              <Link href={`/dashboard/rooms/${notification.data.roomCode}`}>
                <Gamepad2 className="size-3" />
                Join Lobby
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Delete Trigger */}
      <Button
        size="icon"
        variant="ghost"
        disabled={deleteLoading}
        onClick={handleDelete}
        className="absolute top-3 right-3 size-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
      >
        {deleteLoading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Trash2 className="size-3.5" />
        )}
      </Button>
    </div>
  );
}
