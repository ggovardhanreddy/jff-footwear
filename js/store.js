const PRICES = [100, 149, 199, 249, 279, 299, 329, 349, 379, 399, 429, 449, 479, 499, 549, 579, 649, 699, 749, 799, 849, 899, 949, 999, 1000, 1000];

const SIZE_RANGES = {
  men: { min: 5, max: 11, label: "Men" },
  women: { min: 5, max: 10, label: "Women" },
  kids: { min: 2, max: 5, label: "Kids" },
};

const PRODUCT_META = [
  { id: "0381", name: "Classic Flip Flops : Blue", category: "men", badge: "New", bestseller: true },
  { id: "0374", name: "Classic Flip Flops : Terracotta", category: "men", badge: "New", bestseller: true },
  { id: "0363", name: "Floral Comfort Flips : Green", category: "women", badge: "New", bestseller: true },
  { id: "0380", name: "Everyday Comfort : Black", category: "men", badge: "Best Seller", bestseller: true },
  { id: "0378", name: "Soft Walk Slides : Navy", category: "men", bestseller: true },
  { id: "0386", name: "Premium Flips : Brown", category: "men", badge: "New", bestseller: true },
  { id: "0362", name: "Urban Comfort : Grey", category: "men" },
  { id: "0364", name: "Floral Comfort : Pink", category: "women" },
  { id: "0365", name: "Daily Wear : Olive", category: "men" },
  { id: "0366", name: "Breeze Flips : Lavender", category: "women" },
  { id: "0367", name: "Comfort Plus : Charcoal", category: "men" },
  { id: "0368", name: "Style Flips : Coral", category: "women" },
  { id: "0369", name: "Classic Walk : Tan", category: "men" },
  { id: "0370", name: "Soft Sole : Beige", category: "men" },
  { id: "0371", name: "Floral Flips : Mint", category: "women" },
  { id: "0372", name: "Everyday Basic : Black", category: "men" },
  { id: "0373", name: "Comfort Walk : Slate", category: "men" },
  { id: "0375", name: "Premium Comfort : Maroon", category: "men" },
  { id: "0376", name: "Floral Style : Peach", category: "women" },
  { id: "0377", name: "Urban Flips : Dark Blue", category: "men" },
  { id: "0379", name: "Soft Touch : Rose", category: "women" },
  { id: "0382", name: "Bold Comfort : Red", category: "men" },
  { id: "0383", name: "Floral Grace : Yellow", category: "women" },
  { id: "0384", name: "Easy Walk : White", category: "women" },
  { id: "0385", name: "Comfort Zone : Teal", category: "women" },
  { id: "0387", name: "Classic Style : Burgundy", category: "men" },
];

const PRODUCTS = PRODUCT_META.map((item, index) => {
  const price = PRICES[index];
  return {
    ...item,
    image: `images/gallery/${item.id}-800.jpg`,
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

const getSizesForCategory = (category) => {
  const r = SIZE_RANGES[category];
  if (!r) return [];
  const sizes = [];
  for (let i = r.min; i <= r.max; i += 1) sizes.push(i);
  return sizes;
};

const getProductById = (id) => PRODUCTS.find((p) => p.id === id);

const searchProducts = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      categoryLabel(p.category).toLowerCase().includes(q)
  );
};

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

window.JFFStore = {
  PRODUCTS,
  SIZE_RANGES,
  formatPrice,
  discount,
  sizeRangeText,
  categoryLabel,
  getSizesForCategory,
  getProductById,
  searchProducts,
  productRating,
  renderStars,
  sortProducts,
  freeDelivery,
};
