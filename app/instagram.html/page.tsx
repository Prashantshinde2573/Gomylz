import type { Metadata } from "next";
import { InstagramProfile } from "@/components/InstagramProfile";
export const metadata: Metadata = {title: "@go.mylz | The Mylz travel journal", description: "Travel inspiration, hidden gems and beautiful stays. Explore the Mylz Instagram profile preview.", robots: {index:false,follow:false}};
export default function InstagramPage() { return <InstagramProfile/>; }
