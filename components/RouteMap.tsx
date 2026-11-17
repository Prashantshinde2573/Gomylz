import { CITIES } from "@/lib/airports";

const W = 900;
const H = 380;
const LABELLED = new Set(["LON", "LIS", "NYC", "DXB", "TYO", "DPS", "BOM", "SIN", "IST", "ROM"]);

// Simple flat projection over the band of the world the demo cities sit in.
function project(lat: number, lon: number): [number, number] {
  return [((lon + 85) / 235) * W, ((68 - lat) / 86) * H];
}

/** Decorative network of routes out of London, drawn from the city list. */
export function RouteMap() {
  const hub = CITIES[0];
  const [hx, hy] = project(hub.lat, hub.lon);

  return (
    <svg className="route-map" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Routes from London to cities around the world">
      <defs>
        <pattern id="map-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="rgba(169,243,246,0.16)" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#map-dots)" />
      {CITIES.slice(1).map((c, i) => {
        const [x, y] = project(c.lat, c.lon);
        const lift = Math.min(120, Math.abs(x - hx) * 0.32 + 18);
        const d = `M${hx.toFixed(1)} ${hy.toFixed(1)} Q${((hx + x) / 2).toFixed(1)} ${(Math.min(hy, y) - lift).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
        return <path key={c.code} className="route" d={d} pathLength={1} style={{ animationDelay: `${i * 0.12}s` }} />;
      })}
      {CITIES.map((c) => {
        const [x, y] = project(c.lat, c.lon);
        const isHub = c.code === hub.code;
        return (
          <g key={c.code}>
            <circle cx={x} cy={y} r={isHub ? 6 : 3.5} fill={isHub ? "#00c4cc" : "#a9f3f6"} />
            {isHub && <circle className="pulse" cx={x} cy={y} r="6" fill="none" stroke="#00c4cc" />}
            {LABELLED.has(c.code) && (
              <text x={x + 8} y={y - 8} className="route-label">
                {c.code}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
