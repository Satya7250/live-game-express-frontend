"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import * as friendService from "@/services/friend.service";
import { onSocketEvent } from "@/services/socket.service";
import type {
  FriendUser,
  IncomingFriendRequest,
  SendFriendRequestDto,
  SentFriendRequest,
} from "@/types/friend";
import type {
  FriendRequestAcceptedPayload,
  FriendRequestCanceledPayload,
  FriendRequestReceivedPayload,
  FriendRequestRejectedPayload,
  FriendRemovedPayload,
} from "@/types/socket";

type FriendAction =
  | "send"
  | "accept"
  | "reject"
  | "cancel"
  | "remove"
  | "refresh";

interface ActionState {
  type: FriendAction;
  id?: string;
}

export function useFriends() {
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<
    IncomingFriendRequest[]
  >([]);
  const [sentRequests, setSentRequests] = useState<SentFriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionState | null>(null);

  const isActionLoading = useCallback(
    (type: FriendAction, id?: string) => {
      if (!actionState || actionState.type !== type) {
        return false;
      }

      if (id === undefined) {
        return actionState.id === undefined;
      }

      return actionState.id === id;
    },
    [actionState]
  );

  const fetchFriends = useCallback(async () => {
    const response = await friendService.getFriends();

    if (response.success && response.data) {
      setFriends(response.data);
      return response.data;
    }

    throw new Error(response.message || "Failed to load friends");
  }, []);

  const fetchIncomingRequests = useCallback(async () => {
    const response = await friendService.getFriendRequests();

    if (response.success && response.data) {
      setIncomingRequests(response.data);
      return response.data;
    }

    throw new Error(response.message || "Failed to load friend requests");
  }, []);

  const fetchSentRequests = useCallback(async () => {
    const response = await friendService.getSentRequests();

    if (response.success && response.data) {
      setSentRequests(response.data);
      return response.data;
    }

    throw new Error(response.message || "Failed to load sent requests");
  }, []);

  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setActionState({ type: "refresh" });

      await Promise.all([
        fetchFriends(),
        fetchIncomingRequests(),
        fetchSentRequests(),
      ]);
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "Failed to load friends data");
      setError(message);
      return null;
    } finally {
      setLoading(false);
      setActionState(null);
    }
  }, [fetchFriends, fetchIncomingRequests, fetchSentRequests]);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  // Socket event listeners
  useEffect(() => {
    // Friend request received
    const unsubscribeRequestReceived = onSocketEvent(
      "friend:requestReceived",
      (data: FriendRequestReceivedPayload) => {
        toast.info(`${data.sender.name} sent you a friend request!`);
        setIncomingRequests((prev) => [...prev, data]);
      }
    );

    // Friend request accepted
    const unsubscribeRequestAccepted = onSocketEvent(
      "friend:requestAccepted",
      async (data: FriendRequestAcceptedPayload) => {
        toast.success("Friend request accepted!");
        // Refresh everything since we have a new friend
        await refreshAll();
      }
    );

    // Friend request rejected
    const unsubscribeRequestRejected = onSocketEvent(
      "friend:requestRejected",
      (data: FriendRequestRejectedPayload) => {
        setSentRequests((prev) =>
          prev.filter((req) => req._id !== data.requestId)
        );
      }
    );

    // Friend request canceled
    const unsubscribeRequestCanceled = onSocketEvent(
      "friend:requestCanceled",
      (data: FriendRequestCanceledPayload) => {
        setIncomingRequests((prev) =>
          prev.filter((req) => req._id !== data.requestId)
        );
      }
    );

    // Friend removed
    const unsubscribeFriendRemoved = onSocketEvent(
      "friend:removed",
      (data: FriendRemovedPayload) => {
        setFriends((prev) =>
          prev.filter((friend) => friend._id !== data.friendId)
        );
      }
    );

    return () => {
      unsubscribeRequestReceived();
      unsubscribeRequestAccepted();
      unsubscribeRequestRejected();
      unsubscribeRequestCanceled();
      unsubscribeFriendRemoved();
    };
  }, [refreshAll]);

  const sendRequest = useCallback(
    async (payload: SendFriendRequestDto) => {
      try {
        setActionState({ type: "send" });

        const response = await friendService.sendFriendRequest(payload);

        if (response.success) {
          toast.success(response.message || "Friend request sent");
          await Promise.all([fetchSentRequests(), fetchIncomingRequests()]);
          return response.data;
        }

        throw new Error(response.message || "Failed to send friend request");
      } catch (err: unknown) {
        const message = getApiErrorMessage(err, "Failed to send friend request");
        toast.error(message);
        throw err;
      } finally {
        setActionState(null);
      }
    },
    [fetchIncomingRequests, fetchSentRequests]
  );

  const acceptRequest = useCallback(
    async (requestId: string) => {
      try {
        setActionState({ type: "accept", id: requestId });

        const response = await friendService.acceptFriendRequest(requestId);

        if (response.success) {
          toast.success(response.message || "Friend request accepted");
          await Promise.all([
            fetchFriends(),
            fetchIncomingRequests(),
          ]);
          return response.data;
        }

        throw new Error(response.message || "Failed to accept friend request");
      } catch (err: unknown) {
        const message = getApiErrorMessage(
          err,
          "Failed to accept friend request"
        );
        toast.error(message);
        throw err;
      } finally {
        setActionState(null);
      }
    },
    [fetchFriends, fetchIncomingRequests]
  );

  const rejectRequest = useCallback(
    async (requestId: string) => {
      try {
        setActionState({ type: "reject", id: requestId });

        const response = await friendService.rejectFriendRequest(requestId);

        if (response.success) {
          toast.success(response.message || "Friend request rejected");
          await fetchIncomingRequests();
          return response.data;
        }

        throw new Error(response.message || "Failed to reject friend request");
      } catch (err: unknown) {
        const message = getApiErrorMessage(
          err,
          "Failed to reject friend request"
        );
        toast.error(message);
        throw err;
      } finally {
        setActionState(null);
      }
    },
    [fetchIncomingRequests]
  );

  const cancelRequest = useCallback(
    async (requestId: string) => {
      try {
        setActionState({ type: "cancel", id: requestId });

        const response = await friendService.cancelFriendRequest(requestId);

        if (response.success) {
          toast.success(response.message || "Friend request canceled");
          await fetchSentRequests();
          return response.data;
        }

        throw new Error(response.message || "Failed to cancel friend request");
      } catch (err: unknown) {
        const message = getApiErrorMessage(
          err,
          "Failed to cancel friend request"
        );
        toast.error(message);
        throw err;
      } finally {
        setActionState(null);
      }
    },
    [fetchSentRequests]
  );

  const removeFriend = useCallback(
    async (friendId: string) => {
      try {
        setActionState({ type: "remove", id: friendId });

        const response = await friendService.removeFriend(friendId);

        if (response.success) {
          toast.success(response.message || "Friend removed");
          await fetchFriends();
          return response.data;
        }

        throw new Error(response.message || "Failed to remove friend");
      } catch (err: unknown) {
        const message = getApiErrorMessage(err, "Failed to remove friend");
        toast.error(message);
        throw err;
      } finally {
        setActionState(null);
      }
    },
    [fetchFriends]
  );

  return {
    friends,
    incomingRequests,
    sentRequests,
    loading,
    error,
    actionState,
    isActionLoading,
    refreshAll,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    removeFriend,
  };
}
