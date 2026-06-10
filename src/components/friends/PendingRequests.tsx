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
              className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-12 border">
                  <AvatarImage
                    src={request.receiver.avatar}
                    alt={request.receiver.name}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-violet-600 to-pink-500 text-white">
                    {request.receiver.name?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {request.receiver.name}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {request.receiver.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sent {formatDateTime(request.createdAt)}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 sm:shrink-0"
                disabled={isCanceling}
                onClick={() => void onCancel?.(request._id)}
              >
                {isCanceling ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <X className="size-4" />
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
