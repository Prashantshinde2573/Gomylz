"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { CURRENCIES, type CurrencyCode, useCurrency } from "./CurrencyProvider";
import { LOGO } from "@/lib/assets";
import { CloseIcon, FlyIcon, GlobeIcon, PlusIcon } from "./Icons";

const HOME_LINKS = [
  ["Stays", "/#stays"],
  ["See it work", "/#demo"],
  ["How it works", "/#how"],
  ["Trending", "/#trending"],
  ["Booking", "/#fee"],
  ["FAQ", "/#faq"],
];

export function Nav() {
  const { currency, setCurrency } = useCurrency();
  const inChat = usePathname().startsWith("/chat");
  const authDialog = useRef<HTMLDialogElement>(null);

  return (
    <header className={`nav${inChat ? " is-solid" : ""}`}>
      <Link className="logo" href="/" aria-label="mylz home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO.src} alt="mylz" width={LOGO.width} height={LOGO.height} />
      </Link>

      <nav className="nav-links" aria-label="Main">
        {HOME_LINKS.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>

      <div className="nav-actions">
        {inChat && (
          <Link className="new-chat" href="/chat?new=1">
            <PlusIcon size={16} /> <span>Start new chat</span>
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
        {!inChat && (
          <details className="nav-menu">
            <summary aria-label="Open menu"><span aria-hidden="true">☰</span></summary>
            <nav aria-label="Homepage sections">
              {[...HOME_LINKS, ["Plan my trip", "/#start"]].map(([label, href]) => (
                <Link key={href} href={href} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>
                  {label}
                </Link>
              ))}
            </nav>
          </details>
        )}
      </div>
    </header>
  );
}
