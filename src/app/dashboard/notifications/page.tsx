"use client";

import { useEffect, useState } from "react";
import { Bell, CheckSquare, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useNotificationStore } from "@/store/notification.store";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    page,
    totalPages,
    fetchNotifications,
    markAllAsRead,
  } = useNotificationStore();

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    // Initial fetch on mount
    void fetchNotifications(1, 20);
  }, [fetchNotifications]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchNotifications(1, 20);
      toast.success("Notifications refreshed");
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      toast.success("All marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleLoadMore = async () => {
    if (page >= totalPages || loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchNotifications(page + 1, 20, true);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Stay up to date with your friend requests, game invites, and status updates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarkAllRead}
              className="gap-1.5 h-9"
            >
              <CheckSquare className="size-4" />
              Mark all as read
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="gap-1.5 h-9"
          >
            <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Stream Area */}
      <div className="space-y-4">
        {loading && notifications.length === 0 ? (
          // Loading Skeleton state
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border/60">
                <CardContent className="flex items-start gap-4 p-4">
                  <Skeleton className="size-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4.5 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl bg-muted/10 border-border/60">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 mb-4 border">
              <Bell className="size-6 text-muted-foreground/80" />
            </div>
            <h3 className="font-semibold text-lg">No notifications yet</h3>
            <p className="text-sm text-muted-foreground max-w-[320px] mt-1">
              Any alerts about friend requests, room activities, or game updates will show up here.
            </p>
          </div>
        ) : (
          // Notifications List
          <div className="flex flex-col gap-3">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
              />
            ))}
          </div>
        )}

        {/* Pagination Trigger */}
        {page < totalPages && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              disabled={loadingMore}
              onClick={handleLoadMore}
              className="gap-1.5 h-10 w-full sm:w-auto px-6 font-semibold"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Loading more...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
