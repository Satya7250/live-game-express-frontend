import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";

interface ProfileDetailItemProps {
  label: string;
  value: ReactNode;
  showSeparator?: boolean;
}

export function ProfileDetailItem({
  label,
  value,
  showSeparator = true,
}: ProfileDetailItemProps) {
  return (
    <>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="font-medium break-words">{value}</div>
      </div>
      {showSeparator && <Separator />}
    </>
  );
}
