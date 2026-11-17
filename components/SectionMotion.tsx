"use client";

import { useEffect } from "react";

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

    document.querySelectorAll(".travel-home > section:not(.hero)").forEach((section) => {
      if (section.getBoundingClientRect().top >= window.innerHeight) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
