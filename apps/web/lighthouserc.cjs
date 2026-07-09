module.exports = {
  ci: {
    collect: {
      staticDistDir: "./out",
      url: [
        "http://127.0.0.1:4173/",
        "http://127.0.0.1:4173/products/",
        "http://127.0.0.1:4173/products/jff-001/",
        "http://127.0.0.1:4173/contact/",
        "http://127.0.0.1:4173/about/",
        "http://127.0.0.1:4173/faq/",
        "http://127.0.0.1:4173/gallery/",
      ],
      startServerCommand: "npx serve out -l 4173",
      startServerReadyPattern: "Accepting connections",
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.85 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 3500 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
        "resource-summary:script:size": ["warn", { maxNumericValue: 400000 }],
        "resource-summary:image:size": ["warn", { maxNumericValue: 600000 }],
        "resource-summary:total:size": ["warn", { maxNumericValue: 1200000 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
