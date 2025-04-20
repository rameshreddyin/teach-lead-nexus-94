
import { LeadStatus, getStatusText } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusClasses = {
    new: "bg-app-black text-app-white",
    contacted: "bg-app-pending text-app-black",
    follow_up: "bg-app-followup text-app-white",
    converted: "bg-app-success text-app-white",
    closed: "bg-app-closed text-app-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusClasses[status],
        className
      )}
    >
      {getStatusText(status)}
    </span>
  );
}
