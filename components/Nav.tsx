"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CURRENCIES, type CurrencyCode, useCurrency } from "./CurrencyProvider";
import { LOGO } from "@/lib/assets";
import { FlyIcon, GlobeIcon, PlusIcon } from "./Icons";

export function Nav() {
  const { currency, setCurrency } = useCurrency();
  const inChat = usePathname().startsWith("/chat");
  const [scrolled, setScrolled] = useState(false);

  // Transparent over the hero; a solid background once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${inChat ? " is-solid" : ""}${scrolled ? " is-scrolled" : ""}`}>
      <Link className="logo" href="/" aria-label="mylz home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO.src} alt="mylz" width={LOGO.width} height={LOGO.height} />
      </Link>

      <nav className="nav-links" aria-label="Main">
        <Link href="/#demo">See it work</Link>
        <Link href="/#how">How it works</Link>
        <Link href="/#trending">Trending</Link>
        <Link href="/#fee">What you pay</Link>
        <Link href="/#faq">FAQ</Link>
      </nav>

      <div className="nav-actions">
        {inChat && (
          <Link className="new-chat" href="/" aria-label="Start new chat">
            <PlusIcon size={18} />
          </Link>
        )}
        <label className="currency">
          <GlobeIcon />
          <span className="sr-only">Currency</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
            {Object.keys(CURRENCIES).map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
        {/* Point this at your real sign-in route */}
        <Link className="nav-link signin" href="#">
          Sign in
        </Link>
        {!inChat && (
          <Link className="nav-cta btn-fly" href="/#start">
            Plan my trip
            <FlyIcon size={16} />
          </Link>
        )}
      </div>
    </header>
  );
}
