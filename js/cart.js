const CART_KEY = "jff_cart";

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("jff-cart-updated"));
};

const getCartCount = () => readCart().reduce((sum, item) => sum + item.qty, 0);

const getCartTotal = () => {
  const { getProductById, formatPrice } = window.JFFStore;
  return readCart().reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
};

const getCartItems = () => {
  const { getProductById } = window.JFFStore;
  return readCart()
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return { ...item, product, lineTotal: product.price * item.qty };
    })
    .filter(Boolean);
};

const addToCart = (productId, size, qty = 1) => {
  if (!size) throw new Error("Please select a size.");
  const items = readCart();
  const key = `${productId}_${size}`;
  const existing = items.find((i) => i.key === key);

  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ key, productId, size, qty });
  }

  writeCart(items);
  return items;
};

const updateQty = (key, qty) => {
  let items = readCart();
  if (qty <= 0) {
    items = items.filter((i) => i.key !== key);
  } else {
    items = items.map((i) => (i.key === key ? { ...i, qty } : i));
  }
  writeCart(items);
};

const removeFromCart = (key) => {
  writeCart(readCart().filter((i) => i.key !== key));
};

const clearCart = () => writeCart([]);

window.JFFCart = {
  getCartCount,
  getCartTotal,
  getCartItems,
  addToCart,
  updateQty,
  removeFromCart,
  clearCart,
};
