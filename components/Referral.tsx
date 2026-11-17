"use client";

import { useEffect, useState } from "react";

/** "Invite a friend": copy link and WhatsApp share. Set the reward text once it is decided. */
export function Referral() {
  const [copied, setCopied] = useState(false);
  // Same value on the server and on first render; the real origin is filled in after load.
  const [link, setLink] = useState("https://gomylz.com");
  useEffect(() => setLink(window.location.origin), []);
  const text = `Plan and book a trip in one sentence with mylz: ${link}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the visitor can still use WhatsApp */
    }
  }

  return (
    <div className="referral">
      <div>
        <strong>Invite a friend</strong>
        <p>
          <mark>[REWARD: e.g. give £10, get £10]</mark> when they book their first trip.
        </p>
      </div>
      <div className="referral-actions">
        <button type="button" className="btn-ghost on-dark" onClick={copy} aria-live="polite">
          {copied ? "Link copied" : "Copy link"}
        </button>
        <a className="btn-ghost on-dark" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">
          Share on WhatsApp
        </a>
      </div>
    </div>
  );
}
