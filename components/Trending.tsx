"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cityForPlace } from "@/lib/airports";
import { DESTINATION_PHOTOS } from "@/lib/assets";
import { nightsBetween, toISO } from "@/lib/dates";
import { type Idea, trendingTrips } from "@/lib/demo";
import { useCurrency } from "./CurrencyProvider";
import { FlyIcon } from "./Icons";

/** Priced trips from the visitor's home city. Each card opens a chat with the sentence already written. */
export function Trending({ initial }: { initial: Idea[] }) {
  const { format, home } = useCurrency();
  const [trips, setTrips] = useState(initial);
  const rail = useRef<HTMLDivElement>(null);

  function moveRail(direction: number) {
    const element = rail.current;
    if (element) element.scrollBy({ left: direction * element.clientWidth });
  }

  // Re-price from the visitor's own city once their currency is known.
  useEffect(() => {
    setTrips(trendingTrips(home, toISO(new Date())));
  }, [home]);

  const city = cityForPlace(home)?.city ?? "London";

  return (
    <section className="dest" id="trending" aria-labelledby="dest-title">
      <div className="dest-head">
        <span className="eyebrow">Trending from {city}</span>
        <h2 id="dest-title">See where you could go.</h2>
        <p>Find a trip that fits your dates, your budget, and the way you like to travel.</p>
        <small className="dest-note">Sample return fares for one adult.</small>
      </div>
      <div className="dest-carousel">
        <div className="dest-grid" ref={rail}>
          {trips.map((t, i) => (
            <Link key={t.code} className={`dest-card tone-${i % 3}`} href={`/chat?q=${encodeURIComponent(t.prompt)}`} prefetch={false}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {DESTINATION_PHOTOS[t.code] && <img src={DESTINATION_PHOTOS[t.code]} alt="" loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} />}
              <span className="dest-meta"><span>{t.country}</span><span>{nightsBetween(t.out, t.back)} nights</span></span>
              <span className="dest-text">
                <strong>{t.city}</strong>
                <small>
                  {t.line}
                </small>
                <b>
                  from {format(t.fromGBP)} <i>return</i>
                </b>
                <span className="dest-explore">Explore Trip</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="dest-controls">
          <button type="button" aria-label="Previous destinations" onClick={() => moveRail(-1)}><FlyIcon direction="left" /></button>
          <button type="button" aria-label="Next destinations" onClick={() => moveRail(1)}><FlyIcon /></button>
        </div>
      </div>
    </section>
  );
}
