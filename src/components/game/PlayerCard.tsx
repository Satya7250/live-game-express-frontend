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
        "glass-card flex items-center gap-3 p-3 transition-all border border-border/40 hover:transform-none hover:shadow-none bg-background/20",
        isCurrentTurn && "border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(220,38,38,0.15)]",
        isWinner && "border-amber-400/80 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
        isMe && "ring-1 ring-primary/40 border-primary/30"
      )}
    >
      <div className="relative">
        <Avatar className="size-12 border-2 border-border/60">
          <AvatarImage src={player.avatar} alt={player.name} />
          <AvatarFallback className="bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 text-white font-medium text-sm">
            {player.name?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        {symbol && (
          <span
            className={cn(
              "absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border text-xs font-extrabold shadow-sm backdrop-blur-md",
              symbol === "X"
                ? "border-sky-500/30 bg-sky-500/20 text-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                : "border-red-500/30 bg-red-500/20 text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
            )}
          >
            {symbol}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-bold text-sm text-neutral-100">
            {player.name}
            {isMe && (
              <span className="ml-1 text-xs text-neutral-400 font-normal">(You)</span>
            )}
          </p>
          {isOwner && <Crown className="size-3.5 shrink-0 text-amber-400" />}
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {isCurrentTurn && (
            <Badge variant="secondary" className="badge-gaming animate-pulse text-[10px]">
              Current turn
            </Badge>
          )}
          {isWinner && (
            <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 text-[10px]">
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
