/** Verified page content — no fictional claims. */

export const QUALITY_COMMITMENT = {
  title: "Our Quality Commitment",
  subtitle: "Built to Last",
  description:
    "Every pair from JFF Footwear reflects our dedication to comfort, durability, and consistent standards — from material selection to final inspection.",
  items: [
    {
      id: "qc-1",
      title: "Carefully Selected Raw Materials",
      description:
        "We source materials chosen for comfort, strength, and everyday wear performance.",
      icon: "Layers",
    },
    {
      id: "qc-2",
      title: "Durable Manufacturing",
      description:
        "Reliable production processes ensure each slipper is built to withstand daily use.",
      icon: "Factory",
    },
    {
      id: "qc-3",
      title: "Comfort-Focused Design",
      description:
        "Ergonomic shapes and thoughtful construction support all-day comfort at home and outdoors.",
      icon: "Footprints",
    },
    {
      id: "qc-4",
      title: "Quality Inspection Before Dispatch",
      description:
        "Orders are checked for finish, fit, and consistency before they leave our facility.",
      icon: "ClipboardCheck",
    },
    {
      id: "qc-5",
      title: "Customer Satisfaction",
      description:
        "We work closely with retailers and buyers to resolve concerns and maintain trust.",
      icon: "HeartHandshake",
    },
    {
      id: "qc-6",
      title: "Consistent Product Standards",
      description:
        "Batch-to-batch consistency so your customers receive the same quality every time.",
      icon: "ShieldCheck",
    },
  ],
} as const;

export const WHOLESALE_FEATURES = [
  {
    id: "ws-1",
    title: "Bulk Orders",
    description: "Volume orders across styles, sizes, and colours for retailers and businesses.",
    icon: "Package",
  },
  {
    id: "ws-2",
    title: "Retail Supply",
    description: "Steady supply for shop owners and retail stores across India.",
    icon: "Store",
  },
  {
    id: "ws-3",
    title: "Wholesale Supply",
    description: "Competitive wholesale pricing for distributors and bulk buyers.",
    icon: "Truck",
  },
  {
    id: "ws-4",
    title: "Dealer Support",
    description: "Guidance on product selection, pricing, and order fulfilment for partners.",
    icon: "Users",
  },
  {
    id: "ws-5",
    title: "Distributor Enquiries",
    description: "Partnership opportunities for wider regional distribution.",
    icon: "Building2",
  },
  {
    id: "ws-6",
    title: "Competitive Pricing",
    description: "Fair rates structured for retail margins and wholesale volumes.",
    icon: "IndianRupee",
  },
  {
    id: "ws-7",
    title: "Fast Production",
    description: "Efficient manufacturing to meet retail and bulk order timelines.",
    icon: "Zap",
  },
  {
    id: "ws-8",
    title: "Reliable Delivery",
    description: "Dependable dispatch and delivery coordination across India.",
    icon: "MapPin",
  },
] as const;

export const OEM_FEATURES = [
  {
    id: "oem-1",
    title: "Custom Branding",
    description: "Sell footwear under your own brand with tailored product identity.",
    icon: "Tag",
  },
  {
    id: "oem-2",
    title: "Logo Printing",
    description: "Brand logo placement on slippers as per your design requirements.",
    icon: "Stamp",
  },
  {
    id: "oem-3",
    title: "Customized Packaging",
    description: "Packaging options aligned with your brand presentation.",
    icon: "Box",
  },
  {
    id: "oem-4",
    title: "Bulk Manufacturing",
    description: "Large-volume production for private label and OEM programmes.",
    icon: "Factory",
  },
  {
    id: "oem-5",
    title: "Flexible Order Quantities",
    description: "Order quantities discussed based on style, branding, and production scope.",
    icon: "SlidersHorizontal",
  },
  {
    id: "oem-6",
    title: "Dedicated Support",
    description: "A direct point of contact for specifications, samples, and fulfilment.",
    icon: "Headphones",
  },
] as const;

export const OEM_INTRO =
  "JFF Footwear offers private label and OEM manufacturing for businesses looking to sell footwear under their own brand. Based in Rayachoty, Andhra Pradesh, we work with retailers, distributors, and brand owners across India.";

