const initStoreHeader = () => {
  const authLink = document.getElementById("auth-link");
  const cartCount = document.getElementById("cart-count");
  const userMenu = document.getElementById("user-menu");

  const update = () => {
    const session = window.JFFAuth?.getSession();
    const count = window.JFFCart?.getCartCount() || 0;

    if (cartCount) {
      cartCount.textContent = String(count);
      cartCount.hidden = count === 0;
    }

    if (authLink) {
      if (session) {
        authLink.textContent = session.name.split(" ")[0];
        authLink.href = "account.html";
        authLink.title = "My account";
      } else {
        authLink.textContent = "Login";
        authLink.href = "login.html";
      }
    }

    if (userMenu) {
      userMenu.hidden = !session;
    }
  };

  update();
  window.addEventListener("jff-cart-updated", update);
  window.addEventListener("jff-auth-updated", update);
};

const bindMobileNav = () => {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (!navToggle || !nav) return;

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

const bindAddToCartButtons = () => {
  document.querySelectorAll(".product-card").forEach((card) => {
    const btn = card.querySelector(".btn-add-cart");
    const select = card.querySelector(".size-select");
    if (!btn || !select) return;

    btn.addEventListener("click", () => {
      try {
        window.JFFCart.addToCart(btn.dataset.productId, select.value, 1);
        showToast("Added to cart");
        btn.textContent = "Added ✓";
        setTimeout(() => {
          btn.textContent = "Add to Cart";
        }, 1500);
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initStoreHeader();
  bindMobileNav();
  bindAddToCartButtons();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

window.JFFUI = { showToast, bindAddToCartButtons };
