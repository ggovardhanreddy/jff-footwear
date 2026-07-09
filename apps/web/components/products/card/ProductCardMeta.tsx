import type { Gender, Material, ProductCategory } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardMetaProps {
  gender: Gender;
  category: ProductCategory;
  material: Material;
  className?: string;
}

export default function ProductCardMeta({
  gender,
  category,
  material,
  className,
}: ProductCardMetaProps) {
  const items = [
    { label: "Gender", value: gender },
    { label: "Category", value: category },
    { label: "Material", value: material },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        className
      )}
    >
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center rounded-full border border-black/[0.06] bg-white/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-muted backdrop-blur-sm"
        >
          <span className="mr-1.5 text-brand-accent/80">{item.label}</span>
          {item.value}
        </span>
      ))}
    </div>
  );
}
