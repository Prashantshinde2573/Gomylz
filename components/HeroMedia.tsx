"use client";

import { useEffect, useRef, useState } from "react";
import { HOMEPAGE_HERO_POSTER as HERO_POSTER, HERO_VIDEO } from "@/lib/assets";

/** Full-bleed hero background: the hero video under a dark overlay so the text stays readable. */
export function HeroMedia() {
  const ref = useRef<HTMLVideoElement>(null);
  const [videoOk, setVideoOk] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // People who ask for less motion get the still frame.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    video.play().catch(() => undefined);
  }, []);

  return (
    <div className="hero-bg" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-photo" src={HERO_POSTER} alt="" />
      {videoOk && (
        <video
          ref={ref}
          className={playing ? "hero-video is-playing" : "hero-video"}
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_POSTER}
          onPlaying={() => setPlaying(true)}
          onError={() => setVideoOk(false)}
        >
          <source src={HERO_VIDEO} type="video/mp4" onError={() => setVideoOk(false)} />
        </video>
      )}
      <div className="hero-overlay" />
    </div>
  );
}
