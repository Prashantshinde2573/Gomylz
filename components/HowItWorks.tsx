import { ArrowRightIcon, CheckIcon, FlyIcon, MicIcon } from "./Icons";

// Card photos from Unsplash (free licence), loaded from Unsplash's CDN. The video frames in
// /public/images/how sit underneath as a fallback if the CDN is unreachable.
//   1. https://unsplash.com/photos/sXeV4NySLWc  traveller at an airport window
//   2. https://unsplash.com/photos/rf6ywHVkrlY  wing above the clouds
//   3. https://unsplash.com/photos/D1yT791Nf9A  pool and palm trees
const photo = (id: string, fallback: string) =>
  `url(https://images.unsplash.com/${id}?w=1000&h=1000&fit=crop&q=75&auto=format), url(${fallback})`;

// Each card shows the step as a small piece of the real product, on a frame from the hero video.
// The trip, times and prices are an illustration, not live data.

function PanelHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="hw-head">
      <div>
        <h3>{title}</h3>
        {sub && <p>{sub}</p>}
      </div>
      <span className="hw-more" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="how" id="how" aria-labelledby="how-title">
      <div className="how-top">
        <div>
          <span className="how-eyebrow">How it works</span>
          <h2 id="how-title">
            Say it once.
            <br />
            We book the rest.
          </h2>
        </div>
        <p>
          Tell mylz your trip in one sentence, compare priced flights and stays side by side, and book in the same chat —
          with a real person on hand if plans change.
        </p>
      </div>

      <ol className="how-grid">
        {/* 1. Tell */}
        <li className="how-card" style={{ backgroundImage: photo("photo-1464038008305-ee8def75f234", "/images/how/how-1.jpg") }}>
          <div className="hw-panel">
            <PanelHead title="Tell mylz your trip" sub="One sentence, typed or spoken." />
            <div className="hw-input">
              <div>
                <small>Your trip</small>
                <strong>Lisbon, long weekend for two</strong>
              </div>
              <span className="hw-mic">
                <MicIcon size={18} />
              </span>
            </div>
            <div className="hw-inner">
              <span className="hw-inner-title">mylz understood:</span>
              <ul className="hw-checks">
                <li>
                  <CheckIcon size={12} /> London → Lisbon
                </li>
                <li>
                  <CheckIcon size={12} /> Fri 4 – Mon 7 Dec
                </li>
                <li>
                  <CheckIcon size={12} /> 2 adults · flights + stay
                </li>
              </ul>
            </div>
            <span className="hw-btn">
              Plan my trip <FlyIcon size={16} />
            </span>
          </div>
        </li>

        {/* 2. Compare */}
        <li className="how-card" style={{ backgroundImage: photo("photo-1436491865332-7a61a109cc05", "/images/how/how-2.jpg") }}>
          <div className="hw-panel">
            <PanelHead title="Compare your options" sub="Priced, with bags and rules spelled out." />
            <div className="hw-inner">
              <span className="hw-inner-title">Flights · LHR → LIS</span>
              <ul className="hw-options">
                <li>
                  <i /> 07:30 · Direct <b>£159</b>
                </li>
                <li className="is-on">
                  <i>
                    <CheckIcon size={10} />
                  </i>{" "}
                  10:15 · Direct · bag incl. <b>£188</b>
                </li>
                <li>
                  <i /> 17:30 · 1 stop <b>£142</b>
                </li>
              </ul>
            </div>
            <span className="hw-btn">Select flight</span>
          </div>
        </li>

        {/* 3. Book */}
        <li className="how-card" style={{ backgroundImage: photo("photo-1623718649591-311775a30c43", "/images/how/how-3.jpg") }}>
          <div className="hw-panel">
            <PanelHead title="Booked & confirmed" />
            <div className="hw-route">
              <div>
                <small>London</small>
                <strong className="is-from">LHR</strong>
              </div>
              <span className="hw-arrow">
                <ArrowRightIcon size={18} />
              </span>
              <div className="to">
                <small>Lisbon</small>
                <strong>LIS</strong>
              </div>
            </div>
            <div className="hw-tiles">
              <div>
                <small>Flight</small>
                <strong>£188</strong>
                <em>Confirmed</em>
              </div>
              <div>
                <small>Stay</small>
                <strong>£374</strong>
                <em>Confirmed</em>
              </div>
              <div>
                <small>Total</small>
                <strong>£562</strong>
                <em>Paid</em>
              </div>
              <div>
                <small>Help</small>
                <strong>2 h</strong>
                <em>Real person</em>
              </div>
            </div>
          </div>
        </li>
      </ol>
      <small className="how-note">Example trip and prices, for illustration. Photos: Unsplash.</small>
    </section>
  );
}
