// Official partner marks are loaded from the live Mylz site.
const BASE = "https://gomylz.com/images";

export const LOGO = { src: "/images/mylz-wordmark.svg", width: 103, height: 36 };

/** First frame of the hero video: shown while it loads and to visitors who prefer less motion. */
export const HERO_POSTER = "/videos/gomylz-hero-poster.jpg";

/** Uploaded skyline clip, optimized to 1080p with no audio. */
export const HERO_VIDEO = "/videos/hero-skyline.mp4";
export const HOMEPAGE_HERO_POSTER = "/videos/hero-skyline-poster.jpg";

export const BACKERS = [
  // Heights balance each logo's visual weight inside its tile.
  { name: "IATA accredited", src: `${BASE}/iata-tids-logo.png`, height: 44 },
  { name: "NVIDIA Inception Program", src: `${BASE}/nvidia-inception-logo.png`, height: 34 },
  { name: "AWS Activate", src: `${BASE}/aws-activate-logo-v3.svg`, height: 22 },
  { name: "INSEAD AI Venture Lab", src: `${BASE}/insead-ai-venture-lab.png`, height: 42 },
];

/** Editorial destination photography from Unsplash. */
const destinationPhoto = (id: string) => `https://images.unsplash.com/photo-${id}?w=700&h=900&fit=crop&auto=format&q=80`;

export const DESTINATION_PHOTOS: Partial<Record<string, string>> = {
  LIS: destinationPhoto("1658436968246-1b96bea5ed73"),
  ROM: destinationPhoto("1711447402543-d9acc369fbe4"),
  DXB: destinationPhoto("1721804222945-e443900b382a"),
  IST: destinationPhoto("1760184390678-dd49c89c61e1"),
  DPS: destinationPhoto("1672243776001-998bd4198ccd"),
  NYC: destinationPhoto("1661959063479-26d61c39749c"),
  TYO: destinationPhoto("1591194233688-dca69d406068"),
  BCN: destinationPhoto("1583422409516-2895a77efded"),
};
