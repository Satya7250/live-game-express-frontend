"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import * as roomService from "@/services/room.service";
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

interface LeaveRoomButtonProps {
  roomCode: string;
  roomName: string;
  onLeave?: () => Promise<unknown>;
}

export default function LeaveRoomButton({
  roomCode,
  roomName,
  onLeave,
}: LeaveRoomButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLeave = async () => {
    try {
      setLoading(true);

      if (onLeave) {
        await onLeave();
      } else {
        await roomService.leaveRoom(roomCode);
      }

      setOpen(false);
      router.push("/dashboard/rooms");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to leave room"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="btn-gaming bg-destructive hover:bg-destructive/90 text-white font-semibold shadow-md shadow-red-900/10 gap-2 border-0 h-9.5">
          <LogOut className="size-4" />
          Leave Room
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border/45 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">Leave room?</DialogTitle>
          <DialogDescription className="text-neutral-400 text-sm mt-1">
            You are about to leave &quot;{roomName}&quot;. If you are the last
            player, the room will be deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row mt-4">
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() => setOpen(false)}
            className="rounded-lg h-9 font-semibold bg-background/30 hover:bg-background/50 border border-white/10 text-neutral-200 transition-all"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={() => void handleLeave()}
            className="rounded-lg h-9 font-semibold bg-destructive hover:bg-destructive/90 text-white border-0 shadow-sm"
          >
            {loading ? "Leaving..." : "Leave Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
