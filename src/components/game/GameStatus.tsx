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

function GameStatusComponent({
  game,
  players,
  currentUserId,
  isMyTurn = false,
  submittingMove = false,
}: GameStatusProps) {
  if (!game) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Waiting for game</CardTitle>
          <CardDescription>
            The game will begin once started by the room owner.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentPlayerName = getPlayerName(players, game.currentTurn);
  const winnerName = getPlayerName(players, game.winner);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Game Status</CardTitle>
          <Badge
            variant={
              game.status === "playing"
                ? "secondary"
                : game.status === "won"
                  ? "default"
                  : "outline"
            }
          >
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
                <Loader2 className="size-4 animate-spin text-violet-500" />
                <span>Submitting move...</span>
              </>
            ) : (
              <>
                <span
                  className={cn(
                    "size-2 rounded-full",
                    isMyTurn
                      ? "animate-pulse bg-emerald-500"
                      : "animate-pulse bg-violet-500"
                  )}
                />
                <span>
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
              "flex items-center gap-3 rounded-lg border border-amber-400/50 bg-amber-500/10 p-4",
              "animate-in fade-in zoom-in-95 duration-500"
            )}
          >
            <Trophy className="size-8 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold">
                {game.winner === currentUserId
                  ? "You won!"
                  : `${winnerName} wins!`}
              </p>
              <p className="text-sm text-muted-foreground">
                Congratulations on the victory
              </p>
            </div>
          </div>
        )}

        {game.status === "draw" && (
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg border bg-muted/50 p-4",
              "animate-in fade-in zoom-in-95 duration-500"
            )}
          >
            <Handshake className="size-8 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-semibold">It&apos;s a draw!</p>
              <p className="text-sm text-muted-foreground">
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
