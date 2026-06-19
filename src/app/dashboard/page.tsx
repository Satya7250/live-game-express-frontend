"use client";
 
 import dynamic from "next/dynamic";
 import { PlayerStatsCards } from "@/components/dashboard/PlayerStatsCards"
 import { Skeleton } from "@/components/ui/skeleton"
 
 const GameHistoryChart = dynamic(
   () => import("@/components/dashboard/GameHistoryChart").then((mod) => mod.GameHistoryChart),
   {
     loading: () => <Skeleton className="h-[350px] w-full rounded-xl" />,
     ssr: false
   }
 );
 
 const ActiveRoomsWidget = dynamic(
   () => import("@/components/dashboard/ActiveRoomsWidget").then((mod) => mod.ActiveRoomsWidget),
   {
     loading: () => <Skeleton className="h-[350px] w-full rounded-xl" />,
     ssr: false
   }
 );
 
 export default function Page() {
   return (
     <div className="flex flex-col gap-6">
       <PlayerStatsCards />
       <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
         <GameHistoryChart />
         <ActiveRoomsWidget />
       </div>
     </div>
   )
 }
