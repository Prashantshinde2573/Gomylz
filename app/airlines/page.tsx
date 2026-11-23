import type { Metadata } from "next";
import { BadgeCheck, CircleDollarSign, Globe2, Headphones, Layers3, MessageCircle, ShieldCheck, Sparkles, Ticket, TrendingUp } from "lucide-react";
import { FlyIcon } from "@/components/Icons";
import { DiscoveryCall } from "@/components/airlines/DiscoveryCall";
import { Nav } from "@/components/Nav";
import { EditorialImageMotion } from "@/components/airlines/EditorialImageMotion";
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
const bookingBenefits = [
  {icon:Globe2,label:"Experience & ownership",title:"Own the trip from the first question.",description:"Inspire, plan and decide on your site."},
  {icon:Sparkles,label:"Real personalisation",title:"More bookings from the same traffic.",description:"Turn first-party intent into more direct bookings."},
  {icon:Headphones,label:"Retailing & self-servicing",title:"Richer baskets. Simpler service.",description:"Ancillaries, changes and refunds resolved in conversation."},
  {icon:TrendingUp,label:"RASK as an obsession",title:"Lower cost of sale per seat.",description:"Direct bookings avoid indirect distribution costs."},
  {icon:CircleDollarSign,label:"A non-air revenue stream",title:"The journey goes beyond the seat.",description:"Hotels, experiences and transfers in one order."},
];
const travelSteps = [
  {title:"Connect your inventory",description:"Connect your PSS, OMS and inventory. AI only sells what you sell.",image:"operations",width:1400,height:2100,alt:"Aircraft flight-deck instruments and operational controls"},
  {title:"Make it yours",description:"Your brand, your voice, your customer relationship.",image:"cabin",width:1400,height:1050,alt:"A premium passenger seat beside aircraft cabin windows"},
  {title:"Launch everywhere",description:"Your app, website and the AI assistants your customers already use.",image:"book",width:1200,height:800,alt:"A traveller using a digital device while waiting at the airport"},
];
const technicalCapabilities = [
  {title:"Conversational AI",description:"Understands passenger intent in natural language."},
  {title:"RAG & Business Rules",description:"Live fares, availability and your pricing logic."},
  {title:"NDC & APIs",description:"Connects directly to your existing PSS."},
  {title:"Guardrails",description:"Verified data, automatic fallback and cost protection."},
  {title:"Agent Integration",description:"Works with your own AI agents via A2A."},
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
        <header className={styles.valueHeader}>
          <span className={styles.eyebrow}>The AI-native conversational booking layer™</span>
          <h2 id="value-title">Direct demand. Richer baskets. Owned intent.</h2>
          <p>E-commerce captured clicks. AI captures intent and context. Whoever owns them owns the customer.</p>
        </header>
        <div className={styles.valueEditorial}>
          <div className={styles.valueFeatured}>
            <div className={styles.valueFeaturedImage} data-editorial-image><EditorialImageMotion/><img src="/images/airlines/demand/above-clouds.webp" alt="An unbranded aircraft wing above sunlit clouds" width={1800} height={1196} loading="lazy"/></div>
          </div>
          <ol className={styles.valueFeatureList} aria-label="Conversational booking benefits">
            {bookingBenefits.map(({label,title,description},index)=><li className={styles.valueFeatureItem} key={label} data-air-reveal>
              <span className={styles.valueSequence} aria-hidden="true">{String(index+1).padStart(2,"0")}</span>
              <span className={styles.valueRule} aria-hidden="true"/>
              <div className={styles.valueFeatureText}><span>{label}</span><h3>{title}</h3><p>{description}</p></div>
            </li>)}
          </ol>
        </div>
      </section>

      <section className={styles.loyalty} aria-labelledby="loyalty-title" data-air-reveal>
        <div className={styles.loyaltyCopy}><span className={styles.eyebrow}>Loyalty reimagined</span><h2 id="loyalty-title">From air miles to a<br/><em>customer operating system.</em><sup>™</sup></h2><p>Your loyalty programme can be worth more than the airline itself. Mylz turns it into a lifestyle: members earn on everyday spend, and the seat becomes one product in a portfolio AI tailors to each member.</p><div className={styles.loyaltyOutcomes}><span>Higher spend</span><span>Higher yield</span><span>More members</span></div></div>
        <div className={styles.loyaltyVisual} aria-label="Illustrative airline loyalty card"><div className={styles.loyaltyCard}><div><span>Your airline</span><Sparkles size={23}/></div><small>MEMBER EXPERIENCE</small><strong>More than<br/>the journey.</strong><div><span>42,180 <small>points</small></span><span>Silver</span></div></div><div className={styles.loyaltyOffer}><span><Ticket size={20}/></span><div><strong>Your next upgrade, your way.</strong><p>Points. Cash. Or a little of both.</p></div></div><small className={styles.visualNote}>Illustrative member experience</small></div>
      </section>

      <section className={styles.section} id="airline-how" aria-labelledby="how-title" data-air-reveal>
        <div className={styles.howHeader}><span className={styles.eyebrow}>How it works</span><h2 id="how-title">Go live in your channels in 8 to 12 weeks.</h2></div>
        <div className={styles.howCards}>
          {travelSteps.map(({title,description,image,width,height,alt},index)=><article className={styles.howCard} key={title} data-air-reveal>
            <img className={styles.howBackground} src={`/images/airlines/journey/${image}.webp`} alt={alt} width={width} height={height} loading="lazy"/>
            <div className={styles.howCopy}><span className={styles.howStep}>{String(index+1).padStart(2,"0")}</span><h3>{title}</h3><p>{description}</p></div>
          </article>)}
        </div>
        <div className={styles.howTechnical}>
          <h3>Under the hood</h3>
          <div className={styles.howCapabilities}>{technicalCapabilities.map(({title,description})=><article key={title}><h4>{title}</h4><p>{description}</p></article>)}</div>
          <p className={styles.howClosing}>The challenge is integration and orchestration — not model complexity.</p>
        </div>
      </section>

      <section className={styles.contact} id="airline-contact" aria-labelledby="contact-title" data-air-reveal><span className={styles.eyebrow}>Pilot first. Prove the lift. Then scale.</span><h2 id="contact-title">Let’s start with<br/><em>your airline.</em></h2><p>See your airline’s AI in action. You keep the lion’s share.<br/>Mylz takes a small fee on results.</p><div className={styles.actions}><DiscoveryCall/><a className="btn-outline on-dark" href="#airline-experience">Explore the passenger experience <FlyIcon/></a></div><a className={styles.contactEmail} href="mailto:partners@gomylz.com">partners@gomylz.com</a><p className={styles.contactNote}>We’ll walk you through the layer on your own routes and scope a pilot that fits your stack.</p></section>
    </main>
  </div>;
}
