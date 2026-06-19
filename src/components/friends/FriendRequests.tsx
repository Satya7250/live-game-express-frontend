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
              className="glass-card flex flex-col gap-3 p-4 border border-border/40 hover:border-primary/20 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-11 border border-border/60">
                  <AvatarImage
                    src={request.sender.avatar}
                    alt={request.sender.name}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 text-white font-medium text-sm">
                    {request.sender.name?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-bold text-sm text-neutral-100">{request.sender.name}</p>
                  <p className="truncate text-xs text-neutral-400">
                    {request.sender.email}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    Received {formatDateTime(request.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:shrink-0">
                <Button
                  size="sm"
                  disabled={isBusy}
                  onClick={() => void onAccept?.(request._id)}
                  className="btn-gaming h-8.5 rounded-lg bg-primary font-semibold text-white px-3 border-0 shadow-sm shadow-red-900/10 gap-1.5"
                >
                  {isAccepting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isBusy}
                  onClick={() => void onReject?.(request._id)}
                  className="h-8.5 rounded-lg font-semibold bg-background/30 hover:bg-background/50 border-white/10 hover:border-red-500/40 text-neutral-200 transition-all gap-1.5"
                >
                  {isRejecting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <X className="size-3.5" />
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
