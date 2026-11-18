import {
  ArrowLeft, ArrowRight, ArrowRightLeft, ArrowUpRight, BedDouble, Building2,
  CalendarDays, CalendarX2, Check, ChevronDown, ChevronLeft, ChevronRight, Columns2, Globe,
  Heart, LayoutGrid, Luggage, Menu, MessageCircleMore, Mic, Minus, MountainSnow,
  Plane, Play, Plus, Search, ShoppingBag, Sparkles,
  Square, Star, Tag, TicketCheck, Umbrella, UserRound, Users, UsersRound, X,
  type LucideIcon,
} from "lucide-react";

type IconProps = { size?: number };

function outline(Icon: LucideIcon, defaultSize = 20) {
  return function OutlineIcon({ size = defaultSize }: IconProps) {
    return <Icon aria-hidden="true" focusable="false" size={size} strokeWidth={1.8} />;
  };
}

export const SparkleIcon = outline(Sparkles);
export const PlaneIcon = outline(Plane);
export const BedIcon = outline(BedDouble);
export const CalendarIcon = outline(CalendarDays);
export const UserIcon = outline(UsersRound);
export const AccountIcon = outline(UserRound, 16);
export const SearchIcon = outline(Search);
export const MicIcon = outline(Mic);
export const CityIcon = outline(Building2);
export const BeachIcon = outline(Umbrella);
export const FamilyIcon = outline(Users);
export const HeartIcon = outline(Heart);
export const SkiIcon = outline(MountainSnow);
export const TagIcon = outline(Tag);
export const ChatIcon = outline(MessageCircleMore);
export const CompareIcon = outline(Columns2);
export const TicketIcon = outline(TicketCheck);
export const BagIcon = outline(ShoppingBag, 16);
export const SuitcaseIcon = outline(Luggage, 16);
export const CalendarXIcon = outline(CalendarX2, 16);
export const ArrowRightIcon = outline(ArrowRight);
export const ArrowLeftIcon = outline(ArrowLeft);
export const ArrowUpRightIcon = outline(ArrowUpRight, 18);
export const SwapIcon = outline(ArrowRightLeft, 16);
export const GlobeIcon = outline(Globe, 18);
export const CheckIcon = outline(Check, 16);
export const PlusIcon = outline(Plus);
export const MinusIcon = outline(Minus, 16);
export const CloseIcon = outline(X);
export const StarIcon = outline(Star, 18);
export const GridIcon = outline(LayoutGrid, 18);
export const MenuIcon = outline(Menu);
export const ChevronLeftIcon = outline(ChevronLeft, 16);
export const ChevronRightIcon = outline(ChevronRight, 16);
export const ChevronDownIcon = outline(ChevronDown, 14);
export const PlayIcon = outline(Play, 18);
export const StopIcon = outline(Square, 16);

export function FlyIcon({ direction = "right" }: { direction?: "right" | "left" } = {}) {
  return (
    <svg className={`fly${direction === "left" ? " fly-left" : ""}`} aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0 1-1.2 1.7-2.5 1.7h-4.7L9.6 22H7.2l2.6-8.3H5.6l-2 2.4H1.8L3 12 1.8 7.9h1.8l2 2.4h4.2L7.2 2h2.4l5.2 8.3h4.7c1.3 0 2.5.7 2.5 1.7Z" />
    </svg>
  );
}
