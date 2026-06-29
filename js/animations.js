const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pageEnter = () => {
  if (prefersReducedMotion()) return;
  document.body.classList.add("page-loaded");
};

const observeReveal = () => {
  if (prefersReducedMotion()) {
    document.querySelectorAll(".animate-in").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".animate-in").forEach((el) => io.observe(el));
};

const staggerCards = (root = document) => {
  if (prefersReducedMotion()) return;
  root.querySelectorAll(".product-card").forEach((card, i) => {
    card.classList.add("animate-in");
    card.style.setProperty("--stagger", `${Math.min(i * 0.05, 0.4)}s`);
  });
  observeReveal();
};

const bindImageZoom = (root = document) => {
  root.querySelectorAll(".product-image img, .pdp-image-main img").forEach((img) => {
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
};

document.addEventListener("DOMContentLoaded", initAnimations);

window.JFFAnimations = { staggerCards, observeReveal, bindImageZoom };
