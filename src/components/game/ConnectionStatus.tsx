"use client";

import { Loader2, RefreshCw, Wifi, WifiOff } from "lucide-react";

import type { SocketConnectionStatus } from "@/types/socket";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ConnectionStatusProps {
  status: SocketConnectionStatus;
  onReconnect?: () => void;
}

function getStatusConfig(status: SocketConnectionStatus) {
  switch (status) {
    case "connected":
      return {
        label: "Connected",
        variant: "default" as const,
        icon: Wifi,
        className: "bg-emerald-600 hover:bg-emerald-600",
      };
    case "connecting":
    case "reconnecting":
      return {
        label: status === "connecting" ? "Connecting" : "Reconnecting",
        variant: "secondary" as const,
        icon: Loader2,
        className: "animate-pulse",
      };
    case "error":
      return {
        label: "Connection Error",
        variant: "destructive" as const,
        icon: WifiOff,
        className: "",
      };
    default:
      return {
        label: "Disconnected",
        variant: "outline" as const,
        icon: WifiOff,
        className: "",
      };
  }
}

export default function ConnectionStatus({ status, onReconnect }: ConnectionStatusProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  const isSpinning = status === "connecting" || status === "reconnecting";

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant} className={`gap-1.5 ${config.className}`}>
        <Icon className={`size-3.5 ${isSpinning ? "animate-spin" : ""}`} />
        {config.label}
      </Badge>
      {status === "error" && onReconnect && (
        <Button
          onClick={onReconnect}
          variant="outline"
          size="xs"
          className="h-6 px-2 text-xs gap-1 border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
        >
          <RefreshCw className="size-3" />
          Reconnect
        </Button>
      )}
    </div>
  );
}
