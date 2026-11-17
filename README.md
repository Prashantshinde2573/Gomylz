# mylz web (Next.js)

Homepage and booking-flow demo for mylz, built from the October 2026 conversion audit.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Homepage (`app/page.tsx`), in the audit's proposed order

1. **Hero**: video background, explanatory subline, prompt box, trip-type tiles (each sends a ready-made ask).
2. **Trust bar**: Trustpilot rating, IATA, a real person in 2 hours, paid to the supplier, backer logos.
3. **See it in action** (`components/DemoShowcase.tsx`): sentence, priced options, booked. "Try this prompt" fills the hero box.
4. **How it works**: three steps.
5. **Trending trips** (`components/Trending.tsx`): priced return trips from the visitor's home city; a click opens a chat with the sentence written.
6. **Reviews**: three slots.
7. **What you pay**: supplier price + mylz fee = total.
8. **Gets to know you** + comparison with a typical booking site.
9. **FAQ** (`lib/faq.ts`), with FAQ schema.
10. **Final CTA** + invite a friend (`components/Referral.tsx`).

## Funnel fixes from the audit

- Log in is asked only at "Save trip" or "Book". The dialog closes with the X, Esc or an outside click, and has "Continue as guest".
- "Don't loose your trip" is now "Don't lose your trip".
- An ask with no destination ("a beach holiday") gets priced ideas with a "Plan this" button. The origin city is inferred from the selected currency.
- Manual search defaults to Return; tabs are labelled Flights / Stays.
- `lang="en-GB"`, a full meta description, a 1200x630 share image (`public/og.jpg`), Organization and FAQ schema.

## FILL THESE IN before launch (shown on the page with a red dashed outline)

| Where | What is needed |
| --- | --- |
| Trust bar | Trustpilot rating and review count |
| Reviews | Three real Trustpilot reviews with first name and trip |
| What you pay, FAQ | The mylz fee (flat or %) |
| FAQ | Privacy summary; supported countries and currencies |
| Invite a friend | The referral reward |

The site makes no cookie or tracking claim: the audit found the live claim does not match what loads. Add one only once it is true.

## Demo data: replace before going live

- `lib/demo.ts`: flights, stays, ideas and all prices are generated, with invented airlines. Call the real backend from `app/api/plan/route.ts`.
- `components/DemoShowcase.tsx`: example prices. Use a real recent booking.
- `lib/airports.ts`: 22 cities. `components/CurrencyProvider.tsx`: fixed sample exchange rates.
- Log in buttons only close the dialog. Nothing is booked or charged.

## Assets

- `public/videos/hero.mp4` and `hero-poster.jpg`: the hero clip.
- The Mylz wordmark lives in `public/images/`. Official backer logos load from `https://gomylz.com/images/` (`lib/assets.ts`).
- Destination photos are optional: `DESTINATION_PHOTOS` in `lib/assets.ts`.
