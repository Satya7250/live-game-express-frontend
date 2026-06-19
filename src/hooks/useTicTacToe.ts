"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  ensureSocketConnected,
  makeTicTacToeMove,
  onSocketEvent,
  restartTicTacToe,
  startTicTacToe,
} from "@/services/socket.service";
import { extractMove } from "@/lib/tic-tac-toe-engine";
import { useAuthStore } from "@/store/auth.store";
import type {
  TicTacToeGame,
  TicTacToeMoveRecord,
  TicTacToeSymbol,
} from "@/types/tic-tac-toe";
import type {
  SocketErrorPayload,
  TicTacToeGameEndedPayload,
  TicTacToeGamePayload,
} from "@/types/socket";

interface UseTicTacToeOptions {
  roomCode: string;
  onGameEnded?: (reason: string) => void;
}

// extractMove imported from @/lib/tic-tac-toe-engine

export function useTicTacToe({ roomCode, onGameEnded }: UseTicTacToeOptions) {
  const currentUserId = useAuthStore((state) => state.user?._id);
  const [game, setGame] = useState<TicTacToeGame | null>(null);
  const [moveHistory, setMoveHistory] = useState<TicTacToeMoveRecord[]>([]);
  const [lastMovePosition, setLastMovePosition] = useState<number | null>(
    null
  );
  const [starting, setStarting] = useState(false);
  const [submittingMove, setSubmittingMove] = useState(false);
  const previousBoardRef = useRef<TicTacToeGame["board"] | null>(null);
  const onGameEndedRef = useRef(onGameEnded);

  useEffect(() => {
    onGameEndedRef.current = onGameEnded;
  }, [onGameEnded]);

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
    } else {
      setMoveHistory([]);
    }

    previousBoardRef.current = [...nextGame.board];
  }, []);

  const handleGameStarted = useCallback(
    (payload: TicTacToeGamePayload) => {
      setMoveHistory([]);
      previousBoardRef.current = null;
      applyGameState(payload.game);
      toast.success("Tic-Tac-Toe game started!");
    },
    [applyGameState]
  );

  const handleGameUpdate = useCallback(
    (payload: TicTacToeGamePayload) => {
      applyGameState(payload.game);
    },
    [applyGameState]
  );

  const handleGameRestarted = useCallback(
    (payload: TicTacToeGamePayload) => {
      setMoveHistory([]);
      previousBoardRef.current = null;
      setLastMovePosition(null);
      applyGameState(payload.game);
      toast.info("Game restarted");
    },
    [applyGameState]
  );

  const handleGameEnded = useCallback((payload: TicTacToeGameEndedPayload) => {
    setGame(null);
    setMoveHistory([]);
    setLastMovePosition(null);
    previousBoardRef.current = null;
    onGameEndedRef.current?.(payload.reason);

    if (payload.reason === "room_deleted") {
      toast.error("Game ended — room was deleted");
      return;
    }

    toast.info(`Game ended: ${payload.reason}`);
  }, []);

  const handleTttError = useCallback((payload: SocketErrorPayload) => {
    toast.error(payload.message);
  }, []);

  const startGame = useCallback(async () => {
    if (!roomCode) {
      return;
    }

    try {
      setStarting(true);
      await ensureSocketConnected();
      startTicTacToe({ roomCode });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to start game";
      toast.error(message);
    } finally {
      setStarting(false);
    }
  }, [roomCode]);

  const makeMove = useCallback(
    async (position: number) => {
      if (!roomCode || !game) {
        return;
      }

      try {
        setSubmittingMove(true);
        await ensureSocketConnected();
        makeTicTacToeMove({ roomCode, position });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to submit move";
        toast.error(message);
      } finally {
        setSubmittingMove(false);
      }
    },
    [roomCode, game]
  );

  const restartGame = useCallback(async () => {
    if (!roomCode) {
      return;
    }

    try {
      await ensureSocketConnected();
      restartTicTacToe({ roomCode });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to restart game";
      toast.error(message);
    }
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode) {
      return;
    }

    let cancelled = false;

    const setup = async () => {
      try {
        await ensureSocketConnected();

        if (cancelled) {
          return;
        }

        const unsubscribers = [
          onSocketEvent("ttt:started", handleGameStarted),
          onSocketEvent("ttt:update", handleGameUpdate),
          onSocketEvent("ttt:restarted", handleGameRestarted),
          onSocketEvent("ttt:gameEnded", handleGameEnded),
          onSocketEvent("ttt:error", handleTttError),
        ];

        return () => {
          unsubscribers.forEach((unsubscribe) => unsubscribe());
        };
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to initialize game socket";
          toast.error(message);
        }
      }
    };

    let cleanupListeners: (() => void) | undefined;

    void setup().then((cleanup) => {
      cleanupListeners = cleanup;
    });

    return () => {
      cancelled = true;
      cleanupListeners?.();
    };
  }, [
    roomCode,
    handleGameStarted,
    handleGameUpdate,
    handleGameRestarted,
    handleGameEnded,
    handleTttError,
  ]);

  const mySymbol = useMemo<TicTacToeSymbol | null>(() => {
    if (!game || !currentUserId) {
      return null;
    }

    return game.symbols[currentUserId] ?? null;
  }, [game, currentUserId]);

  const isMyTurn = useMemo(() => {
    if (!game || !currentUserId) {
      return false;
    }

    return game.currentTurn === currentUserId && game.status === "playing";
  }, [game, currentUserId]);

  const isPlayer = useMemo(() => {
    if (!game || !currentUserId) {
      return false;
    }

    return game.players.includes(currentUserId);
  }, [game, currentUserId]);

  const canMakeMove = isMyTurn && !submittingMove;

  return {
    game,
    moveHistory,
    lastMovePosition,
    mySymbol,
    isMyTurn,
    isPlayer,
    canMakeMove,
    starting,
    submittingMove,
    startGame,
    makeMove,
    restartGame,
  };
}
