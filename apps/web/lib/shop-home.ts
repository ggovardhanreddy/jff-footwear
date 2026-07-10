import { ROUTES } from "@/lib/constants";
import { getProductMainImage } from "@/lib/utils";
import type { HeroSlide } from "@/components/shop/ShopHeroCarousel";
import type { Product } from "@/types";

export function buildHeroSlides(products: Product[]): HeroSlide[] {
  const picks = products.filter((p) => p.images.length > 0).slice(0, 4);
  const templates = [
    {
      title: "New season comfort",
      subtitle: "Discover the latest JFF slippers — soft, durable, and made for India.",
    },
    {
      title: "Premium daily wear",
      subtitle: "Glossy finishes, memory foam comfort, and sizes for the whole family.",
    },
    {
      title: "Limited drops",
      subtitle: "Shop trending JFF styles before they sell out.",
    },
    {
      title: "House of JFF",
      subtitle: "One brand. Every pair designed and manufactured by us.",
    },
  ];

  return picks.map((product, i) => ({
    id: product.slug,
    title: templates[i]?.title ?? product.name,
    subtitle: templates[i]?.subtitle ?? product.description.slice(0, 120),
    image: getProductMainImage(product),
    ctaPrimary: { label: "Shop Now", href: ROUTES.products },
    ctaSecondary: {
      label: "Explore Collection",
      href: ROUTES.collections,
    },
  }));
}
