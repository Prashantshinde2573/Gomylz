"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrency } from "@/components/CurrencyProvider";
import { ArrowRightIcon, BagIcon, CalendarXIcon, CloseIcon, FlyIcon, MicIcon, SuitcaseIcon, SwapIcon } from "@/components/Icons";
import { useSpeech } from "@/components/useSpeech";
import { cityForPlace } from "@/lib/airports";
import { fmtDuration, fmtLong, fmtShort, toISO } from "@/lib/dates";
import { applyFollowUp, type Flight, type Idea, type SearchResult, type Stay, type TripQuery, travellersText } from "@/lib/demo";
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

export function ChatClient({ id }: { id: string }) {
  const { format, rate, home } = useCurrency();

  const [tab, setTab] = useState<"chat" | "results">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [result, setResult] = useState<Found | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searching, setSearching] = useState(false);
  const [step, setStep] = useState(0);
  const [queue, setQueue] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [kind, setKind] = useState<"flights" | "stays">("flights");
  const [shown, setShown] = useState(PAGE);
  const [details, setDetails] = useState<Flight | null>(null);
  const [picked, setPicked] = useState<{ flight?: Flight; stay?: Stay }>({});
  const [login, setLogin] = useState<null | "entry" | "save" | "book">(null);
  const [secondsLeft, setSecondsLeft] = useState(HOLD_SECONDS);

  const nextId = useRef(1);
  const started = useRef(false);
  const offeredLogin = useRef(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const speech = useSpeech(setDraft);

  const say = useCallback((role: Message["role"], text: string, toResults = false, ideas?: Idea[]) => {
    setMessages((m) => [...m, { id: nextId.current++, role, text, ...(role === "mylz" ? { toResults, ideas } : {}) } as Message]);
  }, []);

  /** A new search: from the homepage, or a follow-up that names a new trip. */
  const search = useCallback(
    async (prompt: string, query: TripQuery | null) => {
      if (!offeredLogin.current) {
        offeredLogin.current = true;
        setLogin("entry");
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
        setFlights(data.flights);
        setShown(PAGE);
        setPicked({});
        setSecondsLeft(HOLD_SECONDS);
        const hasFlights = data.flights.length > 0;
        setKind(hasFlights ? "flights" : "stays");
        const parts = [];
        if (hasFlights) parts.push(`${data.flights.length} flights to ${data.query.to.code}`);
        if (data.stays.length > 0) parts.push(`${data.stays.length} stays`);
        say("mylz", `${parts.join(" and ")} · in Results`, true);
        setTab("results");
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
      if (result && flights.length > 0) {
        const out = applyFollowUp(text, result.flights, flights, rate);
        if (out.handled) {
          setFlights(out.flights);
          setShown(PAGE);
          setKind("flights");
          say("mylz", out.reply, true);
          return;
        }
        // Not a filter: treat it as a new ask (a trip, or an open question that gets priced ideas).
      }
      await search(text, null);
    },
    [flights, rate, result, say, search],
  );

  // First ask, carried over from the homepage.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const seed = readChatSeed(id);
    if (!seed?.prompt) return;
    say("user", seed.prompt);
    void search(seed.prompt, seed.query);
  }, [id, say, search]);

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
  }, [messages, searching, tab]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    if (searching) setQueue((q) => [...q, text]);
    else void handle(text);
  }

  function send(text: string) {
    setTab("chat");
    if (searching) setQueue((q) => [...q, text]);
    else void handle(text);
  }

  // Selecting an option keeps the visitor in the workspace.
  function selectFlight(f: Flight) {
    setPicked((p) => ({ ...p, flight: f }));
    setDetails(null);
  }

  function selectStay(s: Stay) {
    setPicked((p) => ({ ...p, stay: s }));
  }

  function continueAsGuest() {
    const wasBooking = login === "book";
    setLogin(null);
    if (login === "entry") return;
    setTab("chat");
    say("mylz", wasBooking ? "Continuing as a guest. Demo: checkout is not connected, so the booking stops here." : "No problem. Your trip stays open in this tab while you keep looking.");
  }

  // Esc closes whichever dialog is open.
  useEffect(() => {
    if (!login && !details) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (login) setLogin(null);
      else setDetails(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [login, details]);

  const tripTotal = (picked.flight?.priceGBP ?? 0) + (picked.stay ? picked.stay.pricePerNightGBP * picked.stay.nights : 0);

  const q = result?.query;
  const destCity = q ? cityForPlace(q.to.code)?.city ?? q.to.code : "";
  const tripLabel = q?.tripType === "return" ? "Return" : "One way";
  const clock = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;
  const suggestions = result && flights.length > 0
    ? ["Evening departures", `Show me flights under ${format(Math.ceil((flights[Math.min(5, flights.length - 1)].priceGBP * 1.2) / 5) * 5)}`, "Direct flights only", "Show all"]
    : [];

  return (
    <div className="chat-col">
      <div className="view-tabs" role="tablist" aria-label="Chat or results">
        <button type="button" role="tab" aria-selected={tab === "chat"} onClick={() => setTab("chat")}>
          Chat
        </button>
        <button type="button" role="tab" aria-selected={tab === "results"} onClick={() => setTab("results")} disabled={!result && !searching}>
          Results
        </button>
      </div>

      <p className="chat-note">Demo: airlines, fares and stays here are sample data, and nothing is booked.</p>

      <div className="chat-workspace" data-view={tab}>
        <section className="chat-pane" aria-label="Chat">
          <header className="pane-head">
            <small>Chat</small>
            <h1>{result?.title ?? "New trip"}</h1>
          </header>

          <div className="chat-transcript" ref={transcriptRef}>
            {messages.length === 0 && !searching && (
              <div className="bubble ai">Where do you want to go? Try “Lisbon for a long weekend, two of us”.</div>
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
                        <span className="idea-code" aria-hidden="true">{idea.code}</span>
                        <div>
                          <strong>{idea.city}</strong>
                          <small>{idea.line}</small>
                        </div>
                        <p>
                          from <b>{format(idea.fromGBP)}</b> return
                          <small>{fmtShort(idea.out)} – {fmtShort(idea.back)}</small>
                        </p>
                        <button type="button" className="btn-accent sm btn-fly" onClick={() => send(idea.prompt)}>
                          Plan this
                          <FlyIcon size={16} />
                        </button>
                      </article>
                    ))}
                  </div>
                </div>
              ) : m.toResults ? (
                <button key={m.id} type="button" className="bubble ai as-link" onClick={() => setTab("results")}>
                  {m.text} <ArrowRightIcon size={14} />
                </button>
              ) : (
                <div key={m.id} className="bubble ai">
                  {m.text}
                </div>
              ),
            )}

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
                <small>Suggestions · tap to send</small>
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
                id="chat-input"
                type="text"
                autoComplete="off"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  searching
                    ? "Type a follow-up — it will queue"
                    : result && q
                      ? `Filter flights to ${q.to.code}: direct, times, airlines, price...`
                      : "Ask anything about your trip"
                }
              />
              {speech.supported && (
                <button className="mic" type="button" aria-label="Record a message" aria-pressed={speech.listening} onClick={speech.toggle}>
                  <MicIcon />
                </button>
              )}
              <button className="go" type="submit" aria-label="Send">
                <ArrowRightIcon />
              </button>
            </div>
          </form>
        </section>

        <section className="results-pane" aria-label="Results">
          {searching && (
            <div className="results-loading" role="status">
              <header className="pane-head"><small>Results · searching</small><h2>Finding trip options…</h2></header>
              <progress max={SEARCH_STEPS.length} value={step + 1} aria-label="Search progress" />
              {[0, 1, 2].map((item) => <div className="result-skeleton" key={item} aria-hidden="true"><i /><i /></div>)}
            </div>
          )}
          {!searching && !result && (
            <div className="results-empty">
              <FlyIcon size={28} />
              <h2>Your trip options</h2>
              <p>Ask mylz for a trip to see flights and stays here.</p>
            </div>
          )}
          {!searching && result && q && (
            <>
              <header className="pane-head">
                <small>Results · latest ask</small>
                <h2>
                  {kind === "flights" ? `Flights to ${q.to.code} · ${tripLabel.toLowerCase()}` : `Stays in ${destCity}`}
                </h2>
              </header>

              <div className="kind-tabs" role="tablist" aria-label="Flights or stays">
                <button type="button" role="tab" aria-selected={kind === "flights"} disabled={result.flights.length === 0} onClick={() => setKind("flights")}>
                  Flights <b>{result.flights.length > 0 ? flights.length : "—"}</b>
                </button>
                <button type="button" role="tab" aria-selected={kind === "stays"} disabled={result.stays.length === 0} onClick={() => setKind("stays")}>
                  Stays <b>{result.stays.length > 0 ? result.stays.length : "—"}</b>
                </button>
              </div>

              <div className="results-meta">
                <p>
                  {kind === "flights" ? `We found (${flights.length}) flights for your trip.` : `We found (${result.stays.length}) stays for your trip.`}
                  <span>
                    {kind === "flights" ? `${q.cabin} · ${travellersText(q)} · ${tripLabel}` : `${travellersText(q)} · ${fmtShort(q.date)} to ${fmtShort(q.returnDate ?? q.date)}`}
                  </span>
                </p>
                <small className="expires">Demo results · {clock} remaining</small>
              </div>

              {kind === "flights" &&
                flights.slice(0, shown).map((f) => (
                  <article key={f.id} className={`flight${picked.flight?.id === f.id ? " is-picked" : ""}`}>
                    <div className="flight-top">
                      <span className="airline">
                        <i aria-hidden="true">{f.flightNo.slice(0, 2)}</i>
                        <strong>{f.airline}</strong> {f.cabin}
                      </span>
                      <span className="fare-icons">
                        <span title={`Carry-on bags: ${f.carryOn}`}><BagIcon /> ×{f.carryOn}</span>
                        <span title={`Checked bags: ${f.checked}`}><SuitcaseIcon /> ×{f.checked}</span>
                        <span title={f.changeFeeGBP === null ? "Changes: not allowed" : `Changes: allowed with a ${format(f.changeFeeGBP)} fee`} className={f.changeFeeGBP === null ? "off" : ""}><SwapIcon /></span>
                        <span title={f.refundable ? "Cancellation: refundable" : "Cancellation: non-refundable"} className={f.refundable ? "" : "off"}><CalendarXIcon /></span>
                      </span>
                    </div>
                    <div className="flight-times">
                      <div>
                        <small>{fmtShort(f.depDate)}</small>
                        <strong>{f.depTime}</strong>
                        <small>{f.fromCode}</small>
                      </div>
                      <div className="flight-line">
                        <small>{fmtDuration(f.durationMin)}</small>
                        <i aria-hidden="true" />
                        <small className="stops">{f.stops === 0 ? "Direct" : "1 stop"}</small>
                      </div>
                      <div className="arr">
                        <small>{fmtShort(f.arrDate)}</small>
                        <strong>{f.arrTime}</strong>
                        <small>{f.toCode}</small>
                      </div>
                    </div>
                    <div className="flight-foot">
                      <strong className="price">{format(f.priceGBP)}</strong>
                      <button type="button" className="link-btn" onClick={() => setDetails(f)}>
                        See details ›
                      </button>
                      <button type="button" className="btn-dark sm" onClick={() => selectFlight(f)}>
                        {picked.flight?.id === f.id ? "Selected" : "Select"}
                      </button>
                    </div>
                  </article>
                ))}

              {kind === "flights" && flights.length > shown && (
                <button type="button" className="more" onClick={() => setShown((n) => n + 12)}>
                  See {flights.length - shown} more flight options
                </button>
              )}

              {kind === "stays" &&
                result.stays.map((s) => (
                  <article key={s.id} className={`flight stay${picked.stay?.id === s.id ? " is-picked" : ""}`}>
                    <div className="flight-top">
                      <span className="airline">
                        <strong>{s.name}</strong>
                      </span>
                      <span className="fare-icons">{s.type} · {s.area}</span>
                    </div>
                    <p className="stay-perks">{s.perks} · {s.nights} {s.nights === 1 ? "night" : "nights"}</p>
                    <div className="flight-foot">
                      <strong className="price">
                        {format(s.pricePerNightGBP * s.nights)} <small>{format(s.pricePerNightGBP)} per night</small>
                      </strong>
                      <button type="button" className="btn-dark sm" onClick={() => selectStay(s)}>
                        {picked.stay?.id === s.id ? "Selected" : "Select"}
                      </button>
                    </div>
                  </article>
                ))}
            </>
          )}

          {!searching && (picked.flight || picked.stay) && (
            <div className="trip-bar" role="status">
              <div>
                <small>Your trip</small>
                <strong>
                  {[picked.flight && `${picked.flight.fromCode} → ${picked.flight.toCode}`, picked.stay?.name].filter(Boolean).join(" + ")} · {format(tripTotal)}
                </strong>
              </div>
              <button type="button" className="btn-ghost sm on-dark" onClick={() => setLogin("save")}>
                Save trip
              </button>
              <button type="button" className="btn-accent sm btn-fly" onClick={() => setLogin("book")}>
                Book
                <FlyIcon size={16} />
              </button>
            </div>
          )}

        </section>
      </div>

      {details && q && (
        <div className="sheet-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setDetails(null)}>
          <div className="sheet details" role="dialog" aria-modal="true" aria-label="Flight details">
            <button type="button" className="link-btn" onClick={() => setDetails(null)}>
              ‹ Back to results
            </button>
            <h2>Flight details</h2>
            <p className="details-sub">
              {details.fromCity} → {details.toCity} · {fmtShort(details.depDate)} · {tripLabel}, {details.cabin} · {travellersText(q)}
            </p>
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
            {q.tripType === "return" && q.returnDate && <p className="details-sub">Return on {fmtLong(q.returnDate)} is included in this price.</p>}
            <small className="included-title">Included in this ticket</small>
            <ul className="included">
              <li>{details.carryOn} Carry-on bag</li>
              <li>{details.checked} Checked bag</li>
              <li>Emissions estimate {details.co2Kg} kg CO₂e</li>
              <li>{details.changeFeeGBP === null ? "Changes not allowed" : `Changes allowed · ${format(details.changeFeeGBP)} fee`}</li>
              <li>{details.refundable ? "Refunds allowed" : "Refunds not allowed"}</li>
            </ul>
            <p className="policy">
              The airline&apos;s conditions apply to changes and cancellations. The displayed fare is an example.
            </p>
            <div className="details-foot">
              <div>
                <strong className="price">{format(details.priceGBP)}</strong>
                <small>{tripLabel.toLowerCase()} · {travellersText(q)} · incl. taxes</small>
              </div>
              <button type="button" className="btn-ghost sm" onClick={() => setDetails(null)}>
                Close
              </button>
              <button type="button" className="btn-accent sm btn-fly" onClick={() => selectFlight(details)}>
                Select flight
                <FlyIcon size={16} />
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
            <h2 id="login-title">Don&apos;t lose your trip</h2>
            <p>{login === "book" ? "Sign in on live Mylz to continue toward booking." : "Sign in on live Mylz to keep your trip details handy."}</p>
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
