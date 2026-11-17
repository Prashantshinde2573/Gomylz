// mylz icon set.
// Feature icons are duotone: a soft tinted fill (Duo), a 1.6px outline, and one solid accent
// (Dot) that gives each icon its own detail. Utility icons (arrows, close, plus) stay plain.

type IconProps = { size?: number };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Svg({ size = 20, width = 1.6, children }: IconProps & { width?: number; children: React.ReactNode }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" strokeWidth={width} {...stroke}>
      {children}
    </svg>
  );
}

/** Tinted fill layer of a duotone icon. */
const Duo = (p: React.SVGProps<SVGPathElement>) => <path fill="currentColor" fillOpacity={0.24} stroke="none" {...p} />;
/** Solid accent detail. */
const Dot = (p: React.SVGProps<SVGPathElement>) => <path fill="currentColor" stroke="none" {...p} />;

/* ---------- Feature icons (duotone) ---------- */

export const SparkleIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M10 3.500l1.700 4.800 4.800 1.700-4.800 1.700L10 16.500l-1.700-4.800L3.500 10l4.800-1.700z" />
    <path d="M10 3.500l1.700 4.800 4.800 1.700-4.800 1.700L10 16.500l-1.700-4.800L3.500 10l4.800-1.700z" />
    <Dot d="M18 14l.900 2.100L21 17l-2.100.900L18 20l-.900-2.100L15 17l2.100-.900z" />
  </Svg>
);

export const PlaneIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M20.600 3.400c-.800-.800-2.200-.600-3.100.300L13.600 7.600 5.300 5.200 3.600 6.900l6.700 4.100-3.400 3.400-2.500-.400-1.200 1.200 3.400 1.900 1.900 3.400 1.200-1.200-.400-2.500 3.400-3.400 4.100 6.700 1.700-1.700-2.400-8.300 3.900-3.900c.900-.900 1.100-2.300.300-3.100z" />
    <path d="M20.600 3.400c-.800-.800-2.200-.600-3.100.300L13.600 7.600 5.300 5.200 3.600 6.900l6.700 4.100-3.400 3.400-2.500-.400-1.200 1.200 3.400 1.900 1.900 3.400 1.200-1.200-.400-2.500 3.400-3.400 4.100 6.700 1.700-1.700-2.400-8.300 3.900-3.900c.900-.900 1.100-2.300.300-3.100z" />
    <Dot d="M18.300 5.700a1 1 0 1 1-1.400-1.400 1 1 0 0 1 1.400 1.400z" />
  </Svg>
);

/** Stays: a hotel with a lit window. */
export const BedIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M5 20.500V7l7-3.500L19 7v13.500z" />
    <path d="M5 20.500V7l7-3.500L19 7v13.500" />
    <path d="M3 20.500h18" />
    <path d="M10 20.500v-3.500h4v3.500" />
    <path d="M9 10.500h.010M15 10.500h.010M9 13.500h.010" strokeWidth="2.200" />
    <Dot d="M14 12.500h2v2h-2z" />
  </Svg>
);

export const TakeoffIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M4.200 14.300l2.700 2.100 12-4.900c1.100-.500 1.600-1.600 1.100-2.400-.500-.800-1.600-1-2.600-.600l-3.500 1.400-5.400-3.500-2 .800 3.400 4.100-3 1.200-1.600-1.200-1.100.500z" />
    <path d="M4.200 14.300l2.700 2.100 12-4.900c1.100-.500 1.600-1.600 1.100-2.400-.500-.800-1.600-1-2.600-.600l-3.500 1.400-5.400-3.500-2 .800 3.400 4.100-3 1.200-1.600-1.200-1.100.500z" />
    <path d="M3 20.500h18" />
    <Dot d="M5 19.700h3v1.600H5zM10.500 19.700h3v1.600h-3z" />
  </Svg>
);

export const LandingIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M3.300 8.600l1.300-.900 2 1.400 3 .600-1.300-5.300 2-.200 3.400 6.100 4.600 1c1.200.300 1.900 1.300 1.600 2.200-.300.900-1.300 1.300-2.300 1.100L4.400 12.500z" />
    <path d="M3.300 8.600l1.300-.900 2 1.400 3 .600-1.300-5.300 2-.200 3.400 6.100 4.600 1c1.200.300 1.900 1.300 1.600 2.200-.300.900-1.300 1.300-2.300 1.100L4.400 12.500z" />
    <path d="M3 20.500h18" />
    <Dot d="M16 19.700h3v1.600h-3zM10.500 19.700h3v1.600h-3z" />
  </Svg>
);

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M4 7.500A2.500 2.500 0 0 1 6.500 5h11A2.500 2.500 0 0 1 20 7.500V10H4z" />
    <rect x="4" y="5" width="16" height="15.500" rx="2.500" />
    <path d="M4 10h16M8.500 3v4M15.500 3v4" />
    <Dot d="M14 14h3.200v3.200H14z" />
  </Svg>
);

