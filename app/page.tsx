import Link from "next/link";
import { DemoShowcase } from "@/components/DemoShowcase";
import { HeroMedia } from "@/components/HeroMedia";
import { Nav } from "@/components/Nav";
import {
  ArrowUpRightIcon, BedIcon, CalendarIcon, ChatIcon, CompareIcon,
  GlobeIcon, MicIcon, PlaneIcon, SparkleIcon, TicketIcon,
} from "@/components/Icons";
import { SectionMotion } from "@/components/SectionMotion";
import { SearchPanel } from "@/components/SearchPanel";
import { Trending } from "@/components/Trending";
import { BACKERS } from "@/lib/assets";
import { toISO } from "@/lib/dates";
import { trendingTrips } from "@/lib/demo";
import { FAQS } from "@/lib/faq";

export const revalidate = 3600;

const STAYS = [
  { title: "A resort by the water", prompt: "A resort stay in Bali for 7 nights", photo: "1571896349842-33c89424de2d", fallback: "how-3.jpg" },
  { title: "A boutique city stay", prompt: "A boutique hotel in Lisbon for 3 nights", photo: "1611892440504-42a792e24d32", fallback: "how-1.jpg" },
  { title: "A weekend hideaway", prompt: "A hotel in Rome for a long weekend", photo: "1566073771259-6a8506099945", fallback: "how-3.jpg" },
  { title: "A room with a view", prompt: "A hotel in Dubai for 4 nights", photo: "1542314831-068cd1dbfeeb", fallback: "how-2.jpg" },
];

const WORKFLOW = [
  { Icon: MicIcon, title: "Describe the trip", copy: "Type it or say it out loud. Add a route, dates, a budget, or whatever matters most." },
  { Icon: CompareIcon, title: "Compare as Mylz searches", copy: "Keep the conversation beside your flight and stay options. You can queue a follow-up while the search runs." },
  { Icon: TicketIcon, title: "Pick the option that fits", copy: "Open fare details before choosing. On live Mylz, sign in to keep your trip details handy." },
];

const FEATURES = [
  { Icon: SparkleIcon, title: "Search in your own words", copy: "Start with an idea or give Mylz the details you already know." },
  { Icon: CalendarIcon, title: "Use the search form", copy: "Choose airports or a hotel destination, dates, and the people travelling." },
  { Icon: CompareIcon, title: "Keep comparing in chat", copy: "Review options beside the conversation and narrow down the choices." },
  { Icon: GlobeIcon, title: "Search across suppliers", copy: "Mylz brings airline and accommodation options into the same workspace." },
  { Icon: TicketIcon, title: "IATA TIDS registered", copy: "Mylz is listed as a travel sales intermediary and tickets through licensed partners." },
  { Icon: ChatIcon, title: "Speak to the Mylz team", copy: "Contact Mylz for help with changes, cancellations, and travel disruptions." },
];

const BOOKING = [
  { tag: "Flights", title: "Compare the full fare", copy: "Check the route, baggage allowance, and any fees before you choose.", cta: "Search flights and stays", href: "#top", photo: "1539585383997-efd1a743120d" },
  { tag: "Booking terms", title: "Know what can change", copy: "Review the supplier’s rules for changes, cancellations, and refunds.", cta: "Read booking terms", href: "https://gomylz.com/terms-and-conditions", photo: "1654163600133-452eb7274426" },
  { tag: "Stays", title: "Find a stay that fits", copy: "Compare room rates, check-in times, and what’s included in your stay.", cta: "Explore stays", href: "#stays", photo: "1571896349842-33c89424de2d" },
];

const SAMPLE_REVIEWS = [
  { name: "Maya Shah", role: "Product designer", rating: "4.8", photo: "1580489944761-15a19d654956", quote: "I put our dates and budget in one message and had a shortlist for Lisbon in minutes. It was easy to compare the options before deciding." },
  { name: "Daniel Brooks", role: "Operations manager", rating: "4.9", photo: "1500648767791-00dcc994a43e", quote: "I needed a later departure and a hotel near the station. I could ask for both in the same conversation and narrow down the trip from there." },
  { name: "Sofia Martin", role: "Marketing consultant", rating: "4.7", photo: "1534528741775-53994a69da69", quote: "I had a few days free and no destination in mind. I compared a couple of city breaks and found one that worked with my dates." },
];

