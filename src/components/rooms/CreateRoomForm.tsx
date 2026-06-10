"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createRoomSchema,
  type CreateRoomFormData,
} from "@/schemas/create-room.schema";
import { getApiErrorMessage } from "@/lib/api-error";
import * as roomService from "@/services/room.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateRoomForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      gameType: "tic-tac-toe",
      maxPlayers: 2,
    },
  });

  const onSubmit = async (data: CreateRoomFormData) => {
    try {
      setLoading(true);

      const response = await roomService.createRoom(data);

      if (response.success && response.data) {
        toast.success(response.message || "Room created successfully");
        router.push(`/dashboard/rooms/${response.data.roomCode}`);
        return;
      }

      throw new Error(response.message || "Failed to create room");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to create room"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="room-name">Room Name</Label>
        <Input
          id="room-name"
          placeholder="Enter room name"
          disabled={loading}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="game-type">Game Type</Label>
        <Controller
          name="gameType"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={loading}
            >
              <SelectTrigger id="game-type" className="w-full">
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tic-tac-toe">Tic Tac Toe</SelectItem>
                <SelectItem value="rock-paper-scissors">
                  Rock Paper Scissors
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.gameType && (
          <p className="text-sm text-destructive">{errors.gameType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="max-players">Max Players</Label>
        <Input
          id="max-players"
          type="number"
          min={2}
          max={10}
          disabled={loading}
          {...register("maxPlayers", { valueAsNumber: true })}
        />
        {errors.maxPlayers && (
          <p className="text-sm text-destructive">
            {errors.maxPlayers.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Between 2 and 10 players
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          disabled={loading}
          onClick={() => router.push("/dashboard/rooms")}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Creating room..." : "Create Room"}
        </Button>
      </div>
    </form>
  );
}
