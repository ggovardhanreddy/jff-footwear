const initHomePage = () => {
  const {
    filterProducts,
    sortProducts,
    categoryLabel,
    subcategoryLabel,
  } = window.JFFStore;

  const productGrid = document.getElementById("product-grid");
  const bestsellerGrid = document.getElementById("bestseller-grid");
  const dealsGrid = document.getElementById("deals-grid");
  const filterTabs = document.querySelectorAll(".filter-tab");
  const sortSelect = document.getElementById("sort-select");
  const resultsTitle = document.getElementById("results-title");
  const resultsMeta = document.getElementById("results-meta");

  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";
  const cat = params.get("cat") || "";
  const sub = params.get("sub") || "";

  const searchInput = document.getElementById("search-input");
  if (searchInput && query) searchInput.value = query;

  const isSpecialCat = ["bestsellers", "new", "deals"].includes(cat);
  const activeGender = isSpecialCat ? "" : cat;

  window.JFFCatalog?.renderShopSidebar?.("category-sidebar", activeGender, sub);

  const getFilteredProducts = () => {
    let items;

    if (query) items = filterProducts({ query });
    else if (cat === "bestsellers") items = filterProducts({ special: "bestsellers" });
    else if (cat === "new") items = filterProducts({ special: "new" });
    else if (cat === "deals") items = filterProducts({ special: "deals" });
    else if (cat || sub) items = filterProducts({ gender: cat || undefined, subcategory: sub || undefined });
    else items = filterProducts({});

    return sortProducts(items, sortSelect?.value || "featured");
  };

  const renderGrid = (el, items, emptyMessage = "") => {
    if (!el) return;
    if (!items.length && emptyMessage) {
      el.innerHTML = `<p class="grid-empty">${emptyMessage}</p>`;
      return;
    }
    el.innerHTML = items.map((p) => window.JFFUI.renderProductCard(p)).join("");
    window.JFFUI.bindProductCards(el);
  };

  const buildTitle = () => {
    if (query) return `Results for "${query}"`;
    if (cat === "bestsellers") return "Best Sellers";
    if (cat === "new") return "New Arrivals";
    if (cat === "deals") return "Today's Deals";
    if (cat && sub) return `${categoryLabel(cat)}'s ${subcategoryLabel(sub)}`;
    if (cat) return `${categoryLabel(cat)}'s Footwear`;
    return "All Footwear";
  };

  const buildMeta = (count) => {
    if (cat && sub) return `${count} products in ${subcategoryLabel(sub)}`;
    if (cat && !isSpecialCat) return `${count} products for ${categoryLabel(cat).toLowerCase()}`;
    return `${count} products`;
  };

  const updateMainGrid = () => {
    const items = getFilteredProducts();
    let empty = "No products in this category yet. Try another style or contact us on WhatsApp.";
    if (query) empty = "No products found for your search.";

    if (resultsTitle) resultsTitle.textContent = buildTitle();
    if (resultsMeta) resultsMeta.textContent = buildMeta(items.length);

    if (cat && !isSpecialCat) {
      filterTabs.forEach((tab) => {
        const match = tab.dataset.filter === cat;
        tab.classList.toggle("is-active", match);
        tab.setAttribute("aria-selected", match ? "true" : "false");
      });
    }

    renderGrid(productGrid, items, empty);

    if ((cat || sub || query) && window.location.hash === "#shop") {
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  updateMainGrid();
  renderGrid(bestsellerGrid, filterProducts({ special: "bestsellers" }).slice(0, 8));
  renderGrid(dealsGrid, sortProducts(filterProducts({ special: "deals" }), "discount").slice(0, 8));

  if (sortSelect) sortSelect.addEventListener("change", updateMainGrid);

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;
      window.location.href = filter === "all" ? "index.html#shop" : `index.html?cat=${filter}#shop`;
    });
  });

  ["men", "women", "kids"].forEach((category) => {
    const el = document.getElementById(`size-chips-${category}`);
    const range = window.JFFStore.SIZE_RANGES[category];
    if (!el || !range) return;
    const sizes = [];
    for (let i = range.min; i <= range.max; i += 1) sizes.push(i);
    el.innerHTML = sizes.map((size) => `<span class="size-chip">${size}"</span>`).join("");
  });

  const heroBanners = document.getElementById("hero-banners");
  if (heroBanners) {
    const banners = [
      { title: "Men's Casual", sub: "Everyday comfort", img: "images/showcase/craft-960.jpg", href: "index.html?cat=men&sub=casual#shop" },
      { title: "Women's Flip Flops", sub: "Floral & stylish", img: "images/showcase/comfort-960.jpg", href: "index.html?cat=women&sub=flip-flops#shop" },
      { title: "Kids Collection", sub: "Sizes 2–5 inch", img: "images/showcase/style-960.jpg", href: "index.html?cat=kids#shop" },
      { title: "Today's Deals", sub: "Up to 35% off", img: "images/gallery/0374-800.jpg", href: "index.html?cat=deals#shop" },
    ];
    heroBanners.innerHTML = banners
      .map(
        (b) => `
      <a href="${b.href}" class="hero-banner-card">
        <img src="${b.img}" alt="" loading="lazy" />
        <div><strong>${b.title}</strong><span>${b.sub}</span></div>
      </a>`
      )
      .join("");
  }

  const browseGrid = document.getElementById("browse-categories");
  if (browseGrid) {
    const cards = [
      { g: "men", sub: "flip-flops", label: "Men's Flip Flops", img: "images/gallery/0381-800.jpg" },
      { g: "men", sub: "formal", label: "Men's Formal", img: "images/gallery/0386-800.jpg" },
      { g: "women", sub: "casual", label: "Women's Casual", img: "images/gallery/0364-800.jpg" },
      { g: "women", sub: "slippers", label: "Women's Slippers", img: "images/gallery/0379-800.jpg" },
      { g: "kids", sub: "school-wear", label: "Kids School Wear", img: "images/gallery/0378-800.jpg" },
      { g: "kids", sub: "party-wear", label: "Kids Party Wear", img: "images/gallery/0383-800.jpg" },
    ];
    browseGrid.innerHTML = cards
      .map(
        (c) => `
      <a href="index.html?cat=${c.g}&sub=${c.sub}#shop" class="browse-card">
        <img src="${c.img}" alt="${c.label}" loading="lazy" />
        <span>${c.label}</span>
      </a>`
      )
      .join("");
  }
};

if (document.getElementById("product-grid")) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomePage);
  } else {
    initHomePage();
  }
}
