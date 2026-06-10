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

function getStatusVariant(
  status: Room["status"]
): "default" | "secondary" | "outline" {
  switch (status) {
    case "waiting":
      return "secondary";
    case "playing":
      return "default";
    case "finished":
      return "outline";
    default:
      return "outline";
  }
}

export default function RoomDetails({ room }: RoomDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{room.name}</CardTitle>
            <CardDescription className="inline-flex items-center gap-1 font-mono tracking-widest">
              <Hash className="size-3.5" />
              {room.roomCode}
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(room.status)}>
            {formatRoomStatus(room.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-sm text-muted-foreground">Game Type</dt>
            <dd className="font-medium">{formatGameType(room.gameType)}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm text-muted-foreground">Players</dt>
            <dd className="inline-flex items-center gap-1 font-medium">
              <Users className="size-4 text-muted-foreground" />
              {room.players.length}/{room.maxPlayers}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm text-muted-foreground">Owner</dt>
            <dd className="flex items-center gap-2 font-medium">
              <Avatar className="size-7 border">
                <AvatarImage
                  src={room.owner.avatar}
                  alt={room.owner.name}
                />
                <AvatarFallback className="text-xs">
                  {room.owner.name?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <span>{room.owner.name}</span>
              <Crown className="size-3.5 text-amber-600 dark:text-amber-400" />
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm text-muted-foreground">Created</dt>
            <dd className="font-medium">{formatDateTime(room.createdAt)}</dd>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <dt className="text-sm text-muted-foreground">Last Updated</dt>
            <dd className="font-medium">{formatDateTime(room.updatedAt)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
