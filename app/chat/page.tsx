"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { createChat } from "@/lib/startChat";

// /chat?q=... starts a new chat with that sentence; /chat alone goes home.
function Redirect() {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q")?.trim();
  const blank = params.get("new") === "1";

  useEffect(() => {
    router.replace(q || blank ? createChat(q ?? "") : "/");
  }, [blank, q, router]);

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
