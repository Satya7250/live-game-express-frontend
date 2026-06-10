export type TicTacToeSymbol = "X" | "O";

export type TicTacToeCell = TicTacToeSymbol | null;

export type TicTacToeStatus = "playing" | "won" | "draw";

export interface TicTacToeGame {
  players: string[];
  currentTurn: string;
  board: TicTacToeCell[];
  status: TicTacToeStatus;
  winner: string | null;
  winningLine: number[] | null;
  symbols: Record<string, TicTacToeSymbol>;
}

export interface TicTacToeMoveRecord {
  position: number;
  symbol: TicTacToeSymbol;
  playerId: string;
  timestamp: number;
}

export type TicTacToeGameEndReason = "room_deleted" | string;
