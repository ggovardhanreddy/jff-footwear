import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "outline" | "new" | "muted";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-brand-black text-white",
    accent: "bg-brand-accent text-brand-black",
    outline: "border border-brand-black text-brand-black",
    new: "bg-green-600 text-white",
    muted: "bg-white/90 text-brand-black shadow-sm backdrop-blur-sm",
  };

  return (
    <span
      className={cn(
        "inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-widest",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
