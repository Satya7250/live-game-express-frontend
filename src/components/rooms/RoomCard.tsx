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

export default function RoomCard({ room, currentUserId }: RoomCardProps) {
  const isOwner = currentUserId === room.owner._id;

  return (
    <Link href={`/dashboard/rooms/${room.roomCode}`} className="block h-full">
      <Card className="h-full transition-colors hover:border-primary/40">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="line-clamp-1 text-lg">{room.name}</CardTitle>
            <Badge variant={getStatusVariant(room.status)}>
              {formatRoomStatus(room.status)}
            </Badge>
          </div>
          <CardDescription className="font-mono tracking-widest">
            {room.roomCode}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <span>{formatGameType(room.gameType)}</span>
            <span aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" />
              {room.players.length}/{room.maxPlayers}
            </span>
            {isOwner && (
              <>
                <span aria-hidden="true">•</span>
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Crown className="size-3.5" />
                  Owner
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Created {formatDateTime(room.createdAt)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
