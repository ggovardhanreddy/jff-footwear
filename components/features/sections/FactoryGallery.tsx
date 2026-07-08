import AssetImage from "@/components/ui/AssetImage";
import { getGalleryImages } from "@/data";
import { cn } from "@/lib/utils";

export default function FactoryGallery({ className }: { className?: string }) {
  const images = getGalleryImages(8);

  return (
    <section className={cn("space-y-6", className)} aria-labelledby="factory-gallery">
      <div>
        <p className="eyebrow text-brand-accent">Behind The Scenes</p>
        <h2 id="factory-gallery" className="heading-section mt-2">
          Factory Gallery
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((src) => (
          <div
            key={src}
            className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100"
          >
            <AssetImage src={src} alt="JFF factory" fill className="object-cover" sizes="200px" />
          </div>
        ))}
      </div>
    </section>
  );
}
