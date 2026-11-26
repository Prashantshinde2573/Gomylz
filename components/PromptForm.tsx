"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createChat } from "@/lib/startChat";
import { useCurrency } from "./CurrencyProvider";
import { FlyIcon, BeachIcon, CityIcon, FamilyIcon, HeartIcon, MicIcon, SkiIcon, TagIcon } from "./Icons";
import { useSpeech } from "./useSpeech";

const HINTS = [
  "Tell mylz your trip in one sentence",
  "A long weekend in Lisbon for two",
  "Somewhere warm in January",
  "A hotel in Rome for 3 nights",
];

// Examples stay in the placeholder; they never become the submitted query.
const HERO_HINTS = [
  "Flights from London to Lisbon next Friday",
  "A long weekend in Lisbon for two",
  "A hotel in Rome for 3 nights",
  "A beach escape for two in January",
];

/** Other parts of the page can fill the hero box: window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: "..." })) */
export const PREFILL_EVENT = "mylz:prefill";

// Trip-type tiles: each one sends a ready-made ask, so nobody faces a blank box.
const TRIP_TYPES: Array<{ label: string; prompt: string; icon: React.ReactNode }> = [
  { label: "Weekend city break", prompt: "A weekend city break", icon: <CityIcon size={18} /> },
  { label: "Beach", prompt: "A beach holiday somewhere warm", icon: <BeachIcon size={18} /> },
  { label: "Family", prompt: "A family trip with kids", icon: <FamilyIcon size={18} /> },
  { label: "Romantic", prompt: "A romantic getaway for two", icon: <HeartIcon size={18} /> },
  { label: "Ski", prompt: "A ski trip", icon: <SkiIcon size={18} /> },
];

type Props = { variant: "hero" | "cta" };

/** The one-sentence ask. Submitting opens a new chat with that sentence. */
export function PromptForm({ variant }: Props) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [hint, setHint] = useState(0);
  const speech = useSpeech(setValue);
  const [focused, setFocused] = useState(false);
  const [typedHint, setTypedHint] = useState(HERO_HINTS[0].slice(0, 1));

  useEffect(() => {
    if (variant !== "hero" || focused || value || speech.listening) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    let example = 0;
    let character = 1;
    let deleting = false;
    const tick = () => {
      const text = HERO_HINTS[example];
      character += deleting ? -1 : 1;
      setTypedHint(text.slice(0, character));
      let delay = deleting ? 28 : 65;
      if (!deleting && character === text.length) {
        deleting = true;
        delay = 2200;
      } else if (deleting && character === 0) {
        example = (example + 1) % HERO_HINTS.length;
        deleting = false;
        delay = 350;
      }
      timer = setTimeout(tick, delay);
    };
    const start = () => {
      clearTimeout(timer);
      if (motion.matches) {
        setTypedHint(HERO_HINTS[0]);
        return;
      }
      example = 0;
      character = 1;
      deleting = false;
      setTypedHint(HERO_HINTS[0].slice(0, 1));
      timer = setTimeout(tick, 65);
    };
    start();
    motion.addEventListener("change", start);
    return () => {
      clearTimeout(timer);
      motion.removeEventListener("change", start);
    };
  }, [variant, focused, value, speech.listening]);

  useEffect(() => {
    if (variant !== "cta" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setHint((h) => (h + 1) % HINTS.length), 2600);
    return () => window.clearInterval(timer);
  }, [variant]);

  // "Try this prompt" buttons elsewhere on the page fill the hero box.
  useEffect(() => {
    if (variant !== "hero") return;
    const onPrefill = (e: Event) => {
      setValue((e as CustomEvent<string>).detail);
      // Wait a frame: the search card may be switching back to this box.
      window.requestAnimationFrame(() => {
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        inputRef.current?.focus({ preventScroll: true });
      });
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, [variant]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const prompt = value.trim();
    if (!prompt) {
      inputRef.current?.focus();
      return;
    }
    router.push(createChat(prompt));
  }

  if (variant === "cta") {
    return (
      <form className="cta-form" onSubmit={submit}>
        <label className="sr-only" htmlFor={inputId}>
          Ask anything about your trip
        </label>
        <input ref={inputRef} id={inputId} type="text" autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)} placeholder={HINTS[hint]} />
        {speech.supported && (
          <button className="mic" type="button" aria-label="Record a message" aria-pressed={speech.listening} onClick={speech.toggle}>
            <MicIcon />
          </button>
        )}
        <button className="go" type="submit" aria-label="Start planning your trip!">
          <FlyIcon />
        </button>
      </form>
    );
  }

  return (
    <>
      <form className="sc-row ai-row" onSubmit={submit}>
        <div className="ai-box">
          {speech.supported ? (
            <button className="sc-ico mic-btn" type="button" aria-label="Record a message" aria-pressed={speech.listening} onClick={speech.toggle}>
              <MicIcon />
            </button>
          ) : (
            <span className="sc-ico" aria-hidden="true">
              <MicIcon />
            </span>
          )}
          <span className="sc-text">
            <label className="sr-only" htmlFor={inputId}>Your trip, in one sentence</label>
            <input ref={inputRef} id={inputId} type="text" autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)} placeholder={focused || speech.listening ? "Tell Mylz your trip in one sentence" : typedHint} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
          </span>
        </div>
        <button className="search-btn" type="submit" aria-label="Search with MylzAI">
          <FlyIcon />
        </button>
      </form>

    </>
  );
}

/** Trip-type tiles: each one starts a chat with a ready-made ask, so nobody faces a blank box. */
export function TripTypes() {
  const router = useRouter();
  const { format } = useCurrency();
  return (
      <div className="trip-types" aria-label="Trip ideas">
      {TRIP_TYPES.map((t) => (
        <button key={t.label} type="button" className="trip-type" onClick={() => router.push(createChat(t.prompt))}>
          {t.icon}
          {t.label}
        </button>
      ))}
      <button type="button" className="trip-type" onClick={() => router.push(createChat(`Somewhere under ${format(200)}`))}>
        <TagIcon size={18} />
        Under {format(200)}
      </button>
    </div>
  );
}
