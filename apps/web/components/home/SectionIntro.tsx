import Link from "next/link";

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  cta?: string;
};

export default function SectionIntro({
  eyebrow,
  title,
  description,
  href,
  cta,
}: SectionIntroProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
      <div className="max-w-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-black dark:text-[#f4f0ea] md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-brand-muted md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {href && cta ? (
        <Link
          href={href}
          className="focus-ring link-underline inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.22em] text-brand-black dark:text-[#f4f0ea]"
        >
          {cta}
        </Link>
      ) : null}
    </div>
  );
}
