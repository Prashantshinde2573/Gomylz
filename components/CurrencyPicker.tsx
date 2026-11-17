"use client";

import { useEffect, useRef } from "react";
import { CURRENCIES, type CurrencyCode, useCurrency } from "./CurrencyProvider";
import { ChevronDownIcon, GlobeIcon } from "./Icons";

const codes = Object.keys(CURRENCIES) as CurrencyCode[];

export function CurrencyPicker() {
  const { currency, setCurrency } = useCurrency();
  const picker = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !picker.current?.contains(event.target)) {
        picker.current?.removeAttribute("open");
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  function closeAndFocus() {
    picker.current?.removeAttribute("open");
    trigger.current?.focus();
  }

  return (
    <details
      ref={picker}
      className="currency-picker"
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          event.currentTarget.open = false;
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && event.currentTarget.open) {
          event.preventDefault();
          closeAndFocus();
        }
      }}
    >
      <summary ref={trigger} className="currency" aria-label={`Currency: ${CURRENCIES[currency].name} (${currency})`}>
        <GlobeIcon /> {currency} <ChevronDownIcon />
      </summary>
      <ul className="currency-options" aria-label="Available currencies">
        {codes.map((code) => {
          const { name, flag } = CURRENCIES[code];
          return (
            <li key={code}>
              <button type="button" aria-pressed={code === currency} onClick={() => {
                setCurrency(code);
                closeAndFocus();
              }}>
                <img src={`/images/flags/${flag}.svg`} width={24} height={16} alt="" />
                <span>{name}</span>
                <strong>{code}</strong>
              </button>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
