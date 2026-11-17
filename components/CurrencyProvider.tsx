"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Demo exchange rates against GBP. Replace with live rates from your backend.
export const CURRENCIES = {
  GBP: { rate: 1, locale: "en-GB", home: "LON", name: "British Pound Sterling", flag: "gb" },
  EUR: { rate: 1.17, locale: "en-IE", home: "PAR", name: "Euro", flag: "eu" },
  USD: { rate: 1.27, locale: "en-US", home: "NYC", name: "United States Dollar", flag: "us" },
  INR: { rate: 107, locale: "en-IN", home: "BOM", name: "Indian Rupee", flag: "in" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  format: (amountGBP: number) => string;
  /** Units of the selected currency per 1 GBP. */
  rate: number;
  /** Home city inferred from the currency, used when a sentence names no origin. */
  home: string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const STORAGE_KEY = "mylz-currency";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("GBP");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && saved in CURRENCIES) setCurrencyState(saved as CurrencyCode);
    } catch {
      /* storage unavailable: keep the default */
    }
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const { rate, locale, home } = CURRENCIES[currency];
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    return { currency, setCurrency, rate, home, format: (amountGBP) => formatter.format(amountGBP * rate) };
  }, [currency, setCurrency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
