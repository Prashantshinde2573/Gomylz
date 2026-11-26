"use client";

import { useRouter } from "next/navigation";
import { StayCard, StayDetails } from "@/components/StayExperience";
import { filterStays, parseStayFilters, type StayFilters } from "@/lib/stays";
import { StayMap } from "@/components/StayMap";
import { stayQuery, namedStayCity, stayCityName, hotelRequest } from "@/lib/stay-context";
import ui from "./workspace.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrency } from "@/components/CurrencyProvider";
import { BagIcon, BedIcon, CalendarIcon, GridIcon, SparkleIcon, CalendarXIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, FlyIcon, MicIcon, SuitcaseIcon, SwapIcon } from "@/components/Icons";
import { useSpeech } from "@/components/useSpeech";
import { DESTINATION_PHOTOS, HERO_POSTER } from "@/lib/assets";
import { cityForPlace } from "@/lib/airports";
import { fmtDuration, fmtLong, fmtShort, toISO } from "@/lib/dates";
import { applyFollowUp, makeStays, type Flight, type Idea, type SearchResult, type Stay, type TripQuery, travellersText } from "@/lib/demo";
import { readChatSeed } from "@/lib/startChat";

type Found = Extract<SearchResult, { ok: true }>;
type Message =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "mylz"; text: string; toResults?: boolean; ideas?: Idea[] };

const SEARCH_STEPS = [
  "Finding sample fares and stays",
  "Preparing baggage and fare details",
  "Preparing prices and trip options",
  "Sorting by what you asked for",
];
const PAGE = 6;
const HOLD_SECONDS = 25 * 60;

const TRIP_STARTERS = [
  { label: "Flights", icon: <FlyIcon />, prompt: "Find flights to " },
  { label: "Stays", icon: <BedIcon size={21} />, prompt: "Find a hotel in " },
  { label: "Flight + stay", icon: <SuitcaseIcon size={21} />, prompt: "Plan flights and a hotel in " },
  { label: "Explore", icon: <GridIcon size={21} />, prompt: "Suggest places for a long weekend" },
];

const DESTINATION_STARTERS = [
  { code: "LIS", label: "Lisbon", detail: "A long weekend", prompt: "Plan flights and a hotel for a long weekend in Lisbon." },
  { code: "ROM", label: "Rome", detail: "A city break", prompt: "Plan flights and a hotel for three nights in Rome." },
  { code: "TYO", label: "Tokyo", detail: "A week away", prompt: "Plan flights and a hotel for a week in Tokyo." },
];


