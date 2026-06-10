"use client";

import { RefreshCw, Users } from "lucide-react";

import FriendRequests from "@/components/friends/FriendRequests";
import FriendSearch from "@/components/friends/FriendSearch";
import FriendsList from "@/components/friends/FriendsList";
import PendingRequests from "@/components/friends/PendingRequests";
import { useFriends } from "@/hooks/useFriends";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function FriendsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
      <Skeleton className="h-10 w-full max-w-xl" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function FriendsPage() {
  const {
    friends,
    incomingRequests,
    sentRequests,
    loading,
    error,
    actionState,
    isActionLoading,
    refreshAll,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    removeFriend,
  } = useFriends();

  const acceptingId =
    actionState?.type === "accept" ? (actionState.id ?? null) : null;
  const rejectingId =
    actionState?.type === "reject" ? (actionState.id ?? null) : null;
  const cancelingId =
    actionState?.type === "cancel" ? (actionState.id ?? null) : null;
  const removingFriendId =
    actionState?.type === "remove" ? (actionState.id ?? null) : null;

  if (loading) {
    return <FriendsPageSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Unable to load friends</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => void refreshAll()} className="gap-2">
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Users className="size-7" />
            Friends
          </h1>
          <p className="text-muted-foreground">
            Manage your friends and friend requests
          </p>
        </div>
        <Button
          variant="secondary"
          className="w-full gap-2 sm:w-auto"
          disabled={isActionLoading("refresh")}
          onClick={() => void refreshAll()}
        >
          <RefreshCw
            className={`size-4 ${isActionLoading("refresh") ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="friends" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:max-w-2xl sm:grid-cols-4">
          <TabsTrigger value="friends" className="gap-2">
            Friends
            {friends.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {friends.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="incoming" className="gap-2">
            Incoming
            {incomingRequests.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {incomingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-2">
            Sent
            {sentRequests.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {sentRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="add">Add Friend</TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <FriendsList
            friends={friends}
            removingFriendId={removingFriendId ?? null}
            onRemoveFriend={removeFriend}
          />
        </TabsContent>

        <TabsContent value="incoming">
          <FriendRequests
            requests={incomingRequests}
            acceptingId={acceptingId}
            rejectingId={rejectingId ?? null}
            onAccept={acceptRequest}
            onReject={rejectRequest}
          />
        </TabsContent>

        <TabsContent value="sent">
          <PendingRequests
            requests={sentRequests}
            cancelingId={cancelingId ?? null}
            onCancel={cancelRequest}
          />
        </TabsContent>

        <TabsContent value="add">
          <FriendSearch
            sending={isActionLoading("send")}
            onSendRequest={sendRequest}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