export const SIZE_GUIDE_DATA = {
  measureSteps: [
    "Place a sheet of paper on a flat surface against a wall.",
    "Stand with your heel lightly touching the wall.",
    "Mark the tip of your longest toe on the paper.",
    "Measure the distance from the wall to the mark in centimetres.",
    "Compare your foot length with the size chart below.",
  ],
  tips: [
    "Measure feet in the evening when they are slightly larger.",
    "If between two sizes, choose the larger size for comfort.",
    "Wear the type of socks you plan to use with the slippers.",
    "Measure both feet and use the longer measurement.",
    "For kids, allow a little room for growth without oversizing.",
  ],
  men: {
    label: "Men",
    sizes: [
      { size: "5", footCm: "23.5" },
      { size: "6", footCm: "24.0" },
      { size: "7", footCm: "24.5" },
      { size: "8", footCm: "25.5" },
      { size: "9", footCm: "26.0" },
      { size: "10", footCm: "27.0" },
      { size: "11", footCm: "28.0" },
      { size: "12", footCm: "28.5" },
    ],
  },
  women: {
    label: "Women",
    sizes: [
      { size: "5", footCm: "22.5" },
      { size: "6", footCm: "23.0" },
      { size: "7", footCm: "23.5" },
      { size: "8", footCm: "24.5" },
      { size: "9", footCm: "25.0" },
      { size: "10", footCm: "26.0" },
    ],
  },
  kids: {
    label: "Kids",
    sizes: [
      { size: "2", footCm: "14.0" },
      { size: "3", footCm: "15.0" },
      { size: "4", footCm: "16.0" },
      { size: "5", footCm: "17.0" },
      { size: "6", footCm: "18.0" },
      { size: "7", footCm: "19.0" },
      { size: "8", footCm: "20.0" },
      { size: "9", footCm: "21.0" },
      { size: "10", footCm: "22.0" },
    ],
  },
} as const;

export const CARE_INSTRUCTIONS = [
  {
    id: "care-1",
    title: "Clean with a Soft Cloth",
    description: "Wipe slippers gently with a soft, slightly damp cloth after use.",
    icon: "Sparkles",
  },
  {
    id: "care-2",
    title: "Avoid Prolonged Direct Sunlight",
    description: "Keep away from harsh sun to preserve colour and material integrity.",
    icon: "Sun",
  },
  {
    id: "care-3",
    title: "Store in a Cool Dry Place",
    description: "Store in a ventilated area away from moisture when not in use.",
    icon: "Warehouse",
  },
  {
    id: "care-4",
    title: "Keep Away from Harsh Chemicals",
    description: "Do not use bleach, solvents, or strong cleaning agents.",
    icon: "FlaskConical",
  },
  {
    id: "care-5",
    title: "Allow to Air Dry Naturally",
    description: "If wet, air dry at room temperature — avoid direct heat sources.",
    icon: "Wind",
  },
  {
    id: "care-6",
    title: "Avoid Machine Washing",
    description: "Machine washing is not recommended unless specified for a product.",
    icon: "Ban",
  },
] as const;

export const SHIPPING_TIMELINE = [
  {
    step: 1,
    title: "Order Placed",
    description: "Your order is confirmed via WhatsApp or checkout after details are verified.",
  },
  {
    step: 2,
    title: "Processing",
    description: "We prepare your order and confirm availability, sizing, and delivery address.",
  },
  {
    step: 3,
    title: "Dispatch",
    description: "Orders are packed and handed to our courier partner for transit.",
  },
  {
    step: 4,
    title: "Delivery",
    description: "Delivery timelines depend on your PIN code and location across India.",
  },
] as const;

export const SHIPPING_DETAILS = [
  {
    id: "ship-1",
    title: "Delivery Across India",
    description: "We deliver to serviceable PIN codes throughout India.",
    icon: "MapPinned",
  },
  {
    id: "ship-2",
    title: "PIN Code Estimates",
    description: "Enter your PIN code at checkout to view estimated delivery timelines.",
    icon: "LocateFixed",
  },
  {
    id: "ship-3",
    title: "Order Processing",
    description: "Retail orders are processed after order confirmation and address verification.",
    icon: "ClipboardList",
  },
  {
    id: "ship-4",
    title: "Dispatch Timeline",
    description: "Most retail orders dispatch within a few business days after confirmation.",
    icon: "PackageCheck",
  },
  {
    id: "ship-5",
    title: "Delivery Charges",
    description: "Standard delivery charges apply. Free delivery on qualifying order values.",
    icon: "Receipt",
  },
  {
    id: "ship-6",
    title: "Order Tracking",
    description:
      "Tracking details will be shared when available. Full tracking integration coming soon.",
    icon: "Radar",
  },
] as const;

export const RETURN_POLICY_ITEMS = [
  {
    id: "ret-1",
    title: "Return Eligibility",
    description:
      "Defective or damaged products may be eligible for return when reported within 15 days of delivery with supporting details.",
    icon: "RotateCcw",
  },
  {
    id: "ret-2",
    title: "Exchange Process",
    description:
      "Size or style exchanges are handled case by case. Contact us with your order details and we will guide you.",
    icon: "ArrowLeftRight",
  },
  {
    id: "ret-3",
    title: "Damaged Product Reporting",
    description:
      "Share clear photos and a brief description of the issue within 15 days of receiving your order.",
    icon: "Camera",
  },
  {
    id: "ret-4",
    title: "Incorrect Product Received",
    description:
      "If you receive the wrong item, contact us promptly so we can arrange a correction or replacement.",
    icon: "PackageX",
  },
  {
    id: "ret-5",
    title: "Refund Timeline",
    description:
      "Approved refunds are processed after inspection. Timelines depend on payment method and order type.",
    icon: "Clock",
  },
  {
    id: "ret-6",
    title: "Customer Support",
    description:
      "Reach us on WhatsApp, phone, or email. Our team will review your case and respond with next steps.",
    icon: "MessageCircle",
  },
] as const;

