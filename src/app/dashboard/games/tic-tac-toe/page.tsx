"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, Users } from "lucide-react";

import GameBoard from "@/components/game/GameBoard";
import GameStatus from "@/components/game/GameStatus";
import MoveHistory from "@/components/game/MoveHistory";
import PlayerCard from "@/components/game/PlayerCard";
import {
  LOCAL_PLAYER_ONE_ID,
  LOCAL_PLAYER_TWO_ID,
} from "@/lib/tic-tac-toe-engine";
import { useLocalTicTacToe } from "@/hooks/useLocalTicTacToe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LocalTicTacToePage() {
  const {
    game,
    players,
    playerNames,
    moveHistory,
    lastMovePosition,
    currentPlayerName,
    canPlay,
    makeMove,
    restartGame,
    resetGame,
    updatePlayerName,
  } = useLocalTicTacToe();

  const isGameFinished = game.status === "won" || game.status === "draw";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="secondary" className="w-full gap-2 sm:w-auto">
          <Link href="/dashboard/rooms">
            <ArrowLeft className="size-4" />
            Back to Rooms
          </Link>
        </Button>
        <Badge variant="outline" className="w-fit gap-1.5">
          <Users className="size-3.5" />
          Local 2-Player · No internet required
        </Badge>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Tic-Tac-Toe</h1>
        <p className="text-muted-foreground">
          Pass the device between players. {currentPlayerName} goes
          {game.status === "playing" ? " next" : ""}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Player names</CardTitle>
          <CardDescription>
            Customize names before you start. Changes apply immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="player-one">Player 1 (X)</Label>
            <Input
              id="player-one"
              value={playerNames[LOCAL_PLAYER_ONE_ID]}
              onChange={(event) =>
                updatePlayerName(LOCAL_PLAYER_ONE_ID, event.target.value)
              }
              maxLength={24}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="player-two">Player 2 (O)</Label>
            <Input
              id="player-two"
              value={playerNames[LOCAL_PLAYER_TWO_ID]}
              onChange={(event) =>
                updatePlayerName(LOCAL_PLAYER_TWO_ID, event.target.value)
              }
              maxLength={24}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        {isGameFinished && (
          <Button onClick={restartGame} className="gap-2">
            <RotateCcw className="size-4" />
            Play Again
          </Button>
        )}
        <Button variant="secondary" onClick={resetGame} className="gap-2">
          <RotateCcw className="size-4" />
          New Match
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Board</CardTitle>
              <CardDescription>
                {canPlay
                  ? `${currentPlayerName}'s turn — tap a cell`
                  : "Round complete"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <GameBoard
                board={game.board}
                winningLine={game.winningLine}
                lastMovePosition={lastMovePosition}
                disabled={!canPlay}
                onCellClick={makeMove}
              />
            </CardContent>
          </Card>

          <GameStatus game={game} players={players} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Players</CardTitle>
              <CardDescription>Same device, take turns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {players.map((player) => (
                <PlayerCard
                  key={player._id}
                  player={player}
                  symbol={game.symbols[player._id]}
                  isCurrentTurn={game.currentTurn === player._id}
                  isWinner={game.winner === player._id}
                />
              ))}
            </CardContent>
          </Card>

          <MoveHistory moves={moveHistory} players={players} />
        </div>
      </div>
    </div>
  );
}
