"use client";

import { useEffect, useRef, useState } from "react";
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
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const interacting = useRef(false);
  const manual = useRef(false);
  const flightOptions = step === 2 ? OPTIONS.slice(1) : OPTIONS;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .25 });
    if (root.current) observer.observe(root.current);
    return () => { observer.disconnect(); preference.removeEventListener("change", update); };
  }, []);

  useEffect(() => {
    if (!playing || !visible || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden && !interacting.current) {
        manual.current = false;
        setStep((current) => (current + 1) % STEPS.length);
      }
    }, 5500);
    return () => window.clearInterval(timer);
  }, [playing, visible, reducedMotion]);

  useEffect(() => {
    const panel = body.current;
    if (!panel) return;
    panel.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
    if (step === 0 || reducedMotion || !playing || !visible || manual.current) return;
    const timer = window.setTimeout(() => {
      if (!interacting.current) panel.scrollTo({ top: panel.scrollHeight, behavior: "smooth" });
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [step, reducedMotion, playing, visible]);

  return (
    <div className="product-preview" ref={root}
      onPointerEnter={() => { interacting.current = true; }}
      onPointerLeave={() => { interacting.current = false; }}
      onFocusCapture={() => { interacting.current = true; }}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) interacting.current = false; }}>
      <header className="product-preview-head"><span><SparkleIcon size={19} /> mylzAI</span><small>Interactive demo</small></header>
      <div className="preview-steps" role="group" aria-label="Walkthrough step">
        {STEPS.map((label, index) => (
          <button key={label} type="button" aria-pressed={step === index} onClick={() => { manual.current = true; setStep(index); }}>{label}</button>
        ))}
      </div>
      <div className="product-preview-body" ref={body} aria-live={playing && !reducedMotion ? "off" : "polite"} tabIndex={0} aria-label="Trip planning preview">
        <p className="preview-prompt" key={step}>“{step === 2 ? "Show me direct evening flights." : SENTENCE}”</p>
        {step === 0 ? (
          <div className="preview-context"><SparkleIcon size={20} /><div><strong>London to Lisbon</strong><p>Long weekend · 2 adults · Flights + stay</p></div></div>
        ) : (
          <div className="preview-options" key={step}>
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
        <div className="preview-playback"><small>Sample options and prices</small>
          {!reducedMotion && <button type="button" className="link-btn" aria-pressed={playing} onClick={() => setPlaying((current) => !current)}>{playing ? "Pause demo" : "Play demo"}</button>}
        </div>
        <button className="btn-dark sm btn-fly" type="button" onClick={() => window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: SENTENCE }))}>
          Try this prompt <FlyIcon />
        </button>
      </footer>
    </div>
  );
}
