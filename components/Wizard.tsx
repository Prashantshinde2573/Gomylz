"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { type PlaceRef, searchPlaces } from "@/lib/airports";
import { toISO } from "@/lib/dates";
import { CABINS, type Cabin, type TripQuery } from "@/lib/demo";
import { Calendar, type DateRange } from "./Calendar";
import { ArrowLeftIcon, BedIcon, FlyIcon } from "./Icons";

type Step = "from" | "to" | "dates" | "pax";

type Props = {
  mode: "flight" | "hotel";
  tripType: "one-way" | "return";
  onClose: () => void;
  onDone: (query: TripQuery) => void;
};

/** The step-by-step search: where from, where to, dates, travellers, then "Let's go". */
export function Wizard({ mode, tripType, onClose, onDone }: Props) {
  const steps: Step[] = mode === "flight" ? ["from", "to", "dates", "pax"] : ["to", "dates", "pax"];
  const [step, setStep] = useState<Step>(steps[0]);
  const [from, setFrom] = useState<PlaceRef | null>(null);
  const [to, setTo] = useState<PlaceRef | null>(null);
  const [text, setText] = useState("");
  const [dates, setDates] = useState<DateRange>({ start: null, end: null });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [cabin, setCabin] = useState<Cabin>("Economy");
  const inputRef = useRef<HTMLInputElement>(null);
  const today = useMemo(() => toISO(new Date()), []);

  const needsRange = mode === "hotel" || tripType === "return";
  const datesReady = !!dates.start && (!needsRange || !!dates.end);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function back() {
    const i = steps.indexOf(step);
    if (i === 0) onClose();
    else {
      setText("");
      setStep(steps[i - 1]);
    }
  }

  function choose(place: PlaceRef) {
    setText("");
    if (step === "from") {
      setFrom(place);
      setStep("to");
    } else {
      setTo(place);
      setStep("dates");
    }
  }

  function finish() {
    if (!to || !dates.start) return;
    onDone({
      kind: mode,
      tripType: mode === "flight" ? tripType : "one-way",
      from: from ?? undefined,
      to,
      date: dates.start,
      returnDate: dates.end ?? undefined,
      adults,
      children,
      cabin,
    });
  }

  const placeStep = step === "from" || step === "to";
  const results = placeStep
    ? searchPlaces(text, mode === "hotel").filter((p) => step !== "to" || p.cityCode !== from?.cityCode)
    : [];
  const placeholder = step === "from" ? "Departing from" : mode === "hotel" ? "City or hotel" : "Arriving at";
  const title = step === "dates" ? (mode === "hotel" ? "Stay dates" : "Travel dates") : "Who are the travelers?";

  return (
    <div className="sheet-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={mode === "flight" ? "Search flights" : "Search hotels"}>
        <div className="sheet-head">
          <button type="button" className="sheet-back" aria-label="Back" onClick={back}>
            <ArrowLeftIcon size={18} />
          </button>
          {placeStep ? (
            <input
              ref={inputRef}
              type="text"
              autoComplete="off"
              aria-label={placeholder}
              placeholder={placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          ) : (
            <strong>{title}</strong>
          )}
        </div>

        {mode === "flight" && step === "to" && from && <p className="sheet-crumb">From {from.label}</p>}

        {placeStep && (
          <ul className="place-list">
            {results.length === 0 && <li className="place-empty">No match. Try a city such as Lisbon or Tokyo.</li>}
            {results.map((p) => (
              <li key={`${p.kind}-${p.code}`}>
                <button type="button" className={`place ${p.kind}`} onClick={() => choose(p)}>
                  {p.kind === "city" ? <BedIcon size={16} /> : <FlyIcon />}
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        {step === "dates" && (
          <div className="sheet-body">
            <Calendar mode={needsRange ? "range" : "single"} value={dates} onChange={setDates} minISO={today} />
            {needsRange && (
              <p className="sheet-hint">{mode === "hotel" ? "Pick check-in, then check-out." : "Pick your outbound date, then your return."}</p>
            )}
            <button type="button" className="btn-dark sheet-apply" disabled={!datesReady} onClick={() => setStep("pax")}>
              Apply
            </button>
          </div>
        )}

        {step === "pax" && (
          <div className="sheet-body">
            <Stepper label="Adult (18+ Years)" noun="adults" value={adults} min={1} max={9} onChange={setAdults} />
            <Stepper label="Child (0-18 Years)" noun="children" value={children} min={0} max={8} onChange={setChildren} />
            {mode === "flight" && (
              <label className="field">
                <span className="sr-only">Cabin</span>
                <select value={cabin} onChange={(e) => setCabin(e.target.value as Cabin)}>
                  {CABINS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            )}
            <button type="button" className="lets-go" onClick={finish}>
              Let&apos;s go
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper(props: { label: string; noun: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const { label, noun, value, min, max, onChange } = props;
  return (
    <div className="stepper">
      <span>{label}</span>
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
