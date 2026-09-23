import Link from "next/link";
import { reviews } from "@/data/content";
import { ROUTES } from "@/lib/constants";

export default function ReviewsBand() {
  const published = reviews.filter((review) => review.comment && review.name);

  return (
    <section className="container-custom py-16 md:py-24" aria-labelledby="reviews-heading">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
        Voices
      </p>
      <h2
        id="reviews-heading"
        className="mt-2 font-display text-3xl font-semibold text-brand-black dark:text-[#f4f0ea] md:text-4xl"
      >
        Customer reviews
      </h2>
      {published.length === 0 ? (
        <div className="mt-8 max-w-2xl rounded-[1.6rem] border border-black/[0.06] bg-[#fffcf8] p-6 dark:border-white/10 dark:bg-[#1c1916] md:p-8">
          <p className="text-base leading-relaxed text-brand-muted">
            Verified buyer reviews will appear here as they are collected. Product pages already
            keep a place for ratings once orders start coming in.
          </p>
          <Link
            href={ROUTES.contact}
            className="focus-ring mt-6 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-black underline decoration-brand-accent/70 underline-offset-4 dark:text-[#f4f0ea]"
          >
            Share feedback
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {published.slice(0, 3).map((review) => (
            <li
              key={review.id}
              className="rounded-[1.4rem] border border-black/[0.06] bg-[#fffcf8] p-5 dark:border-white/10 dark:bg-[#1c1916]"
            >
              <p className="text-sm leading-relaxed text-brand-black dark:text-[#f4f0ea]">
                {review.comment}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted">
                {review.name}
                {review.location ? ` · ${review.location}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
