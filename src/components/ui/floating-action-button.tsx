
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

/**
 * FloatingActionButton props
 */
interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function FloatingActionButton({
  onClick,
  className,
  children,
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fab",
        // Adjusted position to prevent overlap with bottom nav
        "fixed right-6 bottom-20 md:right-10",
        "rounded-full bg-app-black text-app-white",
        "w-14 h-14 flex items-center justify-center text-2xl",
        "transition-all hover:scale-105 active:scale-95",
        "shadow-lg z-[999]", // Higher z-index and better shadow
        className
      )}
      aria-label="Add"
    >
      {children || <Plus className="w-7 h-7" />}
    </button>
  );
}
