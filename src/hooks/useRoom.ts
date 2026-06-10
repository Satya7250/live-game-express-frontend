"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import * as roomService from "@/services/room.service";
import type { JoinRoomDto, Room } from "@/types/room";

export function useRoom(roomCode: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRoom = useCallback(async () => {
    if (!roomCode) {
      setError("Room code is required");
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await roomService.getRoomByCode(roomCode);

      if (response.success && response.data) {
        setRoom(response.data);
        return response.data;
      }

      throw new Error(response.message || "Failed to load room");
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "Failed to load room");
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [roomCode]);

  useEffect(() => {
    void fetchRoom();
  }, [fetchRoom]);

  const joinRoom = useCallback(async (payload: JoinRoomDto) => {
    try {
      setActionLoading(true);

      const response = await roomService.joinRoom(payload);

      if (response.success && response.data) {
        setRoom(response.data);
        toast.success(response.message || "Joined room successfully");
        return response.data;
      }

      throw new Error(response.message || "Failed to join room");
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "Failed to join room");
      toast.error(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const leaveRoom = useCallback(async () => {
    try {
      setActionLoading(true);

      const response = await roomService.leaveRoom(roomCode);

      if (response.success) {
        toast.success(response.message || "Left room successfully");
        return response.data;
      }

      throw new Error(response.message || "Failed to leave room");
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "Failed to leave room");
      toast.error(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [roomCode]);

  return {
    room,
    loading,
    error,
    actionLoading,
    fetchRoom,
    joinRoom,
    leaveRoom,
  };
}
