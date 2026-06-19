"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  createLocalGame,
  LOCAL_PLAYER_ONE_ID,
  LOCAL_PLAYER_TWO_ID,
  makeMove,
  restartGame,
  extractMove,
} from "@/lib/tic-tac-toe-engine";
import type { RoomPlayer } from "@/types/room";
import type {
  TicTacToeGame,
  TicTacToeMoveRecord,
  TicTacToeSymbol,
} from "@/types/tic-tac-toe";

interface LocalPlayerNames {
  [LOCAL_PLAYER_ONE_ID]: string;
  [LOCAL_PLAYER_TWO_ID]: string;
}

const DEFAULT_NAMES: LocalPlayerNames = {
  [LOCAL_PLAYER_ONE_ID]: "Player 1",
  [LOCAL_PLAYER_TWO_ID]: "Player 2",
};

// extractMove imported from @/lib/tic-tac-toe-engine

export function useLocalTicTacToe() {
  const [game, setGame] = useState<TicTacToeGame>(() => createLocalGame());
  const [playerNames, setPlayerNames] =
    useState<LocalPlayerNames>(DEFAULT_NAMES);
  const [moveHistory, setMoveHistory] = useState<TicTacToeMoveRecord[]>([]);
  const [lastMovePosition, setLastMovePosition] = useState<number | null>(null);
  const previousBoardRef = useRef<TicTacToeGame["board"]>([...game.board]);

  const applyGameState = useCallback((nextGame: TicTacToeGame) => {
    setGame(nextGame);

    if (previousBoardRef.current) {
      const move = extractMove(
        previousBoardRef.current,
        nextGame.board,
        nextGame
      );

      if (move) {
        setMoveHistory((history) => [...history, move]);
        setLastMovePosition(move.position);
      }
    }

    previousBoardRef.current = [...nextGame.board];
  }, []);

  const makeLocalMove = useCallback(
    (position: number) => {
      if (game.status !== "playing") {
        return;
      }

      try {
        const nextGame = makeMove(game, game.currentTurn, position);
        applyGameState(nextGame);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Invalid move";
        toast.error(message);
      }
    },
    [game, applyGameState]
  );

  const restartLocalGame = useCallback(() => {
    const nextGame = restartGame(game);
    setMoveHistory([]);
    setLastMovePosition(null);
    previousBoardRef.current = [...nextGame.board];
    setGame(nextGame);
  }, [game]);

  const resetLocalGame = useCallback(() => {
    const nextGame = createLocalGame();
    setMoveHistory([]);
    setLastMovePosition(null);
    previousBoardRef.current = [...nextGame.board];
    setGame(nextGame);
  }, []);

  const updatePlayerName = useCallback(
    (playerId: keyof LocalPlayerNames, name: string) => {
      setPlayerNames((current) => ({
        ...current,
        [playerId]: name.trim() || current[playerId],
      }));
    },
    []
  );

  const players = useMemo<RoomPlayer[]>(
    () => [
      { _id: LOCAL_PLAYER_ONE_ID, name: playerNames[LOCAL_PLAYER_ONE_ID] },
      { _id: LOCAL_PLAYER_TWO_ID, name: playerNames[LOCAL_PLAYER_TWO_ID] },
    ],
    [playerNames]
  );

  const currentPlayerName = useMemo(() => {
    return playerNames[game.currentTurn as keyof LocalPlayerNames] ?? "Player";
  }, [game.currentTurn, playerNames]);

  const canPlay = game.status === "playing";

  return {
    game,
    players,
    playerNames,
    moveHistory,
    lastMovePosition,
    currentPlayerName,
    canPlay,
    makeMove: makeLocalMove,
    restartGame: restartLocalGame,
    resetGame: resetLocalGame,
    updatePlayerName,
  };
}
