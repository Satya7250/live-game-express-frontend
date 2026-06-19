import {
  connectSocket,
  disconnectSocket,
  emitSocketEvent,
  getConnectionStatus,
  getSocket,
  subscribeToConnectionStatus,
  hasJoinedRoom,
  addJoinedRoom,
  deleteJoinedRoom,
} from "@/lib/socket";
import type { CreateRoomDto } from "@/types/room";
import type {
  ClientToServerEvents,
  RoomJoinPayload,
  RoomLeavePayload,
  RoomStartPayload,
  ServerToClientEvents,
  TicTacToeMovePayload,
  TicTacToeRestartPayload,
  TicTacToeStartPayload,
} from "@/types/socket";

// Rooms are tracked globally in @/lib/socket

export {
  connectSocket,
  disconnectSocket,
  getConnectionStatus,
  getSocket,
  subscribeToConnectionStatus,
};

export async function ensureSocketConnected() {
  return connectSocket();
}

export function createRoom(data: CreateRoomDto): void {
  emitSocketEvent("room:create", data);
}

export function joinRoomSocket(data: RoomJoinPayload): void {
  if (hasJoinedRoom(data.roomCode)) {
    return;
  }
  emitSocketEvent("room:join", data);
  addJoinedRoom(data.roomCode);
}

export function leaveRoomSocket(data: RoomLeavePayload): void {
  if (!hasJoinedRoom(data.roomCode)) {
    return;
  }
  emitSocketEvent("room:leave", data);
  deleteJoinedRoom(data.roomCode);
}

export function startRoomSocket(data: RoomStartPayload): void {
  emitSocketEvent("room:start", data);
}

export function startTicTacToe(data: TicTacToeStartPayload): void {
  emitSocketEvent("ttt:start", data);
}

export function makeTicTacToeMove(data: TicTacToeMovePayload): void {
  emitSocketEvent("ttt:move", data);
}

export function restartTicTacToe(data: TicTacToeRestartPayload): void {
  emitSocketEvent("ttt:restart", data);
}

export function onSocketEvent<E extends keyof ServerToClientEvents>(
  event: E,
  handler: ServerToClientEvents[E]
): () => void {
  let isActive = true;
  let unsubscribeFn: (() => void) | undefined;
  let isRegistered = false;

  const registerListener = async () => {
    if (!isActive || isRegistered) return;
    
    try {
      const socket = await ensureSocketConnected();
      
      if (!isActive) {
        return;
      }
      
      socket.on(event, handler as never);
      isRegistered = true;
      
      unsubscribeFn = () => {
        socket.off(event, handler as never);
        isRegistered = false;
      };
    } catch {
      // Silently fail, we'll retry when socket connects
    }
  };

  registerListener();

  // Subscribe to connection status changes to re-register if needed
  const unsubscribeStatus = subscribeToConnectionStatus((status) => {
    if (status === "connected" && isActive) {
      registerListener();
    }
  });

  return () => {
    isActive = false;
    unsubscribeStatus();
    unsubscribeFn?.();
  };
}

export function offSocketEvent<E extends keyof ServerToClientEvents>(
  event: E,
  handler?: ServerToClientEvents[E]
): void {
  const socket = getSocket();

  if (!socket) {
    return;
  }

  if (handler) {
    socket.off(event, handler as never);
    return;
  }

  socket.removeAllListeners(event);
}

export type { ClientToServerEvents, ServerToClientEvents };
