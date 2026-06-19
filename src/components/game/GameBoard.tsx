"use client";

import { memo } from "react";

import GameCell from "@/components/game/GameCell";
import type { TicTacToeCell } from "@/types/tic-tac-toe";

interface GameBoardProps {
  board: TicTacToeCell[];
  winningLine?: number[] | null;
  lastMovePosition?: number | null;
  disabled?: boolean;
  onCellClick?: (index: number) => void;
}

function GameBoardComponent({
  board,
  winningLine = null,
  lastMovePosition = null,
  disabled = false,
  onCellClick,
}: GameBoardProps) {
  return (
    <div className="mx-auto grid w-full max-w-sm grid-cols-3 gap-2 sm:max-w-md sm:gap-3">
      {board.map((cell, index) => (
        <GameCell
          key={index}
          value={cell}
          index={index}
          disabled={disabled}
          isWinning={winningLine?.includes(index) ?? false}
          isLastMove={lastMovePosition === index}
          onClick={onCellClick}
        />
      ))}
    </div>
  );
}

const GameBoard = memo(GameBoardComponent);

export default GameBoard;
