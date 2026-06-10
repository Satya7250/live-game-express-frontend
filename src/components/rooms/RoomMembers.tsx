import { Crown } from "lucide-react";

import type { Room, RoomPlayer } from "@/types/room";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RoomMembersProps {
  room: Room;
}

function MemberItem({
  player,
  isOwner,
}: {
  player: RoomPlayer;
  isOwner: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-10 border">
          <AvatarImage src={player.avatar} alt={player.name} />
          <AvatarFallback className="bg-gradient-to-r from-violet-600 to-pink-500 text-white">
            {player.name?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium">{player.name}</p>
          {isOwner && (
            <p className="text-xs text-muted-foreground">Room owner</p>
          )}
        </div>
      </div>
      {isOwner && (
        <Badge variant="secondary" className="gap-1 shrink-0">
          <Crown className="size-3" />
          Owner
        </Badge>
      )}
    </div>
  );
}

export default function RoomMembers({ room }: RoomMembersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Players</CardTitle>
        <CardDescription>
          {room.players.length} of {room.maxPlayers} players joined
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {room.players.map((player) => (
          <MemberItem
            key={player._id}
            player={player}
            isOwner={player._id === room.owner._id}
          />
        ))}
      </CardContent>
    </Card>
  );
}
