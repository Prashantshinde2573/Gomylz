import { Plane, Check, CalendarDays, SlidersHorizontal, ArrowRight, Headphones, Plus, ShieldCheck, BedDouble } from 'lucide-react';

/** Decorative examples, deliberately separate from real booking controls. */
export function FeatureVisual({type}:{type:string}) {
  return <div className={`feature-bento-visual visual-${type}`} aria-hidden="true"><div className="feature-mini-art">
    {type==='voice' && <>
      <div className="mini-people"><img src="/images/reviews/emily-carter.webp" alt=""/><img src="/images/reviews/daniel-brooks.webp" alt=""/><span><Plus size={16}/></span></div>
      <div className="mini-pill"><span>Dates</span><b>Flexible</b></div>
      <div className="mini-panel mini-routes"><span><Plane size={18}/><i/>LHR <ArrowRight size={13}/> LIS</span><span><Plane size={18}/><i/>LGW <ArrowRight size={13}/> LIS</span></div>
    </>}
    {type==='calendar' && <>
      <div className="mini-pill"><CalendarDays size={18}/><b>Your next escape</b></div>
      <div className="mini-panel mini-calendar"><div><span>Depart</span><ArrowRight size={15}/><span>Return</span></div><div className="mini-days">{['M','T','W','T','F','S','S',12,13,14,15,16,17,18].map((d,i)=><span key={i} className={i>10?'chosen':''}>{d}</span>)}</div></div>
      <div className="mini-tag"><Check size={15}/> Dates, sorted.</div>
    </>}
    {type==='chat' && <>
      <div className="mini-bubble">A window seat, please.</div>
      <div className="mini-panel mini-answer"><span className="mini-mark">m</span><div><b>Let’s find your fit.</b><i/><i/></div></div>
      <div className="mini-tag"><SlidersHorizontal size={14}/> Refine in conversation</div>
    </>}
    {type==='suppliers' && <>
      <div className="mini-provider-row"><span><Plane/></span><span><BedDouble/></span><span><Plane/></span><span><BedDouble/></span></div>
      <div className="mini-panel mini-option"><span className="mini-mark"><Plane size={20}/></span><div><b>Flights & stays</b><i/><i/></div><Check size={18}/></div>
      <div className="mini-pill"><b>One conversation</b></div>
    </>}
    {type==='ticket' && <>
      <div className="mini-panel mini-ticket"><div><Plane size={20}/><span>YOUR JOURNEY</span></div><strong>LHR <ArrowRight size={20}/> LIS</strong><div className="mini-ticket-bottom"><i/><i/><i/><i/><i/><i/><i/><ShieldCheck size={22}/></div></div>
      <div className="mini-tag"><Check size={14}/> IATA TIDS registered</div>
    </>}
    {type==='support' && <>
      <div className="mini-support-person"><img src="/images/reviews/sofia-martin.webp" alt=""/><span><Headphones size={22}/></span></div>
      <div className="mini-panel mini-answer"><span className="mini-mark">m</span><div><b>How can we help?</b><i/><i/></div></div>
      <div className="mini-tag"><Check size={14}/> A little human help</div>
    </>}
  </div></div>;
}
