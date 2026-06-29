const { formatPrice } = window.JFFStore;

const renderCart = () => {
  const items = JFFCart.getCartItems();
  const container = document.getElementById("cart-items");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add slippers from our collection and they will appear here.</p>
        <a href="index.html" class="btn btn-amazon">Shop Now</a>
        <p class="size-picker-hint">Tap a product → pick size → Add to Cart → Cart → Proceed to Buy</p>
      </div>`;
    document.getElementById("summary-items").textContent = "0";
    document.getElementById("summary-total").textContent = formatPrice(0);
    checkoutBtn.classList.add("disabled");
    checkoutBtn.setAttribute("aria-disabled", "true");
    return;
  }

  checkoutBtn.classList.remove("disabled");
  checkoutBtn.removeAttribute("aria-disabled");

  container.innerHTML = items
    .map(
      (item) => `
      <article class="cart-item" data-key="${item.key}">
        <img src="${item.product.image}" alt="${item.product.name}" width="120" height="120" />
        <div class="cart-item-info">
          <h3><a href="product.html?id=${item.product.id}">${item.product.name}</a></h3>
          <p>Size: ${item.size} inch · ${window.JFFStore.categoryLabel(item.product.category)}</p>
          <p class="cart-item-price">${formatPrice(item.product.price)}</p>
          <div class="qty-controls">
            <button type="button" class="qty-btn" data-action="dec" data-key="${item.key}">−</button>
            <span>${item.qty}</span>
            <button type="button" class="qty-btn" data-action="inc" data-key="${item.key}">+</button>
            <button type="button" class="link-btn" data-action="remove" data-key="${item.key}">Remove</button>
          </div>
        </div>
        <p class="cart-line-total">${formatPrice(item.lineTotal)}</p>
      </article>`
    )
    .join("");

  const subtotal = JFFCart.getCartTotal();
  const count = JFFCart.getCartCount();
  const deliveryFee = subtotal >= 499 ? 0 : 49;
  const orderTotal = subtotal + deliveryFee;
  document.getElementById("summary-items").textContent = String(count);
  const subtotalEl = document.getElementById("summary-subtotal");
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  document.getElementById("summary-total").textContent = formatPrice(orderTotal);
  document.getElementById("summary-delivery").textContent = deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee);

  container.querySelectorAll(".qty-btn, .link-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      const item = items.find((i) => i.key === key);
      if (!item) return;
      if (btn.dataset.action === "remove") JFFCart.removeFromCart(key);
      else if (btn.dataset.action === "inc") JFFCart.updateQty(key, item.qty + 1);
      else JFFCart.updateQty(key, item.qty - 1);
      renderCart();
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
      if (!JFFCart.getCartItems().length) {
        e.preventDefault();
        return;
      }
      if (!window.JFFAuth?.getSession()) {
        e.preventDefault();
        window.location.href = "login.html?return=checkout.html";
      }
    });
  }
});
window.addEventListener("jff-cart-updated", renderCart);
