"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  connectSocket,
  disconnectSocket,
  subscribeToConnectionStatus,
} from "@/services/socket.service";
import { clearAccessToken } from "@/lib/token";
import { useAuthStore } from "@/store/auth.store";
import type { SocketConnectionStatus } from "@/types/socket";

export function useSocket() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [status, setStatus] =
    useState<SocketConnectionStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return subscribeToConnectionStatus(setStatus);
  }, []);

  const connect = useCallback(async () => {
    if (!isAuthenticated) {
      return null;
    }

    try {
      setError(null);
      return await connectSocket();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to connect to game server";
      setError(message);
      toast.error(message);
      return null;
    }
  }, [isAuthenticated]);

  const disconnect = useCallback(() => {
    disconnectSocket();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnect();
      return;
    }

    void connect();
  }, [isAuthenticated, connect, disconnect]);

  return {
    status,
    error,
    isConnected: status === "connected",
    isReconnecting: status === "reconnecting",
    isExhausted: status === "error",
    connect,
    disconnect,
  };
}
