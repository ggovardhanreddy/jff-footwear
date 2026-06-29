const { CATEGORY_TREE, categoryLabel, subcategoryLabel, shopUrl } = window.JFFStore;

const megaMenuHtml = () => {
  const columns = Object.entries(CATEGORY_TREE)
    .map(([gender, subs]) => {
      const links = subs
        .map(
          (sub) =>
            `<li><a href="${shopUrl(gender, sub)}" class="mega-link" data-gender="${gender}" data-sub="${sub}">${subcategoryLabel(sub)}</a></li>`
        )
        .join("");
      return `
        <div class="mega-col">
          <h3><a href="${shopUrl(gender)}">${categoryLabel(gender)}'s Footwear</a></h3>
          <ul>${links}</ul>
          <a href="${shopUrl(gender)}" class="mega-see-all">See all ${categoryLabel(gender).toLowerCase()}'s →</a>
        </div>`;
    })
    .join("");

  return `<div class="mega-menu" id="mega-menu" hidden>
    <div class="mega-menu-inner container">${columns}</div>
  </div>`;
};

const sidebarHtml = (activeGender = "", activeSub = "") => {
  const genderBlocks = Object.entries(CATEGORY_TREE)
    .map(([gender, subs]) => {
      const isOpen = activeGender === gender;
      const subLinks = subs
        .map((sub) => {
          const active = isOpen && activeSub === sub ? " is-active" : "";
          return `<li><a href="${shopUrl(gender, sub)}" class="cat-sub-link${active}">${subcategoryLabel(sub)}</a></li>`;
        })
        .join("");
      return `
        <div class="cat-group ${isOpen ? "is-open" : ""}" data-gender="${gender}">
          <button type="button" class="cat-group-btn" aria-expanded="${isOpen}">
            <span>${categoryLabel(gender)}</span>
            <span class="cat-chevron">›</span>
          </button>
          <ul class="cat-sub-list">${subLinks}</ul>
          <a href="${shopUrl(gender)}" class="cat-all-link">All ${categoryLabel(gender).toLowerCase()}'s</a>
        </div>`;
    })
    .join("");

  return `
    <aside class="category-sidebar animate-in">
      <h2 class="sidebar-title">Shop by Category</h2>
      <a href="index.html" class="cat-sub-link ${!activeGender ? "is-active" : ""}">All Products</a>
      ${genderBlocks}
    </aside>`;
};

const bindMegaMenu = () => {
  const btn = document.getElementById("all-categories-btn");
  const menu = document.getElementById("mega-menu");
  if (!btn || !menu) return;

  const close = () => {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (e) => {
    if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
};

const bindSidebar = () => {
  document.querySelectorAll(".cat-group-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".cat-group");
      const wasOpen = group.classList.contains("is-open");
      document.querySelectorAll(".cat-group").forEach((g) => {
        g.classList.remove("is-open");
        g.querySelector(".cat-group-btn")?.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        group.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
};

const renderShopSidebar = (containerId, activeGender, activeSub) => {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = sidebarHtml(activeGender, activeSub);
  bindSidebar();
};

window.JFFCatalog = { megaMenuHtml, sidebarHtml, bindMegaMenu, bindSidebar, renderShopSidebar };
