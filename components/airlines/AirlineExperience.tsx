"use client";
import { FlyIcon } from "@/components/Icons";

import {useState, useEffect, useRef, type FormEvent} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Bookmark, CalendarCheck, Check, Compass, CreditCard, MessageCircle, Mic, Plane, ShoppingBag, Sparkles, Ticket} from "lucide-react";
import {previewOffer} from "./preview";
import styles from "@/app/airlines/airlines.module.css";

const tabs=[{id:"chat",label:"Ask anything",icon:MessageCircle},{id:"cart",label:"Cart",icon:ShoppingBag},{id:"bookings",label:"My bookings",icon:Ticket},{id:"checkin",label:"Check-in",icon:CalendarCheck},{id:"loyalty",label:"Loyalty",icon:Sparkles},{id:"explore",label:"Inspiration",icon:Compass}] as const;
type Tab=typeof tabs[number]["id"];
const examples=[
 "Direct flight to Lisbon Friday evening - window seat, one bag, under EUR 180.",
 "Change my Tuesday flight to the morning and add fast-track.",
 "Two seats to Madrid next weekend, extra legroom, and a hotel near the centre.",
 "Cheapest way to get to Milan in February, direct only, with lounge access.",
 "Check me in for tomorrow and keep my usual aisle seat.",
 "How many points do I need to upgrade to Madrid?",
];
const widgets={
 cart:{title:"Cart",description:"Three things are waiting from this conversation. One payment covers the flight and everything attached to it."},
 bookings:{title:"My bookings",description:"Anything you would change on a manage-my-booking page can be said here instead. Ask for a later return and I will reprice it."},
 checkin:{title:"Check-in",description:"You are on the 08:15 to Madrid tomorrow, Leonore. I can check you in now and hold 14A, the aisle seat you usually take."},
 loyalty:{title:"Loyalty",description:"An upgrade on tomorrow's Madrid flight costs 18,000 points, or 6,000 points plus EUR 89. Member fares to Faro are open for June."},
 explore:{title:"Inspiration",description:"Two ideas from Lisbon this month, both direct and both inside your usual budget."}
};
export function AirlineExperience(){
 const router=useRouter();
 const [railOpen,setRailOpen]=useState(false);
 const [history,setHistory]=useState<{role:"user"|"agent";text:string}[]>([]);
 const conversationRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=conversationRef.current;if(el)el.scrollTop=el.scrollHeight;},[history]);
 const [tab,setTab]=useState<Tab>("chat");
 const [classic,setClassic]=useState(false);
 const [draft,setDraft]=useState("");
 const [route,setRoute]=useState("Lisbon");
 const [currency,setCurrency]=useState("EUR");
 const [fare,setFare]=useState(149);
 const [extras,setExtras]=useState<{label:string;price:number}[]>([]);
 const [status,setStatus]=useState("");
 const [from,setFrom]=useState("London");
 const [to,setTo]=useState("Lisbon");
 const [date,setDate]=useState("");
 const [travellers,setTravellers]=useState(1);
 const [offer,setOffer]=useState(false);
 const [seatMap,setSeatMap]=useState(false);
 const [seat,setSeat]=useState("14A");
 function choose(next:Tab){setTab(next);setClassic(false);setStatus("");}
 function ask(text:string){
  if(!text.trim())return;
  setHistory(current=>[...current,{role:"user",text}]);setDraft("");setTab("chat");setClassic(false);setStatus("");setOffer(false);setExtras([]);
  if(/\b(iran|north korea|syria|cuba|russia|belarus|venezuela|crimea|donetsk|luhansk)\b/i.test(text)){setHistory(current=>[...current,{role:"agent",text:"This destination cannot be served for sanctions compliance reasons."}]);return;}
  const {destination,travellers:count,extras:additions,currency:unit,fare:price}=previewOffer(text,travellers);
  setCurrency(unit);setFare(price);
  setRoute(destination);setOffer(true);setTravellers(count);setExtras(additions);
  setHistory(current=>[...current,{role:"agent",text:`Here is a direct option to ${destination}, with the extras in the same booking.`}]);
 }
 function submit(e:FormEvent){e.preventDefault();if(draft.trim())router.push(`/chat?q=${encodeURIComponent(draft.trim())}`);}
 function action(text:string){setStatus(text);}
 function addBag(){setExtras(current=>current.some(x=>x.label==="Checked bag")?current:[...current,{label:"Checked bag",price:29}]);action("Checked bag added to this preview basket. Your real airline’s conditions would apply.");}
 const basket=offer?[{label:`${from} to ${route} · ${travellers} ${travellers===1?"adult":"adults"}`,price:fare*travellers},...extras]:[{label:"Madrid, Fri 08:15 · 1 adult",price:149},{label:"Extra legroom, 14A",price:24},{label:"Lounge, Lisbon T1",price:31},{label:"Two nights, hotel near Gran Via",price:186},...extras.filter(item=>!["Seat selection","Lounge access","Hotel · 1 night"].includes(item.label))];
 const total=basket.reduce((sum,item)=>sum+item.price,0);
 return <div className={styles.demo}>
  <div className={styles.demoBrowser}><span><i/><i/><i/></span><span className={styles.browserAddress}>yourairline.com</span></div>
  <div className={styles.demoBrand}><span className={styles.airlineLogo}>Airline logo</span><span className={styles.passenger}>Leonore <b>L</b></span></div>
  <div className={styles.demoBody} data-rail-open={railOpen}>
   <aside className={styles.demoRail}><button type="button" className={styles.railToggle} aria-expanded={railOpen} aria-controls="air-travel-navigation" onClick={()=>setRailOpen(v=>!v)}><FlyIcon/> My travel</button>{railOpen&&<div id="air-travel-navigation" role="tablist" aria-label="Passenger experience">{tabs.map(({id,label,icon:Icon})=><button key={id} type="button" role="tab" id={`air-tab-${id}`} aria-selected={tab===id&&!classic} aria-controls="air-demo-panel" tabIndex={tab===id?0:-1} onClick={()=>choose(id)} onKeyDown={e=>{if(!["ArrowRight","ArrowLeft","ArrowDown","ArrowUp","Home","End"].includes(e.key))return;e.preventDefault();const current=tabs.findIndex(t=>t.id===id);const next=e.key==="Home"?0:e.key==="End"?tabs.length-1:(current+(e.key==="ArrowRight"||e.key==="ArrowDown"?1:-1)+tabs.length)%tabs.length;choose(tabs[next].id);document.getElementById(`air-tab-${tabs[next].id}`)?.focus();}}><Icon size={18}/><span>{label}</span>{id==="cart"&&<small>{basket.length}</small>}</button>)}<p>Every widget opens in the same conversation. Nothing sends the passenger to another page.</p></div>}</aside>
   <div className={styles.demoCanvas}>
    <div className={styles.demoMode} aria-label="Booking mode"><button type="button" aria-pressed={!classic} onClick={()=>setClassic(false)}><Sparkles size={14}/> Book with AI</button><button type="button" aria-pressed={classic} onClick={()=>{setClassic(true);setStatus("");}}>Book old school</button></div>
    <div id="air-demo-panel" role="tabpanel" aria-labelledby={railOpen?`air-tab-${tab}`:undefined} aria-label={railOpen?undefined:tabs.find(item=>item.id===tab)?.label} className={styles.demoPanel}>
    {classic ? <div className={styles.classic}><span className={styles.demoEyebrow}>Your existing channel</span><h3>The familiar way to fly.</h3><p>Nothing is taken away. The AI entry point sits alongside conventional search.</p><form onSubmit={e=>{e.preventDefault();ask(`Flights from ${from} to ${to}${date?` on ${date}`:""} for ${travellers} adults`);}}><label>From<input value={from} onChange={e=>setFrom(e.target.value)} required/></label><label>To<input value={to} onChange={e=>setTo(e.target.value)} required/></label><label>Depart<input type="date" value={date} onChange={e=>setDate(e.target.value)} required/></label><label>Passengers<select value={travellers} onChange={e=>setTravellers(Number(e.target.value))}>{[1,2,3,4].map(n=><option key={n} value={n}>{n} {n===1?"adult":"adults"}</option>)}</select></label><button type="submit" className="btn-accent">Search flights</button></form></div> : tab==="chat" ? <>
     <div className={styles.chatGreeting}><h3>Hello Leonore</h3><p>How can <span>Your Airline</span> serve you today?</p></div>
     <div className={styles.referenceConversation} ref={conversationRef} role="log" aria-live="polite" aria-label="Sample airline conversation">{history.map((entry,index)=><p key={index} data-role={entry.role}>{entry.text}</p>)}
     {offer&&<div className={styles.demoOffer}><div><Plane size={19}/><strong>{from} → {route}</strong><span>{date||"Friday"} · 19:40 · Direct</span></div>{basket.map(item=><p key={item.label}><span>{item.label}</span><b>{currency} {item.price}</b></p>)}<footer><strong>{currency} {total}</strong><button type="button" className="btn-accent" onClick={()=>choose("cart")}>Book direct <FlyIcon/></button></footer></div>}
     </div>
     <form className={styles.demoComposer} onSubmit={submit}><label className="sr-only" htmlFor="airline-prompt">Ask your airline</label><textarea id="airline-prompt" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();if(draft.trim())router.push(`/chat?q=${encodeURIComponent(draft.trim())}`);}}} rows={3} placeholder="Somewhere warm in February, direct, under EUR 800 - and a hotel near the old town." required/><span className={styles.composerMic} aria-hidden="true"><Mic size={18}/></span><button className="btn-accent" type="submit" aria-label="Send travel request"><FlyIcon/></button></form>
     <div className={styles.demoPrompts}>{examples.map(text=><button className="btn-outline" key={text} type="button" onClick={()=>ask(text)}>{text}<FlyIcon/></button>)}</div>
    </> : <>
     <span className={styles.demoEyebrow}>Your airline · {tabs.find(t=>t.id===tab)?.label}</span><h3>{widgets[tab].title}</h3><p className={styles.widgetDescription}>{widgets[tab].description}</p>
     {tab==="cart"&&<div className={styles.demoOffer}>{basket.map(item=><p key={item.label}><span>{item.label}</span><b>{currency} {item.price}</b></p>)}<footer><strong>Total {currency} {total}</strong><button type="button" className="btn-accent" onClick={()=>action("One payment would cover this basket on your airline’s payment rails. This preview does not take payment.")}><CreditCard size={15}/> Pay once</button></footer><button type="button" className="btn-outline" onClick={()=>action("This sample basket is saved for the duration of this preview.")}><Bookmark size={15}/> Save for later</button></div>}
     {tab==="bookings"&&<><div className={styles.bookingTicket}><Plane size={23}/><div><strong>Lisbon → Madrid</strong><p>Tomorrow · 08:15 · Ref 4KQ2ZM</p><small>Seat {seat}, one bag, lounge included.<br/>Return open on Sunday.</small></div></div><div className={styles.widgetActions}><button className="btn-accent" type="button" onClick={()=>action("A later return would be repriced in this conversation. In this example: Sunday 18:30, with a fare difference shown before confirmation.")}>Move the return</button><button className="btn-outline" type="button" onClick={addBag}>Add a bag</button><button className="btn-outline" type="button" onClick={()=>action("Cancellation and refund eligibility would be checked against your fare rules before any change. No booking has been cancelled.")}>Cancel and refund</button></div></>}
     {tab==="checkin"&&<><div className={styles.bookingTicket}><CalendarCheck size={25}/><div><strong>Madrid · Tomorrow, 08:15</strong><p>Leonore Silva · Seat {seat}</p><small>Your usual aisle preference, remembered.</small></div></div><div className={styles.widgetActions}><button className="btn-accent" type="button" onClick={()=>action(`Sample check-in complete. Seat ${seat} held. A live implementation would send the boarding pass to the passenger’s wallet.`)}>Check me in</button><button className="btn-outline" type="button" aria-expanded={seatMap} onClick={()=>setSeatMap(v=>!v)}>Show the seat map</button><button className="btn-outline" type="button" onClick={addBag}>Add a bag</button></div>{seatMap&&<div className={styles.seatMap} aria-label="Example seat selection">{["14A","14B","14C","14D","14E","14F"].map(item=><button type="button" key={item} aria-pressed={seat===item} onClick={()=>{setSeat(item);action(`Seat ${item} selected in this example.`);}}>{item}</button>)}</div>}</>}
     {tab==="loyalty"&&<><div className={styles.memberPoints}><span>Silver tier</span><strong>42,180 <small>points</small></strong><p>Tomorrow’s Madrid upgrade: 18,000 points,<br/>or 6,000 points + EUR 89.</p></div><div className={styles.widgetActions}><button className="btn-accent" type="button" onClick={()=>action("Upgrade preview: 18,000 points. Your airline would check availability and ask for confirmation before redeeming.")}>Use points</button><button className="btn-outline" type="button" onClick={()=>action("Upgrade preview: 6,000 points + EUR 89. Nothing is charged or redeemed in this preview.")}>Points plus cash</button><button className="btn-outline" type="button" onClick={()=>action("Member fare example: Lisbon to Faro in June. The live layer would retrieve the current eligible fares from your inventory.")}>See member fares</button></div></>}
     {tab==="explore"&&<div className={styles.destinationIdeas}>{[{city:"Faro",info:"Fri to Sun, 55 minutes, quiet season",fare:96},{city:"Madeira",info:"Four nights, direct, warm all week",fare:148}].map(item=><button type="button" key={item.city} onClick={()=>ask(`A direct flight to ${item.city}`)}><Compass size={22}/><strong>{item.city}</strong><span>{item.info}</span><b>EUR {item.fare} <FlyIcon/></b></button>)}</div>}
    </>}
    {status&&<div className={styles.demoStatus} role="status"><Check size={17}/><p>{status}</p></div>}
    </div>
    <div className={styles.demoDisclaimer}>Illustrative passenger experience. No live fares, payments or booking changes. <Link href="/chat?new=1">Explore Mylz trip chat</Link></div>
   </div>
  </div>
 </div>;
}
