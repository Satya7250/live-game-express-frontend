import Link from "next/link";
import { Crown, Users } from "lucide-react";

import { formatDateTime, formatGameType, formatRoomStatus } from "@/lib/format";
import type { Room } from "@/types/room";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RoomCardProps {
  room: Room;
  currentUserId?: string;
}

function getStatusClass(status: Room["status"]) {
  switch (status) {
    case "waiting":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "playing":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]";
    case "finished":
      return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
    default:
      return "";
  }
}

export default function RoomCard({ room, currentUserId }: RoomCardProps) {
  const isOwner = currentUserId === room.owner._id;

  return (
    <Link href={`/dashboard/rooms/${room.roomCode}`} className="block h-full">
      <Card className="glass-card h-full border border-border/40">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="line-clamp-1 text-base font-bold text-white">{room.name}</CardTitle>
            <Badge variant="outline" className={getStatusClass(room.status)}>
              {formatRoomStatus(room.status)}
            </Badge>
          </div>
          <CardDescription className="font-mono text-xs tracking-widest text-neutral-400">
            {room.roomCode}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-2 text-neutral-400 text-xs">
            <span className="text-white font-medium">{formatGameType(room.gameType)}</span>
            <span aria-hidden="true" className="opacity-40">•</span>
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5 text-neutral-500" />
              {room.players.length}/{room.maxPlayers}
            </span>
            {isOwner && (
              <>
                <span aria-hidden="true" className="opacity-40">•</span>
                <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                  <Crown className="size-3.5 text-amber-400" />
                  Owner
                </span>
              </>
            )}
          </div>
          <p className="text-[10px] text-neutral-500">
            Created {formatDateTime(room.createdAt)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
