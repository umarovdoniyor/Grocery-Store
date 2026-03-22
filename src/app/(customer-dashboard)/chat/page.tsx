import type { Metadata } from "next";
import ChatClient from "./chat-client";

export const metadata: Metadata = {
  title: "Chat - Bazaar Next.js E-commerce Template",
  description:
    "Real-time customer chat powered by WebSocket for Bazaar Next.js e-commerce frontend.",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["chat", "websocket", "customer dashboard", "next.js"]
};

export default function ChatPage() {
  return <ChatClient />;
}
