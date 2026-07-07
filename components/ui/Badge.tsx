import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "outline" | "new";
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
