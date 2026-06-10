export function formatDateTime(dateString?: string): string {
  if (!dateString) {
    return "Not available";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatRole(role?: string): string {
  if (!role) {
    return "Not set";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function formatGameType(gameType?: string): string {
  if (!gameType) {
    return "Not set";
  }

  const labels: Record<string, string> = {
    "tic-tac-toe": "Tic Tac Toe",
    "rock-paper-scissors": "Rock Paper Scissors",
  };

  return labels[gameType] ?? gameType;
}

export function formatRoomStatus(status?: string): string {
  if (!status) {
    return "Unknown";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}