/** Travellers: two people, the front one tinted. */
export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="16.500" cy="7.500" r="2.500" />
    <path d="M16 12.500c2.700 0 4.500 1.600 5 4.500" />
    <Duo d="M9 11.300a3.300 3.300 0 1 0 0-6.600 3.300 3.300 0 0 0 0 6.600zM2.800 20c.600-3.300 3.100-5.300 6.200-5.300s5.600 2 6.200 5.300z" />
    <circle cx="9" cy="8" r="3.300" />
    <path d="M2.800 20c.600-3.300 3.100-5.300 6.200-5.300s5.600 2 6.200 5.300z" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p} width={1.8}>
    <Duo d="M10.500 17.500a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" />
    <circle cx="10.500" cy="10.500" r="7" />
    <path d="M15.800 15.800L21 21" strokeWidth="2.400" />
    <path d="M7.300 9a3.500 3.500 0 0 1 2.700-2.300" />
  </Svg>
);

export const MicIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" />
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.500 11a6.500 6.500 0 0 0 13 0M12 17.500V21M9 21h6" />
    <Dot d="M11.200 6.500h1.600v1.600h-1.600z" />
  </Svg>
);

/* Trip types */
export const CityIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M9 20.500V4l7 3v13.500z" />
    <path d="M4 20.500V10l5-2.500M9 20.500V4l7 3v13.500M16 20.500V12l4 2v6.500M3 20.500h18" />
    <Dot d="M11.300 9.500h1.400v1.400h-1.400zM11.300 13h1.400v1.400h-1.400z" />
  </Svg>
);

export const BeachIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M4 11a8 8 0 0 1 16 0z" />
    <path d="M4 11a8 8 0 0 1 16 0zM12 3v.500M9 11c0-3 1.300-6 3-8 1.700 2 3 5 3 8M12 11v7" />
    <path d="M3 20.500c2-1.200 4-1.200 6 0s4 1.200 6 0 4-1.200 6 0" />
  </Svg>
);

export const FamilyIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M17 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM13.500 20.500v-1.800a3.500 3.500 0 0 1 7 0v1.800z" />
    <circle cx="8" cy="6.500" r="2.800" />
    <path d="M3 20.500v-3a5 5 0 0 1 10 0v3" />
    <circle cx="17" cy="11" r="2" />
    <path d="M13.500 20.500v-1.800a3.500 3.500 0 0 1 7 0v1.800" />
  </Svg>
);

export const HeartIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M12 20s-7.500-4.600-7.500-10.200A4.200 4.200 0 0 1 12 7.400a4.200 4.200 0 0 1 7.500 2.400C19.500 15.400 12 20 12 20z" />
    <path d="M12 20s-7.500-4.600-7.500-10.200A4.200 4.200 0 0 1 12 7.400a4.200 4.200 0 0 1 7.500 2.400C19.500 15.400 12 20 12 20z" />
    <Dot d="M18.500 2.500l.700 1.600 1.600.700-1.600.700-.700 1.600-.700-1.600-1.600-.700 1.600-.700z" />
  </Svg>
);

export const SkiIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M2.500 19.500L9 8.500l4 6 2-3 6.500 8z" />
    <path d="M2.500 19.500L9 8.500l4 6 2-3 6.500 8z" />
    <Dot d="M7.500 11l1.500-2.500 1.700 2.500-1 .900-.700-.700-.700.700z" />
    <circle cx="18" cy="5" r="1.800" />
  </Svg>
);

export const TagIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M3.500 12.200V4.500a1 1 0 0 1 1-1h7.700l8.300 8.300-8.700 8.700z" />
    <path d="M3.500 12.200V4.500a1 1 0 0 1 1-1h7.700l8.300 8.300-8.700 8.700z" />
    <Dot d="M8.300 9.800a1.500 1.500 0 1 0 0-3 1.500 1.500 0 0 0 0 3z" />
  </Svg>
);

/* How it works */
export const ChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M4 5.500A1.500 1.500 0 0 1 5.500 4h13A1.500 1.500 0 0 1 20 5.500v9a1.500 1.500 0 0 1-1.500 1.500H9l-5 4z" />
    <path d="M4 5.500A1.500 1.500 0 0 1 5.500 4h13A1.500 1.500 0 0 1 20 5.500v9a1.500 1.500 0 0 1-1.500 1.500H9l-5 4z" />
    <Dot d="M7.800 9.200h1.800V11H7.800zM11.100 9.200h1.800V11h-1.800zM14.400 9.200h1.800V11h-1.800z" />
  </Svg>
);

