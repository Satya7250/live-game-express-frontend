import type {
  TicTacToeCell,
  TicTacToeGame,
  TicTacToeMoveRecord,
  TicTacToeSymbol,
} from "@/types/tic-tac-toe";

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export const LOCAL_PLAYER_ONE_ID = "local-player-1";
export const LOCAL_PLAYER_TWO_ID = "local-player-2";

export function createLocalGame(): TicTacToeGame {
  return createGame([LOCAL_PLAYER_ONE_ID, LOCAL_PLAYER_TWO_ID]);
}

export function createGame(players: string[]): TicTacToeGame {
  if (!Array.isArray(players) || players.length !== 2) {
    throw new Error("Game requires exactly 2 players");
  }

  if (new Set(players).size !== 2) {
    throw new Error("Players must be unique");
  }

  return {
    players,
    currentTurn: players[0],
    board: Array(9).fill(null) as TicTacToeCell[],
    status: "playing",
    winner: null,
    winningLine: null,
    symbols: {
      [players[0]]: "X",
      [players[1]]: "O",
    },
  };
}

export function checkWinner(board: TicTacToeCell[]) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        line: [...line],
      };
    }
  }

  return null;
}

export function checkDraw(board: TicTacToeCell[]): boolean {
  return board.every((cell) => cell !== null);
}

export function makeMove(
  gameState: TicTacToeGame,
  playerId: string,
  position: number
): TicTacToeGame {
  if (!gameState.players.includes(playerId)) {
    throw new Error("Invalid player");
  }

  if (!Number.isInteger(position) || position < 0 || position > 8) {
    throw new Error("Invalid position");
  }

  if (gameState.status !== "playing") {
    throw new Error("Game is not active");
  }

  if (gameState.currentTurn !== playerId) {
    throw new Error("Not your turn");
  }

  if (gameState.board[position] !== null) {
    throw new Error("Cell already occupied");
  }

  const newBoard = [...gameState.board];
  newBoard[position] = gameState.symbols[playerId];

  let newStatus: TicTacToeGame["status"] = "playing";
  let newWinner: string | null = null;
  let newWinningLine: number[] | null = null;

  const winnerResult = checkWinner(newBoard);

  if (winnerResult) {
    newStatus = "won";
    newWinner = playerId;
    newWinningLine = winnerResult.line;
  } else if (checkDraw(newBoard)) {
    newStatus = "draw";
  }

  const nextTurn = gameState.players.find((player) => player !== playerId);

  return {
    ...gameState,
    board: newBoard,
    status: newStatus,
    winner: newWinner,
    winningLine: newWinningLine,
    currentTurn: nextTurn ?? gameState.currentTurn,
  };
}

export function restartGame(gameState: TicTacToeGame): TicTacToeGame {
  return createGame(gameState.players);
}

export function extractMove(
  previousBoard: TicTacToeGame["board"],
  nextBoard: TicTacToeGame["board"],
  game: TicTacToeGame
): TicTacToeMoveRecord | null {
  for (let index = 0; index < nextBoard.length; index += 1) {
    if (previousBoard[index] === null && nextBoard[index] !== null) {
      const symbol = nextBoard[index] as TicTacToeSymbol;
      const playerId =
        Object.entries(game.symbols).find(
          ([, value]) => value === symbol
        )?.[0] ?? "";

      return {
        position: index,
        symbol,
        playerId,
        timestamp: Date.now(),
      };
    }
  }

  return null;
}
