"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { createChat } from "@/lib/startChat";

// /chat?q=... starts a new chat with that sentence; /chat alone goes home.
function Redirect() {
  const router = useRouter();
  const q = useSearchParams().get("q")?.trim();

  useEffect(() => {
    router.replace(q ? createChat(q) : "/");
  }, [q, router]);

  return <p className="chat-note">Starting your trip…</p>;
}

export default function ChatIndex() {
  return (
    <main className="chat">
      <Suspense fallback={null}>
        <Redirect />
      </Suspense>
    </main>
  );
}
