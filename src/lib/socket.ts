import { io } from "socket.io-client";

import { clearAccessToken, fetchAccessToken } from "@/lib/token";
import type {
  AppSocket,
  ClientToServerEvents,
  ServerToClientEvents,
  SocketConnectionStatus,
} from "@/types/socket";

type StatusListener = (status: SocketConnectionStatus) => void;

let socket: AppSocket | null = null;
let connectionStatus: SocketConnectionStatus = "disconnected";
let connectPromise: Promise<AppSocket> | null = null;

const statusListeners = new Set<StatusListener>();
const joinedRoomCodes = new Set<string>();

export function hasJoinedRoom(roomCode: string): boolean {
  return joinedRoomCodes.has(roomCode);
}

export function addJoinedRoom(roomCode: string): void {
  joinedRoomCodes.add(roomCode);
}

export function deleteJoinedRoom(roomCode: string): void {
  joinedRoomCodes.delete(roomCode);
}

export function clearJoinedRooms(): void {
  joinedRoomCodes.clear();
}

function getSocketUrl(): string {
  const rawUrl = (
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000"
  );
  
  if (rawUrl.endsWith("/api")) {
    return rawUrl.slice(0, -4);
  }
  
  return rawUrl;
}

function setConnectionStatus(status: SocketConnectionStatus): void {
  connectionStatus = status;
  statusListeners.forEach((listener) => listener(status));
}

export function getConnectionStatus(): SocketConnectionStatus {
  return connectionStatus;
}

export function subscribeToConnectionStatus(
  listener: StatusListener
): () => void {
  statusListeners.add(listener);
  listener(connectionStatus);

  return () => {
    statusListeners.delete(listener);
  };
}

export function getSocket(): AppSocket | null {
  return socket;
}

function attachSocketListeners(instance: AppSocket): void {
  instance.on("connect", () => {
    setConnectionStatus("connected");
  });

  instance.io.on("reconnect_attempt", () => {
    setConnectionStatus("reconnecting");
  });

  instance.io.on("reconnect", () => {
    setConnectionStatus("connected");
  });

  instance.io.on("reconnect_failed", () => {
    setConnectionStatus("error");
  });

  instance.on("disconnect", () => {
    setConnectionStatus("disconnected");
  });

  instance.on("connect_error", async (error) => {
    if (
      error.message.toLowerCase().includes("namespace") ||
      error.message.toLowerCase().includes("invalid")
    ) {
      return;
    }
    
    if (
      error.message.toLowerCase().includes("unauthorized") ||
      error.message.toLowerCase().includes("authentication")
    ) {
      clearAccessToken();

      try {
        const token = await fetchAccessToken();
        instance.auth = { token };
        instance.connect();
        return;
      } catch {
        setConnectionStatus("error");
        return;
      }
    }

    setConnectionStatus("error");
  });
}

export async function connectSocket(): Promise<AppSocket> {
  const socketUrl = getSocketUrl();
  
  if (socket && (socket.io as any).uri !== socketUrl) {
    disconnectSocket();
  }

  if (socket?.connected) {
    return socket;
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    setConnectionStatus("connecting");

    const token = await fetchAccessToken();

    if (!socket) {
      socket = io(socketUrl, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 30000,
        withCredentials: true,
        auth: { token },
        transports: ["websocket", "polling"],
      }) as AppSocket;

      attachSocketListeners(socket);
    } else {
      socket.auth = { token };
    }

    if (!socket.connected) {
      socket.connect();
    }

    await new Promise<void>((resolve) => {
      if (!socket) {
        resolve();
        return;
      }

      if (socket.connected) {
        resolve();
        return;
      }

      let timeoutId: NodeJS.Timeout;
      const handleConnect = () => {
        clearTimeout(timeoutId);
        cleanup();
        resolve();
      };

      const handleError = (error: Error) => {
        if (
          error.message.toLowerCase().includes("namespace") ||
          error.message.toLowerCase().includes("invalid")
        ) {
          clearTimeout(timeoutId);
          cleanup();
          resolve();
          return;
        }
      };

      const cleanup = () => {
        socket?.off("connect", handleConnect);
        socket?.off("connect_error", handleError);
      };

      timeoutId = setTimeout(() => {
        cleanup();
        resolve();
      }, 3000);

      socket.once("connect", handleConnect);
      socket.on("connect_error", handleError);
    });

    return socket;
  })();

  try {
    return await connectPromise;
  } finally {
    connectPromise = null;
  }
}

export function disconnectSocket(): void {
  clearJoinedRooms();
  if (!socket) {
    return;
  }

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  setConnectionStatus("disconnected");
}

export function emitSocketEvent<E extends keyof ClientToServerEvents>(
  event: E,
  ...args: Parameters<ClientToServerEvents[E]>
): void {
  if (!socket) {
    throw new Error("Socket is not initialized");
  }

  socket.emit(event, ...args);
}

export type { ClientToServerEvents, ServerToClientEvents };
