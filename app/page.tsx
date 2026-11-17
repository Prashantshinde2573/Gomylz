import { DemoShowcase } from "@/components/DemoShowcase";
import { HeroMedia } from "@/components/HeroMedia";
import { HowItWorks } from "@/components/HowItWorks";
import { StarIcon } from "@/components/Icons";
import { PromptForm } from "@/components/PromptForm";
import { Referral } from "@/components/Referral";
import { RouteMap } from "@/components/RouteMap";
import { SearchPanel } from "@/components/SearchPanel";
import { Trending } from "@/components/Trending";
import { BACKERS } from "@/lib/assets";
import { toISO } from "@/lib/dates";
import { trendingTrips } from "@/lib/demo";
import { FAQS, isPlaceholder } from "@/lib/faq";

// Trending fares are recalculated hourly.
export const revalidate = 3600;

const COMPARE: Array<[string, string, string]> = [
  ["Searching", "One sentence, typed or spoken", "Filters, forms and tabs"],
  ["Your preferences", "Remembered for next time", "Entered again each trip"],
  ["When something goes wrong", "A real person within 2 hours", "Varies by site"],
  ["Fees", "Shown upfront, before you pay", "Can appear at checkout"],
  ["Your booking", "Made in the supplier's own inventory", "Varies by site"],
];

export default function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.filter((f) => !isPlaceholder(f.a)).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main>
      {/* 1. Hero */}
      <section className="hero">
        <HeroMedia />
        <div className="hero-inner">
        <div className="hero-grid">
          <div className="hero-head">
            <span className="hero-pill">Talk. Book. Go.</span>
            <h1>
              <span>Book Flights &amp; Stays</span> <span>
                Just by <em>Talking</em>
              </span>
            </h1>
            <p className="hero-sub">
              Tell mylz your trip in one sentence. It finds and books your flights and stay — with a real person if
              anything goes wrong.
            </p>
          </div>
          <div className="hero-proof">
          <ul className="hero-tags" aria-label="mylz in numbers">
            <li>
              <svg viewBox="0 0 18 56" aria-hidden="true">
                <path d="M18 0.5 L1 28 L18 55.5" />
              </svg>
              <span>380+ Major Airlines</span>
            </li>
            <li>
              <svg viewBox="0 0 18 56" aria-hidden="true">
                <path d="M18 0.5 L1 28 L18 55.5" />
              </svg>
              <span>1M+ Stays Worldwide</span>
            </li>
            <li>
              <svg viewBox="0 0 18 56" aria-hidden="true">
                <path d="M18 0.5 L1 28 L18 55.5" />
              </svg>
              <span>IATA Accredited Agent</span>
            </li>
          </ul>
          </div>
        </div>
        <SearchPanel />
        </div>
      </section>

      {/* 2. Trusted by: rating and accreditation logos */}
      <section className="trust" aria-labelledby="trust-title">
        <div className="trust-rating">
          <h2 id="trust-title" className="trust-title">
            Trusted &amp; accredited
          </h2>
          {/* DUMMY rating for the demo. Replace with the real Trustpilot score and review count before launch. */}
          <div className="trust-score">
            <span className="trust-badge">4.8</span>
            <div>
              <span className="stars" aria-label="Rated 4.8 out of 5">
                <StarIcon /> <StarIcon /> <StarIcon /> <StarIcon /> <StarIcon />
              </span>
              <p>1,200+ reviews on Trustpilot</p>
            </div>
          </div>
        </div>
        <ul className="trust-logos" aria-label="Accredited and backed by">
          {BACKERS.map((b) => (
            <li key={b.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.src} alt={b.name} style={{ height: b.height }} loading="lazy" />
            </li>
          ))}
        </ul>
      </section>

      {/* 3. See it in action */}
      <section className="action" id="demo">
        <div className="action-copy">
          <span className="eyebrow">See it in action</span>
          <h2>One sentence in. A booked trip out.</h2>
          <p>
            No filters and no ten open tabs. You say what you want, mylz comes back with priced options, and you
            confirm the one you like.
          </p>
        </div>
        <div className="demo-panel">
          <div className="dots" aria-hidden="true" />
          <DemoShowcase />
        </div>
      </section>

      {/* 4. How it works */}
      <HowItWorks />

      {/* 5. Trending trips */}
      <Trending initial={trendingTrips("LON", toISO(new Date()))} />

      {/* 6. Reviews */}
      <section className="reviews" aria-labelledby="reviews-title">
        <div className="reviews-head">
          <span className="eyebrow">Travellers on Trustpilot</span>
          <h2 id="reviews-title">What people say after they book</h2>
        </div>
        {/* Paste three real Trustpilot reviews here. Do not publish with the placeholders. */}
        <div className="review-grid">
          {[1, 2, 3].map((n) => (
            <figure key={n} className="review is-placeholder">
              <blockquote>[PASTE TRUSTPILOT REVIEW {n}]</blockquote>
              <figcaption>[First name] · [Route, travellers — e.g. London → Lisbon, 2 adults]</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 7. What you pay */}
      <section className="pay" id="fee" aria-labelledby="pay-title">
        <div className="pay-copy">
          <span className="eyebrow">What you pay</span>
          <h2 id="pay-title">The supplier&apos;s price, plus one stated fee</h2>
          <p>
            mylz does not mark up fares or room rates. Your money for the trip goes to the airline or hotel. mylz adds
            its own fee, and you see it before you pay.
          </p>
        </div>
        <div className="pay-sum" role="group" aria-label="How the total is made up">
          <div>
            <small>Airline fare or hotel rate</small>
            <strong>Paid to the supplier</strong>
          </div>
          <span aria-hidden="true">+</span>
          <div className="is-placeholder">
            <small>mylz fee</small>
            <strong>[STATE FEE]</strong>
          </div>
          <span aria-hidden="true">=</span>
          <div className="pay-total">
            <small>Your total</small>
            <strong>Nothing added at checkout</strong>
          </div>
        </div>
      </section>

      {/* 8. Gets to know you + comparison */}
      <section className="know" aria-labelledby="know-title">
        <div className="know-copy">
          <span className="eyebrow">Gets to know you</span>
          <h2 id="know-title">Every trip takes fewer words than the last</h2>
          <ul>
            <li>
              <strong>Remembers.</strong> Your home airport, who you travel with and how you like to fly.
            </li>
            <li>
              <strong>Saves.</strong> Trips you are still thinking about, ready when you come back.
            </li>
            <li>
              <strong>Gets faster.</strong> The more you book, the less you have to explain.
            </li>
          </ul>
          <RouteMap />
        </div>
        <div className="compare-wrap">
          <table className="compare">
            <caption className="sr-only">mylz compared with a typical booking site</caption>
            <thead>
              <tr>
                <td />
                <th scope="col">mylz</th>
                <th scope="col">Typical booking site</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([row, us, them]) => (
                <tr key={row}>
                  <th scope="row">{row}</th>
                  <td>{us}</td>
                  <td>{them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="faq" id="faq" aria-labelledby="faq-title">
        <div className="faq-head">
          <span className="eyebrow">Questions</span>
          <h2 id="faq-title">Before you book</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p className={isPlaceholder(f.a) ? "is-placeholder" : undefined}>{f.a}</p>
            </details>
          ))}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </section>

      {/* 10. Final CTA + referral */}
      <section className="cta" id="start">
        <h2>
          Where do you want to go <em>today?</em>
        </h2>
        <PromptForm variant="cta" />
        <small>IATA accredited · A real person within 2 hours · Coming soon: experiences, trains, buses &amp; ferries</small>
        <Referral />
      </section>
    </main>
  );
}
