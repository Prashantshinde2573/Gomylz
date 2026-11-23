/** Deterministic, clearly labelled example data; never a live fare or booking. */
export function previewOffer(text: string, fallbackTravellers = 1) {
  const cities = ["Lisbon", "Madrid", "Milan", "Paris", "Rome", "Barcelona", "Amsterdam", "Dublin", "Berlin", "Vienna", "Prague", "Athens", "Porto", "Faro", "Madeira"];
  // Prefer the named destination after “to” when both endpoints are present.
  const requested = /\bto\s+([a-z]+)/i.exec(text)?.[1];
  const destination = cities.find(city => city.toLowerCase() === requested?.toLowerCase())
    ?? cities.find(city => new RegExp(`\\b${city}\\b`, "i").test(text)) ?? "Lisbon";
  const count = /\b(\d+|one|two|three|four)\s+(?:adults?|seats?|passengers?|travellers?)\b/i.exec(text)?.[1]?.toLowerCase();
  const words: Record<string, number> = {one:1,two:2,three:3,four:4};
  const travellers = Math.max(1, Math.min(9, count ? words[count] ?? Number(count) : fallbackTravellers));
  const extras = [
    {test:/bag/i,label:"Checked bag",price:29},
    {test:/seat|legroom|window|aisle/i,label:"Seat selection",price:18},
    {test:/lounge/i,label:"Lounge access",price:35},
    {test:/fast.?track/i,label:"Fast-track",price:15},
    {test:/hotel/i,label:"Hotel · 1 night",price:120},
  ].filter(item => item.test.test(text)).map(({label,price}) => ({label,price}));
  if (!extras.length) extras.push({label:"Flexible fare",price:24});
  const currency = /gbp|£|pounds/i.test(text) ? "GBP" : "EUR";
  const fare = currency === "GBP" ? 129 : 149;
  return {destination,travellers,extras,currency,fare};
}
