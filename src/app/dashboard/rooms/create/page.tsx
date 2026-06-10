import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CreateRoomForm from "@/components/rooms/CreateRoomForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateRoomPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold sm:text-3xl">Create Room</h1>
          <p className="text-muted-foreground">
            Set up a new game room and invite others to join
          </p>
        </div>
        <Button asChild variant="secondary" className="w-full gap-2 sm:w-auto">
          <Link href="/dashboard/rooms">
            <ArrowLeft className="size-4" />
            Back to Rooms
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Settings</CardTitle>
          <CardDescription>
            Choose a name, game type, and player limit for your room
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateRoomForm />
        </CardContent>
      </Card>
    </div>
  );
}
