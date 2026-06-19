"use client";

import { memo } from "react";
import { Clock, Loader2, X } from "lucide-react";

import { formatDateTime } from "@/lib/format";
import type { SentFriendRequest } from "@/types/friend";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PendingRequestsProps {
  requests: SentFriendRequest[];
  cancelingId?: string | null;
  onCancel?: (requestId: string) => Promise<unknown>;
}

function PendingRequestsComponent({
  requests,
  cancelingId = null,
  onCancel,
}: PendingRequestsProps) {
  if (requests.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Clock className="size-5" />
            No pending requests
          </CardTitle>
          <CardDescription>
            Requests you send will appear here until they are accepted or
            canceled.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sent Requests</CardTitle>
        <CardDescription>
          {requests.length} request{requests.length === 1 ? "" : "s"} awaiting
          response
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {requests.map((request) => {
          const isCanceling = cancelingId === request._id;

          return (
            <div
              key={request._id}
              className="glass-card flex flex-col gap-3 p-4 border border-border/40 hover:border-primary/20 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-11 border border-border/60">
                  <AvatarImage
                    src={request.receiver.avatar}
                    alt={request.receiver.name}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 text-white font-medium text-sm">
                    {request.receiver.name?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-bold text-sm text-neutral-100">
                    {request.receiver.name}
                  </p>
                  <p className="truncate text-xs text-neutral-400">
                    {request.receiver.email}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    Sent {formatDateTime(request.createdAt)}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="secondary"
                className="h-8.5 rounded-lg font-semibold bg-background/30 hover:bg-background/50 border-white/10 hover:border-red-500/40 text-neutral-200 transition-all gap-1.5 sm:shrink-0"
                disabled={isCanceling}
                onClick={() => void onCancel?.(request._id)}
              >
                {isCanceling ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <X className="size-3.5" />
                )}
                Cancel
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

const PendingRequests = memo(PendingRequestsComponent);

export default PendingRequests;