export function ChatClient({ id }: { id: string }) {
  const { format, rate, home } = useCurrency();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const pendingHotel = useRef<string | null>(null);
  const expiresAt = useRef(Date.now() + HOLD_SECONDS * 1000);

  const [sideView, setSideView] = useState<"results" | "cart">("results");
  const [tab, setTab] = useState<"chat" | "results">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [result, setResult] = useState<Found | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searching, setSearching] = useState(false);
  const [step, setStep] = useState(0);
  const [queue, setQueue] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [hotelQuery, setHotelQuery] = useState<TripQuery | null>(null);
  const [stayFilters, setStayFilters] = useState<StayFilters>({});
  const [stayFiltersOpen, setStayFiltersOpen] = useState(false);
  const [stayDetails, setStayDetails] = useState<{stay:Stay;view:"details"|"rooms"} | null>(null);
  const [stays, setStays] = useState<Stay[]>([]);
  const [stayView, setStayView] = useState<"list" | "map">("list");
  const [kind, setKind] = useState<"flights" | "stays">("flights");
  const [shown, setShown] = useState(PAGE);
  const [details, setDetails] = useState<Flight | null>(null);
  const [picked, setPicked] = useState<{ flight?: Flight; stay?: Stay }>({});
  const [login, setLogin] = useState<null | "entry" | "save" | "book">(null);
  const [secondsLeft, setSecondsLeft] = useState(HOLD_SECONDS);

  const nextId = useRef(1);
  const started = useRef(false);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const shortlistRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLInputElement>(null);
  const speech = useSpeech(setDraft);

  const say = useCallback((role: Message["role"], text: string, toResults = false, ideas?: Idea[]) => {
    setMessages((m) => [...m, { id: nextId.current++, role, text, ...(role === "mylz" ? { toResults, ideas } : {}) } as Message]);
  }, []);

  /** A new search: from the homepage, or a follow-up that names a new trip. */
  const search = useCallback(
    async (prompt: string, query: TripQuery | null) => {
      if (!query && /\b(hotels?|stays?|rooms?|hostels?|apartments?)\b/i.test(prompt) && !/\b(flights?|fly|flying)\b/i.test(prompt)) {
        const request=hotelRequest(prompt,toISO(new Date()));
        if (!request.query) { pendingHotel.current=prompt; say("mylz",request.question!); return; }
        query=request.query;pendingHotel.current=null;
      }

      setSearching(true);
      setStep(0);
      try {
        const res = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, query, today: toISO(new Date()), origin: home, rate }),
        });
        const data = (await res.json()) as SearchResult;
        if (!data.ok) {
          // No destination yet: priced ideas, each with a "Plan this" button.
          say("mylz", data.reply, false, data.ideas);
          return;
        }
        setResult(data);
        setSideView("results");
        setFlights(data.flights);
        const hotels = stayQuery(data.query);
        setHotelQuery(hotels);
        setStays(hotels ? makeStays(hotels) : []);
        setStayFilters(parseStayFilters(prompt,{},rate) ?? {});
        setShown(PAGE);
        setPicked(p => query && query.to.code === data.query.to.code ? { flight: data.query.kind === "hotel" ? p.flight : data.flights.find(f => f.id === p.flight?.id), stay: p.stay } : {});
        expiresAt.current = Date.now() + HOLD_SECONDS * 1000;
        setSecondsLeft(HOLD_SECONDS);
        const hasFlights = data.flights.length > 0;
        setKind(hasFlights || data.query.kind === "flight" ? "flights" : "stays");
        const parts = [];
        if (hasFlights) parts.push(`${data.flights.length} flight options to ${data.query.onward?.to.code ?? data.query.to.code}`);
        if (hotels) parts.push(`${makeStays(hotels).length} stays`);
        say("mylz", parts.length ? `${parts.join(" and ")} found. Compare the shortlist below, or see all options.` : "No options match these dates. Try a later onward departure.", true);
        // Keep results in the conversation until the visitor chooses See all.
        setTab(current => data.query.kind === "hotel" ? "results" : current);
      } catch {
        say("mylz", "Something went wrong with that search. Please try again.");
      } finally {
        setSearching(false);
      }
    },
    [home, rate, say],
  );

  /** One message from the visitor: filter the current results, or run a new search. */
  const handle = useCallback(
    async (text: string) => {
      say("user", text);
      if (pendingHotel.current) {
        const combined=`${pendingHotel.current} ${text}`;
        if (!result) {pendingHotel.current=null;await search(combined,null);return;}
        const request=hotelRequest(combined,toISO(new Date()));
        if(!request.query){pendingHotel.current=combined;say("mylz",request.question!);return;}
        pendingHotel.current=null;setHotelQuery(request.query);setStays(makeStays(request.query));setKind("stays");setTab("results");setSideView("results");setPicked(p=>({...p,stay:undefined}));
        say("mylz",`Stays in ${stayCityName(request.query)} for ${fmtShort(request.query.date)}–${fmtShort(request.query.returnDate!)}. Your flights are unchanged.`,true);return;
      }
      if (result && hotelQuery && (kind === "stays" || /\b(hotels?|stays?)\b/i.test(text))) {
        const filters = parseStayFilters(text,stayFilters,rate);
        if (filters !== null && !namedStayCity(text)) {
          setStayFilters(filters); setKind("stays");setTab("results");setSideView("results");
          const count=filterStays(stays,hotelQuery,filters).length;
          say("mylz", count ? `${count} stay${count===1?"":"s"} match${count===1?"es":""} your filters in ${stayCityName(hotelQuery)}.` : "No sample stays match those filters. Clear a filter or increase your budget.",true);
          return;
        }
      }
      if (result && (/\b(hotels?|stays?|accommodation)\b/i.test(text) || (kind === "stays" && (namedStayCity(text) || /\b(change|location|nights?)\b/i.test(text))))) {
        const location = result.query.onward?.to ?? result.query.to;
        const context = namedStayCity(text) ? text : `Hotels in ${cityForPlace(location.code)?.city ?? location.label} ${text}`;
        const request = hotelQuery ? {query:stayQuery(hotelQuery,text) ?? undefined} : hotelRequest(context,toISO(new Date()));
        if (!request.query) {pendingHotel.current=context;say("mylz",("question" in request && request.question) || "What’s your check-in date and how many nights would you like to stay?");setKind("stays");setTab("results");setSideView("results");return;}
        const updated=request.query;
        setHotelQuery(updated); setStays(makeStays(updated)); setStayFilters(parseStayFilters(text,{},rate) ?? {}); setKind("stays"); setTab("results"); setSideView("results");
        setPicked(p => ({...p, stay:undefined}));
        say("mylz", `Here are stays in ${stayCityName(updated)} for ${fmtShort(updated.date)}–${fmtShort(updated.returnDate!)}. Your flight search is unchanged. You can ask for hotels in another city or a different number of nights.`,true);
        return;
      }
      if (result && flights.length > 0) {
        const out = applyFollowUp(text, result.flights, flights, rate);
        if (out.handled) {
          setFlights(out.flights);
          setShown(PAGE);
          setKind("flights");
          setSideView("results");
          say("mylz", out.reply, true);
          return;
        }
        // Not a filter: treat it as a new ask (a trip, or an open question that gets priced ideas).
      }
      await search(text, null);
    },
    [flights, rate, result, say, search, hotelQuery, kind, stayFilters, stays],
  );

  // First ask, carried over from the homepage.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    try {
      const raw = window.sessionStorage.getItem(`mylz-workspace-${id}`);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.messages)) {
          pendingHotel.current=typeof saved.pendingHotel === "string" ? saved.pendingHotel : null;
          setMessages(saved.messages); setResult(saved.result ?? null); setFlights(saved.flights ?? []);
          const restoredHotel = saved.hotelDatesVersion === 1 && saved.hotelQuery ? stayQuery(saved.hotelQuery) : null;
          setHotelQuery(restoredHotel);setStays(restoredHotel ? saved.stays ?? makeStays(restoredHotel) : []);
          setStayView(saved.stayView === "map" ? "map" : "list"); setStayFilters(saved.stayFilters ?? {});
          setPicked({...saved.picked,stay:restoredHotel ? saved.picked?.stay : undefined}); setKind(saved.kind === "stays" || saved.result?.query?.kind === "hotel" ? "stays" : "flights"); setTab(saved.tab === "results" ? "results" : "chat"); setSideView(saved.sideView === "cart" ? "cart" : "results");
          expiresAt.current = Number(saved.expiresAt) || Date.now();
          setSecondsLeft(Math.max(0, Math.floor((expiresAt.current - Date.now()) / 1000)));
          nextId.current = Math.max(0, ...saved.messages.map((m: Message) => m.id)) + 1;
          setHydrated(true); return;
        }
      }
    } catch { /* Keep chat usable when storage is unavailable. */ }
    setHydrated(true);
    const seed = readChatSeed(id);
    if (!seed?.prompt) return;
    if (seed.draft) {
      setDraft(seed.prompt);
      window.requestAnimationFrame(() => {
        const input = composerRef.current;
        input?.focus();
        const placeholder = /\[[^\]]+\]/.exec(seed.prompt);
        if (placeholder) input?.setSelectionRange(placeholder.index, placeholder.index + placeholder[0].length);
      });
      return;
    }
    say("user", seed.prompt);
    void search(seed.prompt, seed.query);
  }, [id, say, search]);

  useEffect(() => {
    if (!hydrated) return;
    try { window.sessionStorage.setItem(`mylz-workspace-${id}`, JSON.stringify({messages,result,flights,picked,tab,hotelQuery,stays,stayView,kind,sideView,stayFilters,hotelDatesVersion:1,pendingHotel:pendingHotel.current,expiresAt:expiresAt.current})); } catch { /* This tab still works without persistence. */ }
  }, [hydrated,id,messages,result,flights,picked,tab,hotelQuery,stays,stayView,kind,sideView,stayFilters]);

  // Messages typed during a search wait their turn.
  useEffect(() => {
    if (searching || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    void handle(next);
  }, [handle, queue, searching]);

  useEffect(() => {
    if (!searching) return;
    const t = window.setInterval(() => setStep((s) => Math.min(s + 1, SEARCH_STEPS.length - 1)), 750);
    return () => window.clearInterval(t);
  }, [searching]);

  useEffect(() => {
    if (!result) return;
    const t = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [result]);

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
  }, [messages, searching]);

  useEffect(() => {
    if (searching || !result || !shortlistRef.current || !transcriptRef.current) return;
    const frame = requestAnimationFrame(() => {
      const panel = transcriptRef.current, shortlist = shortlistRef.current;
      if (!panel || !shortlist) return;
      panel.scrollTo({top:panel.scrollTop + shortlist.getBoundingClientRect().top - panel.getBoundingClientRect().top - 16, behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
    });
    return () => cancelAnimationFrame(frame);
  }, [result, flights, searching]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    if (searching) setQueue((q) => [...q, text]);
    else void handle(text);
  }

  function send(text: string) {
    if (searching) setQueue((q) => [...q, text]);
    else void handle(text);
  }

  function startDraft(prompt: string) {
    setDraft(prompt);
    setTab("chat");
    window.requestAnimationFrame(() => composerRef.current?.focus());
  }

  // Selecting an option keeps the visitor in the workspace.
  function selectFlight(f: Flight) {
    if (!result || secondsLeft <= 0) return;
    setPicked(p => ({...p, flight:p.flight?.id === f.id ? undefined : f}));
    setDetails(null);
    setTab("results"); setSideView("cart");
  }

  function selectStay(stay: Stay) { setStayDetails({stay,view:"rooms"}); }
  function confirmStay(stay: Stay) {
    setPicked(p => ({...p,stay}));setStayDetails(null);
    setTab("results");setSideView("cart");
  }

  function openStays() {
    setKind("stays");setTab("results");setSideView("results");
    if(!hotelQuery && result && !pendingHotel.current){
      const destination=result.query.onward?.to ?? result.query.to;
      const name=cityForPlace(destination.code)?.city ?? destination.label;
      pendingHotel.current=`Hotel in ${name}`;
      say("mylz",`What’s your check-in date in ${name}, and how many nights would you like to stay?`);
      requestAnimationFrame(()=>composerRef.current?.focus());
    }
  }

  function goToCheckout() {
    if (!result || (!picked.flight && !picked.stay)) return;
    if(picked.stay && !hotelQuery){openStays();return;}
    if (picked.flight && secondsLeft <= 0) { say("mylz", "Refresh your flight results before checkout."); return; }
    try {
      const checkoutId = crypto.randomUUID();
      window.sessionStorage.setItem(`mylz-checkout-${checkoutId}`, JSON.stringify({flight:picked.flight,query:result.query,stay:picked.stay,stayQuery:hotelQuery,chatId:id,expiresAt:picked.flight ? expiresAt.current : Date.now()+HOLD_SECONDS*1000}));
      router.push(`/checkout/${checkoutId}`);
    } catch { say("mylz", "Your selection could not be saved. Allow session storage and try again."); }
  }

  function continueAsGuest() {
    const wasBooking = login === "book";
    setLogin(null);
    if (login === "entry") return;
    setTab("chat");
    say("mylz", wasBooking ? "Continuing as a guest. Demo: checkout is not connected, so the booking stops here." : "No problem. Your trip stays open in this tab while you keep looking.");
  }

  // Keep keyboard focus inside an open sheet and restore it on close.
  useEffect(() => {
    if (!login && !details) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = workspaceRef.current?.querySelector<HTMLElement>('[role="dialog"]');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => dialog?.querySelector<HTMLElement>('button, a[href]')?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (login) setLogin(null); else setDetails(null); }
      if (e.key !== "Tab" || !dialog) return;
      const elements = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, [tabindex="0"]'));
      const first = elements[0], last = elements[elements.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("keydown", onKey); document.body.style.overflow = previousOverflow; previous?.focus(); };
  }, [login, details]);

  useEffect(() => {
    if (tab === "results" && result && !searching && window.innerWidth <= 900) {
      resultsRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    }
  }, [tab, result, searching, sideView]);

  const tripTotal = (picked.flight?.priceGBP ?? 0) + (picked.stay ? picked.stay.pricePerNightGBP * picked.stay.nights : 0);

  const q = result?.query;
  const destCity = q ? cityForPlace(q.to.code)?.city ?? q.to.code : "";
  const tripLabel = q?.onward ? "Multi-city" : q?.tripType === "return" ? "Return" : "One way";
  const clock = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;
  const expired = secondsLeft === 0;
  const suggestions = kind === "stays" && stays.length
    ? [`Show hotels under ${format(stays[Math.min(3,stays.length-1)].pricePerNightGBP*stays[0].nights)} total`, "Show me 5-star hotels only", "Show hotels with free cancellation", "Clear hotel filters"]
    : picked.flight || picked.stay
    ? ["Show all", "Direct flights only"]
    : result && flights.length > 0
    ? ["Evening departures", `Show me flights under ${format(Math.ceil((flights[Math.min(5, flights.length - 1)].priceGBP * 1.2) / 5) * 5)}`, "Direct flights only", "Show all"]
    : [];

  const activeHotelQuery = hotelQuery;
  const visibleStays = activeHotelQuery ? filterStays(stays,activeHotelQuery,stayFilters) : stays;

  return (
    <div className={`${ui.workspace} chat-col`} ref={workspaceRef} data-cart={Boolean(picked.flight || picked.stay)}>
      <div className="view-tabs" role="tablist" aria-label="Chat or results">
        <button type="button" role="tab" aria-selected={tab === "chat"} onClick={() => setTab("chat")}>
          Chat
        </button>
        <button type="button" role="tab" aria-selected={tab === "results"} onClick={() => { setSideView("results"); setTab("results"); }}>
          {result || searching ? "Results" : "Trip options"}
        </button>
      </div>

      <div className="chat-workspace" data-expanded={tab === "results"} data-view={tab} data-has-trip={Boolean(picked.flight || picked.stay)}>
        <section className="chat-pane" aria-label="Chat">
          <header className="pane-head">
            <div><h1>{result?.title ?? "New trip"}</h1></div>

          </header>

          <div className="chat-transcript" ref={transcriptRef} role="log" aria-live="polite" aria-relevant="additions">
            {messages.length === 0 && !searching && (
              <div className="chat-welcome"><h2>One conversation.<br/>Your next journey.</h2><p>Tell me where you want to go, when you’d like to leave, or what you have in mind.</p></div>
            )}

            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="bubble user">
                  {m.text}
                </div>
              ) : m.ideas ? (
                <div key={m.id} className="ai-block">
                  <div className="bubble ai">{m.text}</div>
                  <div className="ideas">
                    {m.ideas.map((idea) => (
                      <article key={idea.code} className="idea">
                        <span className="idea-code" aria-hidden="true">
                          {idea.code}
                          <img src={DESTINATION_PHOTOS[idea.code] ?? HERO_POSTER} alt="" loading="lazy"
                            onError={(event) => { event.currentTarget.hidden = true; }} />
                        </span>
                        <div className="idea-copy">
                          <strong>{idea.city}</strong>
                          <small>{idea.line}</small>
                          <small className="idea-dates"><CalendarIcon size={13} /> {fmtShort(idea.out)} – {fmtShort(idea.back)}</small>
                          <div className="idea-action">
                            <span><b>{format(idea.fromGBP)}</b> return</span>
                            <button type="button" className="btn-dark sm" onClick={() => send(idea.prompt)}>
                              Plan this <FlyIcon />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : m.toResults ? (
                <button key={m.id} type="button" className="bubble ai as-link" onClick={() => { setSideView("results"); setTab("results"); }}>
                  {m.text} <FlyIcon />
                </button>
              ) : (
                <div key={m.id} className="bubble ai">
                  {m.text}
                </div>
              ),
            )}

            {!searching && result && flights.length > 0 && <div className="conversation-flights" ref={shortlistRef}>
              <div className="conversation-results-heading"><p>{flights.length} sample options · {q && travellersText(q)} · prices include taxes</p></div>
              {flights.slice(0,4).map((f) => <article key={f.id} className="inline-flight">
                <div className="inline-airline"><span>{f.flightNo.slice(0,2)}</span><strong>{f.airline}</strong><small>{f.cabin}</small></div>
                <div className="inline-route"><div><small>{f.fromCode}</small><strong>{f.depTime}</strong></div><span><small>{fmtDuration(f.durationMin)}</small><i/><small>{f.stops ? "1 stop" : "Direct"}</small></span><div><small>{f.toCode}</small><strong>{f.arrTime}</strong></div></div>
                <div className="inline-fare"><div><small>{fmtShort(f.depDate)} · {q && travellersText(q)}</small><strong>{format(f.priceGBP)} <small>trip total</small></strong></div><button className="btn-dark sm" type="button" disabled={expired} onClick={() => selectFlight(f)}>{expired ? "Expired" : picked.flight?.id === f.id ? "Remove" : "Add to cart"}<FlyIcon/></button></div>
              </article>)}
              <button type="button" className="btn-outline see-all-flights" onClick={() => {setSideView("results");setTab("results"); setShown(flights.length);}}>See all {flights.length} flights <FlyIcon/></button>
            </div>}
            {!searching && result && flights.length === 0 && result.query.kind !== "hotel" && <div className="bubble ai">No flights match the current filters. <button type="button" className="link-btn" onClick={() => setFlights(result.flights)}>Clear filters</button></div>}
            {!searching && !result && <div className="conversation-starters">{TRIP_STARTERS.map(({label,icon,prompt}) => <button type="button" key={label} onClick={() => startDraft(prompt)}>{icon}{label}</button>)}</div>}

            {searching && (
              <div className="searching" role="status">
                <small>mylz</small>
                <strong>{step >= SEARCH_STEPS.length - 1 ? "Almost there…" : "Searching…"}</strong>
                <ul>
                  {SEARCH_STEPS.map((s, i) => (
                    <li key={s} className={i < step ? "done" : i === step ? "now" : ""}>
                      {s}
                    </li>
                  ))}
                </ul>
                <p>You can keep typing — I&apos;ll answer in order.</p>
              </div>
            )}

            {queue.map((text, i) => (
              <div key={`${i}-${text}`} className="bubble user is-queued">
                {text}
              </div>
            ))}

            {!searching && suggestions.length > 0 && (
              <div className="suggest">

                <div>
                  {suggestions.map((s) => (
                    <button key={s} type="button" className="chip" onClick={() => send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <form className="chat-form" onSubmit={onSubmit}>
            {searching && <small className="composer-note">Chat is waiting on a search · new messages are sent in order</small>}
            <div>
              <label className="sr-only" htmlFor="chat-input">
                Message mylz
              </label>
              <input
                ref={composerRef}
                id="chat-input"
                type="text"
                autoComplete="off"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  searching
                    ? "Type a follow-up — it will queue"
                    : result && q
                      ? `${kind === "stays" ? `Filter stays in ${hotelQuery ? stayCityName(hotelQuery) : destCity}: stars, breakfast, price…` : `Filter flights to ${q.to.code}: direct, times, airlines, price…`}`
                      : "Ask anything about your trip"
                }
              />
              {speech.supported && (
                <button className="mic" type="button" aria-label="Record a message" aria-pressed={speech.listening} onClick={speech.toggle}>
                  <MicIcon />
                </button>
              )}
              <button className="go" type="submit" aria-label="Send" disabled={!draft.trim()}>
                <FlyIcon />
              </button>
            </div>
          </form>
        </section>

        <section className="results-pane" aria-label="Results and cart" ref={resultsRef} tabIndex={-1}>
          <div className="side-panel-header"><div className="side-panel-nav" role="group" aria-label="Results panel view"><button type="button" aria-pressed={sideView === "results"} onClick={() => setSideView("results")}>All results</button><button type="button" aria-pressed={sideView === "cart"} onClick={() => setSideView("cart")}>Cart <span>{[picked.flight,picked.stay].filter(Boolean).length}</span></button></div><button type="button" className="side-panel-close" aria-label="Close side panel" onClick={() => setTab("chat")}><CloseIcon size={16}/></button></div>
          {sideView === "cart" ? (<section className="selection-cart" aria-label="Selected trip items">
        <h2 className="side-cart-title">Your cart</h2>
        <div className="cart-items">
          {picked.flight && <div className="cart-item"><span className="cart-item-icon"><FlyIcon/></span><div><small>FLIGHT</small><strong>{picked.flight.fromCode} → {picked.flight.toCode}</strong><span>{picked.flight.airline} · {fmtShort(picked.flight.depDate)}</span></div><button type="button" className="cart-remove" aria-label="Remove flight from cart" onClick={() => setPicked(p=>({...p,flight:undefined}))}><CloseIcon size={15}/></button></div>}
          {picked.stay && <div className="cart-item"><span className="cart-item-icon"><BedIcon size={18}/></span><div><small>STAY</small><strong>{picked.stay.name}</strong><span>{picked.stay.booking ? `${picked.stay.booking.roomName} · ${picked.stay.booking.rateName} · ` : ""}{picked.stay.nights} nights · {hotelQuery ? stayCityName(hotelQuery) : destCity}</span></div><button type="button" className="cart-remove" aria-label="Remove stay from cart" onClick={() => setPicked(p=>({...p,stay:undefined}))}><CloseIcon size={15}/></button></div>}
        </div>
        {(picked.flight || picked.stay) ? <div className="cart-checkout"><div aria-live="polite"><small>Estimated total</small><strong>{format(tripTotal)}</strong></div><button type="button" className="btn-dark" disabled={Boolean(picked.flight) && expired} onClick={goToCheckout}>Go to Checkout <FlyIcon/></button></div> : <div className="cart-empty"><p>Your cart is empty.</p><button type="button" className="btn-outline sm" onClick={() => setSideView("results")}>Browse results</button></div>}
        {picked.stay?.booking && <p className="cart-local-tax">Estimated {format(picked.stay.booking.cityTaxGBP)} city tax paid at the hotel.</p>}
        {picked.flight && expired && <p className="cart-expired">Refresh flight results to continue.</p>}
      </section>) : <>


          {searching && (
            <div className="results-loading" role="status">
              <header className="pane-head"><small>Results · searching</small><h2>Finding trip options…</h2></header>
              <progress max={SEARCH_STEPS.length} value={step + 1} aria-label="Search progress" />
              {[0, 1, 2].map((item) => <div className="result-skeleton" key={item} aria-hidden="true"><i /><i /></div>)}
            </div>
          )}
          {!searching && !result && (
            <div className="chat-discover">
              <div className="chat-planner-banner">
                <img src="/images/chat/flight-at-sunset.webp" alt="" />
                <div>
                  <h2>Plan your next trip with <em>mylz</em></h2>
                  <p>Find flights, stays, and trip ideas in one conversation.</p>
                </div>
              </div>
              <div className="chat-options-heading">
                <h2>Your trip options</h2>
              </div>
              <div className="chat-starters">
                {TRIP_STARTERS.map(({ label, icon, prompt }) => (
                  <button type="button" key={label} onClick={() => startDraft(prompt)}>
                    <span className="chat-heading-icon" aria-hidden="true">{icon}</span>
                    <strong>{label}</strong>
                  </button>
                ))}
              </div>
              <div className="chat-destination-ideas">
                <h3>Destination ideas</h3>
                <div>
                  {DESTINATION_STARTERS.map(({ code, label, detail, prompt }) => (
                    <button type="button" key={code} onClick={() => startDraft(prompt)}>
                      <img src={DESTINATION_PHOTOS[code] ?? HERO_POSTER} alt="" loading="lazy"
                        onError={(event) => { event.currentTarget.hidden = true; }} />
                      <span className="destination-idea-copy">
                        <span><strong>{label}</strong><small>{detail}</small></span>
                        <span className="destination-idea-action">Plan <FlyIcon /></span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!searching && result && q && (
            <>
              <header className="pane-head trip-results-heading">
                <div>

                  <h2>{kind === "flights" ? q.onward ? `Flights via ${q.to.code} to ${q.onward.to.code}` : `Flights to ${q.to.code} · ${tripLabel.toLowerCase()}` : `Stays in ${hotelQuery ? stayCityName(hotelQuery) : destCity}`}</h2>
                </div>
                <img src={DESTINATION_PHOTOS[cityForPlace(q.to.code)?.code ?? ""] ?? HERO_POSTER} alt=""
                  onError={(event) => {
                    if (!event.currentTarget.src.endsWith(HERO_POSTER)) event.currentTarget.src = HERO_POSTER;
                  }}
                />
              </header>

              <div className="kind-tabs" role="tablist" aria-label="Flights or stays">
                <button type="button" role="tab" aria-selected={kind === "flights"} disabled={result.flights.length === 0} onClick={() => setKind("flights")}>
                  Flights <b>{result.flights.length > 0 ? flights.length : "—"}</b>
                </button>
                <button type="button" role="tab" aria-selected={kind === "stays"} onClick={openStays}>
                  Stays <b>{hotelQuery ? visibleStays.length : "—"}</b>
                </button>
              </div>

              <div className="results-meta">
                <p>
                  {kind === "flights" ? `We found (${flights.length}) flights for your trip.` : hotelQuery ? `Explore ${visibleStays.length} stay${visibleStays.length===1?"":"s"} for your destination.` : "Enter your hotel dates to see available stays."}
                  <span>
                    {kind === "flights" ? `${q.cabin} · ${travellersText(q)} · ${tripLabel}` : hotelQuery ? `${travellersText(hotelQuery)} · ${fmtShort(hotelQuery.date)} to ${fmtShort(hotelQuery.returnDate!)}` : "Hotel dates haven’t been selected."}
                  </span>
                </p>
                <small className="expires">{kind === "stays" ? "Sample stays" : expired ? "Sample results expired" : `Sample results · ${clock}`}</small>
              </div>

              <div className="workspace-filters">
                <span>{kind === "flights" ? `${q.cabin} · ${travellersText(q)}` : `Hotels in ${hotelQuery ? stayCityName(hotelQuery) : destCity}`}</span>
                {kind === "flights" && <button type="button" onClick={() => { setFlights(result.flights); setShown(PAGE); }}>Clear filters</button>}
                {expired && kind === "flights" && <button type="button" onClick={() => void search("Refresh these trip options", q)}>Refresh results</button>}
              </div>
              {kind === "flights" && flights.length === 0 && <div className="workspace-empty"><h3>No flights match these filters.</h3><p>Try removing a filter to see more options.</p><button type="button" className="btn-outline sm" onClick={() => setFlights(result.flights)}>Show all flights</button></div>}

              {kind === "flights" &&
                flights.map((f) => (
                  <article key={f.id} className={`clean-flight${picked.flight?.id === f.id ? " is-picked" : ""}`}>
                    <div className="clean-flight-heading"><span className="airline-monogram" aria-hidden="true">{f.flightNo.slice(0,2)}</span><strong>{f.airline}</strong><small>{f.cabin} · {fmtShort(f.depDate)}</small></div>
                    <div className="clean-flight-body"><div className="clean-route"><div><strong>{f.depTime}</strong><small>{f.fromCode}</small></div><span><small>{fmtDuration(f.durationMin)}</small><i/><small>{f.stops ? "1 stop" : "Nonstop"}</small></span><div><strong>{f.arrTime}</strong><small>{f.toCode}{f.arrDate!==f.depDate ? " · +1 day" : ""}</small></div></div><div className="clean-price"><strong>{format(f.priceGBP)}</strong><small>Trip total</small></div></div>
                    {f.onward && <small className="clean-onward">Then {f.onward.fromCode} → {f.onward.toCode} · {fmtShort(f.onward.depDate)}</small>}
                    <div className="clean-flight-actions"><button type="button" className="link-btn" onClick={()=>setDetails(f)}>See details <ChevronRightIcon/></button><button type="button" className="btn-dark sm" disabled={expired} onClick={()=>selectFlight(f)}>{expired ? "Expired" : picked.flight?.id===f.id ? "Remove" : "Add to cart"}</button></div>
                  </article>
                ))}



              {kind === "stays" && !hotelQuery && <div className="workspace-empty hotel-dates-needed"><h3>When would you like to stay?</h3><p>Tell Mylz your check-in date and checkout date or number of nights. We’ll keep your flight search unchanged.</p><button type="button" className="btn-outline sm" onClick={()=>{openStays();composerRef.current?.focus();}}>Enter dates in chat</button></div>}
              {kind === "stays" && hotelQuery && <div className="hotel-filter-bar"><button className="btn-outline sm" type="button" aria-expanded={stayFiltersOpen} onClick={()=>setStayFiltersOpen(!stayFiltersOpen)}>Filters {Object.values(stayFilters).filter(Boolean).length || ""}</button>{Object.values(stayFilters).some(Boolean)&&<button type="button" className="link-btn" onClick={()=>setStayFilters({})}>Clear filters</button>}</div>}
              {kind === "stays" && hotelQuery && stayFiltersOpen && <div className="hotel-filter-inputs"><label>Stars<select value={stayFilters.stars??""} onChange={e=>setStayFilters(f=>({...f,stars:Number(e.target.value)||undefined}))}><option value="">Any rating</option>{[3,4,5].map(n=><option key={n} value={n}>{n} stars</option>)}</select></label><label>Max total ({format(0).replace(/[\d.,\s]/g,"")})<input type="number" min="1" value={stayFilters.maxTotal?Math.round(stayFilters.maxTotal*rate):""} onChange={e=>setStayFilters(f=>({...f,maxTotal:e.target.value?Number(e.target.value)/rate:undefined}))}/></label><label><input type="checkbox" checked={stayFilters.breakfast??false} onChange={e=>setStayFilters(f=>({...f,breakfast:e.target.checked}))}/>Breakfast available</label><label><input type="checkbox" checked={stayFilters.freeCancellation??false} onChange={e=>setStayFilters(f=>({...f,freeCancellation:e.target.checked}))}/>Free cancellation</label></div>}
              {kind === "stays" && hotelQuery && <div className="stay-view-toolbar"><span>Change location in chat — your flights stay saved.</span><div role="group" aria-label="Hotel view"><button type="button" aria-pressed={stayView === "list"} onClick={() => setStayView("list")}>List</button><button type="button" aria-pressed={stayView === "map"} onClick={() => setStayView("map")}>Map</button></div></div>}
              {kind === "stays" && stayView === "map" && hotelQuery && <StayMap stays={visibleStays} query={hotelQuery} format={format} onSelect={selectStay} onDetails={stay=>setStayDetails({stay,view:"details"})} selectedId={picked.stay?.id}/>}
              {kind === "stays" && stayView === "list" && activeHotelQuery && visibleStays.map(stay => <StayCard key={stay.id} stay={stay} query={activeHotelQuery} format={format} selected={picked.stay?.id === stay.id} onDetails={()=>setStayDetails({stay,view:"details"})} onRooms={()=>selectStay(stay)}/>)}
              {kind === "stays" && hotelQuery && !visibleStays.length && <div className="workspace-empty"><h3>No stays match.</h3><p>Try fewer filters or a higher budget.</p><button type="button" className="btn-outline sm" onClick={()=>setStayFilters({})}>Clear hotel filters</button></div>}

            </>
          )}


          </>}
        </section>


      </div>


      {stayDetails && activeHotelQuery && <StayDetails key={`${stayDetails.stay.id}-${stayDetails.view}`} stay={stayDetails.stay} query={activeHotelQuery} format={format} initialView={stayDetails.view} onClose={()=>setStayDetails(null)} onBook={confirmStay}/>}

      {details && q && (
        <div className="sheet-backdrop" data-details="true" onMouseDown={(e) => e.target === e.currentTarget && setDetails(null)}>
          <div className="sheet details" role="dialog" aria-modal="true" aria-label="Flight details" tabIndex={-1}>
            <button type="button" className="link-btn" onClick={() => setDetails(null)}>
              <ChevronLeftIcon /> Back to results
            </button>
            <h2>Flight details</h2>
            <p className="details-sub">
              {details.fromCity} → {details.toCity} · {fmtShort(details.depDate)} · {tripLabel}, {details.cabin} · {travellersText(q)}
            </p>
            <div className="details-overview"><span>{details.airline} · {details.flightNo}</span><strong>{details.stops === 0 ? "Nonstop" : "1 stop"} · {fmtDuration(details.durationMin)}</strong></div>
            <div className="segment">
              <div>
                <strong>{details.depTime}</strong>
                <span>{details.fromCode} ({details.fromCity})</span>
                <small>{fmtLong(details.depDate)}</small>
              </div>
              <div className="segment-mid">
                <small>{fmtDuration(details.durationMin)} total · {details.stops === 0 ? "Direct" : "1 stop"}</small>
                <small>{details.flightNo} · {details.airline}</small>
              </div>
              <div>
                <strong>{details.arrTime}</strong>
                <span>{details.toCode} ({details.toCity})</span>
                <small>{fmtLong(details.arrDate)}</small>
              </div>
            </div>
            {details.onward && <p className="details-sub">Onward flight {details.onward.flightNo} · {details.onward.fromCode} → {details.onward.toCode} · {fmtLong(details.onward.depDate)} · {details.onward.depTime}–{details.onward.arrTime} · {details.onward.airline}</p>}
            {q.tripType === "return" && q.returnDate && <p className="details-sub">Return on {fmtLong(q.returnDate)} is included in this price.</p>}
            <div className="details-essentials"><span><BagIcon size={15}/>{details.carryOn} cabin bag(s)</span><span><SuitcaseIcon size={15}/>{details.checked} checked bag(s)</span></div>
            <details className="details-more"><summary>Read More</summary><div>
              <dl><div><dt>Changes</dt><dd>{details.changeFeeGBP === null ? "Not allowed" : `${format(details.changeFeeGBP)} fee + fare difference`}</dd></div><div><dt>Refunds</dt><dd>{details.refundable ? "Allowed under fare conditions" : "Not allowed"}</dd></div><div><dt>Estimated emissions</dt><dd>{details.co2Kg} kg CO₂e</dd></div></dl>
              <p>Sample fare. Verify the airline’s terms before a real booking. No payment is taken in this preview.</p>
            </div></details>
            <div className="details-foot">
              <div>
                <strong className="price">{format(details.priceGBP)}</strong>
                <small>{tripLabel.toLowerCase()} · {travellersText(q)} · incl. taxes</small>
              </div>
              <button type="button" className="btn-outline sm" onClick={() => setDetails(null)}>
                Close
              </button>
              <button type="button" className="btn-dark sm btn-fly" disabled={expired} onClick={() => selectFlight(details)}>
                {picked.flight?.id === details.id ? "Remove from cart" : "Add to cart"}
                <FlyIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {login && (
        <div className="sheet-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setLogin(null)}>
          <div className="sheet login" role="dialog" aria-modal="true" aria-labelledby="login-title">
            <button type="button" className="sheet-close" aria-label="Close" onClick={() => setLogin(null)}>
              <CloseIcon size={18} />
            </button>
            <h2 id="login-title">{login === "book" ? "Your next journey, ready to review." : "Keep your journey close."}</h2>
            <p>{login === "book" ? "These are sample fares. Continue to live Mylz to search current availability and complete a real booking." : "Sign in on live Mylz to keep your trip details handy."}</p>
            <a className="btn-outline" href="https://gomylz.com/">Open live Mylz to sign in</a>
            <button type="button" className="btn-dark sm guest" onClick={continueAsGuest}>
              Continue as guest
            </button>
            <small>Preview search uses sample inventory.</small>
          </div>
        </div>
      )}
    </div>
  );
}
