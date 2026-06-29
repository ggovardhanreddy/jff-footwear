const WISHLIST_KEY = "jff_wishlist";

const readWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeWishlist = (ids) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("jff-wishlist-updated"));
};

const isWishlisted = (productId) => readWishlist().includes(productId);

const toggleWishlist = (productId) => {
  const list = readWishlist();
  const idx = list.indexOf(productId);
  if (idx >= 0) {
    list.splice(idx, 1);
    writeWishlist(list);
    return false;
  }
  list.push(productId);
  writeWishlist(list);
  return true;
};

const getWishlistCount = () => readWishlist().length;

const getWishlistProducts = () => {
  const { getProductById } = window.JFFStore;
  return readWishlist().map(getProductById).filter(Boolean);
};

window.JFFWishlist = {
  isWishlisted,
  toggleWishlist,
  getWishlistCount,
  getWishlistProducts,
};
