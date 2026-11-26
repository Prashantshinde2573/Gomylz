// DEMO DATA ONLY.
// Flights, stays, airlines and prices below are generated so the flow can be
// shown end to end. Replace runSearch() with calls to the real mylz backend.

import { CITIES, type City, type PlaceRef, cityForPlace, cityRef } from "./airports";
import { addDays, fmtClock, fmtShort, nightsBetween, parseDayMonth } from "./dates";

export type Cabin = "Economy" | "Premium Economy" | "Business" | "First";
export const CABINS: Cabin[] = ["Economy", "Premium Economy", "Business", "First"];

export type TripQuery = {
  kind: "flight" | "hotel" | "trip"; // "trip" = flights and stays from a free-text ask
  tripType: "one-way" | "return";
  from?: PlaceRef;
  to: PlaceRef;
  date: string;
  returnDate?: string;
  onward?: { to: PlaceRef; date: string };
  adults: number;
  children: number;
  cabin: Cabin;
};

export type Flight = {
  id: string;
  airline: string;
  flightNo: string;
  cabin: Cabin;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  depDate: string;
  depMin: number; // minutes after midnight, local
  depTime: string;
  arrDate: string;
  arrTime: string;
  durationMin: number;
  stops: number;
  carryOn: number;
  checked: number;
  changeFeeGBP: number | null; // null = changes not allowed
  refundable: boolean;
  co2Kg: number;
  priceGBP: number; // total for all travellers
  onward?: Flight;
};

export type Stay = {
  booking?: { roomName:string; rateName:string; rateId:string; refundable:boolean; cancelUntil?:string; cancellationFeeGBP:number; cityTaxGBP:number };
  id: string;
  name: string;
  area: string;
  type: string;
  perks: string;
  pricePerNightGBP: number;
  nights: number;
};

/** A destination suggestion with a starting price: the answer to an open ask. */
export type Idea = {
  code: string;
  city: string;
  country: string;
  line: string;
  fromGBP: number; // cheapest return fare for one adult
  out: string;
  back: string;
  prompt: string; // the sentence "Plan this" sends
};

export type SearchResult =
  | { ok: true; title: string; query: TripQuery; flights: Flight[]; stays: Stay[] }
  | { ok: false; reply: string; ideas?: Idea[] };

// Invented carriers, so sample fares are never attributed to a real airline.
const AIRLINES = [
  { name: "Northwind", code: "NW" },
  { name: "Solara Air", code: "SL" },
  { name: "Atlas Jet", code: "AJ" },
  { name: "Blue Meridian", code: "BM" },
  { name: "Kestrel", code: "KS" },
];

const CABIN_FACTOR: Record<Cabin, number> = { Economy: 1, "Premium Economy": 1.6, Business: 3.2, First: 5 };

/* ---------- helpers ---------- */

function seeded(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function distanceKm(a: City, b: City): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(s));
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

export function travellersText(q: Pick<TripQuery, "adults" | "children">): string {
  const parts = [plural(q.adults, "adult", "adults")];
  if (q.children > 0) parts.push(plural(q.children, "child", "children"));
  return parts.join(" and ");
}

/** The sentence the search form sends to the chat, e.g.
 *  "Need a one way flight from LON to LIS on 27 Nov for 1 adult in Economy" */
export function buildSentence(q: TripQuery): string {
  const who = travellersText(q);
  if (q.kind === "hotel") {
    const city = cityForPlace(q.to.code)?.city ?? q.to.code;
    return `Need a hotel in ${city} from ${fmtShort(q.date)} to ${fmtShort(q.returnDate ?? addDays(q.date, 1))} for ${who}`;
  }
  if (q.onward) {
    return `Multi-city flights from ${q.from?.code} to ${q.to.code} on ${fmtShort(q.date)}, then to ${q.onward.to.code} on ${fmtShort(q.onward.date)} for ${who} in ${q.cabin}`;
  }
  const trip = q.tripType === "return" ? "return" : "one way";
  const back = q.tripType === "return" && q.returnDate ? `, back on ${fmtShort(q.returnDate)}` : "";
  return `Need a ${trip} flight from ${q.from?.code} to ${q.to.code} on ${fmtShort(q.date)}${back} for ${who} in ${q.cabin}`;
}

/* ---------- free-text understanding (demo-grade) ---------- */

const WORD_NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

function refFromCode(code: string): PlaceRef | null {
  const city = cityForPlace(code);
  if (!city) return null;
  if (city.code === code) return cityRef(city);
  const a = city.airports.find((x) => x.code === code)!;
  return { code: a.code, label: `${a.name} - ${a.code}`, cityCode: city.code, kind: "airport" };
}

