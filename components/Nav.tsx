"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CurrencyPicker } from "./CurrencyPicker";
import { createChat } from "@/lib/startChat";
import { LOGO } from "@/lib/assets";
import { AccountIcon, CloseIcon, FlyIcon, MenuIcon, PlusIcon } from "./Icons";

const HOME_LINKS = [
  ["Why Mylz?", "/#how"],
  ["Trending", "/#trending"],
  ["FAQ", "/#faq"],
];

export function Nav({ solid = false }: { solid?: boolean } = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const inChat = pathname === "/chat" || pathname.startsWith("/chat/");
  const menuLinks = HOME_LINKS;
  const authDialog = useRef<HTMLDialogElement>(null);
  const mobileMenu = useRef<HTMLDialogElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 640px)");
    const closeOnDesktop = () => {
      if (!mobile.matches) mobileMenu.current?.close();
    };
    mobile.addEventListener("change", closeOnDesktop);
    return () => mobile.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header className={`nav${inChat ? " nav-chat" : ""}${solid || inChat || scrolled ? " is-solid" : " is-over-hero"}`}>
      <details className="nav-menu">
        <summary aria-label="Navigation menu"><MenuIcon size={19} /></summary>
        <nav aria-label="Main menu">
          {menuLinks.map(([label, href]) => (
            <Link key={href} href={href} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>
              {label}
            </Link>
          ))}
        </nav>
      </details>
      <Link className="logo" href="/" aria-label="mylz home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO.src} alt="mylz" width={LOGO.width} height={LOGO.height} />
      </Link>

      <nav className="nav-links" aria-label="Main">
        {HOME_LINKS.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>

      <div className="nav-actions">
        {inChat && (
          <button type="button" className="new-chat" aria-label="Start new chat" onClick={() => router.push(createChat(""))}>
            <PlusIcon size={16} /> <span>Start New Chat</span>
          </button>
        )}
        <CurrencyPicker />
        <button type="button" className="nav-link signin" aria-label="Sign in" onClick={() => authDialog.current?.showModal()}>
          <span>Sign in</span><AccountIcon />
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
            <FlyIcon />
          </Link>
        )}
      </div>
      <button type="button" className="mobile-menu-trigger" aria-label="Open navigation menu" aria-haspopup="dialog" onClick={() => mobileMenu.current?.showModal()}>
        <MenuIcon size={19} />
      </button>
      <dialog ref={mobileMenu} className="mobile-menu-dialog" aria-label="Navigation menu">
        <div className="mobile-menu-heading">
          <Link className="logo" href="/" aria-label="Mylz home" onClick={() => mobileMenu.current?.close()}>
            <img src={LOGO.src} alt="mylz" width={LOGO.width} height={LOGO.height} />
          </Link>
          <button type="button" className="mobile-menu-close" aria-label="Close navigation menu" onClick={() => mobileMenu.current?.close()}>
            <CloseIcon size={20} />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {menuLinks.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => mobileMenu.current?.close()}>{label}</Link>
          ))}
        </nav>
        <button type="button" className="mobile-menu-signin" onClick={() => {
          mobileMenu.current?.close();
          authDialog.current?.showModal();
        }}>
          <AccountIcon /> Sign in
        </button>
      </dialog>
    </header>
  );
}
