"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  ensureSocketConnected,
  joinRoomSocket,
  leaveRoomSocket,
  onSocketEvent,
  startRoomSocket,
} from "@/services/socket.service";
import type { Room, LeaveRoomDeletedResult } from "@/types/room";
import type {
  RoomJoinedPayload,
  RoomLeftPayload,
  RoomStartedPayload,
  RoomUpdatedPayload,
  SocketErrorPayload,
} from "@/types/socket";

interface UseRoomSocketOptions {
  roomCode: string;
  initialRoom?: Room | null;
  isMember?: boolean;
  autoJoin?: boolean;
  onRoomDeleted?: () => void;
}

function isRoomDeletedResult(
  result: Room | LeaveRoomDeletedResult
): result is LeaveRoomDeletedResult {
  return "message" in result && !("_id" in result);
}

export function useRoomSocket({
  roomCode,
  initialRoom = null,
  isMember = false,
  autoJoin = true,
  onRoomDeleted,
}: UseRoomSocketOptions) {
  const [room, setRoom] = useState<Room | null>(initialRoom);
  const [joined, setJoined] = useState(false);
  const [starting, setStarting] = useState(false);
  const hasJoinedRef = useRef(false);
  const onRoomDeletedRef = useRef(onRoomDeleted);

  useEffect(() => {
    onRoomDeletedRef.current = onRoomDeleted;
  }, [onRoomDeleted]);

  useEffect(() => {
    if (initialRoom) {
      setRoom(initialRoom);
    }
  }, [initialRoom]);

  const handleRoomError = useCallback((payload: SocketErrorPayload) => {
    // Ignore "invalid namespace" and similar errors
    if (
      payload.message.toLowerCase().includes("namespace") ||
      payload.message.toLowerCase().includes("invalid")
    ) {
      return;
    }
    toast.error(payload.message);
  }, []);

  const handleRoomUpdated = useCallback((payload: RoomUpdatedPayload) => {
    setRoom(payload.room);
  }, []);

  const handleRoomJoined = useCallback((payload: RoomJoinedPayload) => {
    setRoom(payload.room);
    setJoined(true);
  }, []);

  const handleRoomStarted = useCallback((payload: RoomStartedPayload) => {
    setRoom(payload.room);
    toast.success("Game started!");
  }, []);

  const handleRoomLeft = useCallback((payload: RoomLeftPayload) => {
    if (isRoomDeletedResult(payload.result)) {
      onRoomDeletedRef.current?.();
      return;
    }

    setRoom(payload.result);
    setJoined(false);
    hasJoinedRef.current = false;
  }, []);

  const joinRoom = useCallback(async () => {
    if (!roomCode || hasJoinedRef.current) {
      return;
    }

    try {
      await ensureSocketConnected();
      joinRoomSocket({ roomCode });
      hasJoinedRef.current = true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to join room channel";
      toast.error(message);
    }
  }, [roomCode]);

  const leaveRoom = useCallback(async () => {
    if (!roomCode) {
      return;
    }

    try {
      await ensureSocketConnected();
      leaveRoomSocket({ roomCode });
      hasJoinedRef.current = false;
      setJoined(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to leave room channel";
      toast.error(message);
    }
  }, [roomCode]);

  const startRoom = useCallback(async () => {
    if (!roomCode) {
      return;
    }

    try {
      setStarting(true);
      await ensureSocketConnected();
      startRoomSocket({ roomCode });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to start room";
      toast.error(message);
    } finally {
      setStarting(false);
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
          onSocketEvent("room:joined", handleRoomJoined),
          onSocketEvent("room:updated", handleRoomUpdated),
          onSocketEvent("room:started", handleRoomStarted),
          onSocketEvent("room:left", handleRoomLeft),
          onSocketEvent("room:error", handleRoomError),
        ];

        return () => {
          unsubscribers.forEach((unsubscribe) => unsubscribe());
        };
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to initialize room socket";
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
    handleRoomJoined,
    handleRoomUpdated,
    handleRoomStarted,
    handleRoomLeft,
    handleRoomError,
  ]);

  useEffect(() => {
    if (!autoJoin || !isMember || !roomCode) {
      return;
    }

    void joinRoom();
  }, [autoJoin, isMember, roomCode, joinRoom]);

  return {
    room,
    setRoom,
    joined,
    starting,
    joinRoom,
    leaveRoom,
    startRoom,
  };
}