function findCity(text: string, after?: RegExp, skip?: string): City | undefined {
  const scope = after ? text.split(after).slice(1).join(" ") : text;
  // The city mentioned first wins, not the first one in the list.
  let best: City | undefined;
  let bestAt = Infinity;
  for (const c of CITIES) {
    if (c.code === skip) continue;
    const at = scope.indexOf(c.city.toLowerCase());
    if (at !== -1 && at < bestAt) {
      best = c;
      bestAt = at;
    }
  }
  return best;
}

export function parsePrompt(prompt: string, todayISO: string, originCode = "LON"): TripQuery | null {
  const lower = prompt.toLowerCase();

  // Destination and origin: IATA codes first ("from LON to LIS"), then city names.
  const codes = prompt.match(/\bfrom\s+([A-Z]{3})\s+to\s+([A-Z]{3})\b/);
  let from = codes ? refFromCode(codes[1]) : null;
  let to = codes ? refFromCode(codes[2]) : null;

  if (!from) {
    const c = findCity(lower, /\bfrom\b/);
    if (c) from = cityRef(c);
  }
  if (!to) {
    const c = findCity(lower, /\b(?:to|in)\b/, from?.cityCode) ?? findCity(lower, undefined, from?.cityCode);
    if (c) to = cityRef(c);
  }
  if (!to) return null;

  const wantsHotel = /\b(hotel|stay|room|hostel|apartment)\b/.test(lower);
  const wantsFlight = /\b(flight|flights|fly|flying)\b/.test(lower);
  const kind: TripQuery["kind"] = wantsHotel && !wantsFlight ? "hotel" : wantsFlight && !wantsHotel ? "flight" : "trip";

  // No origin in the sentence: use the visitor's home city (inferred from their currency).
  if (kind !== "hotel" && !from) from = cityRef(cityForPlace(originCode) ?? CITIES[0]);
  if (from && from.cityCode === to.cityCode) return null;

  // Travellers
  let adults = 1;
  const digits = lower.match(/(\d+)\s*(adults?|people|persons|travellers|travelers|of us|friends|pax)/);
  const word = lower.match(/\b(?:for|with)\s+(one|two|three|four|five|six)\b/);
  if (digits) adults = parseInt(digits[1], 10);
  else if (word) adults = WORD_NUM[word[1]];
  else if (/\b(couple|two of us|my partner|my wife|my husband)\b/.test(lower)) adults = 2;
  adults = Math.min(9, Math.max(1, adults));
  const kids = lower.match(/(\d+)\s*(child|children|kids?)/);
  const children = kids ? Math.min(8, parseInt(kids[1], 10)) : 0;

  // Dates
  const date = parseDayMonth(lower, todayISO) ?? addDays(todayISO, 14);
  const rest = lower.slice(lower.search(/\b(back on|to|until|-)\s+\d{1,2}/) + 1);
  const explicitBack = /\b(back on|until|to)\s+\d{1,2}(?:st|nd|rd|th)?\s+[a-z]{3}/.test(lower) ? parseDayMonth(rest, date) : null;
  let nights = 0;
  const n = lower.match(/(\d+)\s*(nights?|days?)/);
  if (n) nights = parseInt(n[1], 10);
  else if (/long weekend/.test(lower)) nights = 3;
  else if (/weekend/.test(lower)) nights = 2;
  else if (/two weeks|fortnight/.test(lower)) nights = 14;
  else if (/\bweek\b/.test(lower)) nights = 7;
  const isReturn = /\breturn\b|\bround ?trip\b|\bback on\b/.test(lower) || (kind !== "flight" && nights > 0) || kind === "trip";
  const returnDate =
    explicitBack && explicitBack > date ? explicitBack : isReturn || kind === "hotel" ? addDays(date, nights || (kind === "hotel" ? 1 : 4)) : undefined;

  const cabin = CABINS.slice().reverse().find((c) => lower.includes(c.toLowerCase())) ?? "Economy";

  return {
    kind,
    tripType: returnDate && kind !== "hotel" ? "return" : "one-way",
    from: from ?? undefined,
    to,
    date,
    returnDate,
    adults,
    children,
    cabin,
  };
}

/* ---------- generators ---------- */

