import type { Review, FAQ, CategoryInfo, Feature, ManufacturingStep } from "@/types";

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    comment:
      "The orthopedic slippers are a game changer. My foot pain has reduced significantly. JFF quality is unmatched!",
    productName: "JFF Premium Comfort Orthopedic",
    avatar: "PS",
  },
  {
    id: "r2",
    name: "Rajesh Patel",
    location: "Ahmedabad",
    rating: 5,
    comment:
      "We ordered 500 pairs for our hotel chain. Excellent bulk pricing and consistent quality across all sizes.",
    productName: "JFF Classic Stride Bathroom",
    avatar: "RP",
  },
  {
    id: "r3",
    name: "Ananya Reddy",
    location: "Hyderabad",
    rating: 4,
    comment:
      "Love the memory foam slippers! So soft and the color options are beautiful. Will definitely reorder.",
    productName: "JFF Cloud Rest Memory Foam",
    avatar: "AR",
  },
  {
    id: "r4",
    name: "Vikram Singh",
    location: "Delhi",
    rating: 5,
    comment:
      "Best EVA slippers I've worn. Lightweight yet durable. Perfect for daily outdoor use.",
    productName: "JFF Aero Glide EVA",
    avatar: "VS",
  },
  {
    id: "r5",
    name: "Meera Krishnan",
    location: "Chennai",
    rating: 5,
    comment:
      "The kids slippers are adorable and well-made. My children love them and they hold up to rough play.",
    productName: "JFF Soft Nest Kids",
    avatar: "MK",
  },
  {
    id: "r6",
    name: "Arjun Mehta",
    location: "Pune",
    rating: 4,
    comment:
      "Fashion slippers with premium PU finish. Great for casual outings. JFF never disappoints.",
    productName: "JFF Luxe Flow Fashion",
    avatar: "AM",
  },
];

export const faqs: FAQ[] = [
  {
    id: "f1",
    category: "Orders",
    question: "How do I place an order?",
    answer:
      "Browse our products, select your preferred color, size, and quantity, then click 'Send Inquiry' to connect with us on WhatsApp. Our team will assist you with pricing and availability.",
  },
  {
    id: "f2",
    category: "Orders",
    question: "What is the minimum order quantity?",
    answer:
      "For retail inquiries, there is no minimum. For wholesale and bulk orders, MOQ starts at 100 pairs per style. Contact us for custom requirements.",
  },
  {
    id: "f3",
    category: "Products",
    question: "What materials do you use?",
    answer:
      "We manufacture slippers in EVA, PVC, Rubber, PU, and Memory Foam. Each material is selected for specific use cases — comfort, durability, water resistance, or fashion appeal.",
  },
  {
    id: "f4",
    category: "Products",
    question: "Do you offer custom branding?",
    answer:
      "Yes! We offer OEM/ODM services including custom logos, colors, packaging, and sole designs. Minimum quantities apply for custom branding.",
  },
  {
    id: "f5",
    category: "Shipping",
    question: "Do you ship internationally?",
    answer:
      "Yes, we export to over 30 countries. Shipping timelines and costs vary by destination. Contact us for a detailed quote.",
  },
  {
    id: "f6",
    category: "Shipping",
    question: "What are the delivery timelines?",
    answer:
      "Standard domestic orders ship within 5-7 business days. Bulk orders typically require 15-30 days depending on quantity and customization.",
  },
  {
    id: "f7",
    category: "Quality",
    question: "Are your slippers orthopedic certified?",
    answer:
      "Our orthopedic range is designed in consultation with podiatrists and features arch support, cushioned footbeds, and ergonomic soles. Specific certifications are available on request.",
  },
  {
    id: "f8",
    category: "Quality",
    question: "What is your return policy?",
    answer:
      "We stand behind our quality. Defective products can be returned within 15 days of delivery. Wholesale return policies are negotiated per contract.",
  },
];

