"use client";

import { memo } from "react";
import { Check, Inbox, Loader2, X } from "lucide-react";

import { formatDateTime } from "@/lib/format";
import type { IncomingFriendRequest } from "@/types/friend";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FriendRequestsProps {
  requests: IncomingFriendRequest[];
  acceptingId?: string | null;
  rejectingId?: string | null;
  onAccept?: (requestId: string) => Promise<unknown>;
  onReject?: (requestId: string) => Promise<unknown>;
}

function FriendRequestsComponent({
  requests,
  acceptingId = null,
  rejectingId = null,
  onAccept,
  onReject,
}: FriendRequestsProps) {
  if (requests.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Inbox className="size-5" />
            No incoming requests
          </CardTitle>
          <CardDescription>
            Friend requests from other players will appear here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incoming Requests</CardTitle>
        <CardDescription>
          {requests.length} pending request{requests.length === 1 ? "" : "s"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {requests.map((request) => {
          const isAccepting = acceptingId === request._id;
          const isRejecting = rejectingId === request._id;
          const isBusy = isAccepting || isRejecting;

          return (
            <div
              key={request._id}
              className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-12 border">
                  <AvatarImage
                    src={request.sender.avatar}
                    alt={request.sender.name}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-violet-600 to-pink-500 text-white">
                    {request.sender.name?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{request.sender.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {request.sender.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Received {formatDateTime(request.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:shrink-0">
                <Button
                  size="sm"
                  className="gap-1.5"
                  disabled={isBusy}
                  onClick={() => void onAccept?.(request._id)}
                >
                  {isAccepting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="gap-1.5"
                  disabled={isBusy}
                  onClick={() => void onReject?.(request._id)}
                >
                  {isRejecting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <X className="size-4" />
                  )}
                  Reject
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

const FriendRequests = memo(FriendRequestsComponent);

export default FriendRequests;
