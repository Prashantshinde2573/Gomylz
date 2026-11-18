"use client";

import { useEffect } from "react";

const revealTargets = [
  ".travel-home .section-intro",
  ".travel-home .stay-tile",
  ".travel-home .workflow-list > li",
  ".travel-home .dest-head",
  ".travel-home .feature-card",
  ".travel-home .feature-bento > *",
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

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".stay-tile"));
    let frame = 0;
    function update() {
      frame = 0;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const progress = (window.innerHeight / 2 - rect.top - rect.height / 2) / window.innerHeight;
        const offset = Math.max(-28, Math.min(28, progress * 56)) * (index % 2 === 0 ? -1 : 1);
        card.style.setProperty("--stay-offset", `${offset}px`);
      });
    }
    function schedule() {
      if (!motion.matches && !frame) frame = requestAnimationFrame(update);
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  return null;
}
