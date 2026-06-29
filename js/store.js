const PRICES = [100, 149, 199, 249, 279, 299, 329, 349, 379, 399, 429, 449, 479, 499, 549, 579, 649, 699, 749, 799, 849, 899, 949, 999, 1000, 1000, 149, 199, 249, 279, 299, 329, 349, 379];

const SIZE_RANGES = {
  men: { min: 5, max: 11, label: "Men" },
  women: { min: 5, max: 10, label: "Women" },
  kids: { min: 2, max: 5, label: "Kids" },
};

const SUBCATEGORY_DEFS = {
  casual: "Casual",
  formal: "Formal",
  "daily-wear": "Daily Wear",
  "occasional-wear": "Occasional Wear",
  "flip-flops": "Flip Flops",
  slippers: "Slippers",
  slides: "Slides",
  "school-wear": "School Wear",
  "party-wear": "Party Wear",
  sports: "Sports",
};

const CATEGORY_TREE = {
  men: ["casual", "formal", "daily-wear", "occasional-wear", "flip-flops", "slippers", "slides"],
  women: ["casual", "formal", "daily-wear", "occasional-wear", "flip-flops", "slippers", "slides"],
  kids: ["casual", "daily-wear", "flip-flops", "slippers", "school-wear", "party-wear", "sports"],
};

const PRODUCT_META = [
  { id: "0381", name: "Classic Flip Flops : Blue", category: "men", subcategory: "flip-flops", badge: "New", bestseller: true },
  { id: "0374", name: "Classic Flip Flops : Terracotta", category: "men", subcategory: "flip-flops", badge: "New", bestseller: true },
  { id: "0363", name: "Floral Comfort Flips : Green", category: "women", subcategory: "flip-flops", badge: "New", bestseller: true },
  { id: "0380", name: "Everyday Comfort : Black", category: "men", subcategory: "daily-wear", badge: "Best Seller", bestseller: true },
  { id: "0378", name: "Soft Walk Slides : Navy", category: "men", subcategory: "slides", bestseller: true },
  { id: "0386", name: "Premium Flips : Brown", category: "men", subcategory: "formal", badge: "New", bestseller: true },
  { id: "0362", name: "Urban Comfort : Grey", category: "men", subcategory: "casual" },
  { id: "0364", name: "Floral Comfort : Pink", category: "women", subcategory: "casual" },
  { id: "0365", name: "Daily Wear : Olive", category: "men", subcategory: "daily-wear" },
  { id: "0366", name: "Breeze Flips : Lavender", category: "women", subcategory: "flip-flops" },
  { id: "0367", name: "Comfort Plus : Charcoal", category: "men", subcategory: "daily-wear" },
  { id: "0368", name: "Style Flips : Coral", category: "women", subcategory: "occasional-wear" },
  { id: "0369", name: "Classic Walk : Tan", category: "men", subcategory: "casual" },
  { id: "0370", name: "Soft Sole : Beige", category: "men", subcategory: "slippers" },
  { id: "0371", name: "Floral Flips : Mint", category: "women", subcategory: "casual" },
  { id: "0372", name: "Everyday Basic : Black", category: "men", subcategory: "daily-wear" },
  { id: "0373", name: "Comfort Walk : Slate", category: "men", subcategory: "casual" },
  { id: "0375", name: "Premium Comfort : Maroon", category: "men", subcategory: "formal" },
  { id: "0376", name: "Floral Style : Peach", category: "women", subcategory: "occasional-wear" },
  { id: "0377", name: "Urban Flips : Dark Blue", category: "men", subcategory: "flip-flops" },
  { id: "0379", name: "Soft Touch : Rose", category: "women", subcategory: "slippers" },
  { id: "0382", name: "Bold Comfort : Red", category: "men", subcategory: "occasional-wear" },
  { id: "0383", name: "Floral Grace : Yellow", category: "women", subcategory: "occasional-wear" },
  { id: "0384", name: "Easy Walk : White", category: "women", subcategory: "daily-wear" },
  { id: "0385", name: "Comfort Zone : Teal", category: "women", subcategory: "daily-wear" },
  { id: "0387", name: "Classic Style : Burgundy", category: "men", subcategory: "formal" },
  { id: "K001", name: "Kids Fun Flips : Blue", category: "kids", subcategory: "flip-flops", imageId: "0381", badge: "New" },
  { id: "K002", name: "Kids Comfy Slippers : Pink", category: "kids", subcategory: "slippers", imageId: "0364" },
  { id: "K003", name: "School Day Flips : Navy", category: "kids", subcategory: "school-wear", imageId: "0378" },
  { id: "K004", name: "Kids Party Flips : Gold", category: "kids", subcategory: "party-wear", imageId: "0383", badge: "New" },
  { id: "K005", name: "Little Walk Daily : Green", category: "kids", subcategory: "daily-wear", imageId: "0363" },
  { id: "K006", name: "Kids Casual Slides : Grey", category: "kids", subcategory: "casual", imageId: "0362" },
  { id: "K007", name: "Tiny Tots Flips : Coral", category: "kids", subcategory: "flip-flops", imageId: "0368" },
  { id: "K008", name: "Kids Sports Flips : Red", category: "kids", subcategory: "sports", imageId: "0382", bestseller: true },
];