export const categories: CategoryInfo[] = [
  {
    id: "cat-men",
    name: "Men",
    slug: "men",
    description: "Robust, stylish slippers engineered for the modern man.",
    image: "/images/categories/men.svg",
    productCount: 0,
  },
  {
    id: "cat-women",
    name: "Women",
    slug: "women",
    description: "Elegant comfort slippers designed for every occasion.",
    image: "/images/categories/women.svg",
    productCount: 0,
  },
  {
    id: "cat-kids",
    name: "Kids",
    slug: "kids",
    description: "Fun, safe, and durable slippers for little feet.",
    image: "/images/categories/kids.svg",
    productCount: 0,
  },
  {
    id: "cat-unisex",
    name: "Unisex",
    slug: "unisex",
    description: "Versatile designs that suit everyone.",
    image: "/images/categories/unisex.svg",
    productCount: 0,
  },
  {
    id: "cat-orthopedic",
    name: "Orthopedic",
    slug: "orthopedic",
    description: "Therapeutic support for healthier feet.",
    image: "/images/categories/orthopedic.svg",
    productCount: 0,
  },
  {
    id: "cat-bathroom",
    name: "Bathroom",
    slug: "bathroom",
    description: "Water-resistant slippers for wet environments.",
    image: "/images/categories/bathroom.svg",
    productCount: 0,
  },
  {
    id: "cat-regular",
    name: "Regular",
    slug: "regular",
    description: "Everyday comfort for home and casual wear.",
    image: "/images/categories/regular.svg",
    productCount: 0,
  },
  {
    id: "cat-fashion",
    name: "Fashion",
    slug: "fashion",
    description: "Trend-forward designs that make a statement.",
    image: "/images/categories/fashion.svg",
    productCount: 0,
  },
  {
    id: "cat-outdoor",
    name: "Outdoor",
    slug: "outdoor",
    description: "Durable soles built for adventure.",
    image: "/images/categories/outdoor.svg",
    productCount: 0,
  },
];

export const features: Feature[] = [
  {
    id: "feat-1",
    title: "Premium Materials",
    description:
      "Sourced from certified suppliers, our EVA, PU, Rubber, PVC, and Memory Foam materials meet international quality standards.",
    icon: "Gem",
  },
  {
    id: "feat-2",
    title: "Ergonomic Design",
    description:
      "Every slipper is engineered with anatomical footbeds, arch support, and weight-distribution technology for all-day comfort.",
    icon: "Footprints",
  },
  {
    id: "feat-3",
    title: "Anti-Slip Soles",
    description:
      "Multi-pattern grip soles provide superior traction on wet, dry, and slippery surfaces for maximum safety.",
    icon: "Shield",
  },
  {
    id: "feat-4",
    title: "Custom OEM/ODM",
    description:
      "Full customization including branding, colors, packaging, and sole designs for wholesale partners worldwide.",
    icon: "Palette",
  },
  {
    id: "feat-5",
    title: "Sustainable Practices",
    description:
      "Eco-conscious manufacturing with recycled materials, water-efficient processes, and minimal waste production.",
    icon: "Leaf",
  },
  {
    id: "feat-6",
    title: "Global Export",
    description:
      "Trusted by distributors in 30+ countries with reliable logistics and competitive international pricing.",
    icon: "Globe",
  },
];

export const manufacturingSteps: ManufacturingStep[] = [
  {
    id: "step-1",
    step: 1,
    title: "Material Selection",
    description:
      "Premium raw materials are inspected and tested for durability, flexibility, and safety compliance.",
    image: "/images/manufacturing/step-1.svg",
  },
  {
    id: "step-2",
    step: 2,
    title: "Mold Design",
    description:
      "Precision CAD-designed molds ensure consistent shape, fit, and ergonomic support across every pair.",
    image: "/images/manufacturing/step-2.svg",
  },
  {
    id: "step-3",
    step: 3,
    title: "Injection Molding",
    description:
      "State-of-the-art injection molding machines produce soles and uppers with micron-level accuracy.",
    image: "/images/manufacturing/step-3.svg",
  },
  {
    id: "step-4",
    step: 4,
    title: "Assembly & Finishing",
    description:
      "Skilled craftsmen assemble, trim, and finish each slipper with meticulous attention to detail.",
    image: "/images/manufacturing/step-4.svg",
  },
  {
    id: "step-5",
    step: 5,
    title: "Quality Control",
    description:
      "Every batch undergoes rigorous testing for slip resistance, color fastness, and structural integrity.",
    image: "/images/manufacturing/step-5.svg",
  },
  {
    id: "step-6",
    step: 6,
    title: "Packaging & Dispatch",
    description:
      "Eco-friendly packaging with branded labels, ready for domestic and international shipping.",
    image: "/images/manufacturing/step-6.svg",
  },
];
