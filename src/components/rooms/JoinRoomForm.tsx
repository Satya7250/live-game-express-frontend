"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  joinRoomSchema,
  type JoinRoomFormData,
} from "@/schemas/join-room.schema";
import { getApiErrorMessage } from "@/lib/api-error";
import * as roomService from "@/services/room.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JoinRoomFormProps {
  defaultRoomCode?: string;
  onJoined?: () => void;
}

export default function JoinRoomForm({
  defaultRoomCode = "",
  onJoined,
}: JoinRoomFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinRoomFormData>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      roomCode: defaultRoomCode.toUpperCase(),
    },
  });

  const onSubmit = async (data: JoinRoomFormData) => {
    try {
      setLoading(true);

      const response = await roomService.joinRoom(data);

      if (response.success && response.data) {
        toast.success(response.message || "Joined room successfully");
        onJoined?.();
        router.push(`/dashboard/rooms/${response.data.roomCode}`);
        return;
      }

      throw new Error(response.message || "Failed to join room");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to join room"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card bg-background/25 hover:transform-none">
      <CardHeader>
        <CardTitle className="text-white font-bold">Join a Room</CardTitle>
        <CardDescription className="text-neutral-400">
          Enter a 6-character room code to join an existing game room
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-code" className="text-neutral-300 font-medium">Room Code</Label>
            <Input
              id="room-code"
              placeholder="ABC123"
              disabled={loading}
              className="font-mono uppercase tracking-widest border-white/10 bg-background/30 focus-visible:ring-primary/20"
              maxLength={6}
              {...register("roomCode")}
            />
            {errors.roomCode && (
              <p className="text-sm text-destructive">
                {errors.roomCode.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="btn-gaming bg-primary hover:bg-primary/95 text-white font-semibold shadow-md shadow-red-900/10 w-full sm:w-auto border-0 h-9.5">
            {loading ? "Joining room..." : "Join Room"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