const PRODUCTS = PRODUCT_META.map((item, index) => {
  const price = PRICES[index];
  const imageId = item.imageId || item.id;
  return {
    ...item,
    image: `images/gallery/${imageId}-800.jpg`,
    price,
    mrp: Math.round(price * 1.35),
  };
});

const formatPrice = (n) => `₹ ${Number(n).toLocaleString("en-IN")}`;

const discount = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

const sizeRangeText = (category) => {
  const r = SIZE_RANGES[category];
  return r ? `${r.min} – ${r.max} inch` : "";
};

const categoryLabel = (category) => {
  if (category === "men") return "Men";
  if (category === "women") return "Women";
  if (category === "kids") return "Kids";
  return category;
};

const subcategoryLabel = (sub) => SUBCATEGORY_DEFS[sub] || sub;

const getSizesForCategory = (category) => {
  const r = SIZE_RANGES[category];
  if (!r) return [];
  const sizes = [];
  for (let i = r.min; i <= r.max; i += 1) sizes.push(i);
  return sizes;
};

const getProductById = (id) => PRODUCTS.find((p) => p.id === id);

const filterProducts = ({ gender, subcategory, query, special } = {}) => {
  let items = [...PRODUCTS];

  if (query) {
    const q = query.trim().toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.includes(q) ||
        categoryLabel(p.category).toLowerCase().includes(q) ||
        subcategoryLabel(p.subcategory).toLowerCase().includes(q)
    );
  }

  if (special === "bestsellers") items = items.filter((p) => p.bestseller);
  else if (special === "new") items = items.filter((p) => p.badge === "New");
  else if (special === "deals") items = [...items].sort((a, b) => discount(b.price, b.mrp) - discount(a.price, a.mrp)).slice(0, 16);

  if (gender && gender !== "all") items = items.filter((p) => p.category === gender);
  if (subcategory) items = items.filter((p) => p.subcategory === subcategory);

  return items;
};

const searchProducts = (query) => filterProducts({ query });

const productRating = (id) => {
  const num = parseInt(String(id).replace(/\D/g, ""), 10) || 1;
  return {
    stars: Math.round((3.6 + (num % 13) * 0.1) * 10) / 10,
    count: 48 + (num % 420),
  };
};

const renderStars = (rating, size = "sm") => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const star = (type) => {
    if (type === "full") return "★";
    if (type === "half") return "★";
    return "☆";
  };
  let html = "";
  for (let i = 0; i < full; i += 1) html += star("full");
  if (half) html += star("half");
  for (let i = 0; i < empty; i += 1) html += star("empty");
  return `<span class="stars stars-${size}" aria-label="${rating} out of 5">${html}</span>`;
};

const sortProducts = (items, sort) => {
  const list = [...items];
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "rating") list.sort((a, b) => productRating(b.id).stars - productRating(a.id).stars);
  else if (sort === "discount") list.sort((a, b) => discount(b.price, b.mrp) - discount(a.price, a.mrp));
  return list;
};

const freeDelivery = (price) => price >= 499;

const shopUrl = (gender, subcategory) => {
  const params = new URLSearchParams();
  if (gender) params.set("cat", gender);
  if (subcategory) params.set("sub", subcategory);
  const qs = params.toString();
  return qs ? `index.html?${qs}` : "index.html";
};

window.JFFStore = {
  PRODUCTS,
  SIZE_RANGES,
  CATEGORY_TREE,
  SUBCATEGORY_DEFS,
  formatPrice,
  discount,
  sizeRangeText,
  categoryLabel,
  subcategoryLabel,
  getSizesForCategory,
  getProductById,
  searchProducts,
  filterProducts,
  productRating,
  renderStars,
  sortProducts,
  freeDelivery,
  shopUrl,
};
