"use client";

import { memo } from "react";
import { Users } from "lucide-react";

import FriendCard from "@/components/friends/FriendCard";
import type { FriendUser } from "@/types/friend";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FriendsListProps {
  friends: FriendUser[];
  removingFriendId?: string | null;
  onRemoveFriend?: (friendId: string) => Promise<unknown>;
}

function FriendsListComponent({
  friends,
  removingFriendId = null,
  onRemoveFriend,
}: FriendsListProps) {
  if (friends.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Users className="size-5" />
            No friends yet
          </CardTitle>
          <CardDescription>
            Send a friend request to start building your network.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Friends</CardTitle>
        <CardDescription>
          {friends.length} friend{friends.length === 1 ? "" : "s"} in your list
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {friends.map((friend) => (
          <FriendCard
            key={friend._id}
            friend={friend}
            removing={removingFriendId === friend._id}
            onRemove={onRemoveFriend}
          />
        ))}
      </CardContent>
    </Card>
  );
}

const FriendsList = memo(FriendsListComponent);

export default FriendsList;
