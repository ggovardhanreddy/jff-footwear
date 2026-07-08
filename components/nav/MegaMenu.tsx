"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  PRODUCT_CATEGORIES,
  MATERIALS,
  GENDERS,
  ROUTES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  showSolid: boolean;
}

export default function MegaMenu({ showSolid }: MegaMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative hidden md:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "link-underline focus-ring flex items-center gap-1 rounded-sm text-xs font-semibold uppercase tracking-widest transition-colors",
          showSolid
            ? "text-brand-black hover:text-brand-accent"
            : "text-white/90 hover:text-brand-accent"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Shop
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div
          className="absolute left-1/2 top-full z-50 mt-3 w-[min(90vw,720px)] -translate-x-1/2 rounded-[24px] border border-black/[0.06] bg-white/95 p-8 shadow-premium backdrop-blur-xl"
          role="menu"
        >
          <div className="grid gap-8 md:grid-cols-3">
            <MegaColumn title="Categories" items={PRODUCT_CATEGORIES} param="category" />
            <MegaColumn title="Materials" items={MATERIALS} param="material" />
            <MegaColumn title="Gender" items={GENDERS} param="gender" />
          </div>
          <div className="mt-6 flex flex-wrap gap-4 border-t border-black/[0.06] pt-6">
            <Link
              href={ROUTES.products}
              className="focus-ring text-sm font-semibold text-brand-accent hover:underline"
            >
              All Products →
            </Link>
            <Link
              href={ROUTES.customize}
              className="focus-ring text-sm font-semibold text-brand-black hover:text-brand-accent"
            >
              Customize Slippers →
            </Link>
            <Link
              href={ROUTES.categories}
              className="focus-ring text-sm font-semibold text-brand-muted hover:text-brand-accent"
            >
              Browse Categories →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function MegaColumn({
  title,
  items,
  param,
}: {
  title: string;
  items: readonly string[];
  param: string;
}) {
  return (
    <div>
      <p className="eyebrow mb-4 text-brand-accent">{title}</p>
      <ul className="space-y-2">
        {items.slice(0, 8).map((item) => (
          <li key={item}>
            <Link
              href={`${ROUTES.products}?${param}=${encodeURIComponent(item)}`}
              className="focus-ring block rounded-lg py-1.5 text-sm text-brand-muted transition-colors hover:text-brand-black"
              role="menuitem"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
