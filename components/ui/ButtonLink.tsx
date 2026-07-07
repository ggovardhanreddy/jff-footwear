import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "outline" | "whatsapp";

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

const variants: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  outline: "btn-outline",
  whatsapp: "btn-whatsapp",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "",
  lg: "px-10 py-4 text-base",
};

export default function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
