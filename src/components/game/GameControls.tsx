"use client";

import { memo } from "react";
import { Play, RotateCcw } from "lucide-react";

import type { TicTacToeGame } from "@/types/tic-tac-toe";
import { Button } from "@/components/ui/button";

interface GameControlsProps {
  game: TicTacToeGame | null;
  isPlayer?: boolean;
  isOwner?: boolean;
  canStartRoom?: boolean;
  canStartGame?: boolean;
  roomStatus?: string;
  startingRoom?: boolean;
  startingGame?: boolean;
  onStartRoom?: () => void;
  onStartGame?: () => void;
  onRestartGame?: () => void;
}

function GameControlsComponent({
  game,
  isPlayer = false,
  isOwner = false,
  canStartRoom = false,
  canStartGame = false,
  roomStatus = "waiting",
  startingRoom = false,
  startingGame = false,
  onStartRoom,
  onStartGame,
  onRestartGame,
}: GameControlsProps) {
  const isGameFinished = game?.status === "won" || game?.status === "draw";

  return (
    <div className="flex flex-wrap gap-3">
      {canStartRoom && roomStatus === "waiting" && (
        <Button
          onClick={onStartRoom}
          disabled={startingRoom}
          className="gap-2"
        >
          <Play className="size-4" />
          {startingRoom ? "Starting room..." : "Start Room"}
        </Button>
      )}

      {canStartGame && !game && roomStatus === "playing" && (
        <Button
          onClick={onStartGame}
          disabled={startingGame}
          className="gap-2"
        >
          <Play className="size-4" />
          {startingGame ? "Starting game..." : "Start Tic-Tac-Toe"}
        </Button>
      )}

      {game && isGameFinished && isPlayer && (
        <Button
          variant="secondary"
          onClick={onRestartGame}
          className="gap-2"
        >
          <RotateCcw className="size-4" />
          Play Again
        </Button>
      )}

      {isOwner && roomStatus === "waiting" && !canStartRoom && (
        <p className="text-sm text-muted-foreground">
          Waiting for at least 2 players to start the room.
        </p>
      )}
    </div>
  );
}

const GameControls = memo(GameControlsComponent);

export default GameControls;
