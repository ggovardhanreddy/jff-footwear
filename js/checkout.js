const { formatPrice } = window.JFFStore;

if (!JFFAuth.requireAuth("login.html?return=checkout.html")) {
  // redirecting
}

const items = JFFCart.getCartItems();
if (!items.length) {
  window.location.href = "cart.html";
}

const user = JFFAuth.getCurrentUser();
const form = document.getElementById("checkout-form");

if (user) {
  form.elements.name.value = user.name;
  form.elements.phone.value = user.phone;
}

const list = document.getElementById("summary-list");
list.innerHTML = items
  .map(
    (item) => `
    <div class="summary-item">
      <span>${item.product.name} · ${item.size}" × ${item.qty}</span>
      <span>${formatPrice(item.lineTotal)}</span>
    </div>`
  )
  .join("");

const delivery = JFFCart.getCartTotal() >= 999 ? 0 : 49;
const total = JFFCart.getCartTotal() + delivery;
document.getElementById("summary-total").textContent = formatPrice(total);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const err = document.getElementById("checkout-error");
  err.hidden = true;

  const fd = new FormData(form);
  const session = JFFAuth.getSession();
  const order = {
    id: `ORD${Date.now()}`,
    userId: session.id,
    items: items.map((i) => ({
      productId: i.productId,
      name: i.product.name,
      size: i.size,
      qty: i.qty,
      price: i.product.price,
    })),
    total,
    delivery,
    address: {
      name: fd.get("name"),
      phone: fd.get("phone"),
      address: fd.get("address"),
      city: fd.get("city"),
      pincode: fd.get("pincode"),
    },
    payment: fd.get("payment"),
    status: "Placed",
    createdAt: new Date().toISOString(),
  };

  JFFAuth.saveOrder(order);
  JFFCart.clearCart();

  const lines = order.items.map((i) => `• ${i.name} (${i.size}") x${i.qty} - ${formatPrice(i.price * i.qty)}`).join("\n");
  const msg = encodeURIComponent(
    `New JFF order ${order.id}\n\n${lines}\n\nTotal: ${formatPrice(total)}\nPayment: ${order.payment}\n\nDeliver to:\n${order.address.name}\n${order.address.phone}\n${order.address.address}\n${order.address.city} - ${order.address.pincode}`
  );

  window.open(`https://wa.me/918106407372?text=${msg}`, "_blank");
  window.location.href = `account.html?ordered=${order.id}`;
});
