const headerHtml = (active = "") => `
  <div class="announcement amazon-announce">
    <p>Free delivery on orders above ₹499 &nbsp;·&nbsp; Easy returns &nbsp;·&nbsp; <a href="tel:+918106407372">+91 81064 07372</a></p>
  </div>
  <header class="header amazon-header">
    <div class="header-inner amazon-header-inner">
      <button class="nav-toggle amazon-nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span></button>
      <a href="index.html" class="logo amazon-logo">JFF</a>
      <div class="amazon-deliver hide-mobile">
        <span class="amazon-deliver-label">Deliver to</span>
        <strong>India</strong>
      </div>
      <form id="search-form" class="search-form amazon-search" action="index.html" method="get">
        <select class="amazon-search-cat hide-mobile" aria-label="Search category">
          <option>All</option>
          <option>Men</option>
          <option>Women</option>
          <option>Flip Flops</option>
        </select>
        <input id="search-input" type="search" name="q" placeholder="Search JFF Footwear" />
        <button type="submit" class="amazon-search-btn" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </form>
      <div class="header-actions amazon-actions">
        <div class="amazon-account-block hide-mobile">
          <span class="amazon-account-hi">Hello, <span id="auth-greeting">sign in</span></span>
          <a href="login.html" id="auth-link" class="amazon-account-link">Account &amp; Lists</a>
        </div>
        <a href="account.html" class="amazon-orders hide-mobile ${active === "orders" ? "active" : ""}">Returns<br /><strong>&amp; Orders</strong></a>
        <a href="wishlist.html" class="amazon-wishlist hide-mobile ${active === "wishlist" ? "active" : ""}" aria-label="Wishlist">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.5 1.5 4 2.5.5-1 2-2.5 4-2.5 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z" stroke="currentColor" stroke-width="2"/></svg>
          <span id="wishlist-count" class="wishlist-badge" hidden>0</span>
        </a>
        <a href="cart.html" class="cart-link amazon-cart ${active === "cart" ? "active" : ""}" aria-label="Cart">
          <span class="amazon-cart-count" id="cart-count-label">0</span>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6h15l-1.5 9H8L6 6zm0 0L5 3H2M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <span class="amazon-cart-text hide-mobile">Cart</span>
        </a>
      </div>
    </div>
    <nav class="amazon-subnav" aria-label="Categories">
      <div class="amazon-subnav-inner">
        <button type="button" class="amazon-all-btn hide-mobile" id="all-categories-btn">☰ All</button>
        <a href="index.html?cat=deals" class="${active === "deals" ? "active" : ""}">Today's Deals</a>
        <a href="index.html?cat=men">Men's</a>
        <a href="index.html?cat=women">Women's</a>
        <a href="index.html?cat=kids">Kids</a>
        <a href="index.html?cat=bestsellers">Best Sellers</a>
        <a href="index.html?cat=new">New Arrivals</a>
        <a href="index.html#sizes">Size Guide</a>
        <a href="account.html">Your Orders</a>
        <a href="login.html" class="show-mobile" id="mobile-auth-link">Sign In</a>
      </div>
    </nav>
    ${window.JFFCatalog?.megaMenuHtml?.() || ""}
  </header>`;

const footerHtml = () => `
  <footer class="footer amazon-footer">
    <a href="#top" class="amazon-back-top">Back to top</a>
    <div class="amazon-footer-main">
      <div class="container amazon-footer-grid">
        <div>
          <h3>Get to Know Us</h3>
          <ul>
            <li><a href="index.html#about">About JFF</a></li>
            <li><a href="mailto:govardhan.reddy.g.94@gmail.com">Careers</a></li>
            <li><a href="index.html#contact">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h3>Shop</h3>
          <ul>
            <li><a href="index.html?cat=men">Men's Flip Flops</a></li>
            <li><a href="index.html?cat=women">Women's Flip Flops</a></li>
            <li><a href="index.html?cat=bestsellers">Best Sellers</a></li>
            <li><a href="index.html?cat=deals">Today's Deals</a></li>
          </ul>
        </div>
        <div>
          <h3>Your Account</h3>
          <ul>
            <li><a href="account.html">Your Orders</a></li>
            <li><a href="wishlist.html">Your Wishlist</a></li>
            <li><a href="cart.html">Your Cart</a></li>
            <li><a href="login.html">Login</a></li>
          </ul>
        </div>
        <div>
          <h3>Help</h3>
          <ul>
            <li><a href="https://wa.me/918106407372" target="_blank" rel="noopener noreferrer">WhatsApp Support</a></li>
            <li><a href="tel:+918106407372">Call Us</a></li>
            <li><a href="index.html#sizes">Size Guide</a></li>
            <li><a href="mailto:govardhan.reddy.g.94@gmail.com?subject=Bulk%20Order">Bulk Orders</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container footer-bottom amazon-footer-bottom">
      <a href="index.html" class="logo amazon-logo-sm">JFF Footwear</a>
      <p>&copy; <span id="year"></span> JFF Footwear · Luxury for Every Step</p>
    </div>
  </footer>`;

const mount = (active = "") => {
  const headerSlot = document.getElementById("jff-header");
  const footerSlot = document.getElementById("jff-footer");
  if (headerSlot) headerSlot.innerHTML = headerHtml(active);
  if (footerSlot) footerSlot.innerHTML = footerHtml();
};

window.JFFLayout = { mount, headerHtml, footerHtml };
