"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect } from "react";
import { ArrowLeft, Gamepad2, Play, RefreshCw } from "lucide-react";

import ConnectionStatus from "@/components/game/ConnectionStatus";
import JoinRoomForm from "@/components/rooms/JoinRoomForm";
import LeaveRoomButton from "@/components/rooms/LeaveRoomButton";
import RoomDetails from "@/components/rooms/RoomDetails";
import RoomMembers from "@/components/rooms/RoomMembers";
import { useRoom } from "@/hooks/useRoom";
import { useRoomSocket } from "@/hooks/useRoomSocket";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RoomDetailsPageProps {
  params: Promise<{ roomCode: string }>;
}

function RoomDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function RoomDetailsPage({ params }: RoomDetailsPageProps) {
  const { roomCode } = use(params);
  const router = useRouter();
  const currentUserId = useAuthStore((state) => state.user?._id);
  const { status: socketStatus, connect: reconnectSocket } = useSocket();

  const {
    room: fetchedRoom,
    loading,
    error,
    actionLoading,
    fetchRoom,
    leaveRoom: leaveRoomApi,
  } = useRoom(roomCode);

  const handleRoomDeleted = useCallback(() => {
    router.push("/dashboard/rooms");
  }, [router]);

  const isMemberPreview = fetchedRoom?.players.some(
    (player) => player._id === currentUserId
  );

  const {
    room: liveRoom,
    starting,
    startRoom,
    leaveRoom: leaveRoomSocket,
  } = useRoomSocket({
    roomCode,
    initialRoom: fetchedRoom,
    isMember: Boolean(isMemberPreview),
    autoJoin: true,
    onRoomDeleted: handleRoomDeleted,
  });

  const resolvedRoom = liveRoom ?? fetchedRoom;

  // Auto-redirect to game page when room is playing
  useEffect(() => {
    if (
      resolvedRoom &&
      resolvedRoom.status === "playing" &&
      resolvedRoom.gameType === "tic-tac-toe" &&
      isMemberPreview
    ) {
      router.push(`/dashboard/rooms/${roomCode}/game`);
    }
  }, [resolvedRoom, roomCode, router, isMemberPreview]);

  const handleLeave = useCallback(async () => {
    await leaveRoomSocket();
    return leaveRoomApi();
  }, [leaveRoomApi, leaveRoomSocket]);

  if (loading && !resolvedRoom) {
    return <RoomDetailsSkeleton />;
  }

  if (error || !resolvedRoom) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Unable to load room</CardTitle>
          <CardDescription>
            {error || "Room data is unavailable."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => void fetchRoom()} className="gap-2">
            <RefreshCw className="size-4" />
            Try Again
          </Button>
          <Button asChild variant="secondary">
            <Link href="/dashboard/rooms">Back to Rooms</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const room = resolvedRoom;

  const isMember = room.players.some(
    (player) => player._id === currentUserId
  );
  const isOwner = room.owner._id === currentUserId;
  const canStartRoom =
    isOwner && room.status === "waiting" && room.players.length >= 2;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="secondary" className="h-9 font-semibold bg-background/30 hover:bg-background/50 border border-white/10 hover:border-red-500/40 text-neutral-200 transition-all gap-2 w-full sm:w-auto">
            <Link href="/dashboard/rooms">
              <ArrowLeft className="size-4" />
              Back to Rooms
            </Link>
          </Button>
          <ConnectionStatus status={socketStatus} onReconnect={() => void reconnectSocket()} />
        </div>

        {isMember && (
          <LeaveRoomButton
            roomCode={room.roomCode}
            roomName={room.name}
            onLeave={handleLeave}
          />
        )}
      </div>

      <RoomDetails room={room} />
      <div className="mt-4">
        <RoomMembers room={room} />
      </div>

      {isMember && canStartRoom && (
        <Card className="glass-card bg-background/25">
          <CardHeader>
            <CardTitle className="text-white font-bold">Ready to play?</CardTitle>
            <CardDescription className="text-neutral-400">
              Start the room when all players have joined. Everyone will be
              notified in real time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => void startRoom()}
              disabled={starting || actionLoading}
              className="btn-gaming bg-primary hover:bg-primary/95 text-white font-semibold shadow-md shadow-red-900/10 gap-2 border-0 h-9.5"
            >
              <Play className="size-4" />
              {starting ? "Starting..." : "Start Game"}
            </Button>
          </CardContent>
        </Card>
      )}

      {isMember && room.status === "playing" && room.gameType === "tic-tac-toe" && (
        <Card className="glass-card border-violet-500/30 hover:border-violet-500/50 bg-violet-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-bold">
              <Gamepad2 className="size-5 text-violet-400" />
              Game in progress
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Enter the game board to play Tic-Tac-Toe with other room members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="btn-gaming bg-primary hover:bg-primary/95 text-white font-semibold shadow-md shadow-red-900/10 gap-2 border-0 h-9.5">
              <Link href={`/dashboard/rooms/${room.roomCode}/game`}>
                <Gamepad2 className="size-4" />
                Enter Game
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!isMember && room.status === "waiting" && (
        <JoinRoomForm
          defaultRoomCode={room.roomCode}
          onJoined={() => void fetchRoom()}
        />
      )}

      {!isMember && room.status !== "waiting" && (
        <Card className="glass-card border-dashed border-white/10 bg-background/25">
          <CardHeader>
            <CardTitle className="text-white font-bold">Cannot join this room</CardTitle>
            <CardDescription className="text-neutral-400">
              This room is {room.status} and is not accepting new players.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {isMember && room.status === "waiting" && actionLoading && (
        <p className="text-sm text-neutral-400 animate-pulse">Updating room...</p>
      )}
    </div>
  );
}
