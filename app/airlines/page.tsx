import type { Metadata } from "next";
import { BadgeCheck, CircleDollarSign, Globe2, Headphones, Layers3, MessageCircle, Plug, ShieldCheck, Sparkles, Ticket, TrendingUp } from "lucide-react";
import { FlyIcon } from "@/components/Icons";
import { Nav } from "@/components/Nav";
import { AirlineMotion } from "@/components/airlines/AirlineMotion";
import { AirlineExperience } from "@/components/airlines/AirlineExperience";
import styles from "./airlines.module.css";

const CONTACT = "mailto:partners@gomylz.com?subject=Airline%20partnership%20%E2%80%94%2030-minute%20discovery%20call";
export const metadata: Metadata = {
  title: "Mylz for Airlines | Your channel. A new conversation.",
  description: "mylz factory is the AI-native conversational booking layer for airlines. Bring fares, ancillaries and servicing into your own app and website. Explore a partnership.",
  alternates: { canonical: "https://gomylz.vercel.app/airlines" },
  openGraph: {title:"Mylz for Airlines | Conversational commerce",description:"Your fares, your brand, your customer relationship. Explore the conversational booking layer for airlines.",url:"https://gomylz.vercel.app/airlines",images:[{url:"/images/airlines/aircraft.png",alt:"Original unbranded passenger aircraft"}]},
};
const benefits = [
  {icon:Globe2, label:"Experience & ownership",title:"Own the trip from the first question.",text:"Today your website can only take the booking once passengers have decided. Make your website the place where trips are inspired, planned—and decided."},
  {icon:Sparkles,label:"Real personalisation",title:"More bookings from the same traffic.",text:"First-party intent data stays with you. The right answer helps convert the traffic you already pay for."},
  {icon:Headphones,label:"Retailing & self-servicing",title:"Richer baskets. Simpler service.",text:"Ancillaries ride along, while changes, refunds and delays are resolved in the conversation.",note:"Up to 30% fewer calls¹"},
  {icon:TrendingUp,label:"RASK as an obsession",title:"Lower cost of sale per seat.",text:"Every booking made direct avoids indirect distribution costs, on capacity you already fly."},
  {icon:CircleDollarSign,label:"A non-air revenue stream",title:"The journey goes beyond the seat.",text:"Hotels, experiences and transfers in the same order, with a revenue share on every sale and no inventory held."},
];
const technology = [
  {icon:MessageCircle,title:"Conversational AI",text:"Understands passenger intent in natural language."},
  {icon:Layers3,title:"RAG & business rules",text:"Live fares and availability, with your pricing logic."},
  {icon:Plug,title:"NDC & your APIs",text:"No NDC? No problem. Connect directly to your existing PSS."},
  {icon:ShieldCheck,title:"Guardrails",text:"Verified data, automatic fallback, cost limits and attack protection."},
  {icon:BadgeCheck,title:"Works with your own agent",text:"Your agent stays in charge and hands booking to mylz via A2A, with zero context loss."},
];
export default function AirlinesPage() {
  return <div className={styles.page}>
    <div className={styles.navigation}><Nav/></div>
    <main id="airline-main">
      <section className={styles.hero} aria-labelledby="airline-title">
        <div className={styles.heroCopy}>
          <h1 id="airline-title">Your airline. <em>AI-native.</em></h1>
        </div>
        <div className={styles.flightScene} aria-label="Original front-facing passenger aircraft above a natural cloudscape">
          <div className={styles.skyWindow} aria-hidden="true"><img src="/images/airlines/sky.webp" alt="" width={2000} height={3000} className={styles.skyPhoto} fetchPriority="high"/><div className={styles.skyTint}/></div>
          <div className={styles.aircraftParallax} data-aircraft><div className={styles.aircraftApproach}><div className={styles.aircraftFloat}><img src="/images/airlines/aircraft-front.png" width={1536} height={1024} alt="Front view of an original unbranded passenger jet, with both wings extending beyond the rounded sky scene" fetchPriority="high" className={styles.aircraft}/></div></div></div>
          <AirlineMotion/>
        </div>
        <div className={styles.heroBottom}>
          <p className={styles.heroLead}>The AI-native conversational booking layer<span className={styles.tm}>™</span> that lives inside your app and website.</p>
          <div className={styles.actions}><a className="btn-accent" href={CONTACT}>Let’s talk partnership</a><a className="btn-outline" href="#airline-experience">Take the passenger’s seat <FlyIcon/></a></div>
        </div>
      </section>
      <section className={styles.ownershipSection} aria-label="Your airline, your ownership">
        <ul className={styles.ownershipStrip}>
          <li><span className={styles.ownershipIcon}><BadgeCheck size={25} strokeWidth={1.8} aria-hidden="true"/></span><div><span>Your</span><strong>brand</strong></div></li>
          <li><span className={styles.ownershipIcon}><Layers3 size={25} strokeWidth={1.8} aria-hidden="true"/></span><div><span>Your</span><strong>channels</strong></div></li>
          <li><span className={styles.ownershipIcon}><ShieldCheck size={25} strokeWidth={1.8} aria-hidden="true"/></span><div><span>Your</span><strong>customer relationship</strong></div></li>
        </ul>
        <p className={styles.ownershipStatement}>Your fares, ancillaries and servicing. Your brand’s voice. The customer relationship stays with you.</p>
      </section>

      <section className={styles.section} id="airline-opportunity" aria-labelledby="opportunity-title" data-air-reveal>
        <div className={styles.demandHeader}>
          <div className={styles.demandIntro}>
            <span className={styles.eyebrow}>Where demand leaks today</span>
            <h2 id="opportunity-title">Your customers start with you.<br/><span>Your search form can’t finish the job.</span></h2>
            <p>Dates, airports, passengers—anything more nuanced has nowhere to go. Demand that began on your channel leaks out in three ways.</p>
          </div>
          <a className="btn-accent" href={CONTACT}>Let’s talk partnership</a>
        </div>
        <div className={styles.demandBento}>
          <article className={styles.demandCard} data-air-reveal>
            <img className={styles.demandPhoto} src="/images/airlines/demand/digital-planning.webp" width={1800} height={1200} alt="People comparing options together on a laptop" loading="lazy"/>
            <div className={styles.demandCopy}>
              <h3>They book elsewhere.</h3>
              <p>You lose the booking, the data and the relationship.</p>
            </div>
          </article>
          <article className={styles.demandCard} data-air-reveal>
            <img className={styles.demandPhoto} src="/images/airlines/demand/airport-terminal.webp" width={1800} height={1200} alt="Passengers walking through a spacious modern airport terminal" loading="lazy"/>
            <div className={styles.demandCopy}>
              <h3>They call you instead.</h3>
              <p>Your most expensive channel—and higher CASK.</p>
            </div>
          </article>
          <article className={styles.demandCard} data-air-reveal>
            <img className={styles.demandPhoto} src="/images/airlines/demand/above-clouds.webp" width={1800} height={1196} alt="Unbranded aircraft wing above clouds in warm evening light" loading="lazy"/>
            <div className={styles.demandCopy}>
              <h3>They don’t book at all.</h3>
              <p>No booking. Lost RASK on that seat.</p>
            </div>
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.experienceSection}`} id="airline-experience" aria-labelledby="experience-title" data-air-reveal>
        <div className={styles.channelIntro}>
          <div><span className={styles.eyebrow}>Your channel, AI-native</span><h2 id="experience-title">Search, retailing and servicing in one conversational layer</h2></div>
          <div><p>This is the cornerstone of an <strong>AI-native</strong> airline: the layer every other digital investment plugs into.</p><p>Conventional search stays one tap away for anyone who prefers it.</p></div>
        </div>
        <AirlineExperience/>
        <div className={styles.experienceFoot}><span><ShieldCheck size={17}/> Your PSS inventory</span><span><CircleDollarSign size={17}/> Payment on your rails</span><span><MessageCircle size={17}/> Your brand’s voice</span></div>
      </section>

      <section className={styles.section} id="airline-value" aria-labelledby="value-title" data-air-reveal>
        <div className={styles.introSplit}><div><span className={styles.eyebrow}>The AI-native conversational booking layer™</span><h2 id="value-title">Direct demand.<br/>Richer baskets. <span>Owned intent.</span></h2></div><p>E-commerce captured clicks. AI captures intent and context. Whoever owns them owns the customer.</p></div>
        <div className={styles.benefits}>{benefits.map(({icon:Icon,label,title,text,note})=><article key={title}><Icon size={25}/><span>{label}</span><h3>{title}</h3><p>{text}</p>{note&&<small>{note}</small>}</article>)}</div>
        <p className={styles.footnote}>¹ Potential call reduction stated in the current Mylz Airlines offering. Pilot results depend on your implementation and passenger journeys.</p>
      </section>

      <section className={styles.loyalty} aria-labelledby="loyalty-title" data-air-reveal>
        <div className={styles.loyaltyCopy}><span className={styles.eyebrow}>Loyalty reimagined</span><h2 id="loyalty-title">From air miles to a<br/><em>customer operating system.</em><sup>™</sup></h2><p>Your loyalty programme can be worth more than the airline itself. Mylz turns it into a lifestyle: members earn on everyday spend, and the seat becomes one product in a portfolio AI tailors to each member.</p><div className={styles.loyaltyOutcomes}><span>Higher spend</span><span>Higher yield</span><span>More members</span></div></div>
        <div className={styles.loyaltyVisual} aria-label="Illustrative airline loyalty card"><div className={styles.loyaltyCard}><div><span>Your airline</span><Sparkles size={23}/></div><small>MEMBER EXPERIENCE</small><strong>More than<br/>the journey.</strong><div><span>42,180 <small>points</small></span><span>Silver</span></div></div><div className={styles.loyaltyOffer}><span><Ticket size={20}/></span><div><strong>Your next upgrade, your way.</strong><p>Points. Cash. Or a little of both.</p></div></div><small className={styles.visualNote}>Illustrative member experience</small></div>
      </section>

      <section className={styles.section} id="airline-how" aria-labelledby="how-title" data-air-reveal>
        <div className={styles.introSplit}><div><span className={styles.eyebrow}>How it works</span><h2 id="how-title">Your channels.<br/>AI-native in <span>8–12 weeks.</span></h2></div><p>Others are building AI travel apps. We power the booking experience behind the brands that already own the customer.</p></div>
        <div className={styles.integration}><ol className={styles.steps}><li><span>Connect</span><h3>Connect your inventory.</h3><p>Plug into your PSS, OMS and inventory. The AI only sells what you sell.</p></li><li><span>Personalise</span><h3>Make it yours.</h3><p>Your name, look and tone of voice. Customers never see mylz.</p></li><li><span>Launch</span><h3>Go where your customers are.</h3><p>Your app, your website and the AI assistants they already use.</p></li></ol><div className={styles.stackDiagram}><div className={styles.diagramTop}><span>Your website</span><span>Your app</span><span>AI assistants</span></div><div className={styles.diagramConnector}/><div className={styles.diagramCore}><Sparkles size={25}/><strong>mylz factory</strong><span>AI-native conversational booking layer</span></div><div className={styles.diagramConnector}/><div className={styles.diagramBottom}><span>PSS</span><span>OMS</span><span>Your APIs</span></div><p>Your inventory. Your rules. Your payment rails.</p></div></div>
        <div className={styles.technology}><h3>Under the hood.</h3><div>{technology.map(({icon:Icon,title,text})=><article key={title}><Icon size={21}/><h4>{title}</h4><p>{text}</p></article>)}</div><p className={styles.techConclusion}>The challenge is integration and orchestration—not model complexity.</p></div>
      </section>

      <section className={styles.contact} id="airline-contact" aria-labelledby="contact-title" data-air-reveal><span className={styles.eyebrow}>Pilot first. Prove the lift. Then scale.</span><h2 id="contact-title">Let’s start with<br/><em>your airline.</em></h2><p>See your airline’s AI in action. You keep the lion’s share.<br/>Mylz takes a small fee on results.</p><div className={styles.actions}><a className="btn-accent" href={CONTACT}>Book a 30-min discovery call</a><a className="btn-outline" href="#airline-experience">Explore the passenger experience <FlyIcon/></a></div><a className={styles.contactEmail} href="mailto:partners@gomylz.com">partners@gomylz.com</a><p className={styles.contactNote}>We’ll walk you through the layer on your own routes and scope a pilot that fits your stack.</p></section>
    </main>
  </div>;
}
