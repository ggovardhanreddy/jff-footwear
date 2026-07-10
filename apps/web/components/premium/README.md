# Premium UI library (canonical)

These components are the **source of truth** for JFF’s premium storefront chrome.

They did not exist elsewhere in the monorepo or on disk when integrated (Jul 2026).
If you later import originals from another project, replace files here **without changing export names** so call sites stay stable.

## Components

| Component             | Motion stack                  | Use for                                        |
| --------------------- | ----------------------------- | ---------------------------------------------- |
| `SpotlightNavbar`     | Framer only                   | Sticky glass header, spotlight, hide-on-scroll |
| `PerspectiveCarousel` | Framer only                   | Hero / banners                                 |
| `ImageTrail`          | DOM (no Framer/GSAP)          | Desktop hero mouse trail                       |
| `FlipText`            | Framer only                   | Headline reveals                               |
| `SocialFlipButton`    | Framer only                   | Footer social                                  |
| `StaggeredGrid`       | **GSAP** ScrollTrigger        | Bento / spotlight / MOQ grids                  |
| `AnimatedBorder`      | CSS (respects reduced motion) | Glass frames                                   |

## Rules

1. **Framer** for UI chrome and micro-interactions.
2. **GSAP** only for scroll-triggered staggered grids (and similar entrance sequences).
3. Do not stack Framer + GSAP on the same element.
4. Always respect `prefers-reduced-motion` and disable heavy effects on `pointer: coarse`.
5. Keep APIs stable; prefer new optional props over breaking changes.

## Social links

Configure in `@jff/config` → `SOCIAL_LINKS` / `getConfiguredSocialLinks()`.
Empty strings are hidden — never ship fake Instagram/Facebook URLs.
