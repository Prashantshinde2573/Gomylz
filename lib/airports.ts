// Airports and cities offered by the search pickers.
// A short static list for the demo; swap for your real places API.

export type Airport = { code: string; name: string };

export type City = {
  code: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  tz: number; // hours from UTC, used for local arrival times
  airports: Airport[];
  areas: [string, string, string];
  stayBase: number; // typical nightly price in GBP for demo stays
};

export type PlaceRef = {
  code: string; // city code (LON) or airport code (LHR)
  label: string; // "London - LON"
  cityCode: string;
  kind: "city" | "airport";
};

export const CITIES: City[] = [
  { code: "LON", city: "London", country: "United Kingdom", lat: 51.5, lon: -0.12, tz: 0, stayBase: 160, areas: ["Soho", "Shoreditch", "South Bank"], airports: [
    { code: "LGW", name: "Gatwick Airport" }, { code: "LHR", name: "Heathrow Airport" }, { code: "LCY", name: "London City Airport" }, { code: "LTN", name: "London Luton Airport" }, { code: "STN", name: "London Stansted Airport" } ] },
  { code: "MAN", city: "Manchester", country: "United Kingdom", lat: 53.48, lon: -2.24, tz: 0, stayBase: 95, areas: ["Northern Quarter", "Deansgate", "Ancoats"], airports: [{ code: "MAN", name: "Manchester Airport" }] },
  { code: "LIS", city: "Lisbon", country: "Portugal", lat: 38.72, lon: -9.14, tz: 0, stayBase: 95, areas: ["Alfama", "Baixa", "Chiado"], airports: [{ code: "LIS", name: "Lisbon Portela Airport" }] },
  { code: "ROM", city: "Rome", country: "Italy", lat: 41.9, lon: 12.5, tz: 1, stayBase: 110, areas: ["Trastevere", "Monti", "Centro Storico"], airports: [{ code: "FCO", name: "Fiumicino Airport" }, { code: "CIA", name: "Ciampino Airport" }] },
  { code: "PAR", city: "Paris", country: "France", lat: 48.86, lon: 2.35, tz: 1, stayBase: 140, areas: ["Le Marais", "Montmartre", "Saint-Germain"], airports: [{ code: "CDG", name: "Charles de Gaulle Airport" }, { code: "ORY", name: "Orly Airport" }] },
  { code: "BCN", city: "Barcelona", country: "Spain", lat: 41.39, lon: 2.17, tz: 1, stayBase: 115, areas: ["El Born", "Eixample", "Gràcia"], airports: [{ code: "BCN", name: "Barcelona El Prat Airport" }] },
  { code: "MAD", city: "Madrid", country: "Spain", lat: 40.42, lon: -3.7, tz: 1, stayBase: 100, areas: ["Malasaña", "La Latina", "Salamanca"], airports: [{ code: "MAD", name: "Madrid Barajas Airport" }] },
  { code: "AMS", city: "Amsterdam", country: "Netherlands", lat: 52.37, lon: 4.9, tz: 1, stayBase: 150, areas: ["Jordaan", "De Pijp", "Centrum"], airports: [{ code: "AMS", name: "Amsterdam Schiphol Airport" }] },
  { code: "BER", city: "Berlin", country: "Germany", lat: 52.52, lon: 13.4, tz: 1, stayBase: 100, areas: ["Mitte", "Kreuzberg", "Prenzlauer Berg"], airports: [{ code: "BER", name: "Berlin Brandenburg Airport" }] },
  { code: "GVA", city: "Geneva", country: "Switzerland", lat: 46.2, lon: 6.14, tz: 1, stayBase: 170, areas: ["Old Town", "Pâquis", "Carouge"], airports: [{ code: "GVA", name: "Geneva Airport" }] },
  { code: "ZRH", city: "Zurich", country: "Switzerland", lat: 47.37, lon: 8.54, tz: 1, stayBase: 180, areas: ["Altstadt", "Zürich West", "Seefeld"], airports: [{ code: "ZRH", name: "Zurich Airport" }] },
  { code: "IST", city: "Istanbul", country: "Türkiye", lat: 41.01, lon: 28.98, tz: 3, stayBase: 80, areas: ["Sultanahmet", "Karaköy", "Kadıköy"], airports: [{ code: "IST", name: "Istanbul Airport" }, { code: "SAW", name: "Sabiha Gökçen Airport" }] },
  { code: "DXB", city: "Dubai", country: "United Arab Emirates", lat: 25.2, lon: 55.27, tz: 4, stayBase: 130, areas: ["Downtown", "Marina", "Deira"], airports: [{ code: "DXB", name: "Dubai International Airport" }] },
  { code: "NYC", city: "New York", country: "United States", lat: 40.71, lon: -74.0, tz: -5, stayBase: 210, areas: ["Midtown", "Brooklyn", "Lower East Side"], airports: [{ code: "JFK", name: "John F. Kennedy International Airport" }, { code: "EWR", name: "Newark Liberty International Airport" }, { code: "LGA", name: "LaGuardia Airport" }] },
  { code: "TYO", city: "Tokyo", country: "Japan", lat: 35.68, lon: 139.69, tz: 9, stayBase: 120, areas: ["Shibuya", "Asakusa", "Shinjuku"], airports: [{ code: "HND", name: "Haneda Airport" }, { code: "NRT", name: "Narita International Airport" }] },
  { code: "SIN", city: "Singapore", country: "Singapore", lat: 1.35, lon: 103.82, tz: 8, stayBase: 150, areas: ["Marina Bay", "Chinatown", "Kampong Glam"], airports: [{ code: "SIN", name: "Singapore Changi Airport" }] },
  { code: "BKK", city: "Bangkok", country: "Thailand", lat: 13.76, lon: 100.5, tz: 7, stayBase: 60, areas: ["Sukhumvit", "Silom", "Old Town"], airports: [{ code: "BKK", name: "Suvarnabhumi Airport" }, { code: "DMK", name: "Don Mueang Airport" }] },
  { code: "DPS", city: "Bali", country: "Indonesia", lat: -8.65, lon: 115.22, tz: 8, stayBase: 60, areas: ["Ubud", "Seminyak", "Canggu"], airports: [{ code: "DPS", name: "Ngurah Rai International Airport" }] },
  { code: "BOM", city: "Mumbai", country: "India", lat: 19.08, lon: 72.88, tz: 5.5, stayBase: 70, areas: ["Colaba", "Bandra", "Lower Parel"], airports: [{ code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport" }] },
  { code: "DEL", city: "Delhi", country: "India", lat: 28.61, lon: 77.21, tz: 5.5, stayBase: 65, areas: ["Connaught Place", "Hauz Khas", "Aerocity"], airports: [{ code: "DEL", name: "Indira Gandhi International Airport" }] },
  { code: "PNQ", city: "Pune", country: "India", lat: 18.52, lon: 73.86, tz: 5.5, stayBase: 45, areas: ["Koregaon Park", "Shivajinagar", "Baner"], airports: [{ code: "PNQ", name: "Pune Airport" }] },
  { code: "GOI", city: "Goa", country: "India", lat: 15.38, lon: 73.83, tz: 5.5, stayBase: 55, areas: ["Anjuna", "Panjim", "Palolem"], airports: [{ code: "GOI", name: "Dabolim Airport" }, { code: "GOX", name: "Manohar International Airport" }] },
];

export function cityByCode(code: string): City | undefined {
  return CITIES.find((c) => c.code === code);
}

/** City that owns a city code or an airport code. */
export function cityForPlace(code: string): City | undefined {
  return CITIES.find((c) => c.code === code || c.airports.some((a) => a.code === code));
}

export function cityRef(c: City): PlaceRef {
  return { code: c.code, label: `${c.city} - ${c.code}`, cityCode: c.code, kind: "city" };
}

/** City first, then its airports: the same grouping the pickers show. */
export function searchPlaces(query: string, citiesOnly = false): PlaceRef[] {
  const q = query.trim().toLowerCase();
  const out: PlaceRef[] = [];
  for (const c of CITIES) {
    const cityHit = !q || c.city.toLowerCase().includes(q) || c.code.toLowerCase() === q || c.country.toLowerCase().startsWith(q);
    const airportHits = c.airports.filter((a) => a.name.toLowerCase().includes(q) || a.code.toLowerCase() === q);
    if (!cityHit && airportHits.length === 0) continue;
    out.push(cityRef(c));
    if (citiesOnly || !q) continue;
    const list = cityHit ? c.airports : airportHits;
    // A single airport that shares the city code adds nothing to the list.
    if (list.length === 1 && list[0].code === c.code) continue;
    for (const a of list) out.push({ code: a.code, label: `${a.name} - ${a.code}`, cityCode: c.code, kind: "airport" });
  }
  return out.slice(0, 14);
}
