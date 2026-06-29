const grid = document.getElementById("wishlist-grid");
const products = window.JFFWishlist.getWishlistProducts();

if (!products.length) {
  grid.innerHTML = `<p class="grid-empty">Your wishlist is empty. <a href="index.html">Discover products</a></p>`;
} else {
  grid.innerHTML = products.map((p) => window.JFFUI.renderProductCard(p)).join("");
  window.JFFUI.bindProductCards(grid);
}
