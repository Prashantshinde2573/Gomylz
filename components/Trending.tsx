"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cityForPlace } from "@/lib/airports";
import { DESTINATION_PHOTOS } from "@/lib/assets";
import { fmtShort, toISO } from "@/lib/dates";
import { type Idea, trendingTrips } from "@/lib/demo";
import { useCurrency } from "./CurrencyProvider";
import { ArrowUpRightIcon } from "./Icons";

/** Priced trips from the visitor's home city. Each card opens a chat with the sentence already written. */
export function Trending({ initial }: { initial: Idea[] }) {
  const { format, home } = useCurrency();
  const [trips, setTrips] = useState(initial);

  // Re-price from the visitor's own city once their currency is known.
  useEffect(() => {
    setTrips(trendingTrips(home, toISO(new Date())));
  }, [home]);

  const city = cityForPlace(home)?.city ?? "London";

  return (
    <section className="dest" id="trending" aria-labelledby="dest-title">
      <div className="dest-head">
        <span className="eyebrow">Trending from {city}</span>
        <h2 id="dest-title">Start with a place. mylz does the rest.</h2>
      </div>
      <div className="dest-grid">
        {trips.map((t, i) => (
          <Link key={t.code} className={`dest-card tone-${i % 3}`} href={`/chat?q=${encodeURIComponent(t.prompt)}`} prefetch={false}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {DESTINATION_PHOTOS[t.code] && <img src={DESTINATION_PHOTOS[t.code]} alt="" loading="lazy" />}
            <span className="dest-code" aria-hidden="true">
              {t.code}
            </span>
            <svg className="dest-arc" viewBox="0 0 200 80" aria-hidden="true">
              <path d="M6 70 Q100 -20 194 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" strokeLinecap="round" />
              <circle cx="6" cy="70" r="3" fill="currentColor" />
              <circle cx="194" cy="40" r="4" fill="currentColor" />
            </svg>
            <span className="dest-text">
              <strong>{t.city}</strong>
              <small>
                {fmtShort(t.out)} – {fmtShort(t.back)} · {t.line}
              </small>
              <b>
                from {format(t.fromGBP)} <i>return</i>
              </b>
            </span>
            <span className="dest-go" aria-hidden="true">
              <ArrowUpRightIcon size={16} />
            </span>
          </Link>
        ))}
      </div>
      <small className="dest-note">Example fares for one adult, for illustration.</small>
    </section>
  );
}
