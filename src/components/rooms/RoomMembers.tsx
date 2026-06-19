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
    <div className="glass-card flex items-center justify-between gap-3 p-3 border border-border/40 hover:border-primary/20 transition-all hover:transform-none hover:shadow-none bg-background/10">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-10 border border-border/60">
          <AvatarImage src={player.avatar} alt={player.name} />
          <AvatarFallback className="bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 text-white font-medium text-sm">
            {player.name?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-bold text-sm text-neutral-100">{player.name}</p>
          {isOwner && (
            <p className="text-[10px] text-neutral-400 font-medium">Room owner</p>
          )}
        </div>
      </div>
      {isOwner && (
        <Badge variant="secondary" className="badge-gaming gap-1 shrink-0 bg-amber-500/10 text-amber-500 border-amber-500/20">
          <Crown className="size-3 text-amber-500" />
          Owner
        </Badge>
      )}
    </div>
  );
}

export default function RoomMembers({ room }: RoomMembersProps) {
  return (
    <Card className="glass-card bg-background/25">
      <CardHeader>
        <CardTitle className="text-white font-bold">Players</CardTitle>
        <CardDescription className="text-neutral-400">
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
