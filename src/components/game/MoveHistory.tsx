"use client";

import { memo } from "react";

import type { RoomPlayer } from "@/types/room";
import type { TicTacToeMoveRecord } from "@/types/tic-tac-toe";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MoveHistoryProps {
  moves: TicTacToeMoveRecord[];
  players: RoomPlayer[];
  currentUserId?: string;
}

function MoveHistoryComponent({
  moves,
  players,
  currentUserId,
}: MoveHistoryProps) {
  const getPlayerName = (playerId: string) => {
    const player = players.find((item) => item._id === playerId);
    if (!player) {
      return "Unknown";
    }

    return player._id === currentUserId ? "You" : player.name;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Move History</CardTitle>
        <CardDescription>
          {moves.length === 0
            ? "No moves yet"
            : `${moves.length} move${moves.length === 1 ? "" : "s"} played`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {moves.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Moves will appear here in real time.
          </p>
        ) : (
          <ol className="max-h-48 space-y-2 overflow-y-auto text-sm">
            {moves.map((move, index) => (
              <li
                key={`${move.timestamp}-${move.position}`}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <span className="text-muted-foreground">#{index + 1}</span>
                <span className="font-medium">
                  {getPlayerName(move.playerId)}
                </span>
                <span
                  className={
                    move.symbol === "X" ? "text-sky-500" : "text-rose-500"
                  }
                >
                  {move.symbol}
                </span>
                <span className="font-mono text-muted-foreground">
                  Cell {move.position + 1}
                </span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

const MoveHistory = memo(MoveHistoryComponent);

export default MoveHistory;
