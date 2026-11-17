import { NextResponse } from "next/server";
import { runSearch, type TripQuery } from "@/lib/demo";

// Demo search endpoint. Swap runSearch() for the real mylz backend call.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { prompt?: unknown; query?: unknown; today?: unknown; origin?: unknown; rate?: unknown }
    | null;
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim().slice(0, 500) : "";
  const today =
    typeof body?.today === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.today)
      ? body.today
      : new Date().toISOString().slice(0, 10);
  const query = body?.query && typeof body.query === "object" ? (body.query as TripQuery) : null;

  if (!prompt) {
    return NextResponse.json({ ok: false, reply: "Tell me where you want to go." }, { status: 400 });
  }

  // A real search takes 10-15 seconds; the demo waits a few so the progress steps are visible.
  await new Promise((resolve) => setTimeout(resolve, 3200));
  const origin = typeof body?.origin === "string" && /^[A-Z]{3}$/.test(body.origin) ? body.origin : "LON";
  const rate = typeof body?.rate === "number" && body.rate > 0 ? body.rate : 1;
  return NextResponse.json(runSearch(prompt, query, today, origin, rate));
}
