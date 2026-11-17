"use client";

import { useState } from "react";
import { useCurrency } from "./CurrencyProvider";
import { BedIcon, FlyIcon, PlaneIcon, SparkleIcon } from "./Icons";
import { PREFILL_EVENT } from "./PromptForm";

const SENTENCE = "A long weekend in Lisbon for two, flying from London. Flights and a hotel, please.";
const STEPS = ["Ask", "Compare", "Refine"];
const OPTIONS = [
  { id: "early", tag: "Early departure", flight: "London Gatwick → Lisbon", time: "07:30 · Direct", price: 178 },
  { id: "late", tag: "Later departure", flight: "London Heathrow → Lisbon", time: "18:15 · Direct", price: 204 },
];

export function DemoShowcase() {
  const { format } = useCurrency();
  const [step, setStep] = useState(1);
  const flightOptions = step === 2 ? OPTIONS.slice(1) : OPTIONS;

  return (
    <div className="product-preview">
      <header className="product-preview-head"><span><SparkleIcon size={19} /> mylzAI</span><small>Interactive demo</small></header>
      <div className="preview-steps" role="group" aria-label="Walkthrough step">
        {STEPS.map((label, index) => (
          <button key={label} type="button" aria-pressed={step === index} onClick={() => setStep(index)}>{label}</button>
        ))}
      </div>
      <div className="product-preview-body" aria-live="polite">
        <p className="preview-prompt">“{step === 2 ? "Show me direct evening flights." : SENTENCE}”</p>
        {step === 0 ? (
          <div className="preview-context"><SparkleIcon size={20} /><div><strong>London to Lisbon</strong><p>Long weekend · 2 adults · Flights + stay</p></div></div>
        ) : (
          <div className="preview-options">
            {flightOptions.map((option) => (
              <article key={option.id}>
                <span className="preview-option-icon"><PlaneIcon size={20} /></span>
                <div><small>{option.tag}</small><h3>{option.flight}</h3><p>{option.time}</p></div>
                <strong>{format(option.price)}</strong>
              </article>
            ))}
            <article>
              <span className="preview-option-icon"><BedIcon size={20} /></span>
              <div><small>Stay</small><h3>Guesthouse in Alfama</h3><p>Lisbon · 3 nights</p></div>
              <strong>{format(260)}</strong>
            </article>
          </div>
        )}
      </div>
      <footer className="product-preview-foot">
        <small>Sample options and prices</small>
        <button className="btn-dark sm btn-fly" type="button" onClick={() => window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: SENTENCE }))}>
          Try this prompt <FlyIcon />
        </button>
      </footer>
    </div>
  );
}
