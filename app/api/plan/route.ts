import { NextResponse } from "next/server";
import { cityForPlace, type PlaceRef } from "@/lib/airports";
import { CABINS, runSearch, type TripQuery } from "@/lib/demo";

function isCalendarDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < "1900" || value >= "9999") return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().startsWith(value);
}

function isPlace(value: unknown): value is PlaceRef {
  if (!value || typeof value !== "object") return false;
  const place = value as Partial<PlaceRef>;
  return typeof place.code === "string" && cityForPlace(place.code)?.code === place.cityCode
    && typeof place.cityCode === "string" && typeof place.label === "string"
    && (place.kind === "city" || place.kind === "airport");
}

function isTripQuery(value: unknown): value is TripQuery {
  if (!value || typeof value !== "object") return false;
  const q = value as TripQuery;
  return (q.kind === "flight" || q.kind === "hotel" || q.kind === "trip")
    && (q.tripType === "one-way" || q.tripType === "return")
    && isPlace(q.to)
    && (q.from === undefined ? q.kind === "hotel" : isPlace(q.from))
    && isCalendarDate(q.date)
    && (q.returnDate === undefined
      ? q.tripType === "one-way" && q.kind !== "hotel"
      : isCalendarDate(q.returnDate) && q.returnDate > q.date)
    && Number.isInteger(q.adults) && q.adults >= 1 && q.adults <= 9
    && Number.isInteger(q.children) && q.children >= 0 && q.children <= 8
    && CABINS.includes(q.cabin);
}

// Demo search endpoint. Swap runSearch() for the real mylz backend call.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { prompt?: unknown; query?: unknown; today?: unknown; origin?: unknown; rate?: unknown }
    | null;
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim().slice(0, 500) : "";
  const today = isCalendarDate(body?.today) ? body.today : new Date().toISOString().slice(0, 10);
  const query = body?.query ?? null;

  if (!prompt) {
    return NextResponse.json({ ok: false, reply: "Tell me where you want to go." }, { status: 400 });
  }

  if (query !== null && !isTripQuery(query)) {
    return NextResponse.json({ ok: false, reply: "Check the trip details and dates, then try again." }, { status: 400 });
  }

  // The preview waits briefly so the search progress and message queue are visible.
  await new Promise((resolve) => setTimeout(resolve, 3200));
  const origin = typeof body?.origin === "string" && /^[A-Z]{3}$/.test(body.origin) ? body.origin : "LON";
  const rate = typeof body?.rate === "number" && body.rate > 0 ? body.rate : 1;
  return NextResponse.json(runSearch(prompt, query, today, origin, rate));
}
