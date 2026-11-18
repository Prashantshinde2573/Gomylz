"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useCurrency } from "./CurrencyProvider";
import { BedIcon, CheckIcon, FlyIcon, MicIcon, SparkleIcon } from "./Icons";

const PROMPT = "A long weekend in Lisbon for two, flying from London. Flights and a hotel, please.";
const STEPS = [
  { title: "Describe your trip" },
  { title: "Compare your options" },
  { title: "Pick the option that fits" },
];

export function BookingJourney() {
  const { format } = useCurrency();
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .3 });
    if (root.current) observer.observe(root.current);
    return () => { observer.disconnect(); media.removeEventListener("change", update); };
  }, []);

  useEffect(() => {
    if (!visible || reduced || focused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % STEPS.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [active, visible, reduced, focused]);

  function choose(index: number) {
    setActive(index);
  }

  return (
    <section ref={root} className="booking-journey" id="demo" aria-labelledby="walkthrough-title">
      <header className="journey-heading">
        <div><span className="eyebrow">Book with mylzAI</span><h2 id="walkthrough-title">From an idea to options you can compare.</h2></div>
        <p>Describe your trip, compare your options, and find your fit.</p>
      </header>
      <div className="journey-panels"
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
        {STEPS.map(({ title }, index) => (
          <div className="journey-panel" data-active={index === active} key={title}>
            <img className="journey-background" src={`/images/journey/scenes/step-${index + 1}.webp`} alt="" loading="lazy" />
            <button type="button" className="journey-tab" id={`${id}-tab-${index}`} aria-expanded={index === active} aria-controls={`${id}-panel-${index}`}
              onClick={() => choose(index)}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === "ArrowRight") next = (index + 1) % 3;
                else if (event.key === "ArrowLeft") next = (index + 2) % 3;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = 2;
                else return;
                event.preventDefault();
                choose(next);
                document.getElementById(`${id}-tab-${next}`)?.focus();
              }}>
              <span className="journey-number">00{index + 1}</span><span className="journey-tab-label">{title}</span>
            </button>
            <div className="journey-content" role="region" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} aria-hidden={index !== active} inert={index !== active}>
              <h3>{title}</h3>
              <div className="journey-visual">
                <div className="journey-ui">
                  <div className="journey-ui-head"><SparkleIcon size={17} /><strong>mylzAI</strong><small>{["Your next adventure", "Your trip options", "Your shortlist"][index]}</small></div>
                  {index === 0 ? <>
                    <p className="journey-message journey-message-user">{PROMPT}</p>
                    <p className="journey-message">Lisbon sounds lovely. Let’s find flights and a stay for your weekend.</p>
                    <div className="journey-input"><MicIcon size={16} /><span>Tell Mylz your next idea</span><FlyIcon /></div>
                  </> : <>
                    <div className="journey-result"><FlyIcon /><span><strong>London → Lisbon</strong><small>18:15 · Direct · Return flight</small></span><b>{format(204)}</b>{index === 2 && <CheckIcon />}</div>
                    {index === 1 && <div className="journey-result"><FlyIcon /><span><strong>London → Lisbon</strong><small>07:30 · Direct · Return flight</small></span><b>{format(178)}</b></div>}
                    <div className="journey-result"><BedIcon size={16} /><span><strong>Guesthouse in Alfama</strong><small>Lisbon · 3 nights</small></span><b>{format(260)}</b>{index === 2 && <CheckIcon />}</div>
                    {index === 2 && <Link className="journey-start" href={`/chat?q=${encodeURIComponent(PROMPT)}`}>Plan a trip like this <FlyIcon /></Link>}
                  </>}
                  <small className="journey-sample">Illustrative trip · Sample options and prices</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