export const CompareIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M13 5.500A1.500 1.500 0 0 1 14.500 4h4A1.500 1.500 0 0 1 20 5.500v13a1.500 1.500 0 0 1-1.500 1.500h-4a1.500 1.500 0 0 1-1.500-1.500z" />
    <rect x="4" y="4" width="7" height="16" rx="1.500" />
    <rect x="13" y="4" width="7" height="16" rx="1.500" />
    <path d="M6.500 8.500h2M6.500 12h2" />
    <path d="M14.800 11.800l1.400 1.400 2.300-2.700" />
  </Svg>
);

export const TicketIcon = (p: IconProps) => (
  <Svg {...p}>
    <Duo d="M3 7.500A1.500 1.500 0 0 1 4.500 6h15A1.500 1.500 0 0 1 21 7.500V10a2 2 0 0 0 0 4v2.500a1.500 1.500 0 0 1-1.500 1.500h-15A1.500 1.500 0 0 1 3 16.500V14a2 2 0 0 0 0-4z" />
    <path d="M3 7.500A1.500 1.500 0 0 1 4.500 6h15A1.500 1.500 0 0 1 21 7.500V10a2 2 0 0 0 0 4v2.500a1.500 1.500 0 0 1-1.500 1.500h-15A1.500 1.500 0 0 1 3 16.500V14a2 2 0 0 0 0-4z" />
    <path d="M15 6v2M15 11v2M15 16v2" strokeDasharray="0" />
    <path d="M7.300 12.100l1.700 1.700 3-3.300" />
  </Svg>
);

/** Solid plane for primary buttons; it does a barrel roll on hover (see .btn-fly in globals.css). */
export const FlyIcon = ({ size = 18 }: IconProps) => (
  <span className="fly" aria-hidden="true">
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path
        transform="rotate(90 12 12)"
        d="M12 1.800c.900 0 1.500 1 1.500 2.200v5.100l7.700 4.500v2.200l-7.700-2.300v4.300l2.300 1.700v1.800L12 20.300l-3.800 1v-1.800l2.300-1.700v-4.300l-7.700 2.300v-2.200l7.700-4.500V4c0-1.200.600-2.200 1.500-2.200z"
      />
    </svg>
  </span>
);

/* ---------- Small detail icons (fare rules) ---------- */

export const BagIcon = ({ size = 16 }: IconProps) => (
  <Svg size={size} width={1.8}>
    <rect x="5" y="8" width="14" height="12" rx="2" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
);

export const SuitcaseIcon = ({ size = 16 }: IconProps) => (
  <Svg size={size} width={1.8}>
    <rect x="6" y="6" width="12" height="14" rx="2" />
    <path d="M10 6V3h4v3M10 10v6M14 10v6" />
  </Svg>
);

export const CalendarXIcon = ({ size = 16 }: IconProps) => (
  <Svg size={size} width={1.8}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 10h16M8 3v4M16 3v4M10 13l4 4M14 13l-4 4" />
  </Svg>
);

/* ---------- Utility icons (plain) ---------- */

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p} width={2.2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <Svg {...p} width={2.2}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
);

export const ArrowUpRightIcon = ({ size = 18 }: IconProps) => (
  <Svg size={size} width={2.2}>
    <path d="M7 17L17 7M8 7h9v9" />
  </Svg>
);

export const SwapIcon = ({ size = 16 }: IconProps) => (
  <Svg size={size} width={2}>
    <path d="M4 8h14M15 5l3 3-3 3M20 16H6M9 13l-3 3 3 3" />
  </Svg>
);

export const GlobeIcon = ({ size = 18 }: IconProps) => (
  <Svg size={size} width={1.8}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3.200 3 14.800 0 18M12 3c-3 3.200-3 14.800 0 18" />
  </Svg>
);

export const CheckIcon = ({ size = 16 }: IconProps) => (
  <Svg size={size} width={3}>
    <path d="M5 12l5 5 9-10" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p} width={2.2}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p} width={2.2}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const StarIcon = ({ size = 18 }: IconProps) => (
  <Svg size={size} width={1.6}>
    <path d="M12 3.500l2.600 5.300 5.800.800-4.200 4.100 1 5.800L12 16.800l-5.200 2.700 1-5.800-4.200-4.100 5.800-.800z" />
  </Svg>
);

export function GridIcon({ size = 18 }: IconProps) {
  const dots = [3, 9, 15];
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 18 18" fill="currentColor">
      {dots.flatMap((y) => dots.map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" />))}
    </svg>
  );
}
