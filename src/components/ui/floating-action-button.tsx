
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

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
        "fixed bottom-6 right-6 rounded-full bg-app-black text-app-white shadow-lg z-10",
        "w-14 h-14 flex items-center justify-center text-2xl",
        "transition-all hover:scale-105 active:scale-95",
        className
      )}
    >
      {children || <Plus className="w-6 h-6" />}
    </button>
  );
}
