import type { TripQuery } from "./demo";

export type ChatSeed = { prompt: string; query: TripQuery | null; draft?: boolean };

const key = (id: string) => `mylz-chat-${id}`;

/** Creates a chat id, remembers the first ask for it, and returns the chat URL. */
export function createChat(prompt: string, query: TripQuery | null = null, draft = false): string {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  try {
    window.sessionStorage.setItem(key(id), JSON.stringify({ prompt, query, draft } satisfies ChatSeed));
  } catch {
    /* storage unavailable: the chat opens empty */
  }
  return `/chat/${id}`;
}

export function readChatSeed(id: string): ChatSeed | null {
  try {
    const raw = window.sessionStorage.getItem(key(id));
    return raw ? (JSON.parse(raw) as ChatSeed) : null;
  } catch {
    return null;
  }
}
