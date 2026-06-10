import api from "@/lib/axios";
import type {
  CreateRoomDto,
  JoinRoomDto,
  LeaveRoomResponse,
  MyRoomsResponse,
  RoomResponse,
} from "@/types/room";

export interface GetMyRoomsParams {
  page?: number;
  limit?: number;
}

export const getMyRooms = async (
  params: GetMyRoomsParams = {}
): Promise<MyRoomsResponse> => {
  const { data } = await api.get<MyRoomsResponse>("/rooms", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    },
  });

  return data;
};

export const getRoomByCode = async (
  roomCode: string
): Promise<RoomResponse> => {
  const { data } = await api.get<RoomResponse>(
    `/rooms/${encodeURIComponent(roomCode)}`
  );

  return data;
};

export const createRoom = async (
  payload: CreateRoomDto
): Promise<RoomResponse> => {
  const { data } = await api.post<RoomResponse>("/rooms", payload);

  return data;
};

export const joinRoom = async (
  payload: JoinRoomDto
): Promise<RoomResponse> => {
  const { data } = await api.post<RoomResponse>("/rooms/join", payload);

  return data;
};

export const leaveRoom = async (
  roomCode: string
): Promise<LeaveRoomResponse> => {
  const { data } = await api.post<LeaveRoomResponse>(
    `/rooms/${encodeURIComponent(roomCode)}/leave`
  );

  return data;
};
