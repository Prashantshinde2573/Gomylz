"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { type PlaceRef, cityForPlace, cityRef, searchPlaces } from "@/lib/airports";
import { fmtShort, toISO } from "@/lib/dates";
import { buildSentence, CABINS, type Cabin, type TripQuery } from "@/lib/demo";
import { createChat } from "@/lib/startChat";
import { Calendar, type DateRange } from "./Calendar";
import { useCurrency } from "./CurrencyProvider";
import { BedIcon, CalendarIcon, FlyIcon, LandingIcon, PlaneIcon, SparkleIcon, SwapIcon, TakeoffIcon, UserIcon } from "./Icons";
import { PREFILL_EVENT, PromptForm, TripTypes } from "./PromptForm";

type Mode = "ai" | "flights" | "stays";
type Pop = "from" | "to" | "dates" | "pax" | null;

/** The hero search card: ask mylzAI in one sentence, or search flights or stays field by field. */
export function SearchPanel() {
  const router = useRouter();
  const { home } = useCurrency();
  const searchRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => toISO(new Date()), []);

  const [mode, setMode] = useState<Mode>("ai");
  const [tripType, setTripType] = useState<"return" | "one-way">("return");
  const [cabin, setCabin] = useState<Cabin>("Economy");
  const [from, setFrom] = useState<PlaceRef | null>(null);
  const [to, setTo] = useState<PlaceRef | null>(null);
  const [dates, setDates] = useState<DateRange>({ start: null, end: null });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pop, setPop] = useState<Pop>(null);

  // Departure defaults to the visitor's home city, inferred from their currency.
  const homeCity = cityForPlace(home);
  const origin = from ?? (homeCity ? cityRef(homeCity) : null);
  const needsRange = mode === "stays" || tripType === "return";
  const datesReady = !!dates.start && (!needsRange || !!dates.end);

  // "Try this prompt" elsewhere on the page switches back to the sentence box.
  useEffect(() => {
    const onPrefill = () => setMode("ai");
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  // Close an open picker on Esc or a click outside the card.
  useEffect(() => {
    if (!pop) return;
    const onDown = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setPop(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPop(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pop]);

  function switchMode(next: Mode) {
    setMode(next);
    setPop(null);
    // A one-way trip has one date; a stay always has two.
    if (next === "stays" && dates.start && !dates.end) setDates({ start: dates.start, end: null });
  }

  function swap() {
    if (!to || !origin) return;
    setFrom(to);
    setTo(origin);
  }

  function search() {
    if (mode === "flights" && !origin) return setPop("from");
    if (!to) return setPop("to");
    if (!datesReady) return setPop("dates");
    const query: TripQuery = {
      kind: mode === "stays" ? "hotel" : "flight",
      tripType: mode === "flights" ? tripType : "one-way",
      from: mode === "flights" ? origin ?? undefined : undefined,
      to,
      date: dates.start!,
      returnDate: needsRange ? dates.end ?? undefined : undefined,
      adults,
      children,
      cabin,
    };
    setPop(null);
    // The form becomes the same sentence a visitor could have typed.
    router.push(createChat(buildSentence(query), query));
  }

  const toggle = (p: Exclude<Pop, null>) => setPop((cur) => (cur === p ? null : p));
  const people = `${adults} ${adults === 1 ? "Adult" : "Adults"}${children ? `, ${children} ${children === 1 ? "Child" : "Children"}` : ""}`;
  const dateText = dates.start ? (needsRange ? `${fmtShort(dates.start)} – ${dates.end ? fmtShort(dates.end) : "…"}` : fmtShort(dates.start)) : null;

  return (
    <div className="search-wrap" ref={searchRef}>
      <div className="sc-modes" role="tablist" aria-label="How to search">
        <button type="button" role="tab" aria-selected={mode === "ai"} onClick={() => switchMode("ai")}>
          <SparkleIcon /> <strong>Ask mylzAI</strong>
        </button>
        <button type="button" role="tab" aria-selected={mode === "flights"} onClick={() => switchMode("flights")}>
          <PlaneIcon /> Flights
        </button>
        <button type="button" role="tab" aria-selected={mode === "stays"} onClick={() => switchMode("stays")}>
          <BedIcon /> Stays
        </button>
      </div>
      <div className="search-card">
      <div className="sc-top">
        {mode === "flights" && (
          <div className="sc-opts">
            <fieldset className="sc-trip">
              <legend className="sr-only">Trip type</legend>
              {(["return", "one-way"] as const).map((t) => (
                <label key={t}>
                  <input type="radio" name="trip-type" checked={tripType === t} onChange={() => setTripType(t)} />
                  <span>{t === "return" ? "Return" : "One way"}</span>
                </label>
              ))}
            </fieldset>
            <label className="sc-class">
              <span className="sr-only">Cabin class</span>
              <select value={cabin} onChange={(e) => setCabin(e.target.value as Cabin)}>
                {CABINS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      <div className="sc-ai" hidden={mode !== "ai"}>
        <PromptForm variant="hero" />
      </div>

      {mode !== "ai" && (
        <div className="sc-row">
          {mode === "flights" ? (
            <div className="sc-route">
              <Field
                icon={<TakeoffIcon />}
                label="Departure city"
                value={origin ? placeName(origin) : null}
                placeholder="City or airport"
                open={pop === "from"}
                onClick={() => toggle("from")}
              >
                <PlacePicker
                  placeholder="Departing from"
                  exclude={to?.cityCode}
                  onPick={(p) => {
                    setFrom(p);
                    setPop(to ? null : "to");
                  }}
                />
              </Field>
              <button type="button" className="sc-swap" aria-label="Swap departure and arrival" onClick={swap} disabled={!to}>
                <SwapIcon />
              </button>
              <Field
                icon={<LandingIcon />}
                label="Arrival city"
                value={to ? placeName(to) : null}
                placeholder="Where to?"
                open={pop === "to"}
                onClick={() => toggle("to")}
              >
                <PlacePicker
                  placeholder="Arriving at"
                  exclude={origin?.cityCode}
                  onPick={(p) => {
                    setTo(p);
                    setPop(datesReady ? null : "dates");
                  }}
                />
              </Field>
            </div>
          ) : (
            <Field
              wide
              icon={<BedIcon size={20} />}
              label="Destination"
              value={to ? placeName(to) : null}
              placeholder="Which city?"
              open={pop === "to"}
              onClick={() => toggle("to")}
            >
              <PlacePicker
                placeholder="City"
                citiesOnly
                onPick={(p) => {
                  setTo(p);
                  setPop(datesReady ? null : "dates");
                }}
              />
            </Field>
          )}

          <Field
            icon={<CalendarIcon />}
            label={mode === "stays" ? "Check-in – Check-out" : tripType === "return" ? "Departure – Return" : "Departure"}
            value={dateText}
            placeholder="Add dates"
            open={pop === "dates"}
            onClick={() => toggle("dates")}
            popClass="is-dates"
          >
            <Calendar mode={needsRange ? "range" : "single"} value={dates} onChange={setDates} minISO={today} />
            <div className="pop-foot">
              <small>{needsRange ? (mode === "stays" ? "Pick check-in, then check-out." : "Pick departure, then return.") : "Pick your departure date."}</small>
              <button type="button" className="btn-dark sm" disabled={!datesReady} onClick={() => setPop("pax")}>
                Done
              </button>
            </div>
          </Field>

          <Field
            icon={<UserIcon />}
            label={mode === "stays" ? "Guests" : "Travellers"}
            value={people}
            placeholder=""
            open={pop === "pax"}
            onClick={() => toggle("pax")}
            popClass="is-end"
          >
            <Stepper label="Adults" hint="18+ years" noun="adults" value={adults} min={1} max={9} onChange={setAdults} />
            <Stepper label="Children" hint="0–17 years" noun="children" value={children} min={0} max={8} onChange={setChildren} />
            <div className="pop-foot">
              <span />
              <button type="button" className="btn-dark sm" onClick={() => setPop(null)}>
                Done
              </button>
            </div>
          </Field>

          <button type="button" className="search-btn btn-fly" onClick={search}>
            Search
            <FlyIcon />
          </button>
        </div>
      )}
    </div>
    <TripTypes />
    </div>
  );
}

function placeName(p: PlaceRef): string {
  const city = cityForPlace(p.code);
  if (p.kind === "airport") return `${p.label.replace(/ - [A-Z]{3}$/, "")} · ${p.code}`;
  return `${city?.city ?? p.label} · ${p.code}`;
}

function Field(props: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  placeholder: string;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
  wide?: boolean;
  popClass?: string;
}) {
  const { icon, label, value, placeholder, open, onClick, children, wide, popClass } = props;
  const fieldRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [up, setUp] = useState(false);

  // Keep the picker on screen: open below if it fits, above if it fits there,
  // otherwise scroll just enough to show the field and the picker together.
  useLayoutEffect(() => {
    if (!open || !fieldRef.current || !popRef.current) return;
    const nav = 84;
    const field = fieldRef.current.getBoundingClientRect();
    const popHeight = popRef.current.offsetHeight + 12;
    const below = window.innerHeight - field.bottom;
    const above = field.top - nav;
    if (popHeight <= below) {
      setUp(false);
    } else if (popHeight <= above && field.bottom <= window.innerHeight) {
      setUp(true);
    } else {
      setUp(false);
      const need = field.bottom + popHeight + 16 - window.innerHeight;
      const room = field.top - nav - 8;
      window.scrollBy({ top: Math.max(0, Math.min(need, room)), behavior: "smooth" });
    }
  }, [open]);

  return (
    <div className={`sc-field${wide ? " is-wide" : ""}`} ref={fieldRef}>
      <button type="button" aria-expanded={open} aria-haspopup="dialog" onClick={onClick}>
        <span className="sc-text">
          <small className="sc-label">{icon}{label}</small>
          <strong className={value ? undefined : "is-empty"}>{value ?? placeholder}</strong>
        </span>
      </button>
      {open && (
        <div ref={popRef} className={`sc-pop ${popClass ?? ""}${up ? " is-up" : ""}`} role="dialog" aria-label={label}>
          {children}
        </div>
      )}
    </div>
  );
}

function PlacePicker(props: { placeholder: string; onPick: (p: PlaceRef) => void; exclude?: string; citiesOnly?: boolean }) {
  const { placeholder, onPick, exclude, citiesOnly = false } = props;
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchPlaces(text, citiesOnly).filter((p) => p.cityCode !== exclude);

  // Focus without letting the browser scroll the page to the picker.
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);
  return (
    <>
      <input ref={inputRef} className="pop-input" type="text" autoComplete="off" aria-label={placeholder} placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} />
      <ul className="place-list">
        {results.length === 0 && <li className="place-empty">No match. Try a city such as Lisbon or Tokyo.</li>}
        {results.map((p) => (
          <li key={`${p.kind}-${p.code}`}>
            <button type="button" className={`place ${p.kind}`} onClick={() => onPick(p)}>
              {p.kind === "city" ? <BedIcon size={16} /> : <PlaneIcon size={16} />}
              {p.label}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function Stepper(props: { label: string; hint: string; noun: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const { label, hint, noun, value, min, max, onChange } = props;
  return (
    <div className="stepper">
      <span>
        {label}
        <small>{hint}</small>
      </span>
      <div>
        <button type="button" aria-label={`Remove one ${noun}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
          −
        </button>
        <output aria-live="polite">{value}</output>
        <button type="button" aria-label={`Add one ${noun}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
          +
        </button>
      </div>
    </div>
  );
}
