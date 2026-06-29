const {
  getProductById,
  formatPrice,
  discount,
  sizeRangeText,
  categoryLabel,
  getSizesForCategory,
  productRating,
  renderStars,
  freeDelivery,
  PRODUCTS,
} = window.JFFStore;

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const product = getProductById(productId);

const content = document.getElementById("pdp-content");
const breadcrumb = document.getElementById("pdp-breadcrumb");
const reviewsEl = document.getElementById("pdp-reviews");
const relatedEl = document.getElementById("pdp-related-grid");

if (!product) {
  content.innerHTML = `<div class="alert error">Product not found. <a href="index.html">Continue shopping</a></div>`;
} else {
  document.title = `${product.name} | JFF Footwear`;
  const rating = productRating(product.id);
  const off = discount(product.price, product.mrp);
  const delivery = freeDelivery(product.price);
  const sizes = getSizesForCategory(product.category)
    .map((s) => `<option value="${s}">${s} inch</option>`)
    .join("");
  const wishlisted = window.JFFWishlist.isWishlisted(product.id);

  breadcrumb.innerHTML = `
    <a href="index.html">Home</a>
    <span aria-hidden="true">›</span>
    <a href="index.html?cat=${product.category}">${categoryLabel(product.category)}</a>
    <span aria-hidden="true">›</span>
    <span>${product.name}</span>`;

  content.innerHTML = `
    <div class="pdp-gallery">
      <div class="pdp-image-main">
        ${product.badge ? `<span class="product-badge ${product.badge === "Best Seller" ? "" : "sale"}">${product.badge}</span>` : ""}
        <img src="${product.image}" alt="${product.name}" width="900" height="900" />
      </div>
    </div>
    <div class="pdp-buybox">
      <h1 class="pdp-title">${product.name}</h1>
      <div class="pdp-rating-row">
        ${renderStars(rating.stars, "md")}
        <a href="#reviews" class="pdp-rating-link">${rating.count} ratings</a>
      </div>
      <hr class="pdp-divider" />
      <div class="pdp-price-block">
        <span class="price-off-badge">-${off}%</span>
        <span class="pdp-price-now">${formatPrice(product.price)}</span>
        <span class="price-was">M.R.P.: ${formatPrice(product.mrp)}</span>
      </div>
      <p class="pdp-tax">Inclusive of all taxes</p>
      <div class="pdp-delivery ${delivery ? "is-free" : ""}">
        <strong>${delivery ? "FREE delivery" : "Delivery ₹49"}</strong>
        <span>· Ships in 3–5 business days across India</span>
      </div>
      <p class="pdp-stock in-stock">In stock</p>
      <div class="pdp-options">
        <label>Size (inches)
          <select id="pdp-size" class="size-select">
            <option value="">Select size</option>
            ${sizes}
          </select>
        </label>
        <label>Quantity
          <select id="pdp-qty">
            ${[1, 2, 3, 4, 5].map((n) => `<option value="${n}">${n}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="pdp-actions">
        <button type="button" class="btn btn-amazon" id="pdp-add-cart">Add to Cart</button>
        <button type="button" class="btn btn-amazon-secondary" id="pdp-buy-now">Buy Now</button>
      </div>
      <button type="button" class="pdp-wishlist-btn ${wishlisted ? "is-active" : ""}" id="pdp-wishlist">
        ${wishlisted ? "♥ In your wishlist" : "♡ Add to Wishlist"}
      </button>
      <div class="pdp-trust">
        <div><strong>Secure transaction</strong></div>
        <div><strong>Easy returns</strong> within 7 days</div>
        <div><strong>Non-slip sole</strong> · Lightweight</div>
      </div>
    </div>
    <div class="pdp-about">
      <h2>About this item</h2>
      <ul>
        <li>Premium ${categoryLabel(product.category).toLowerCase()}'s flip flops with cushioned footbed</li>
        <li>Available sizes: ${sizeRangeText(product.category)}</li>
        <li>Lightweight, non-slip sole for everyday comfort</li>
        <li>Perfect for home, travel, and casual wear</li>
        <li>Brand: JFF Footwear — Luxury for Every Step</li>
      </ul>
    </div>`;

  const reviewSnippets = [
    "Super comfortable and great value for money.",
    "Soft footbed and good grip on wet floors.",
    "True to size. Looks exactly like the photos.",
    "Bought for daily use — very happy with quality.",
  ];

  reviewsEl.id = "reviews";
  reviewsEl.innerHTML = `
    <h2>Customer reviews</h2>
    <div class="pdp-reviews-summary">
      ${renderStars(rating.stars, "lg")}
      <span>${rating.stars} out of 5 · ${rating.count} global ratings</span>
    </div>
    <div class="review-list">
      ${reviewSnippets
        .map(
          (text, i) => `
        <article class="review-item">
          ${renderStars(4 + (i % 2) * 0.5, "sm")}
          <strong>Verified Purchase</strong>
          <p>${text}</p>
          <footer>Reviewed in India</footer>
        </article>`
        )
        .join("")}
    </div>`;

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6);
  relatedEl.innerHTML = related.map((p) => window.JFFUI.renderProductCard(p, { compact: true })).join("");
  window.JFFUI.bindProductCards(relatedEl);

  document.getElementById("pdp-add-cart").addEventListener("click", () => {
    try {
      const size = document.getElementById("pdp-size").value;
      const qty = Number(document.getElementById("pdp-qty").value);
      window.JFFCart.addToCart(product.id, size, qty);
      window.JFFUI.showToast("Added to cart");
    } catch (err) {
      window.JFFUI.showToast(err.message, "error");
    }
  });

  document.getElementById("pdp-buy-now").addEventListener("click", () => {
    try {
      const size = document.getElementById("pdp-size").value;
      const qty = Number(document.getElementById("pdp-qty").value);
      window.JFFCart.addToCart(product.id, size, qty);
      if (!window.JFFAuth.getSession()) {
        window.location.href = `login.html?return=${encodeURIComponent("checkout.html")}`;
        return;
      }
      window.location.href = "checkout.html";
    } catch (err) {
      window.JFFUI.showToast(err.message, "error");
    }
  });

  document.getElementById("pdp-wishlist").addEventListener("click", (e) => {
    const added = window.JFFWishlist.toggleWishlist(product.id);
    e.currentTarget.classList.toggle("is-active", added);
    e.currentTarget.textContent = added ? "♥ In your wishlist" : "♡ Add to Wishlist";
    window.JFFUI.showToast(added ? "Added to wishlist" : "Removed from wishlist");
  });
}
