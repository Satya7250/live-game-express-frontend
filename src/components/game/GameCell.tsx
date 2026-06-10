"use client";

import { memo } from "react";

import type { TicTacToeCell } from "@/types/tic-tac-toe";
import { cn } from "@/lib/utils";

interface GameCellProps {
  value: TicTacToeCell;
  index: number;
  disabled?: boolean;
  isWinning?: boolean;
  isLastMove?: boolean;
  onClick?: (index: number) => void;
}

function GameCellComponent({
  value,
  index,
  disabled = false,
  isWinning = false,
  isLastMove = false,
  onClick,
}: GameCellProps) {
  return (
    <button
      type="button"
      aria-label={
        value ? `Cell ${index + 1}, ${value}` : `Empty cell ${index + 1}`
      }
      disabled={disabled || value !== null}
      onClick={() => onClick?.(index)}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-xl border-2 text-4xl font-bold transition-all sm:text-5xl",
        "bg-card hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        value === "X" && "text-sky-500",
        value === "O" && "text-rose-500",
        isWinning && "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/20",
        isLastMove && !isWinning && "ring-2 ring-violet-500/60",
        disabled && "cursor-not-allowed opacity-70"
      )}
    >
      <span
        className={cn(
          "transition-transform duration-300",
          value && "animate-in zoom-in-50",
          isLastMove && value && "scale-110"
        )}
      >
        {value}
      </span>
      {isLastMove && value && (
        <span className="absolute inset-0 rounded-xl ring-2 ring-violet-400/40 animate-pulse" />
      )}
    </button>
  );
}

const GameCell = memo(GameCellComponent);

export default GameCell;
