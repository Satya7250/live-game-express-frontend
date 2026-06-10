"use client";

import { memo, useState } from "react";
import { Loader2, UserMinus } from "lucide-react";

import type { FriendUser } from "@/types/friend";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FriendCardProps {
  friend: FriendUser;
  removing?: boolean;
  onRemove?: (friendId: string) => Promise<unknown>;
}

function FriendCardComponent({
  friend,
  removing = false,
  onRemove,
}: FriendCardProps) {
  const [open, setOpen] = useState(false);

  const handleRemove = async () => {
    if (!onRemove) {
      return;
    }

    await onRemove(friend._id);
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border p-4 transition-colors hover:border-primary/30">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-12 border">
          <AvatarImage src={friend.avatar} alt={friend.name} />
          <AvatarFallback className="bg-gradient-to-r from-violet-600 to-pink-500 text-white">
            {friend.name?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium">{friend.name}</p>
          <p className="truncate text-sm text-muted-foreground">
            {friend.email}
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5 text-destructive hover:text-destructive"
            disabled={removing}
          >
            {removing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UserMinus className="size-4" />
            )}
            Remove
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove friend?</DialogTitle>
            <DialogDescription>
              You are about to remove &quot;{friend.name}&quot; from your
              friends list. You can send them a new request later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              disabled={removing}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={removing}
              onClick={() => void handleRemove()}
            >
              {removing ? "Removing..." : "Remove Friend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const FriendCard = memo(FriendCardComponent);

export default FriendCard;
