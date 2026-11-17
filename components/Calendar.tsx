"use client";

import { useState } from "react";
import { MONTH_NAMES, fromISO, toISO } from "@/lib/dates";

export type DateRange = { start: string | null; end: string | null };

type Props = {
  mode: "single" | "range";
  value: DateRange;
  onChange: (value: DateRange) => void;
  minISO: string;
};

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function Calendar({ mode, value, onChange, minISO }: Props) {
  const initial = fromISO(value.start ?? minISO);
  const [view, setView] = useState({ year: initial.getFullYear(), month: initial.getMonth() });
  const min = fromISO(minISO);

  const first = new Date(view.year, view.month, 1);
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: Array<string | null> = [
    ...Array.from({ length: first.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => toISO(new Date(view.year, view.month, i + 1))),
  ];

  const canGoBack = view.year > min.getFullYear() || view.month > min.getMonth();

  function shift(delta: number) {
    const d = new Date(view.year, view.month + delta, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  }

  function pick(iso: string) {
    if (mode === "single") {
      onChange({ start: iso, end: null });
      return;
    }
    if (!value.start || value.end || iso <= value.start) onChange({ start: iso, end: null });
    else onChange({ start: value.start, end: iso });
  }

  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" className="cal-nav" aria-label="Previous month" disabled={!canGoBack} onClick={() => shift(-1)}>
          ‹
        </button>
        <strong aria-live="polite">
          {MONTH_NAMES[view.month]} {view.year}
        </strong>
        <button type="button" className="cal-nav" aria-label="Next month" onClick={() => shift(1)}>
          ›
        </button>
      </div>
      <div className="cal-grid" role="grid">
        {WEEKDAYS.map((d) => (
          <span key={d} className="cal-dow">
            {d}
          </span>
        ))}
        {cells.map((iso, i) => {
          if (!iso) return <span key={`blank-${i}`} />;
          const selected = iso === value.start || iso === value.end;
          const inRange = !!value.start && !!value.end && iso > value.start && iso < value.end;
          return (
            <button
              key={iso}
              type="button"
              className={`cal-day${selected ? " is-selected" : ""}${inRange ? " is-between" : ""}${iso === minISO ? " is-today" : ""}`}
              disabled={iso < minISO}
              aria-pressed={selected}
              onClick={() => pick(iso)}
            >
              {fromISO(iso).getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
