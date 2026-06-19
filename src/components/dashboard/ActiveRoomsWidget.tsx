"use client";
 
 import { useEffect, useState } from "react";
 import Link from "next/link";
 import { Play, Users, Gamepad2, ArrowRight } from "lucide-react";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Skeleton } from "@/components/ui/skeleton";
 import { getMyRooms } from "@/services/room.service";
 import { formatRoomStatus, formatGameType } from "@/lib/format";
 import type { Room } from "@/types/room";
 
 export function ActiveRoomsWidget() {
   const [rooms, setRooms] = useState<Room[]>([]);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     const fetchActiveRooms = async () => {
       try {
         setLoading(true);
         const response = await getMyRooms({ page: 1, limit: 10 });
         if (response.success && response.data) {
           // Show only open / joinable / playing rooms
           const active = response.data.rooms.filter(
             (room) => room.status === "waiting" || room.status === "playing"
           );
           setRooms(active.slice(0, 5)); // Show top 5
         }
       } catch (error) {
         console.error("Failed to load active rooms lobby:", error);
       } finally {
         setLoading(false);
       }
     };
 
     fetchActiveRooms();
   }, []);
 
   if (loading) {
     return (
       <Card>
         <CardHeader>
           <Skeleton className="h-6 w-32 mb-2" />
           <Skeleton className="h-4 w-48" />
         </CardHeader>
         <CardContent className="space-y-4">
           {Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
               <div className="space-y-1.5">
                 <Skeleton className="h-5 w-40" />
                 <Skeleton className="h-4.5 w-24" />
               </div>
               <Skeleton className="h-8 w-20" />
             </div>
           ))}
         </CardContent>
       </Card>
     );
   }
 
   return (
     <Card className="border-border/40 bg-background/50 backdrop-blur-[2px]">
       <CardHeader className="flex flex-row items-center justify-between space-y-0">
         <div>
           <CardTitle className="text-lg font-semibold">Active Game Rooms</CardTitle>
           <CardDescription>Join a room to play right now</CardDescription>
         </div>
         <Button asChild variant="ghost" size="sm" className="gap-1.5 font-medium hover:bg-muted">
           <Link href="/dashboard/rooms">
             Lobby
             <ArrowRight className="size-4" />
           </Link>
         </Button>
       </CardHeader>
       <CardContent className="pt-2">
         {rooms.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed rounded-xl border-border/60 bg-muted/10">
             <Gamepad2 className="size-8 text-muted-foreground/60 mb-2" />
             <p className="text-sm font-medium text-foreground/80">No active rooms found</p>
             <p className="text-xs text-muted-foreground mt-0.5 max-w-[250px]">
               Create a new room in the lobby and invite your friends to start playing.
             </p>
             <Button asChild size="sm" className="mt-4 gap-1.5">
               <Link href="/dashboard/rooms">
                 <Play className="size-3.5 fill-current" />
                 Open Lobby
               </Link>
             </Button>
           </div>
         ) : (
           <div className="space-y-4">
             {rooms.map((room) => (
               <div
                 key={room._id}
                 className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0"
               >
                 <div className="space-y-1">
                   <div className="flex items-center gap-2">
                     <span className="font-semibold text-sm">{room.name}</span>
                     <Badge variant={room.status === "playing" ? "default" : "secondary"} className="h-5 text-[10px] px-1.5">
                       {formatRoomStatus(room.status)}
                     </Badge>
                   </div>
                   <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                     <span>{formatGameType(room.gameType)}</span>
                     <span>•</span>
                     <span className="flex items-center gap-1">
                       <Users className="size-3" />
                       {room.players.length}/{room.maxPlayers}
                     </span>
                     <span>•</span>
                     <span className="font-mono tracking-wider">{room.roomCode}</span>
                   </div>
                 </div>
                 <Button asChild size="xs" variant={room.status === "playing" ? "outline" : "default"}>
                   <Link href={`/dashboard/rooms/${room.roomCode}`}>
                     {room.status === "playing" ? "Watch" : "Join"}
                   </Link>
                 </Button>
               </div>
             ))}
           </div>
         )}
       </CardContent>
     </Card>
   );
 }
