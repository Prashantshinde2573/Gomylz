"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CURRENCIES, type CurrencyCode, useCurrency } from "./CurrencyProvider";
import { createChat } from "@/lib/startChat";
import { LOGO } from "@/lib/assets";
import { CloseIcon, FlyIcon, GlobeIcon, PlusIcon } from "./Icons";

const HOME_LINKS = [
  ["Stays", "/#stays"],
  ["How it works", "/#demo"],
  ["Why Mylz?", "/#how"],
  ["Trending", "/#trending"],
  ["Booking", "/#fee"],
  ["FAQ", "/#faq"],
];

export function Nav() {
  const { currency, setCurrency } = useCurrency();
  const pathname = usePathname();
  const router = useRouter();
  const inChat = pathname === "/chat" || pathname.startsWith("/chat/");
  const chatLinks = [["Home", "/"], ["Destinations", "/#trending"], ["Booking help", "/#faq"]];
  const authDialog = useRef<HTMLDialogElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`nav${inChat ? " nav-chat" : ""}${inChat || scrolled ? " is-solid" : " is-over-hero"}`}>
      <Link className="logo" href="/" aria-label="mylz home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO.src} alt="mylz" width={LOGO.width} height={LOGO.height} />
      </Link>

      <nav className="nav-links" aria-label="Main">
        {(inChat ? chatLinks : HOME_LINKS).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        {pathname.startsWith("/chat/") && <span className="nav-current" aria-current="page">Trip chat</span>}
      </nav>

      <div className="nav-actions">
        {inChat && (
          <button type="button" className="new-chat" aria-label="Start new chat" onClick={() => router.push(createChat(""))}>
            <PlusIcon size={16} /> <span>Start New Chat</span>
          </button>
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
        <button type="button" className="nav-link signin" onClick={() => authDialog.current?.showModal()}>
          Sign in
        </button>
        <dialog ref={authDialog} className="sheet login nav-auth" aria-labelledby="nav-auth-title">
          <button type="button" className="sheet-close" aria-label="Close" onClick={() => authDialog.current?.close()}><CloseIcon size={18} /></button>
          <h2 id="nav-auth-title">Sign in to mylz</h2>
          <p>Sign-in is available on the live GoMylz site.</p>
          <a className="btn-dark sm" href="https://gomylz.com/">Open GoMylz</a>
          <button type="button" className="link-btn" onClick={() => authDialog.current?.close()}>Continue as guest</button>
        </dialog>
        {!inChat && (
          <Link className="nav-cta btn-fly" href="/#start">
            Plan my trip
            <FlyIcon size={16} />
          </Link>
        )}
        <details className="nav-menu">
          <summary aria-label="Open menu"><span aria-hidden="true">☰</span></summary>
          <nav aria-label="Homepage sections">
            {(inChat ? chatLinks : [...HOME_LINKS, ["Plan my trip", "/#start"]]).map(([label, href]) => (
              <Link key={href} href={href} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>
                {label}
              </Link>
            ))}
            {pathname.startsWith("/chat/") && <span className="nav-current" aria-current="page">Trip chat</span>}
          </nav>
        </details>
      </div>
    </header>
  );
}
