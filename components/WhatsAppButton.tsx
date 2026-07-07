import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  message?: string;
  label?: string;
  className?: string;
  variant?: "inline" | "floating";
}

export default function WhatsAppButton({
  message = "Hello JFF, I would like to inquire about your products.",
  label = "WhatsApp",
  className,
  variant = "inline",
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#1da851]",
          className
        )}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("btn-whatsapp", className)}
    >
      <MessageCircle className="h-5 w-5" />
      {label}
    </a>
  );
}
