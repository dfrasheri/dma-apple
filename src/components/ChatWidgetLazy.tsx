"use client";

/**
 * Mounts the site's native chat assistant, lazily and client-only, on every
 * public page (see PublicChrome.tsx).
 *
 * The widget is first-party: it stores nothing and calls nothing until the
 * visitor actually chats (POST /api/chat, grounded in the site's own knowledge
 * layer), so unlike the previous third-party Omnia embed it does not need to
 * wait for cookie consent. To go back to the Omnia embed, see this file's git
 * history.
 */
import dynamic from "next/dynamic";

const ChatWidget = dynamic(
  () => import("./ChatWidget").then((m) => m.ChatWidget),
  { ssr: false },
);

export function ChatWidgetLazy() {
  return <ChatWidget />;
}
