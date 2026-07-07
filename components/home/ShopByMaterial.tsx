"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import MaterialCard from "@/components/MaterialCard";
import { MATERIAL_INFO } from "@/lib/constants";

interface ShopByMaterialProps {
  productCounts: Record<string, number>;
}

export default function ShopByMaterial({
  productCounts,
}: ShopByMaterialProps) {
  return (
    <section className="section-padding bg-brand-light">
      <div className="container-custom">
        <SectionHeading
          subtitle="Materials"
          title="Shop by Material"
          description="Each material is engineered for a specific purpose — comfort, durability, or style."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {MATERIAL_INFO.map((material, index) => (
            <MaterialCard
              key={material.id}
              name={material.name}
              description={material.description}
              productCount={productCounts[material.name] || 0}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
