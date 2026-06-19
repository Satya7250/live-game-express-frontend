import { Crown, Hash, Users } from "lucide-react";

import {
  formatDateTime,
  formatGameType,
  formatRoomStatus,
} from "@/lib/format";
import type { Room } from "@/types/room";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RoomDetailsProps {
  room: Room;
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

export default function RoomDetails({ room }: RoomDetailsProps) {
  return (
    <Card className="glass-card bg-background/25">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">{room.name}</CardTitle>
            <CardDescription className="inline-flex items-center gap-1 font-mono tracking-widest text-neutral-400">
              <Hash className="size-3.5" />
              {room.roomCode}
            </CardDescription>
          </div>
          <Badge variant="outline" className={getStatusClass(room.status)}>
            {formatRoomStatus(room.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-sm text-neutral-400">Game Type</dt>
            <dd className="font-semibold text-white">{formatGameType(room.gameType)}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm text-neutral-400">Players</dt>
            <dd className="inline-flex items-center gap-1 font-semibold text-white">
              <Users className="size-4 text-neutral-500" />
              {room.players.length}/{room.maxPlayers}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm text-neutral-400">Owner</dt>
            <dd className="flex items-center gap-2 font-semibold text-white">
              <Avatar className="size-7 border border-border/60">
                <AvatarImage
                  src={room.owner.avatar}
                  alt={room.owner.name}
                />
                <AvatarFallback className="bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 text-white font-medium text-xs">
                  {room.owner.name?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <span>{room.owner.name}</span>
              <Crown className="size-3.5 text-amber-400" />
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm text-neutral-400">Created</dt>
            <dd className="font-semibold text-white">{formatDateTime(room.createdAt)}</dd>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <dt className="text-sm text-neutral-400">Last Updated</dt>
            <dd className="font-semibold text-white">{formatDateTime(room.updatedAt)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
