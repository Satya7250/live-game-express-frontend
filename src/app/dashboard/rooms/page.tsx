"use client";

import Link from "next/link";
import { Gamepad2, Grid3X3, Plus, RefreshCw } from "lucide-react";

import JoinRoomForm from "@/components/rooms/JoinRoomForm";
import RoomList from "@/components/rooms/RoomList";
import { useRooms } from "@/hooks/useRooms";
import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function RoomsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <Skeleton className="h-40 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function RoomsPage() {
  const { rooms, pagination, loading, error, fetchRooms } = useRooms();
  const { isConnected } = useSocket();

  useEffect(() => {
    if (isConnected) {
      void fetchRooms();
    }
  }, [isConnected, fetchRooms]);

  if (loading) {
    return <RoomsSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Unable to load rooms</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => void fetchRooms()} className="gap-2">
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
            <Gamepad2 className="size-7" />
            Rooms
          </h1>
          <p className="text-muted-foreground">
            Create or join game rooms to play with friends
            {pagination ? ` (${pagination.total} total)` : ""}
          </p>
        </div>
        <Button asChild className="btn-gaming bg-primary hover:bg-primary/95 text-white font-semibold shadow-md shadow-red-900/10 w-full gap-2 sm:w-auto border-0">
          <Link href="/dashboard/rooms/create">
            <Plus className="size-4" />
            Create Room
          </Link>
        </Button>
      </div>

      <Card className="glass-card border-dashed border-white/10 hover:border-red-500/20 hover:transform-none bg-background/25 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white font-bold">
            <Grid3X3 className="size-5 text-primary" />
            Play offline
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Two players on the same device — no room code or internet needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="secondary" className="h-9 font-semibold bg-background/30 hover:bg-background/50 border border-white/10 hover:border-red-500/40 text-neutral-200 transition-all gap-2">
            <Link href="/dashboard/games/tic-tac-toe">
              <Grid3X3 className="size-4" />
              Local Tic-Tac-Toe
            </Link>
          </Button>
        </CardContent>
      </Card>

      <JoinRoomForm onJoined={() => void fetchRooms()} />

      {rooms.length === 0 ? (
        <Card className="glass-card border-dashed border-white/10 hover:transform-none bg-background/25">
          <CardHeader className="text-center">
            <CardTitle className="text-white font-bold">No rooms yet</CardTitle>
            <CardDescription className="text-neutral-400">
              Create your first room or join one using a room code above.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button asChild className="btn-gaming bg-primary hover:bg-primary/95 text-white font-semibold shadow-md shadow-red-900/10 gap-2 border-0">
              <Link href="/dashboard/rooms/create">
                <Plus className="size-4" />
                Create Your First Room
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <RoomList rooms={rooms} />
      )}
    </div>
  );
}