function makeFlights(q: TripQuery): Flight[] {
  if (!q.from) return [];
  const origin = cityForPlace(q.from.code)!;
  const dest = cityForPlace(q.to.code)!;
  const rand = seeded(`${q.from.code}-${q.to.code}-${q.date}-${q.cabin}`);
  const dist = distanceKm(origin, dest);
  const pick = <T,>(xs: T[]) => xs[Math.floor(rand() * xs.length)];
  const depAirports = q.from.kind === "airport" ? [q.from.code] : origin.airports.map((a) => a.code);
  const arrAirports = q.to.kind === "airport" ? [q.to.code] : dest.airports.map((a) => a.code);
  const count = 18 + Math.floor(rand() * 30);
  const flights: Flight[] = [];

  for (let i = 0; i < count; i += 1) {
    const airline = pick(AIRLINES);
    const direct = rand() < (dist < 4500 ? 0.8 : 0.3);
    const stops = direct ? 0 : 1;
    const durationMin = Math.round((dist / 820) * 60 + 35 + (direct ? 0 : 95 + rand() * 150) + rand() * 20);
    const depMin = Math.round((330 + rand() * 1020) / 5) * 5;
    const arrTotal = depMin + durationMin + Math.round((dest.tz - origin.tz) * 60);
    const carryOn = rand() < 0.5 ? 1 : 0;
    const checked = rand() < 0.25 ? 1 : 0;
    const perAdult =
      (28 + dist * 0.035) * (0.85 + rand() * 1.6) * CABIN_FACTOR[q.cabin] * (direct ? 1 : 0.88) +
      carryOn * 14 + checked * 32;
    const total = perAdult * (q.adults + q.children * 0.8) * (q.tripType === "return" ? 1.85 : 1);

    flights.push({
      id: `f${i}`,
      airline: airline.name,
      flightNo: `${airline.code} ${1000 + Math.floor(rand() * 8000)}`,
      cabin: q.cabin,
      fromCode: pick(depAirports),
      fromCity: origin.city,
      toCode: pick(arrAirports),
      toCity: dest.city,
      depDate: q.date,
      depMin,
      depTime: fmtClock(depMin),
      arrDate: addDays(q.date, Math.floor(arrTotal / 1440)),
      arrTime: fmtClock(arrTotal),
      durationMin,
      stops,
      carryOn,
      checked,
      changeFeeGBP: rand() < 0.75 ? 49 : null,
      refundable: rand() < 0.15,
      co2Kg: Math.round(dist * 0.049 * (direct ? 1 : 1.15)),
      priceGBP: Math.round(total),
    });
  }
  if (!q.onward) return flights.sort((a, b) => a.priceGBP - b.priceGBP);

  const onwardFlights = makeFlights({
    ...q, from: q.to, to: q.onward.to, date: q.onward.date, returnDate: undefined, onward: undefined,
  });
  return flights.flatMap((first) => {
    const onward = onwardFlights.find((flight) => flight.fromCode === first.toCode
      && (flight.depDate > first.arrDate || (flight.depDate === first.arrDate && flight.depTime > first.arrTime)));
    if (!onward) return [];
    return [{
      ...first,
      priceGBP: first.priceGBP + onward.priceGBP,
      carryOn: Math.min(first.carryOn, onward.carryOn),
      checked: Math.min(first.checked, onward.checked),
      changeFeeGBP: first.changeFeeGBP === null || onward.changeFeeGBP === null ? null : first.changeFeeGBP + onward.changeFeeGBP,
      refundable: first.refundable && onward.refundable,
      co2Kg: first.co2Kg + onward.co2Kg,
      onward,
    }];
  }).sort((a, b) => a.priceGBP - b.priceGBP);
}

export function makeStays(q: TripQuery): Stay[] {
  if(q.kind !== "hotel" || !q.date || !q.returnDate || !Number.isFinite(Date.parse(q.date)) || !Number.isFinite(Date.parse(q.returnDate)) || q.returnDate<=q.date) return [];
  const dest = cityForPlace(q.to.code)!;
  const nights = Math.max(1, q.returnDate ? nightsBetween(q.date, q.returnDate) : 1);
  const rand = seeded(`stay-${dest.code}-${q.date}`);
  const templates: Array<[string, string, string, number]> = [
    ["{a} Guesthouse", "Guesthouse", "Private room · breakfast", 0.7],
    ["The {a} House", "Boutique hotel", "Double room · free cancellation", 1.05],
    ["{a} Apartments", "Apartment", "Entire place · kitchen", 1.3],
    ["Hotel {a} Central", "Hotel", "Double room · breakfast", 0.95],
    ["{a} Rooftop Hotel", "Hotel", "Double room · pool", 1.6],
    ["{a} Hostel & Rooms", "Hostel", "Private room · shared lounge", 0.5],
  ];
  const rooms = Math.max(1, Math.ceil((q.adults + q.children) / 2));
  return templates
    .map(([name, type, perks, factor], i) => {
      const area = dest.areas[i % 3];
      return {
        id: `s${i}`,
        name: name.replace("{a}", area),
        area,
        type,
        perks,
        pricePerNightGBP: Math.round(dest.stayBase * factor * (0.9 + rand() * 0.3) * rooms),
        nights,
      };
    })
    .sort((a, b) => a.pricePerNightGBP - b.pricePerNightGBP);
}

