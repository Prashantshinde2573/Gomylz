"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "./CurrencyProvider";
import { CheckIcon, FlyIcon } from "./Icons";
import { PREFILL_EVENT } from "./PromptForm";

const SENTENCE = "A long weekend in Lisbon for two, flying from London.";
// Example prices in GBP. Replace with a real recent booking before launch.
const OPTIONS = [
  { id: "a", tag: "Best value", flight: "LGW → LIS · direct · Fri 07:30", stay: "Guesthouse in Alfama · 3 nights", total: 438 },
  { id: "b", tag: "Best timing", flight: "LHR → LIS · direct · Fri 10:15", stay: "Hotel in Chiado · 3 nights", total: 562 },
];
const STEPS = ["Ask", "Search", "Compare", "Booked"];

/** "See it in action": one sentence, priced options, booked. Plays by itself; the steps are tappable. */
export function DemoShowcase() {
  const { format } = useCurrency();
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAuto(false);
      setTyped(SENTENCE.length);
      setStep(2);
    }
  }, []);

  // Type the sentence out on step 0.
  useEffect(() => {
    if (step !== 0 || !auto) return;
    setTyped(0);
    const t = window.setInterval(() => setTyped((n) => Math.min(n + 1, SENTENCE.length)), 38);
    return () => window.clearInterval(t);
  }, [step, auto]);

  useEffect(() => {
    if (!auto) return;
    const wait = [SENTENCE.length * 38 + 900, 1500, 3600, 3200][step];
    const t = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), wait);
    return () => window.clearTimeout(t);
  }, [step, auto]);

  function go(i: number) {
    setAuto(false);
    setTyped(SENTENCE.length);
    setStep(i);
  }

  return (
    <div className="showcase">
      <div className="showcase-steps" role="tablist" aria-label="Demo steps">
        {STEPS.map((label, i) => (
          <button key={label} type="button" role="tab" aria-selected={step === i} className={i < step ? "done" : ""} onClick={() => go(i)}>
            <i>{i + 1}</i>
            {label}
          </button>
        ))}
      </div>

      <div className="showcase-stage" aria-live="polite">
        <p className="bubble user">
          {SENTENCE.slice(0, step === 0 ? typed : SENTENCE.length)}
          {step === 0 && typed < SENTENCE.length && <span className="caret" aria-hidden="true" />}
        </p>

        {step === 1 && (
          <div className="bubble ai typing">
            <span className="sr-only">mylz is searching</span>
            <i />
            <i />
            <i />
          </div>
        )}

        {step >= 2 && (
          <>
            <p className="bubble ai">Two good matches. Both are direct, with the stay a short walk from the centre.</p>
            <div className="showcase-options">
              {OPTIONS.map((o, i) => (
                <article key={o.id} className={step === 3 && i === 0 ? "is-booked" : ""}>
                  <small>{o.tag}</small>
                  <span>{o.flight}</span>
                  <span>{o.stay}</span>
                  <strong>
                    {format(o.total)} <em>total for two</em>
                  </strong>
                </article>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <div className="showcase-booked">
            <span>
              <CheckIcon />
            </span>
            <div>
              <strong>Booked.</strong> Confirmations from the airline and the hotel are in your inbox.
            </div>
          </div>
        )}
      </div>

      <div className="showcase-foot">
        <small>Example prices, for illustration.</small>
        <button type="button" className="btn-accent sm btn-fly" onClick={() => window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: SENTENCE }))}>
          Try this prompt
          <FlyIcon size={16} />
        </button>
      </div>
    </div>
  );
}
