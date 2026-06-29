const {
  PRODUCTS,
  formatPrice,
  getSizesForCategory,
  searchProducts,
  sortProducts,
  categoryLabel,
} = window.JFFStore;

const productGrid = document.getElementById("product-grid");
const bestsellerGrid = document.getElementById("bestseller-grid");
const dealsGrid = document.getElementById("deals-grid");
const filterTabs = document.querySelectorAll(".filter-tab");
const sortSelect = document.getElementById("sort-select");
const resultsTitle = document.getElementById("results-title");

const params = new URLSearchParams(window.location.search);
const query = params.get("q") || "";
const cat = params.get("cat") || "";

const searchInput = document.getElementById("search-input");
if (searchInput && query) searchInput.value = query;

const getFilteredProducts = () => {
  let items = query ? searchProducts(query) : [...PRODUCTS];

  if (cat === "men") items = items.filter((p) => p.category === "men");
  else if (cat === "women") items = items.filter((p) => p.category === "women");
  else if (cat === "kids") items = items.filter((p) => p.category === "kids");
  else if (cat === "bestsellers") items = items.filter((p) => p.bestseller);
  else if (cat === "new") items = items.filter((p) => p.badge === "New");
  else if (cat === "deals") items = [...items].sort((a, b) => b.price - a.price).slice(0, 12);

  const sort = sortSelect?.value || "featured";
  return sortProducts(items, sort);
};

const renderGrid = (el, items, emptyMessage = "") => {
  if (!el) return;
  if (!items.length && emptyMessage) {
    el.innerHTML = `<p class="grid-empty">${emptyMessage}</p>`;
    return;
  }
  el.innerHTML = items.map((p) => window.JFFUI.renderProductCard(p)).join("");
  window.JFFUI.bindProductCards(el);
};

const updateMainGrid = () => {
  const items = getFilteredProducts();
  let title = "Results";
  let empty = "No products found.";

  if (query) {
    title = `Results for "${query}"`;
    empty = "No products found for your search.";
  } else if (cat === "men") title = "Men's Flip Flops";
  else if (cat === "women") title = "Women's Flip Flops";
  else if (cat === "bestsellers") title = "Best Sellers";
  else if (cat === "new") title = "New Arrivals";
  else if (cat === "deals") title = "Today's Deals";
  else title = "All Flip Flops";

  if (resultsTitle) resultsTitle.textContent = title;
  renderGrid(productGrid, items, empty);
};

updateMainGrid();
renderGrid(bestsellerGrid, PRODUCTS.filter((p) => p.bestseller).slice(0, 8));
renderGrid(dealsGrid, sortProducts([...PRODUCTS], "discount").slice(0, 8));

if (sortSelect) {
  sortSelect.addEventListener("change", updateMainGrid);
}

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((t) => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");

    const filter = tab.dataset.filter;
    let filtered = PRODUCTS;
    let emptyMessage = "";

    if (filter === "kids") {
      filtered = PRODUCTS.filter((p) => p.category === "kids");
      emptyMessage = "Kids flip flops coming soon. Contact us on WhatsApp for kids sizes 2–5 inch.";
    } else if (filter !== "all") {
      filtered = PRODUCTS.filter((p) => p.category === filter);
    }

    if (resultsTitle) {
      resultsTitle.textContent =
        filter === "all" ? "All Flip Flops" : `${categoryLabel(filter)}'s Flip Flops`;
    }
    renderGrid(productGrid, filtered, emptyMessage);
  });
});

const renderSizeChips = (containerId, category) => {
  const el = document.getElementById(containerId);
  const range = window.JFFStore.SIZE_RANGES[category];
  if (!el || !range) return;

  const sizes = [];
  for (let i = range.min; i <= range.max; i += 1) sizes.push(i);

  el.innerHTML = sizes
    .map((size) => `<span class="size-chip">${size}"</span>`)
    .join("");
};

renderSizeChips("size-chips-men", "men");
renderSizeChips("size-chips-women", "women");
renderSizeChips("size-chips-kids", "kids");

// Hero mini banners
const heroBanners = document.getElementById("hero-banners");
if (heroBanners) {
  const banners = [
    { title: "Up to 35% off", sub: "Men's comfort flips", img: "images/showcase/craft-960.jpg", href: "index.html?cat=men" },
    { title: "New arrivals", sub: "Women's floral styles", img: "images/showcase/comfort-960.jpg", href: "index.html?cat=women" },
    { title: "Best sellers", sub: "Top rated this week", img: "images/gallery/0380-800.jpg", href: "index.html?cat=bestsellers" },
    { title: "Under ₹499", sub: "Free delivery eligible", img: "images/gallery/0374-800.jpg", href: "index.html?cat=deals" },
  ];
  heroBanners.innerHTML = banners
    .map(
      (b) => `
    <a href="${b.href}" class="hero-banner-card">
      <img src="${b.img}" alt="" loading="lazy" />
      <div><strong>${b.title}</strong><span>${b.sub}</span></div>
    </a>`
    )
    .join("");
}
