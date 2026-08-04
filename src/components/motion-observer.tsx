"use client";

import { useEffect } from "react";

const revealSelectors = [
  "main > header",
  "main > nav",
  "main > section:not(.hero-motion):not(.checkout-content):not(.quiz-section)",
  "main > article",
  "main > form",
  "main > aside",
  "figure",
  ".section-heading",
  ".product-breadcrumbs",
  ".catalog-quick-tags",
  ".catalog-filters",
  ".product-gallery-thumbnails",
  ".product-gallery-main",
  ".product-gallery-controls",
  ".product-info-panel",
  ".product-related-header",
  ".product-related-controls",
  ".catalog-editorial-side",
  ".catalog-product-card",
  ".related-card",
  ".journal-card",
  ".product-detail-pill details",
  ".cart-item",
  ".checkout-section",
  ".checkout-summary",
  ".account-card",
  ".hero-description",
  ".editorial-copy > *",
  ".button",
];

const selector = revealSelectors.join(",");

function decorate(root: ParentNode) {
  const elements: HTMLElement[] = root instanceof HTMLElement && root.matches(selector)
    ? [root, ...root.querySelectorAll<HTMLElement>(selector)]
    : Array.from(root.querySelectorAll<HTMLElement>(selector));

  elements.forEach((element) => {
    if (element.classList.contains("motion-reveal") || element.closest(".hero-motion, .quiz-section")) return;

    const isImage = element.matches("figure, .catalog-product-card, .related-card, .journal-card");
    const isSection = element.matches("main > header, main > section:not(.hero-motion):not(.checkout-content):not(.quiz-section), .section-heading");
    const variant = isImage ? "image" : isSection ? "mask" : "text";
    const siblings = element.parentElement ? Array.from(element.parentElement.children) : [];
    const siblingIndex = Math.min(Math.max(siblings.indexOf(element), 0), 6);

    element.classList.add("motion-reveal", `motion-reveal--${variant}`);
    element.style.setProperty("--motion-delay", `${siblingIndex * 70}ms`);
  });
}

export function MotionObserver() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    let scrollFrame: number | null = null;

    const revealVisible = () => {
      const viewportBottom = window.innerHeight * 0.92;

      document.querySelectorAll<HTMLElement>(".motion-reveal:not(.is-visible)").forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < viewportBottom && rect.bottom > 0) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      });
    };

    const observe = (root: ParentNode = document) => {
      decorate(root);
      root.querySelectorAll<HTMLElement>(".motion-reveal:not(.is-visible)").forEach((element) => observer.observe(element));
    };

    observe();
    document.documentElement.dataset.motionReady = "true";
    revealVisible();

    const onScroll = () => {
      if (scrollFrame !== null) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = null;
        revealVisible();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) observe(node);
      }));
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    if (reduceMotion.matches) document.documentElement.dataset.motionReduced = "true";
    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      document.documentElement.dataset.motionReduced = event.matches ? "true" : "false";
    };
    reduceMotion.addEventListener("change", onMotionPreferenceChange);

    return () => {
      mutations.disconnect();
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
      reduceMotion.removeEventListener("change", onMotionPreferenceChange);
      delete document.documentElement.dataset.motionReady;
      delete document.documentElement.dataset.motionReduced;
    };
  }, []);

  return null;
}