/* ---------- ideas: open asks ("a beach holiday") and the homepage trending cards ---------- */

const LINES: Record<string, string> = {
  LIS: "Tiled hills and late dinners", ROM: "Two thousand years on foot", PAR: "Bakeries, bridges, museums",
  BCN: "Beach and city in one", MAD: "Late nights, long lunches", AMS: "Canals by bike", BER: "Galleries and night life",
  IST: "Two continents, one ferry", DXB: "Desert sun, year round", NYC: "Five boroughs, one long weekend",
  TYO: "Neon nights, quiet shrines", SIN: "Gardens and hawker food", BKK: "Street food and temples",
  DPS: "Rice terraces and surf", BOM: "The city that never slows", DEL: "Old city, big flavours",
  PNQ: "Hills and good coffee", GOI: "Beach shacks at sunset", GVA: "Lake views, slopes an hour away",
  ZRH: "Alps on the doorstep", LON: "Markets, parks and pubs", MAN: "Music and football",
};

const THEMES: Array<{ test: RegExp; label: string; codes: string[]; nights: number }> = [
  { test: /\bski|snow|slopes?\b/, label: "ski trips", codes: ["GVA", "ZRH"], nights: 4 },
  { test: /\bbeach|warm|sun|island|sea\b/, label: "beach escapes", codes: ["DPS", "GOI", "DXB", "BCN", "LIS"], nights: 7 },
  { test: /\bfamily|kids?|children\b/, label: "family trips", codes: ["BCN", "DXB", "PAR", "LIS", "SIN"], nights: 5 },
  { test: /\bromantic|couple|honeymoon|anniversary\b/, label: "romantic getaways", codes: ["PAR", "ROM", "LIS", "IST", "DPS"], nights: 3 },
  { test: /\bweekend|city break|short\b/, label: "weekend city breaks", codes: ["LIS", "ROM", "PAR", "BCN", "AMS"], nights: 2 },
];

/** The next Friday at least two weeks out: a sensible default departure. */
function nextFriday(todayISO: string): string {
  let d = addDays(todayISO, 14);
  while (new Date(`${d}T12:00:00`).getDay() !== 5) d = addDays(d, 1);
  return d;
}

function makeIdea(origin: City, dest: City, out: string, nights: number): Idea {
  const back = addDays(out, nights);
  const q: TripQuery = { kind: "flight", tripType: "return", from: cityRef(origin), to: cityRef(dest), date: out, returnDate: back, adults: 1, children: 0, cabin: "Economy" };
  return {
    code: dest.code,
    city: dest.city,
    country: dest.country,
    line: LINES[dest.code] ?? dest.country,
    fromGBP: makeFlights(q)[0].priceGBP,
    out,
    back,
    prompt: `Return flights from ${origin.city} to ${dest.city} on ${fmtShort(out)}, back on ${fmtShort(back)}`,
  };
}

/** Six priced trips from the visitor's home city, for the homepage. */
export function trendingTrips(originCode: string, todayISO: string): Idea[] {
  const origin = cityForPlace(originCode) ?? CITIES[0];
  const out = nextFriday(todayISO);
  return ["LIS", "ROM", "DXB", "IST", "DPS", "NYC", "TYO", "BCN"]
    .filter((c) => c !== origin.code)
    .slice(0, 6)
    .map((c, i) => makeIdea(origin, cityForPlace(c)!, out, [3, 3, 5, 4, 7, 5][i]));
}

