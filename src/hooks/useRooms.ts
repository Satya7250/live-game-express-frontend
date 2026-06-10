"use client";

import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api-error";
import * as roomService from "@/services/room.service";
import { onSocketEvent } from "@/services/socket.service";
import type { Room, RoomPagination } from "@/types/room";

interface UseRoomsOptions {
  page?: number;
  limit?: number;
}

export function useRooms(options: UseRoomsOptions = {}) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pagination, setPagination] = useState<RoomPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await roomService.getMyRooms({
        page: options.page,
        limit: options.limit,
      });

      if (response.success && response.data) {
        setRooms(response.data.rooms);
        setPagination(response.data.pagination);
        return response.data;
      }

      throw new Error(response.message || "Failed to load rooms");
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "Failed to load rooms");
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options.limit, options.page]);

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  // Listen to room update events to refresh rooms list
  useEffect(() => {
    const unsubscribers = [
      onSocketEvent("room:created", fetchRooms),
      onSocketEvent("room:updated", fetchRooms),
      onSocketEvent("room:started", fetchRooms),
      onSocketEvent("room:left", fetchRooms),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [fetchRooms]);

  return {
    rooms,
    pagination,
    loading,
    error,
    fetchRooms,
  };
}
