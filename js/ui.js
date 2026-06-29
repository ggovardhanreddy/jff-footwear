const {
  formatPrice,
  discount,
  sizeRangeText,
  categoryLabel,
  subcategoryLabel,
  getSizesForCategory,
  productRating,
  renderStars,
  freeDelivery,
} = window.JFFStore;

const renderProductCard = (product, opts = {}) => {
  const { compact = false } = opts;
  const rating = productRating(product.id);
  const off = discount(product.price, product.mrp);
  const sizes = getSizesForCategory(product.category)
    .map((s) => `<option value="${s}">${s}"</option>`)
    .join("");
  const delivery = freeDelivery(product.price);

  return `
    <article class="product-card amazon-card ${compact ? "is-compact" : ""}" data-category="${product.category}" data-product-id="${product.id}">
      <div class="product-image-wrap">
        <button type="button" class="wishlist-heart ${window.JFFWishlist?.isWishlisted(product.id) ? "is-active" : ""}" data-wishlist-id="${product.id}" aria-label="Add to wishlist">♡</button>
        <a href="product.html?id=${product.id}" class="product-image">
          ${product.badge ? `<span class="product-badge ${product.badge === "Best Seller" ? "" : "sale"}">${product.badge}</span>` : ""}
          <img src="${product.image}" alt="${product.name}" width="900" height="900" loading="lazy" decoding="async" />
        </a>
      </div>
      <div class="product-info">
        <a href="product.html?id=${product.id}" class="product-name">${product.name}</a>
        <p class="product-subcat">${categoryLabel(product.category)} › ${subcategoryLabel(product.subcategory)}</p>
        <div class="product-rating-row">
          ${renderStars(rating.stars)}
          <span class="rating-count">${rating.count}</span>
        </div>
        <div class="product-price">
          <span class="price-now">${formatPrice(product.price)}</span>
          ${!compact ? `<span class="price-was">${formatPrice(product.mrp)}</span>` : ""}
          <span class="price-off">${off}% off</span>
        </div>
        ${delivery ? `<p class="delivery-badge">FREE delivery</p>` : ""}
        ${compact ? "" : `<p class="product-sizes">Sizes ${sizeRangeText(product.category)}</p>`}
        <label class="sr-only" for="size-${product.id}">Select size</label>
        <select id="size-${product.id}" class="size-select" aria-label="Select size for ${product.name}">
          <option value="">Size</option>
          ${sizes}
        </select>
        <div class="product-actions">
          <button type="button" class="product-order btn-add-cart" data-product-id="${product.id}">Add to Cart</button>
          <button type="button" class="btn-buy-now" data-product-id="${product.id}">Buy Now</button>
        </div>
      </div>
    </article>
  `;
};

const bindProductCards = (root = document) => {
  root.querySelectorAll(".product-card").forEach((card) => {
    const btn = card.querySelector(".btn-add-cart");
    const buyBtn = card.querySelector(".btn-buy-now");
    const select = card.querySelector(".size-select");
    const heart = card.querySelector(".wishlist-heart");
    const productId = card.dataset.productId;

    if (btn && select && !btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        try {
          window.JFFCart.addToCart(btn.dataset.productId, select.value, 1);
          showToast("Added to cart");
        } catch (err) {
          showToast(err.message, "error");
        }
      });
    }

    if (buyBtn && select && !buyBtn.dataset.bound) {
      buyBtn.dataset.bound = "1";
      buyBtn.addEventListener("click", () => {
        try {
          window.JFFCart.buyNow(buyBtn.dataset.productId, select.value, 1);
        } catch (err) {
          showToast(err.message, "error");
        }
      });
    }

    if (heart && !heart.dataset.bound) {
      heart.dataset.bound = "1";
      heart.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = window.JFFWishlist.toggleWishlist(heart.dataset.wishlistId);
        heart.classList.toggle("is-active", added);
        heart.textContent = added ? "♥" : "♡";
        showToast(added ? "Added to wishlist" : "Removed from wishlist");
        updateHeader();
      });
    }
  });
};

const initStoreHeader = () => {
  const update = () => {
    const session = window.JFFAuth?.getSession();
    const count = window.JFFCart?.getCartCount() || 0;
    const wishCount = window.JFFWishlist?.getWishlistCount() || 0;

    const cartCount = document.getElementById("cart-count");
    const cartCountLabel = document.getElementById("cart-count-label");
    const wishlistCount = document.getElementById("wishlist-count");
    const authLink = document.getElementById("auth-link");
    const authGreeting = document.getElementById("auth-greeting");
    const mobileAuth = document.getElementById("mobile-auth-link");

    if (cartCount) {
      cartCount.textContent = String(count);
      cartCount.hidden = count === 0;
    }
    if (cartCountLabel) cartCountLabel.textContent = String(count);
    if (wishlistCount) {
      wishlistCount.textContent = String(wishCount);
      wishlistCount.hidden = wishCount === 0;
    }

    if (session) {
      const first = session.name.split(" ")[0];
      if (authGreeting) authGreeting.textContent = first;
      if (authLink) {
        authLink.textContent = "Account & Lists";
        authLink.href = "account.html";
      }
      if (mobileAuth) {
        mobileAuth.textContent = first;
        mobileAuth.href = "account.html";
      }
    } else {
      if (authGreeting) authGreeting.textContent = "sign in";
      if (authLink) {
        authLink.textContent = "Account & Lists";
        authLink.href = "login.html";
      }
    }
  };

  update();
  window.addEventListener("jff-cart-updated", update);
  window.addEventListener("jff-auth-updated", update);
  window.addEventListener("jff-wishlist-updated", update);
  return update;
};

let updateHeader = () => {};

const bindMobileNav = () => {
  const navToggle = document.querySelector(".nav-toggle");
  const subnav = document.querySelector(".amazon-subnav");
  if (!navToggle || !subnav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = subnav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
};

const bindSearch = () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  if (!searchForm) return;

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = searchInput?.value.trim() || "";
    window.location.href = q ? `index.html?q=${encodeURIComponent(q)}` : "index.html";
  });
};

const showToast = (message, type = "success") => {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.dataset.type = type;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 2800);
};

const bindAddToCartButtons = () => bindProductCards(document);

document.addEventListener("DOMContentLoaded", () => {
  const headerSlot = document.getElementById("jff-header");
  if (headerSlot) {
    window.JFFLayout?.mount(headerSlot.dataset.active || "");
  }

  updateHeader = initStoreHeader();
  bindMobileNav();
  bindSearch();
  window.JFFCatalog?.bindMegaMenu?.();
  bindProductCards(document);

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

window.JFFUI = {
  showToast,
  bindAddToCartButtons,
  bindProductCards,
  renderProductCard,
};
