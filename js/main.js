const PRICES = [100, 149, 199, 249, 279, 299, 329, 349, 379, 399, 429, 449, 479, 499, 549, 579, 649, 699, 749, 799, 849, 899, 949, 999, 1000, 1000];

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
  const mrp = Math.round(price * 1.35);
  return {
    ...item,
    image: `images/gallery/${item.id}-800.jpg`,
    price,
    mrp,
  };
});

const formatPrice = (n) => `₹ ${n.toLocaleString("en-IN")}`;
const discount = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

const orderLink = (product) => {
  const msg = encodeURIComponent(
    `Hi JFF Footwear, I'd like to order: ${product.name} (${formatPrice(product.price)}). Please share size availability.`
  );
  return `https://wa.me/918106407372?text=${msg}`;
};

const renderProduct = (product) => {
  const off = discount(product.price, product.mrp);
  const badgeClass = product.badge === "Best Seller" ? "" : "sale";
  return `
    <article class="product-card" data-category="${product.category}">
      <a href="${orderLink(product)}" class="product-image" target="_blank" rel="noopener noreferrer">
        ${product.badge ? `<span class="product-badge ${badgeClass}">${product.badge}</span>` : ""}
        <img src="${product.image}" alt="${product.name}" width="900" height="900" loading="lazy" decoding="async" />
      </a>
      <div class="product-info">
        <p class="product-category">${product.category === "men" ? "Men" : "Women"} · Flip Flops</p>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">
          <span class="price-now">${formatPrice(product.price)}</span>
          <span class="price-was">${formatPrice(product.mrp)}</span>
          <span class="price-off">${off}% Off</span>
        </div>
        <a href="${orderLink(product)}" class="product-order" target="_blank" rel="noopener noreferrer">Order on WhatsApp</a>
      </div>
    </article>
  `;
};

const productGrid = document.getElementById("product-grid");
const bestsellerGrid = document.getElementById("bestseller-grid");
const filterTabs = document.querySelectorAll(".filter-tab");
const yearEl = document.getElementById("year");

if (yearEl) yearEl.textContent = new Date().getFullYear();

const renderGrid = (el, items) => {
  if (!el) return;
  el.innerHTML = items.map(renderProduct).join("");
};

renderGrid(productGrid, PRODUCTS);
renderGrid(bestsellerGrid, PRODUCTS.filter((p) => p.bestseller));

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((t) => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");

    const filter = tab.dataset.filter;
    const filtered = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
    renderGrid(productGrid, filtered);
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

// Mobile nav
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}
