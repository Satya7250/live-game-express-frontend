"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Gamepad2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAuthStore } from "@/store/auth.store";
import { getMyRooms } from "@/services/room.service";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  wins: {
    label: "Wins",
    color: "var(--primary)", // Theme primary color dynamically mapped
  },
  losses: {
    label: "Losses",
    color: "rgba(255, 255, 255, 0.2)", // Muted Charcoal/Silver
  },
} satisfies ChartConfig;

export function GameHistoryChart() {
  const user = useAuthStore((state) => state.user);
  const [chartData, setChartData] = React.useState<Array<{ date: string; wins: number; losses: number }>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const roomsRes = await getMyRooms({ limit: 100 }).catch(() => ({ success: true, data: { rooms: [] } }));
        const roomsList = roomsRes.success ? (roomsRes.data?.rooms || []) : [];
        
        const finishedRooms = roomsList.filter(r => 
          r.status === "finished" && 
          r.players.some(p => p._id === user?._id)
        );

        if (finishedRooms.length > 0) {
          // Group finished rooms by date client-side
          const grouped: Record<string, { wins: number; losses: number }> = {};
          
          finishedRooms.forEach(room => {
            const dateStr = new Date(room.updatedAt).toISOString().split("T")[0];
            if (!grouped[dateStr]) {
              grouped[dateStr] = { wins: 0, losses: 0 };
            }
            
            const isWin = (room as any).winner === user?._id;
            if (isWin) {
              grouped[dateStr].wins += 1;
            } else {
              // If there's a winner and it is not me, it is a loss (or if winner is null, it is a draw/loss)
              grouped[dateStr].losses += 1;
            }
          });

          // Format for chart
          const formatted = Object.entries(grouped).map(([date, stats]) => ({
            date,
            wins: stats.wins,
            losses: stats.losses
          })).sort((a, b) => a.date.localeCompare(b.date));
          
          setChartData(formatted);
        } else {
          setChartData([]);
        }
      } catch (error) {
        console.error("Failed to load chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadChartData();
    }
  }, [user]);

  if (loading) {
    return (
      <Card className="glass-card border-border/40 hover:transform-none hover:shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-36 bg-muted/60" />
          <Skeleton className="h-4 w-52 bg-muted/60 mt-1" />
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <Skeleton className="h-[200px] w-full bg-muted/60" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:transform-none hover:shadow-lg bg-background/30 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white">Game Win/Loss History</CardTitle>
        <CardDescription className="text-neutral-400">Visual stats for your recent online matches</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6">
        {chartData.length === 0 ? (
          <div className="flex h-[250px] w-full flex-col items-center justify-center text-center border border-dashed rounded-xl border-border/50 bg-muted/5 p-4">
            <Gamepad2 className="size-8 text-neutral-500 mb-2" />
            <p className="text-sm font-bold text-neutral-200">No game history yet</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-[240px] leading-relaxed">
              Play a game of Tic-Tac-Toe in active rooms to populate your history.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillWins" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-wins)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-wins)" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="fillLosses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-losses)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-losses)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/15" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="wins"
                type="monotone"
                fill="url(#fillWins)"
                stroke="var(--color-wins)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="losses"
                type="monotone"
                fill="url(#fillLosses)"
                stroke="var(--color-losses)"
                strokeWidth={1.5}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