export type PolicySection = {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
};

export const PRIVACY_SECTIONS: PolicySection[] = [
  {
    id: "intro",
    title: "Introduction",
    paragraphs: [
      'JFF Footwear ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we collect, use, store, and protect information when you visit our website, place an inquiry, or communicate with us via WhatsApp, email, or phone.',
      "By using our website, you agree to the practices described in this policy.",
    ],
  },
  {
    id: "collect",
    title: "Information We Collect",
    paragraphs: ["We may collect the following information when you interact with us:"],
    list: [
      "Name, phone number, and email address",
      "Delivery address and PIN code for orders",
      "Product preferences (size, colour, style, quantity)",
      "Messages sent through contact forms or WhatsApp",
      "Business details for wholesale, dealer, or OEM enquiries (e.g. GST number, city, state)",
      "Basic technical data such as browser type and pages visited (via standard server logs)",
    ],
  },
  {
    id: "use",
    title: "Use of Information",
    paragraphs: ["We use collected information to:"],
    list: [
      "Respond to product, wholesale, and OEM enquiries",
      "Process and fulfil retail and bulk orders",
      "Provide pricing, availability, and delivery information",
      "Improve our products, website, and customer service",
      "Communicate order updates and support responses",
      "Comply with applicable legal obligations",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    paragraphs: [
      "Our website may use essential cookies and local storage to support basic functionality such as cart, wishlist, and theme preferences. We do not use cookies for third-party advertising.",
      "You can control cookie settings through your browser. Disabling cookies may affect some site features.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "We take reasonable measures to protect your information. Order and inquiry data is handled through direct communication channels and secure practices appropriate to our operations.",
      "No method of transmission over the internet is completely secure. Please share sensitive information only through our official contact channels.",
    ],
  },
  {
    id: "rights",
    title: "Your Rights",
    paragraphs: ["You may request to:"],
    list: [
      "Access or correct personal information we hold about you",
      "Withdraw consent for non-essential communications",
      "Request deletion of inquiry data where applicable",
      "Raise privacy concerns with our team",
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    paragraphs: [
      "For privacy-related questions, contact JFF Footwear at govardhan.reddy.g.94@gmail.com or +91 77803 07058.",
      "Plot 42, Rayachoty, Annamayya District, Andhra Pradesh – 516269, India.",
    ],
  },
];

export const TERMS_SECTIONS: PolicySection[] = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    paragraphs: [
      "By accessing and using the JFF Footwear website, you agree to these Terms and Conditions. If you do not agree, please discontinue use of the website.",
    ],
  },
  {
    id: "products",
    title: "Product Information",
    paragraphs: [
      "We strive to display accurate product images, descriptions, and specifications. Colours may vary slightly due to screen settings and manufacturing batches.",
      "Final product details, pricing, and availability are confirmed at the time of order through our sales team.",
    ],
  },
  {
    id: "pricing",
    title: "Pricing",
    paragraphs: [
      "Prices shown on the website are indicative where applicable. Confirmed pricing is shared via WhatsApp, email, or phone before order fulfilment.",
      "Wholesale, bulk, and OEM pricing is quoted based on quantity, style, branding, and order requirements.",
    ],
  },
  {
    id: "orders",
    title: "Orders",
    paragraphs: [
      "Orders are placed through our checkout flow or confirmed via WhatsApp. An order is considered confirmed only after we verify details and availability.",
      "We reserve the right to decline or cancel orders in cases of stock unavailability, incorrect information, or suspected misuse.",
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    paragraphs: [
      "We deliver across serviceable PIN codes in India. Delivery timelines and charges depend on location and order type.",
      "Risk of loss passes to the buyer upon successful delivery to the provided address.",
    ],
  },
  {
    id: "returns",
    title: "Returns & Exchanges",
    paragraphs: [
      "Return and exchange terms are described on our Returns page. Wholesale and bulk return terms may differ and are agreed per order contract.",
      "Contact us within 15 days of delivery for defective or incorrect products.",
    ],
  },
  {
    id: "ip",
    title: "Intellectual Property",
    paragraphs: [
      "All website content — including text, images, logos, and designs — is owned by JFF Footwear unless otherwise stated. Unauthorised reproduction is prohibited.",
      "Private label and OEM customers receive rights as agreed in their specific manufacturing contract.",
    ],
  },
  {
    id: "responsibilities",
    title: "User Responsibilities",
    paragraphs: [
      "You agree to provide accurate contact and delivery information, use the website lawfully, and not attempt to disrupt site functionality or misuse inquiry channels.",
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    paragraphs: [
      "Questions about these terms? Contact JFF Footwear at govardhan.reddy.g.94@gmail.com or +91 77803 07058.",
      "Plot 42, Rayachoty, Annamayya District, Andhra Pradesh – 516269, India.",
    ],
  },
];

export const DEALER_BUSINESS_TYPES = [
  "Retail Store",
  "Wholesale Distributor",
  "Online Seller",
  "Supermarket / Chain",
  "Other",
] as const;
