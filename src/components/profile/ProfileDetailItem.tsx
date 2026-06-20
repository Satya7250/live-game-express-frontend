import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProfileDetailItemProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function ProfileDetailItem({
  label,
  value,
  icon,
  className,
}: ProfileDetailItemProps) {
  return (
    <div className={cn(
      "flex items-start justify-start text-left w-full gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-red-500/20 hover:bg-white/[0.04] transition-all duration-200 group",
      className
    )}>
      {icon && (
        <div className="flex size-10 items-center justify-center rounded-lg bg-white/[0.03] border border-white/5 text-primary group-hover:scale-105 group-hover:border-red-500/30 group-hover:bg-red-500/5 transition-all duration-200 shrink-0">
          {icon}
        </div>
      )}
      <div className="space-y-1 min-w-0 flex-1">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{label}</p>
        <div className="text-sm font-medium text-white break-words">{value}</div>
      </div>
    </div>
  );
}
