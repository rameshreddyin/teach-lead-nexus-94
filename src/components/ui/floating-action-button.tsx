
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
        // Adjusted bottom position to prevent overlap with bottom nav
        "fixed right-6 bottom-20 md:right-10 md:bottom-8",
        "rounded-full bg-app-black text-app-white shadow-lg",
        "w-14 h-14 flex items-center justify-center text-2xl",
        "transition-all hover:scale-105 active:scale-95",
        "z-[999]",  // extra high z-index
        className
      )}
      aria-label="Add"
    >
      {children || <Plus className="w-7 h-7" />}
    </button>
  );
}
