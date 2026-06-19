"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useMemo } from "react";
import { ArrowLeft } from "lucide-react";

import ConnectionStatus from "@/components/game/ConnectionStatus";
import GameBoard from "@/components/game/GameBoard";
import GameControls from "@/components/game/GameControls";
import GameStatus from "@/components/game/GameStatus";
import MoveHistory from "@/components/game/MoveHistory";
import PlayerCard from "@/components/game/PlayerCard";
import LeaveRoomButton from "@/components/rooms/LeaveRoomButton";
import { useRoom } from "@/hooks/useRoom";
import { useRoomSocket } from "@/hooks/useRoomSocket";
import { useSocket } from "@/hooks/useSocket";
import { useTicTacToe } from "@/hooks/useTicTacToe";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface GamePageProps {
  params: Promise<{ roomCode: string }>;
}

function GamePageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Skeleton className="aspect-square w-full max-w-md" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export default function TicTacToeGamePage({ params }: GamePageProps) {
  const { roomCode } = use(params);
  const router = useRouter();
  const currentUserId = useAuthStore((state) => state.user?._id);
  const { status: socketStatus, connect: reconnectSocket } = useSocket();

  const {
    room: fetchedRoom,
    loading,
    error,
    leaveRoom: leaveRoomApi,
  } = useRoom(roomCode);

  const handleRoomDeleted = useCallback(() => {
    router.push("/dashboard/rooms");
  }, [router]);

  const isMemberPreview = fetchedRoom?.players.some(
    (player) => player._id === currentUserId
  );

  const {
    room: liveRoom,
    starting: startingRoom,
    startRoom,
    leaveRoom: leaveRoomSocket,
  } = useRoomSocket({
    roomCode,
    initialRoom: fetchedRoom,
    isMember: Boolean(isMemberPreview),
    autoJoin: true,
    onRoomDeleted: handleRoomDeleted,
  });

  const room = liveRoom ?? fetchedRoom;

  const handleGameEnded = useCallback(
    (reason: string) => {
      if (reason === "room_deleted") {
        router.push("/dashboard/rooms");
      }
    },
    [router]
  );

  const {
    game,
    moveHistory,
    lastMovePosition,
    mySymbol,
    isMyTurn,
    isPlayer,
    canMakeMove,
    starting: startingGame,
    submittingMove,
    startGame,
    makeMove,
    restartGame,
  } = useTicTacToe({
    roomCode,
    onGameEnded: handleGameEnded,
  });

  const isOwner = room?.owner._id === currentUserId;
  const isMember = room?.players.some(
    (player) => player._id === currentUserId
  );

  const canStartRoom = Boolean(
    isOwner &&
      room?.status === "waiting" &&
      room.players.length >= 2
  );

  const canStartGame = Boolean(
    isMember &&
      room?.status === "playing" &&
      !game &&
      room.players.length === 2
  );

  const gamePlayers = useMemo(() => {
    if (!room || !game) {
      return room?.players ?? [];
    }

    return room.players.filter((player) =>
      game.players.includes(player._id)
    );
  }, [room, game]);

  const handleLeave = useCallback(async () => {
    await leaveRoomSocket();
    await leaveRoomApi();
  }, [leaveRoomApi, leaveRoomSocket]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (!canMakeMove) {
        return;
      }

      void makeMove(index);
    },
    [canMakeMove, makeMove]
  );

  if (loading && !room) {
    return <GamePageSkeleton />;
  }

  if (error || !room) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Unable to load game</CardTitle>
          <CardDescription>{error || "Room not found"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="secondary">
            <Link href="/dashboard/rooms">Back to Rooms</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (room.gameType !== "tic-tac-toe") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unsupported game type</CardTitle>
          <CardDescription>
            This room is configured for a different game.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="secondary">
            <Link href={`/dashboard/rooms/${room.roomCode}`}>
              Back to Room
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isMember) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not a room member</CardTitle>
          <CardDescription>
            Join this room before entering the game.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={`/dashboard/rooms/${room.roomCode}`}>
              Go to Room
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="secondary" className="gap-2">
            <Link href={`/dashboard/rooms/${room.roomCode}`}>
              <ArrowLeft className="size-4" />
              Room
            </Link>
          </Button>
          <ConnectionStatus status={socketStatus} onReconnect={() => void reconnectSocket()} />
        </div>

        <LeaveRoomButton
          roomCode={room.roomCode}
          roomName={room.name}
          onLeave={handleLeave}
        />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">{room.name}</h1>
        <p className="font-mono text-sm text-muted-foreground tracking-widest">
          {room.roomCode}
        </p>
      </div>

      <GameControls
        game={game}
        isPlayer={isPlayer}
        isOwner={isOwner}
        canStartRoom={canStartRoom}
        canStartGame={canStartGame}
        roomStatus={room.status}
        startingRoom={startingRoom}
        startingGame={startingGame}
        onStartRoom={() => void startRoom()}
        onStartGame={() => void startGame()}
        onRestartGame={() => void restartGame()}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Board</CardTitle>
              <CardDescription>
                {game
                  ? isMyTurn
                    ? "Make your move"
                    : "Waiting for opponent"
                  : "Game board will appear when the match starts"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              {game ? (
                <GameBoard
                  board={game.board}
                  winningLine={game.winningLine}
                  lastMovePosition={lastMovePosition}
                  disabled={!canMakeMove}
                  onCellClick={handleCellClick}
                />
              ) : (
                <div className="flex h-64 w-full max-w-sm items-center justify-center rounded-xl border border-dashed text-muted-foreground">
                  Waiting to start...
                </div>
              )}
            </CardContent>
          </Card>

          <GameStatus
            game={game}
            players={room.players}
            currentUserId={currentUserId}
            isMyTurn={isMyTurn}
            submittingMove={submittingMove}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Players</CardTitle>
              <CardDescription>
                {mySymbol ? `You are playing as ${mySymbol}` : "Spectating"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {gamePlayers.map((player) => (
                <PlayerCard
                  key={player._id}
                  player={player}
                  symbol={game?.symbols[player._id] ?? null}
                  isCurrentTurn={game?.currentTurn === player._id}
                  isWinner={game?.winner === player._id}
                  isOwner={player._id === room.owner._id}
                  isMe={player._id === currentUserId}
                />
              ))}
            </CardContent>
          </Card>

          <MoveHistory
            moves={moveHistory}
            players={room.players}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </div>
  );
}
