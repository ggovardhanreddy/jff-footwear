import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const POINTS = ["Bulk orders", "Competitive pricing", "Large product range", "Reliable supply"];

export default function WholesaleBand() {
  return (
    <section className="container-custom py-8 md:py-12" aria-labelledby="wholesale-heading">
      <div className="rounded-[1.8rem] bg-[#161311] px-6 py-12 text-[#f4f0ea] md:px-12 md:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c6a27a]">
          Wholesale
        </p>
        <h2
          id="wholesale-heading"
          className="mt-3 max-w-xl font-display text-3xl font-semibold md:text-5xl"
        >
          Build your business with JFF
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((point) => (
            <li
              key={point}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm"
            >
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={ROUTES.wholesale}
            className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-[#f4f0ea] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#161311]"
          >
            Wholesale enquiry
          </Link>
          <Link
            href={ROUTES.dealer}
            className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white"
          >
            Become a JFF partner
          </Link>
        </div>
      </div>
    </section>
  );
}
