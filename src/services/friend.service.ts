import api from "@/lib/axios";
import type {
  AcceptedRequestResponse,
  FriendRequestResponse,
  FriendsResponse,
  IncomingRequestsResponse,
  MessageApiResponse,
  SendFriendRequestDto,
  SentRequestsResponse,
} from "@/types/friend";

export const getFriends = async (): Promise<FriendsResponse> => {
  const { data } = await api.get<FriendsResponse>("/friends");
  return data;
};

export const getFriendRequests = async (): Promise<IncomingRequestsResponse> => {
  const { data } = await api.get<IncomingRequestsResponse>("/friends/requests");
  return data;
};

export const getSentRequests = async (): Promise<SentRequestsResponse> => {
  const { data } = await api.get<SentRequestsResponse>(
    "/friends/sent-requests"
  );
  return data;
};

export const sendFriendRequest = async (
  payload: SendFriendRequestDto
): Promise<FriendRequestResponse> => {
  const { data } = await api.post<FriendRequestResponse>(
    "/friends/send-request",
    payload
  );
  return data;
};

export const acceptFriendRequest = async (
  requestId: string
): Promise<AcceptedRequestResponse> => {
  const { data } = await api.patch<AcceptedRequestResponse>(
    `/friends/accept-request/${encodeURIComponent(requestId)}`
  );
  return data;
};

export const rejectFriendRequest = async (
  requestId: string
): Promise<AcceptedRequestResponse> => {
  const { data } = await api.patch<AcceptedRequestResponse>(
    `/friends/reject-request/${encodeURIComponent(requestId)}`
  );
  return data;
};

export const cancelFriendRequest = async (
  requestId: string
): Promise<MessageApiResponse> => {
  const { data } = await api.delete<MessageApiResponse>(
    `/friends/cancel-request/${encodeURIComponent(requestId)}`
  );
  return data;
};

export const removeFriend = async (
  friendId: string
): Promise<MessageApiResponse> => {
  const { data } = await api.delete<MessageApiResponse>(
    `/friends/remove/${encodeURIComponent(friendId)}`
  );
  return data;
};
