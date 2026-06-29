const {
  PRODUCTS,
  formatPrice,
  discount,
  sizeRangeText,
  categoryLabel,
  getSizesForCategory,
  searchProducts,
} = window.JFFStore;

const renderProduct = (product) => {
  const off = discount(product.price, product.mrp);
  const badgeClass = product.badge === "Best Seller" ? "" : "sale";
  const sizes = getSizesForCategory(product.category)
    .map((s) => `<option value="${s}">${s} inch</option>`)
    .join("");

  return `
    <article class="product-card" data-category="${product.category}">
      <a href="cart.html" class="product-image">
        ${product.badge ? `<span class="product-badge ${badgeClass}">${product.badge}</span>` : ""}
        <img src="${product.image}" alt="${product.name}" width="900" height="900" loading="lazy" decoding="async" />
      </a>
      <div class="product-info">
        <p class="product-category">${categoryLabel(product.category)} · Flip Flops</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-sizes">Sizes: ${sizeRangeText(product.category)}</p>
        <div class="product-price">
          <span class="price-now">${formatPrice(product.price)}</span>
          <span class="price-was">${formatPrice(product.mrp)}</span>
          <span class="price-off">${off}% Off</span>
        </div>
        <label class="sr-only" for="size-${product.id}">Select size</label>
        <select id="size-${product.id}" class="size-select" aria-label="Select size for ${product.name}">
          <option value="">Select size</option>
          ${sizes}
        </select>
        <button type="button" class="product-order btn-add-cart" data-product-id="${product.id}">Add to Cart</button>
      </div>
    </article>
  `;
};

const productGrid = document.getElementById("product-grid");
const bestsellerGrid = document.getElementById("bestseller-grid");
const filterTabs = document.querySelectorAll(".filter-tab");

const renderGrid = (el, items, emptyMessage = "") => {
  if (!el) return;
  if (!items.length && emptyMessage) {
    el.innerHTML = `<p class="grid-empty">${emptyMessage}</p>`;
    return;
  }
  el.innerHTML = items.map(renderProduct).join("");
  window.JFFUI?.bindAddToCartButtons();
};

const query = new URLSearchParams(window.location.search).get("q") || "";
const searchInput = document.getElementById("search-input");
if (searchInput && query) searchInput.value = query;

const initialProducts = query ? searchProducts(query) : PRODUCTS;
renderGrid(productGrid, initialProducts, query ? "No products found for your search." : "");
renderGrid(bestsellerGrid, PRODUCTS.filter((p) => p.bestseller));

const renderSizeChips = (containerId, category) => {
  const el = document.getElementById(containerId);
  const range = window.JFFStore.SIZE_RANGES[category];
  if (!el || !range) return;

  const sizes = [];
  for (let i = range.min; i <= range.max; i += 1) sizes.push(i);

  el.innerHTML = sizes
    .map(
      (size) =>
        `<a class="size-chip" href="login.html?return=${encodeURIComponent("checkout.html")}">${size}"</a>`
    )
    .join("");
};

renderSizeChips("size-chips-men", "men");
renderSizeChips("size-chips-women", "women");
renderSizeChips("size-chips-kids", "kids");

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
      emptyMessage =
        "Kids flip flops available in sizes 2 – 5 inch. Login and order, or contact us on WhatsApp.";
    } else if (filter !== "all") {
      filtered = PRODUCTS.filter((p) => p.category === filter);
    }

    renderGrid(productGrid, filtered, emptyMessage);
  });
});

// Hero slider
const slides = document.querySelectorAll(".hero-slide");
const dotsContainer = document.getElementById("hero-dots");
let currentSlide = 0;
let slideTimer;

if (slides.length && dotsContainer) {
  const dots = [];

  const goToSlide = (index) => {
    slides[currentSlide].classList.remove("is-active");
    dots[currentSlide].classList.remove("is-active");
    currentSlide = index;
    slides[currentSlide].classList.add("is-active");
    dots[currentSlide].classList.add("is-active");
  };

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = `hero-dot${i === 0 ? " is-active" : ""}`;
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => {
      goToSlide(i);
      startTimer();
    });
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);
  const startTimer = () => {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, 5000);
  };
  startTimer();
}

const searchForm = document.getElementById("search-form");
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = searchInput?.value.trim() || "";
    window.location.href = q ? `index.html?q=${encodeURIComponent(q)}` : "index.html";
  });
}