export default function HomePage() {
  return (
    <>
    <Nav />
    <main className="travel-home">
      <SectionMotion />
      <section className="hero">
        <HeroMedia />
        <div className="hero-inner">
          <div className="hero-grid">
            <div className="hero-head">
              <span className="hero-pill">Talk. Book. Go.</span>
              <h1>Let's Plan and <em>Go</em></h1>
              <p className="hero-sub">Tell mylz where you want to go. Search flights and stays by typing, speaking, or using the search form.</p>
            </div>
          </div>
          <SearchPanel />
        </div>
      </section>

      <ul className="coverage" aria-label="Mylz travel coverage">
        <li><span className="coverage-icon"><PlaneIcon size={25} /></span><div><strong>380+</strong><span>Major airlines</span></div></li>
        <li><span className="coverage-icon"><BedIcon size={25} /></span><div><strong>1M+</strong><span>Stays</span></div></li>
        <li><span className="coverage-icon"><TicketIcon size={25} /></span><div><strong>IATA</strong><span>TIDS 96192412</span></div></li>
      </ul>

      <section className="stay-edit" id="stays" aria-labelledby="stay-title">
        <div className="stay-heading">
          <div className="section-intro">
            <h2 id="stay-title">Find your kind of stay.</h2>
            <p>A beachfront escape, a city weekend, or somewhere with a view. Pick a starting point and make the search your own.</p>
          </div>
          <Link className="btn-outline sm" href="/#trending">Explore Destinations <ArrowUpRightIcon size={15} /></Link>
        </div>
        <div className="stay-grid">
          {STAYS.map(({ title, prompt, photo, fallback }) => (
            <Link
              className="stay-tile"
              href={`/chat?q=${encodeURIComponent(prompt)}`}
              key={title}
              prefetch={false}
              style={{backgroundImage: `var(--card-photo-gradient), url(https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1050&q=80), url(/images/how/${fallback})`}}
            >
              <span>{title}</span><span className="round-arrow"><ArrowUpRightIcon size={17} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="walkthrough" id="demo" aria-labelledby="walkthrough-title">
        <div className="walkthrough-copy">
          <div className="section-intro">
            <span className="eyebrow">Book with mylzAI</span>
            <h2 id="walkthrough-title">From an idea to options you can compare.</h2>
          </div>
          <ol className="workflow-list">
            {WORKFLOW.map(({ Icon, title, copy }) => (
              <li key={title}><span className="feature-icon"><Icon size={20} /></span><div><h3>{title}</h3><p>{copy}</p></div></li>
            ))}
          </ol>
        </div>
        <DemoShowcase />
      </section>

      <Trending initial={trendingTrips("LON", toISO(new Date()))} />

      <section className="feature-section" id="how" aria-labelledby="feature-title">
        <div className="section-intro centered">
          <h2 id="feature-title">Why plan with mylz?</h2>
          <p>Search the way you like, see your options, and know where to turn if plans change.</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map(({ Icon, title, copy }) => (
            <article className="feature-card" key={title}>
              <span className="feature-icon"><Icon size={20} /></span><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="partner-band">
          <span>Accredited &amp; backed by</span>
          <ul aria-label="Accreditation and backers">
            {BACKERS.map((backer) => (
              <li key={backer.name}><img src={backer.src} alt={backer.name} style={{height: backer.height}} loading="lazy" /></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="booking-section" id="fee" aria-labelledby="booking-title">
        <div className="section-intro centered">
          <h2 id="booking-title">What to check before you book.</h2>
          <p>Mylz connects you with travel suppliers. Review the price and conditions for the option you choose.</p>
        </div>
        <div className="booking-grid">
          {BOOKING.map(({ tag, title, copy, cta, href, photo }) => (
            <article className="booking-card" key={title}>
              <img className="booking-card-photo" src={`https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=900&q=82`} alt="" loading="lazy" />
              <div className="booking-card-copy">
                <span className="booking-card-tag">{tag}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <a className="booking-card-cta" href={href}>{cta} <ArrowUpRightIcon size={14} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="reviews" aria-labelledby="reviews-title">
        <div className="section-intro centered">
          <h2 id="reviews-title">What Our Customers Say</h2>
          <p>Fictional testimonials for this preview. Photos are illustrative.</p>
        </div>
        <div className="review-grid">
          {SAMPLE_REVIEWS.map(({ name, role, rating, photo, quote }) => (
            <figure className="review" key={name}>
              <details className="review-media">
                <summary aria-label={`Toggle testimonial preview for ${name}`}>
                  <img src={`https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1200&h=700&q=82`} alt="" loading="lazy" />
                  <span className="review-play" aria-hidden="true"><span className="review-play-icon" /></span>
                </summary>
                <p className="review-preview">Sample testimonial · Video unavailable</p>
              </details>
              <blockquote>“{quote}”</blockquote>
              <figcaption>
                <span><strong>{name}</strong><small>{role}</small></span>
                <span className="review-score" aria-label={`${rating} out of 5 stars`}><span aria-hidden="true">★</span> {rating}/5</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="faq" id="faq" aria-labelledby="faq-title">
        <div className="faq-head section-intro"><h2 id="faq-title">Frequently asked questions.</h2></div>
        <div className="faq-list">
          {FAQS.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary><p>{item.a} {item.href && <a href={item.href}>{item.linkLabel} <span aria-hidden="true">↗</span></a>}</p>
            </details>
          ))}
        </div>
      </section>

    </main>
    </>
  );
}
