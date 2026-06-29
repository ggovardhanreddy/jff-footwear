const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pageEnter = () => {
  document.body.classList.add("page-loaded");
};

const observeReveal = () => {
  document.querySelectorAll(".animate-in").forEach((el) => {
    if (prefersReducedMotion()) {
      el.classList.add("is-visible");
      return;
    }
  });

  if (prefersReducedMotion()) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
  );

  document.querySelectorAll(".animate-in").forEach((el) => io.observe(el));
};

const staggerCards = (root = document) => {
  const container = root.querySelectorAll ? root : document;
  container.querySelectorAll(".product-card .animate-card, .product-card .product-image-wrap").forEach((el, i) => {
    if (prefersReducedMotion()) return;
    el.classList.add("animate-in");
    el.style.setProperty("--stagger", `${Math.min(i * 0.04, 0.35)}s`);
  });
  observeReveal();
};

const bindImageZoom = (root = document) => {
  const container = root.querySelectorAll ? root : document;
  container.querySelectorAll(".product-image img, .pdp-image-main img").forEach((img) => {
    const wrap = img.closest(".product-image, .pdp-image-main");
    if (!wrap || wrap.dataset.zoomBound) return;
    wrap.dataset.zoomBound = "1";
    wrap.classList.add("has-zoom");
  });
};

const bindAddToCartPulse = () => {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add-cart, #pdp-add-cart");
    if (!btn || prefersReducedMotion()) return;
    btn.classList.add("btn-pulse");
    setTimeout(() => btn.classList.remove("btn-pulse"), 450);
  });
};

const initAnimations = () => {
  pageEnter();
  observeReveal();
  bindAddToCartPulse();
  bindImageZoom();
  setTimeout(() => {
    document.querySelectorAll(".animate-in:not(.is-visible)").forEach((el) => el.classList.add("is-visible"));
  }, 1200);
};

document.addEventListener("DOMContentLoaded", initAnimations);

window.JFFAnimations = { staggerCards, observeReveal, bindImageZoom };
