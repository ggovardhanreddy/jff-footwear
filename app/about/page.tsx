import AssetImage from "@/components/ui/AssetImage";
import { Award, Users, Factory, Globe, Target, Eye, Shield, Layers } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Breadcrumb from "@/components/Breadcrumb";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { createMetadata } from "@/lib/seo";
import { COMPANY, MATERIAL_INFO } from "@/lib/constants";
import { manufacturingSteps } from "@/data/content";

export const metadata = createMetadata({
  title: "About Us",
  description:
    "Learn about JFF Footwear — a leading slipper manufacturer since 1998, crafting premium footwear for global markets.",
  path: "/about",
});

const stats = [
  { icon: Factory, value: "25+", label: "Years of Excellence" },
  { icon: Users, value: "500+", label: "Employees" },
  { icon: Globe, value: "30+", label: "Countries Exported" },
  { icon: Award, value: "2M+", label: "Pairs Annually" },
];

export default function AboutPage() {
  return (
    <div className="page-shell">
      <section className="relative flex min-h-[50vh] items-center overflow-hidden bg-brand-black">
        <AssetImage
          src="/images/hero-banner.svg"
          alt="JFF Manufacturing"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 to-brand-black/50" />
        <AnimatedBackground variant="dark" />
        <div className="container-custom relative z-10 section-padding">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
            ]}
          />
          <p className="eyebrow">Our Story</p>
          <h1 className="heading-display mt-4 max-w-3xl text-white">
            Crafting Comfort Since {COMPANY.founded}
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <SectionHeading
                subtitle="Who We Are"
                title="The JFF Legacy"
                align="left"
                className="mb-8"
              />
              <div className="space-y-4 text-body">
                <p>
                  Founded in {COMPANY.founded} in Surat, Gujarat — the footwear
                  capital of India — JFF has grown from a small workshop to one
                  of the region&apos;s most trusted slipper manufacturers.
                </p>
                <p>
                  Our commitment to quality, innovation, and customer satisfaction
                  has earned us partnerships with retailers, hotels, and
                  distributors across 30+ countries.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <AssetImage
                src="/images/hero-banner.svg"
                alt="JFF Factory"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <Target className="h-8 w-8 text-brand-accent" />
              <h2 className="mt-4 font-display text-2xl font-bold">Mission</h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-muted">
                To craft premium slippers that deliver unmatched comfort,
                durability, and style — making quality footwear accessible to
                customers and partners worldwide.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <Eye className="h-8 w-8 text-brand-accent" />
              <h2 className="mt-4 font-display text-2xl font-bold">Vision</h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-muted">
                To be the most trusted slipper manufacturer in India and a
                globally recognized brand synonymous with comfort, innovation,
                and manufacturing excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black text-white">
        <div className="container-custom">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-4 h-8 w-8 text-brand-accent" />
                <p className="font-display text-4xl font-bold">{stat.value}</p>
                <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            subtitle="Manufacturing"
            title="How We Make Every Pair"
            description="Six stages of precision manufacturing ensure consistent quality."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {manufacturingSteps.map((step) => (
              <div
                key={step.id}
                className="rounded-2xl border border-gray-100 p-6 transition-shadow hover:shadow-md"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-accent">
                  Step {step.step}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-brand-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <SectionHeading
            subtitle="Quality"
            title="Our Quality Promise"
            description="Every pair passes rigorous quality checks before leaving our facility."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "12-Point Inspection",
                text: "Slip resistance, color fastness, and structural integrity tested on every batch.",
              },
              {
                icon: Award,
                title: "Certified Materials",
                text: "Raw materials sourced from certified suppliers meeting international standards.",
              },
              {
                icon: Factory,
                title: "Precision Molding",
                text: "State-of-the-art injection molding for micron-level accuracy and consistency.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-8 shadow-sm">
                <item.icon className="h-8 w-8 text-brand-accent" />
                <h3 className="mt-4 font-display text-lg font-bold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-brand-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            subtitle="Materials"
            title="Premium Materials We Use"
            description="Each material is selected for specific performance characteristics."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MATERIAL_INFO.map((material) => (
              <div
                key={material.id}
                className="flex items-start gap-4 rounded-2xl border border-gray-100 p-6"
              >
                <Layers className="h-6 w-6 shrink-0 text-brand-accent" />
                <div>
                  <h3 className="font-display font-bold">{material.name}</h3>
                  <p className="mt-1 text-sm text-brand-muted">
                    {material.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
