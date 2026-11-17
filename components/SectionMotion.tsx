"use client";

import { useEffect } from "react";

const revealTargets = [
  ".travel-home .section-intro",
  ".travel-home .stay-tile",
  ".travel-home .workflow-list > li",
  ".travel-home .dest-head",
  ".travel-home .feature-card",
  ".travel-home .booking-card",
  ".travel-home .review",
  ".travel-home .partner-band",
  ".footer-pitch",
].join(", ");

export function SectionMotion() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("section-entered");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -32px" });

    document.querySelectorAll(revealTargets).forEach((target) => {
      if (target.getBoundingClientRect().top >= window.innerHeight) observer.observe(target);
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
