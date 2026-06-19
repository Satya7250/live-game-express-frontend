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
    <div className="glass-card flex items-center justify-between gap-3 p-4 border border-border/40 hover:border-primary/20">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-11 border border-border/60">
          <AvatarImage src={friend.avatar} alt={friend.name} />
          <AvatarFallback className="bg-gradient-to-r from-red-500 via-purple-600 to-indigo-600 text-white font-medium text-sm">
            {friend.name?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-bold text-sm text-neutral-100">{friend.name}</p>
          <p className="truncate text-xs text-neutral-400">
            {friend.email}
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 h-8 gap-1.5 font-medium rounded-lg text-neutral-400 hover:text-destructive hover:bg-destructive/10 border-white/10 hover:border-destructive/30 transition-all"
            disabled={removing}
          >
            {removing ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <UserMinus className="size-3.5" />
            )}
            Remove
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-card border-border/45 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">Remove friend?</DialogTitle>
            <DialogDescription className="text-neutral-400 text-sm mt-1">
              You are about to remove &quot;{friend.name}&quot; from your
              friends list. You can send them a new request later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row mt-4">
            <Button
              type="button"
              variant="secondary"
              disabled={removing}
              className="rounded-lg h-9 font-semibold bg-background/30 hover:bg-background/50 border-white/10"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={removing}
              className="rounded-lg h-9 font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0 shadow-sm"
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
