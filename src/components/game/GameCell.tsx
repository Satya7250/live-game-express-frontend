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
        "relative flex aspect-square items-center justify-center rounded-xl border-2 text-4xl font-extrabold transition-all duration-300 sm:text-5xl",
        "bg-background/30 backdrop-blur-md border-white/5 hover:border-white/15 hover:bg-white/5 hover:scale-[1.02] shadow-[0_8px_32px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        value === "X" && "text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.6)] border-sky-500/20",
        value === "O" && "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)] border-red-500/20",
        isWinning && "border-amber-400/80 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.25)] text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] hover:scale-100",
        isLastMove && !isWinning && "ring-2 ring-primary/40 border-primary/40 bg-primary/5",
        disabled && value === null && "cursor-not-allowed opacity-50 hover:scale-100"
      )}
    >
      <span
        className={cn(
          "transition-all duration-300",
          value && "animate-in zoom-in-50",
          isLastMove && value && "scale-110"
        )}
      >
        {value}
      </span>
      {isLastMove && value && (
        <span className="absolute inset-0 rounded-xl ring-2 ring-primary/30 animate-pulse" />
      )}
    </button>
  );
}

const GameCell = memo(GameCellComponent);

export default GameCell;
