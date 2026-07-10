import type { FAQ, CategoryInfo, Review } from "@jff/types";
import { WHY_CHOOSE_JFF } from "./company";

/** @deprecated Use WHY_CHOOSE_JFF from data/company.ts — kept for FeaturesSection compatibility */
export const features = WHY_CHOOSE_JFF.map((item) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  icon: item.icon,
}));

/** No fictional testimonials — kept empty for legacy component imports. */
export const reviews: Review[] = [];

export const faqs: FAQ[] = [
  {
    id: "f1",
    category: "Products",
    question: "Do you manufacture slippers?",
    answer:
      "Yes. JFF Footwear is an Indian slipper manufacturer based in Rayachoty, Andhra Pradesh. We produce comfortable, durable slippers for men, women, kids, and unisex collections.",
  },
  {
    id: "f2",
    category: "Wholesale",
    question: "Do you accept wholesale orders?",
    answer:
      "Yes. We accept wholesale and bulk orders for retailers, dealers, and distributors. Visit our Wholesale page or contact us with your requirements for pricing and availability.",
  },
  {
    id: "f3",
    category: "Wholesale",
    question: "Can I become a dealer?",
    answer:
      "Yes. We welcome dealer registration enquiries. Complete the form on our Become a Dealer page or contact us with your business details, city, and GST information.",
  },
  {
    id: "f4",
    category: "Products",
    question: "Can I customize slippers?",
    answer:
      "Yes. We offer customization through our Customize page and accept private label and OEM manufacturing enquiries. Options include branding, logo printing, and packaging.",
  },
  {
    id: "f5",
    category: "Orders",
    question: "What payment methods are accepted?",
    answer:
      "Payment terms are confirmed at order placement. Retail checkout supports Cash on Delivery where available. Wholesale and bulk orders may use bank transfer or agreed payment terms.",
  },
  {
    id: "f6",
    category: "Shipping",
    question: "How long is delivery?",
    answer:
      "Delivery timelines depend on your PIN code and location. Enter your PIN at checkout for an estimate. Most retail orders dispatch within a few business days after confirmation.",
  },
  {
    id: "f7",
    category: "Shipping",
    question: "Do you offer COD?",
    answer:
      "Cash on Delivery is available on eligible PIN codes. Check availability during checkout. COD availability may vary by location.",
  },
  {
    id: "f8",
    category: "Shipping",
    question: "How do I track my order?",
    answer:
      "After dispatch, tracking details are shared when available. Full order tracking integration is coming soon. Contact us on WhatsApp for order status updates.",
  },
  {
    id: "f9",
    category: "Support",
    question: "How do I contact support?",
    answer:
      "Reach us on WhatsApp at +91 77803 07058, email at govardhan.reddy.g.94@gmail.com, or through our Contact page. Business hours: Monday – Saturday, 9:00 AM – 6:00 PM IST.",
  },
  {
    id: "f10",
    category: "Wholesale",
    question: "Can I request bulk pricing?",
    answer:
      "Yes. Share your style, quantity, and delivery requirements via WhatsApp or our contact form. We will provide competitive bulk pricing based on your order.",
  },
  {
    id: "f11",
    category: "Orders",
    question: "How do I place an order?",
    answer:
      "Browse our Shop, add items to cart, and complete checkout — or message us on WhatsApp. Our team confirms pricing, availability, and delivery before fulfilment.",
  },
  {
    id: "f12",
    category: "Quality",
    question: "What is your return policy?",
    answer:
      "Defective products may be reported within 15 days of delivery with photos and details. See our Returns page for eligibility, exchanges, and support process.",
  },
];

export const categories: CategoryInfo[] = [
  {
    id: "cat-men",
    name: "Men",
    slug: "men",
    description: "Comfortable slippers designed for men.",
    image: "/images/categories/men.svg",
    productCount: 0,
  },
  {
    id: "cat-women",
    name: "Women",
    slug: "women",
    description: "Stylish and comfortable slippers for women.",
    image: "/images/categories/women.svg",
    productCount: 0,
  },
  {
    id: "cat-kids",
    name: "Kids",
    slug: "kids",
    description: "Safe and durable slippers for children.",
    image: "/images/categories/kids.svg",
    productCount: 0,
  },
  {
    id: "cat-unisex",
    name: "Unisex",
    slug: "unisex",
    description: "Versatile designs for everyone.",
    image: "/images/categories/unisex.svg",
    productCount: 0,
  },
  {
    id: "cat-orthopedic",
    name: "Orthopedic",
    slug: "orthopedic",
    description: "Supportive slippers for everyday comfort.",
    image: "/images/categories/orthopedic.svg",
    productCount: 0,
  },
  {
    id: "cat-bathroom",
    name: "Bathroom",
    slug: "bathroom",
    description: "Water-friendly slippers for wet areas.",
    image: "/images/categories/bathroom.svg",
    productCount: 0,
  },
  {
    id: "cat-regular",
    name: "Regular",
    slug: "regular",
    description: "Everyday slippers for home and casual wear.",
    image: "/images/categories/regular.svg",
    productCount: 0,
  },
  {
    id: "cat-fashion",
    name: "Fashion",
    slug: "fashion",
    description: "Trend-forward styles for modern wear.",
    image: "/images/categories/fashion.svg",
    productCount: 0,
  },
  {
    id: "cat-casual",
    name: "Casual",
    slug: "casual",
    description: "Relaxed slippers for daily comfort.",
    image: "/images/categories/casual.svg",
    productCount: 0,
  },
];
