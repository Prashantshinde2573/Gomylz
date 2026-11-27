"use client";

import { usePathname } from "next/navigation";
import { PromptForm } from "./PromptForm";
import { DiscoveryCall } from "./airlines/DiscoveryCall";
import { FlyIcon } from "./Icons";
import { LOGO } from "@/lib/assets";

export function SiteFooter() {
  const isAirlines = usePathname() === "/airlines";
  return (<footer className="footer">
{isAirlines ? (<section className="footer-airline-cta" id="airline-contact" aria-labelledby="contact-title">
                <span className="eyebrow">Pilot first. Prove the lift. Then scale.</span>
                <h2 id="contact-title">Let’s start with<br/><em>your airline.</em></h2>
                <p>See your airline’s AI in action. You keep the lion’s share.<br/>Mylz takes a small fee on results.</p>
                <div className="footer-airline-actions"><DiscoveryCall/><a className="btn-outline on-dark" href="#airline-experience">Explore the passenger experience <FlyIcon/></a></div>
                <a className="footer-airline-email" href="mailto:partners@gomylz.com">partners@gomylz.com</a>
                <p className="footer-airline-note">We’ll walk you through the layer on your own routes and scope a pilot that fits your stack.</p>
              </section>) : (              <section className="footer-banner" id="start" aria-labelledby="start-title">
                <div className="footer-pitch">
                  <a href="/" aria-label="Mylz home"><img className="footer-logo" src={LOGO.src} alt="mylz" width={LOGO.width} height={LOGO.height} loading="lazy" /></a>
                  <h2 id="start-title">Where to next?</h2>
                  <p>The best moments in life happen offline.</p>
                </div>
                <div className="footer-actions">
                  <p>Start with a destination, a date, or an idea.</p>
                  <PromptForm variant="cta" />
                </div>
              </section>)}
              <nav aria-label="Explore Mylz">
                <strong>Explore</strong>
                <a href="/#stays">Stays</a>
                <a href="/#trending">Destinations</a>
              </nav>
              <nav aria-label="Trip planning">
                <strong>Plan</strong>
                <a href="/#start">Plan a trip</a>
                <a href="/#demo">See it work</a>
              </nav>
              <nav aria-label="Booking help">
                <strong>Booking help</strong>
                <a href="/#how">How it works</a>
                <a href="/#fee">Before you book</a>
                <a href="/#faq">FAQ</a>
              </nav>
              <nav aria-label="Legal">
                <strong>Company</strong>
                <a href="https://gomylz.com/terms-and-conditions">Terms</a>
                <a href="https://gomylz.com/privacy">Privacy</a>
                <a href="https://gomylz.com/sanctions-compliance">Sanctions compliance</a>
              </nav>
              <div className="footer-legal">
                <span>© 2026 Milesfactory Limited</span>
                <span>Company No. 16131941 · IATA TIDS 96192412</span>
              </div>
            </footer>);
}
