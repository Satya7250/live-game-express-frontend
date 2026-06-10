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
        <Button variant="destructive" className="gap-2">
          <LogOut className="size-4" />
          Leave Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave room?</DialogTitle>
          <DialogDescription>
            You are about to leave &quot;{roomName}&quot;. If you are the last
            player, the room will be deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={() => void handleLeave()}
          >
            {loading ? "Leaving..." : "Leave Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
