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
        <a href="index.html" class="btn">Shop Now</a>
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
          <h3>${item.product.name}</h3>
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

  const total = JFFCart.getCartTotal();
  const count = JFFCart.getCartCount();
  document.getElementById("summary-items").textContent = String(count);
  document.getElementById("summary-total").textContent = formatPrice(total);
  document.getElementById("summary-delivery").textContent = total >= 999 ? "FREE" : "₹ 49";

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
      if (!window.JFFAuth?.getSession()) {
        e.preventDefault();
        window.location.href = "login.html?return=checkout.html";
      }
    });
  }
});
window.addEventListener("jff-cart-updated", renderCart);
