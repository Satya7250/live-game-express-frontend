"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Users, Gamepad2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyRooms } from "@/services/room.service";
import { formatRoomStatus, formatGameType } from "@/lib/format";
import type { Room } from "@/types/room";

export function ActiveRoomsWidget() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveRooms = async () => {
      try {
        setLoading(true);
        const response = await getMyRooms({ page: 1, limit: 10 });
        if (response.success && response.data) {
          // Show only open / joinable / playing rooms
          const active = response.data.rooms.filter(
            (room) => room.status === "waiting" || room.status === "playing"
          );
          setRooms(active.slice(0, 5)); // Show top 5
        }
      } catch (error) {
        console.error("Failed to load active rooms lobby:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveRooms();
  }, []);

  if (loading) {
    return (
      <Card className="glass-card border-border/40 hover:transform-none hover:shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40 bg-muted/60" />
          <Skeleton className="h-4 w-56 bg-muted/60 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-5 w-48 bg-muted/60" />
                <Skeleton className="h-3.5 w-32 bg-muted/60" />
              </div>
              <Skeleton className="h-7 w-16 rounded-lg bg-muted/60" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:transform-none hover:shadow-lg bg-background/30 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg font-bold text-white">Active Game Rooms</CardTitle>
          <CardDescription className="text-neutral-400">Join a room to play right now</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1 px-2.5 h-8 font-semibold text-neutral-300 hover:text-white hover:bg-muted/40 rounded-lg transition-colors">
          <Link href="/dashboard/rooms">
            Lobby
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-2">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-xl border-border/50 bg-muted/5">
            <Gamepad2 className="size-8 text-neutral-500 mb-2" />
            <p className="text-sm font-bold text-neutral-200">No active rooms found</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-[240px] leading-relaxed">
              Create a new room in the lobby and invite your friends to start playing.
            </p>
            <Button asChild size="sm" className="btn-gaming mt-4 gap-1.5 h-9 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl border-0 shadow-sm">
              <Link href="/dashboard/rooms">
                <Play className="size-3.5 fill-current" />
                Open Lobby
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="flex items-center justify-between border-b border-border/20 pb-3 last:border-0 last:pb-0 hover:bg-muted/5 p-1 rounded-lg transition-colors duration-150"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-200">{room.name}</span>
                    <Badge variant={room.status === "playing" ? "default" : "secondary"} className={`h-5 text-[10px] px-1.5 font-bold ${
                      room.status === "playing" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-red-500/10 text-primary border border-red-500/20"
                    }`}>
                      {formatRoomStatus(room.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                    <span>{formatGameType(room.gameType)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3 text-neutral-500" />
                      {room.players.length}/{room.maxPlayers}
                    </span>
                    <span>•</span>
                    <span className="font-mono tracking-wider text-[10px] bg-muted/40 px-1 py-0.5 rounded">{room.roomCode}</span>
                  </div>
                </div>
                <Button asChild size="xs" variant={room.status === "playing" ? "outline" : "default"} className={`h-8 font-semibold rounded-lg ${
                  room.status === "playing"
                    ? "border-white/10 text-neutral-300 hover:text-white hover:bg-muted/40"
                    : "btn-gaming bg-primary text-white border-0"
                }`}>
                  <Link href={`/dashboard/rooms/${room.roomCode}`}>
                    {room.status === "playing" ? "Watch" : "Join"}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
