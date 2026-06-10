"use client";

import { memo } from "react";
import { Crown } from "lucide-react";

import type { RoomPlayer } from "@/types/room";
import type { TicTacToeSymbol } from "@/types/tic-tac-toe";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  player: RoomPlayer;
  symbol?: TicTacToeSymbol | null;
  isCurrentTurn?: boolean;
  isWinner?: boolean;
  isOwner?: boolean;
  isMe?: boolean;
}

function PlayerCardComponent({
  player,
  symbol = null,
  isCurrentTurn = false,
  isWinner = false,
  isOwner = false,
  isMe = false,
}: PlayerCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 transition-all",
        isCurrentTurn && "border-violet-500 bg-violet-500/5 shadow-sm",
        isWinner && "border-amber-400 bg-amber-500/10",
        isMe && "ring-1 ring-primary/30"
      )}
    >
      <div className="relative">
        <Avatar className="size-12 border-2">
          <AvatarImage src={player.avatar} alt={player.name} />
          <AvatarFallback className="bg-gradient-to-r from-violet-600 to-pink-500 text-white">
            {player.name?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        {symbol && (
          <span
            className={cn(
              "absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border text-xs font-bold",
              symbol === "X"
                ? "border-sky-500 bg-sky-500 text-white"
                : "border-rose-500 bg-rose-500 text-white"
            )}
          >
            {symbol}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">
            {player.name}
            {isMe && (
              <span className="ml-1 text-xs text-muted-foreground">(You)</span>
            )}
          </p>
          {isOwner && <Crown className="size-3.5 shrink-0 text-amber-500" />}
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {isCurrentTurn && (
            <Badge variant="secondary" className="animate-pulse text-xs">
              Current turn
            </Badge>
          )}
          {isWinner && (
            <Badge className="bg-amber-500 text-xs hover:bg-amber-500">
              Winner
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

const PlayerCard = memo(PlayerCardComponent);

export default PlayerCard;
