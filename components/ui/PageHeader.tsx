import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  titleAs?: "h1" | "h2";
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  titleAs = "h1",
  actions,
  className,
}: PageHeaderProps) {
  const TitleTag = titleAs;

  return (
    <header
      className={cn(
        "page-header flex flex-wrap items-end justify-between gap-4",
        className
      )}
    >
      <div className="max-w-3xl">
        {eyebrow && <p className="eyebrow text-brand-accent">{eyebrow}</p>}
        <TitleTag className="page-header__title mt-2 text-brand-black dark:text-white">
          {title}
        </TitleTag>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-brand-muted md:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}
