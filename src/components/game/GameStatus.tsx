"use client";

import { memo } from "react";
import { Handshake, Loader2, Trophy } from "lucide-react";

import type { RoomPlayer } from "@/types/room";
import type { TicTacToeGame } from "@/types/tic-tac-toe";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GameStatusProps {
  game: TicTacToeGame | null;
  players: RoomPlayer[];
  currentUserId?: string;
  isMyTurn?: boolean;
  submittingMove?: boolean;
}

function getPlayerName(
  players: RoomPlayer[],
  playerId: string | null
): string {
  if (!playerId) {
    return "Unknown";
  }

  return players.find((player) => player._id === playerId)?.name ?? "Unknown";
}

function getGameStatusClass(status: TicTacToeGame["status"]) {
  switch (status) {
    case "playing":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]";
    case "won":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.15)]";
    case "draw":
      return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
    default:
      return "";
  }
}

function GameStatusComponent({
  game,
  players,
  currentUserId,
  isMyTurn = false,
  submittingMove = false,
}: GameStatusProps) {
  if (!game) {
    return (
      <Card className="glass-card bg-background/25 hover:transform-none">
        <CardHeader>
          <CardTitle className="text-white font-bold">Waiting for game</CardTitle>
          <CardDescription className="text-neutral-400">
            The game will begin once started by the room owner.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentPlayerName = getPlayerName(players, game.currentTurn);
  const winnerName = getPlayerName(players, game.winner);

  return (
    <Card className="glass-card bg-background/25 hover:transform-none">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-white font-bold">Game Status</CardTitle>
          <Badge variant="outline" className={getGameStatusClass(game.status)}>
            {game.status === "playing"
              ? "In Progress"
              : game.status === "won"
                ? "Finished"
                : "Draw"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {game.status === "playing" && (
          <div className="flex items-center gap-2 text-sm">
            {submittingMove ? (
              <>
                <Loader2 className="size-4 animate-spin text-primary" />
                <span className="text-neutral-300">Submitting move...</span>
              </>
            ) : (
              <>
                <span
                  className={cn(
                    "size-2 rounded-full",
                    isMyTurn
                      ? "animate-pulse bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                      : "animate-pulse bg-primary shadow-[0_0_8px_rgba(220,38,38,0.7)]"
                  )}
                />
                <span className="text-neutral-200 font-semibold">
                  {isMyTurn
                    ? "Your turn"
                    : `${currentPlayerName}'s turn`}
                </span>
              </>
            )}
          </div>
        )}

        {game.status === "won" && (
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 shadow-[inset_0_0_15px_rgba(245,158,11,0.15)]",
              "animate-in fade-in zoom-in-95 duration-500"
            )}
          >
            <Trophy className="size-8 shrink-0 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
            <div>
              <p className="font-bold text-amber-400">
                {game.winner === currentUserId
                  ? "You won!"
                  : `${winnerName} wins!`}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Congratulations on the victory
              </p>
            </div>
          </div>
        )}

        {game.status === "draw" && (
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border border-white/10 bg-background/25 p-4 shadow-[inset_0_0_12px_rgba(255,255,255,0.03)]",
              "animate-in fade-in zoom-in-95 duration-500"
            )}
          >
            <Handshake className="size-8 shrink-0 text-neutral-400" />
            <div>
              <p className="font-bold text-white">It&apos;s a draw!</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                No winner this round
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const GameStatus = memo(GameStatusComponent);

export default GameStatus;