function ideasFor(prompt: string, originCode: string, todayISO: string, rate: number): { reply: string; ideas: Idea[] } {
  const lower = prompt.toLowerCase();
  const origin = cityForPlace(originCode) ?? CITIES[0];
  const theme = THEMES.find((t) => t.test.test(lower));
  const out = nextFriday(todayISO);
  const codes = theme?.codes ?? ["LIS", "ROM", "DXB", "IST", "BCN"];
  let ideas = codes.filter((c) => c !== origin.code).map((c) => makeIdea(origin, cityForPlace(c)!, out, theme?.nights ?? 3));

  const budget = lower.match(/(?:under|below|less than|max(?:imum)?)\s*[^\d]{0,3}(\d[\d,]*)/);
  if (budget) {
    const limit = parseInt(budget[1].replace(/,/g, ""), 10) / rate;
    const all = CITIES.filter((c) => c.code !== origin.code).map((c) => makeIdea(origin, c, out, 3));
    const within = all.filter((i) => i.fromGBP <= limit).sort((a, b) => a.fromGBP - b.fromGBP).slice(0, 5);
    ideas = within.length > 0 ? within : all.sort((a, b) => a.fromGBP - b.fromGBP).slice(0, 3);
    return {
      reply: within.length > 0 ? `Return flights from ${origin.city} within that budget:` : `Nothing from ${origin.city} fits that budget in this demo. The cheapest returns are:`,
      ideas,
    };
  }
  ideas.sort((a, b) => a.fromGBP - b.fromGBP);
  return { reply: `Here are ${theme?.label ?? "some ideas"} from ${origin.city}, with return fares for ${fmtShort(out)}. Tap one to plan it.`, ideas };
}

export function runSearch(prompt: string, query: TripQuery | null, todayISO: string, originCode = "LON", rate = 1): SearchResult {
  const q = query ?? parsePrompt(prompt, todayISO, originCode);
  // No destination named: answer with priced ideas instead of a question.
  if (!q) return { ok: false, ...ideasFor(prompt, originCode, todayISO, rate) };
  const dest = cityForPlace(q.onward?.to.code ?? q.to.code)!;
  return {
    ok: true,
    title: `Trip to ${dest.city}`,
    query: q,
    flights: q.kind === "hotel" ? [] : makeFlights(q),
    stays: q.kind === "flight" ? [] : makeStays(q),
  };
}

/* ---------- follow-up filters ("Evening departures", "under £125" ...) ---------- */

export type FollowUp = { handled: boolean; reply: string; flights: Flight[] };

/** `rate` converts the visitor's displayed currency back to GBP for "under 125". */
export function applyFollowUp(text: string, all: Flight[], current: Flight[], rate: number): FollowUp {
  const t = text.toLowerCase();
  if (/\b(all flights|show all|reset|clear)\b/.test(t)) {
    return { handled: true, reply: `Showing all ${all.length} flights again.`, flights: all };
  }

  let list = current;
  const notes: string[] = [];
  const under = t.match(/(?:under|below|less than|max(?:imum)?)\s*[^\d]{0,3}(\d[\d,]*)/);
  if (under) {
    const limit = parseInt(under[1].replace(/,/g, ""), 10) / rate;
    list = list.filter((f) => f.priceGBP <= limit);
    notes.push("within your budget");
  }
  if (/\bevening\b|\bnight\b/.test(t)) { list = list.filter((f) => f.depMin >= 17 * 60); notes.push("evening departures"); }
  if (/\bmorning\b/.test(t)) { list = list.filter((f) => f.depMin < 12 * 60); notes.push("morning departures"); }
  if (/\bafternoon\b/.test(t)) { list = list.filter((f) => f.depMin >= 12 * 60 && f.depMin < 17 * 60); notes.push("afternoon departures"); }
  if (/\bdirect\b|\bnon-?stop\b/.test(t)) { list = list.filter((f) => f.stops === 0); notes.push("direct only"); }
  if (/\b(checked )?bags?\b|\bluggage\b/.test(t)) { list = list.filter((f) => f.checked > 0); notes.push("checked bag included"); }
  if (/\brefund/.test(t)) { list = list.filter((f) => f.refundable); notes.push("refundable"); }
  const airline = AIRLINES.find((a) => t.includes(a.name.toLowerCase()));
  if (airline) { list = list.filter((f) => f.airline === airline.name); notes.push(`${airline.name} only`); }
  if (/\bcheap/.test(t)) { list = [...list].sort((a, b) => a.priceGBP - b.priceGBP); notes.push("cheapest first"); }
  if (/\bfast|\bquick|\bshort/.test(t)) { list = [...list].sort((a, b) => a.durationMin - b.durationMin); notes.push("fastest first"); }

  if (notes.length === 0) {
    return {
      handled: false,
      reply: "In this demo I can filter by time of day, direct, price (“under 125”), bags, refundable, airline, or sort by cheapest or fastest.",
      flights: current,
    };
  }
  if (list.length === 0) {
    return { handled: true, reply: `No flights match ${notes.join(", ")}. I kept the previous list. Say “show all” to start over.`, flights: current };
  }
  return { handled: true, reply: `${list.length} ${list.length === 1 ? "flight" : "flights"}: ${notes.join(", ")}.`, flights: list };
}
