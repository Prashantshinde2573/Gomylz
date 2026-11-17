import type { Metadata } from "next";
import { ChatClient } from "../ChatClient";

export const metadata: Metadata = { title: "Mylz | Your trip" };

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="chat">
      <ChatClient id={id} />
    </main>
  );
}
