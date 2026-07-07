import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  /** Optional ambient background variant */
  ambient?: "none" | "cream" | "light";
  fullWidth?: boolean;
}

export default function PageShell({
  children,
  className,
  ambient = "none",
  fullWidth = false,
}: PageShellProps) {
  return (
    <div
      className={cn(
        "page-shell relative overflow-hidden",
        ambient === "cream" && "bg-brand-cream",
        ambient === "light" && "bg-white",
        className
      )}
    >
      {fullWidth ? children : (
        <div className="container-custom section-padding relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}
