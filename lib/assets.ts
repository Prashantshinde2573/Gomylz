// Brand images, loaded from the live mylz site.
// To self-host: save the files into /public/images and set BASE to "/images".
const BASE = "https://gomylz.com/images";

export const LOGO = { src: `${BASE}/mylz-logo-cyan.png`, width: 268, height: 107 };

/** First frame of the hero video: shown while it loads and to visitors who prefer less motion. */
export const HERO_POSTER = "/videos/hero-poster.jpg";

/** Hero background clip (1080p, muted, 16s loop). */
export const HERO_VIDEO = "/videos/hero.mp4";

export const BACKERS = [
  // Heights balance each logo's visual weight inside its tile.
  { name: "IATA accredited", src: `${BASE}/iata-tids-logo.png`, height: 44 },
  { name: "NVIDIA Inception Program", src: `${BASE}/nvidia-inception-logo.png`, height: 34 },
  { name: "AWS Activate", src: `${BASE}/aws-activate-logo-v3.svg`, height: 22 },
  { name: "INSEAD AI Venture Lab", src: `${BASE}/insead-ai-venture-lab.png`, height: 42 },
];

/** Optional destination photos: add e.g. LIS: "/images/destinations/lisbon.jpg". */
export const DESTINATION_PHOTOS: Record<string, string> = {};
