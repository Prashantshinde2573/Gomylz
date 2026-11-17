import type { Viewport } from "next";
import { Nav } from "@/components/Nav";

export const viewport: Viewport = { interactiveWidget: "resizes-content" };

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
