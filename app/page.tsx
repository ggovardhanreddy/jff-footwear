import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import LatestCollection from "@/components/home/LatestCollection";
import CustomerReviews from "@/components/home/CustomerReviews";
import ManufacturingProcess from "@/components/home/ManufacturingProcess";
import ProductCategories from "@/components/home/ProductCategories";
import ShopByMaterial from "@/components/home/ShopByMaterial";
import AboutSection from "@/components/home/AboutSection";
import Statistics from "@/components/home/Statistics";
import ContactCTA from "@/components/home/ContactCTA";
import Newsletter from "@/components/Newsletter";
import InstagramGallery from "@/components/InstagramGallery";
import {
  getFeaturedProducts,
  getLatestProducts,
  getProductCountByCategory,
  getProductCountByMaterial,
  getGalleryImages,
} from "@/data";
import { categories, manufacturingSteps, reviews } from "@/data/content";
import { MATERIAL_INFO } from "@/lib/constants";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const latest = getLatestProducts(8);
  const galleryImages = getGalleryImages(8);

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    productCount: getProductCountByCategory(cat.name),
  }));

  const materialCounts = Object.fromEntries(
    MATERIAL_INFO.map((m) => [m.name, getProductCountByMaterial(m.name)])
  );

  return (
    <>
      <Hero />
      <FeaturedProducts products={featured} />
      <LatestCollection products={latest} />
      <ProductCategories categories={categoriesWithCount} />
      <ShopByMaterial productCounts={materialCounts} />
      <ManufacturingProcess steps={manufacturingSteps} />
      <AboutSection />
      <WhyChooseUs />
      <Statistics />
      <CustomerReviews reviews={reviews} />
      <InstagramGallery images={galleryImages} />
      <ContactCTA />
      <Newsletter />
    </>
  );
}
