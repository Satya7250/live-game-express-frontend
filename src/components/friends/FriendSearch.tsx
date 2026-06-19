"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";

import {
  sendFriendRequestSchema,
  type SendFriendRequestFormData,
} from "@/schemas/friend.schema";
import type { SendFriendRequestDto } from "@/types/friend";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FriendSearchProps {
  sending?: boolean;
  onSendRequest?: (payload: SendFriendRequestDto) => Promise<unknown>;
}

export default function FriendSearch({
  sending = false,
  onSendRequest,
}: FriendSearchProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendFriendRequestFormData>({
    resolver: zodResolver(sendFriendRequestSchema),
    defaultValues: {
      receiverId: "",
    },
  });

  const onSubmit = async (data: SendFriendRequestFormData) => {
    if (!onSendRequest) {
      return;
    }

    await onSendRequest({ receiverId: data.receiverId });
    reset();
    setSubmitted(true);
  };

  return (
    <Card className="glass-card border-border/40 hover:transform-none hover:shadow-lg bg-background/30 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white font-bold">
          <UserPlus className="size-5 text-primary" />
          Add Friend
        </CardTitle>
        <CardDescription className="text-neutral-400 text-sm mt-1">
          Enter a user&apos;s 24-character ID to send a friend request. You can
          find your own ID on your profile page.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receiver-id" className="text-neutral-300 font-medium">User ID</Label>
            <Input
              id="receiver-id"
              placeholder="e.g. 507f1f77bcf86cd799439011"
              disabled={sending}
              className="font-mono h-10 border-white/10 bg-background/30 focus-visible:ring-primary/20"
              maxLength={24}
              {...register("receiverId")}
            />
            {errors.receiverId && (
              <p className="text-sm text-destructive">
                {errors.receiverId.message}
              </p>
            )}
          </div>

          {submitted && !errors.receiverId && (
            <p className="text-sm text-emerald-400 font-medium">
              Request sent. Check the Sent tab for status.
            </p>
          )}

          <Button type="submit" disabled={sending} className="btn-gaming h-9.5 rounded-lg bg-primary text-white font-semibold px-4 border-0 shadow-md shadow-red-900/10 gap-2">
            {sending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UserPlus className="size-4" />
            )}
            {sending ? "Sending..." : "Send Friend Request"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
