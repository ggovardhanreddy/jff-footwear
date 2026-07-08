import { Phone, Mail, MessageCircle, MapPin, type LucideIcon } from "lucide-react";
import { COMPANY, WHATSAPP_NUMBER } from "@/lib/constants";
import { ADDRESS_LINES } from "@/data/company";
import { cn } from "@/lib/utils";

interface ContactItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

const items: ContactItem[] = [
  {
    icon: Phone,
    label: "Phone",
    value: COMPANY.phone,
    href: `tel:${COMPANY.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: COMPANY.phone,
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    external: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
  },
  {
    icon: MapPin,
    label: "Address",
    value: COMPANY.address,
  },
];

interface ContactCardProps {
  className?: string;
}

export default function ContactCard({ className }: ContactCardProps) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-[28px] border border-black/[0.06] bg-white/80 p-6 shadow-soft backdrop-blur-md md:p-8",
        className
      )}
    >
      <div>
        <p className="eyebrow text-brand-accent">Contact</p>
        <h2 className="font-display mt-2 text-2xl font-bold">{COMPANY.fullName}</h2>
      </div>

      <address className="not-italic text-sm leading-relaxed text-brand-muted">
        {ADDRESS_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>

      <ul className="space-y-4 pt-2">
        {items.map((item) => (
          <li key={item.label} className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-black text-brand-accent">
              <item.icon className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="link-underline text-sm font-medium text-brand-black"
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-sm font-medium text-brand-black">{item.value}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
