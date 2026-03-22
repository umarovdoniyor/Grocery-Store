"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getJwtToken } from "../../libs/auth";

type MemberData = {
  sub?: string;
  memberEmail?: string;
  memberNickname?: string;
  memberType?: string;
  memberStatus?: string;
  iat?: number;
  exp?: number;
};

type ServerMessageEvent = {
  event: "message";
  text: string;
  memberData?: MemberData;
};

type ServerInfoEvent = {
  event: "info";
  totalClient?: number;
  memberData?: MemberData;
  action?: "joined" | "left";
};

type ServerGetMessagesEvent = {
  event: "getMessages";
  list?: ServerMessageEvent[];
};

type ServerSocketEvent = ServerMessageEvent | ServerInfoEvent | ServerGetMessagesEvent;

export type ChatMessage = {
  id: string;
  text: string;
  senderName: string;
  senderType: string;
  timestamp: number;
};

export type ChatNotice = {
  id: string;
  text: string;
  action: "joined" | "left";
  timestamp: number;
};

export type SocketConnectionState = "idle" | "connecting" | "connected" | "closed" | "error";

const getDisplayName = (memberData?: MemberData) => {
  if (memberData?.memberNickname?.trim()) return memberData.memberNickname.trim();
  if (memberData?.memberEmail?.trim()) return memberData.memberEmail.trim();
  return "Guest User";
};

const normalizeWsUrl = () => {
  const explicitUrl =
    process.env.NEXT_PUBLIC_SOCKET_CHAT_URL ||
    process.env.NEXT_PUBLIC_API_SOCKET_URL ||
    process.env.REACT_APP_SOCKET_CHAT_URL;

  if (explicitUrl) return explicitUrl;

  const graphQlUrl =
    process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
    process.env.REACT_APP_API_GRAPHQL_URL ||
    "http://localhost:3007/graphql";

  try {
    const parsed = new URL(graphQlUrl);
    const socketProtocol = parsed.protocol === "https:" ? "wss:" : "ws:";
    return `${socketProtocol}//${parsed.host}`;
  } catch {
    return "ws://localhost:3007";
  }
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function useSocketChat(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const [connectionState, setConnectionState] = useState<SocketConnectionState>("idle");
  const [onlineCount, setOnlineCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notices, setNotices] = useState<ChatNotice[]>([]);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const mountedRef = useRef(true);

  const socketUrl = useMemo(() => {
    const base = normalizeWsUrl();
    const token = getJwtToken();
    const query = token ? `?token=${encodeURIComponent(token)}` : "";
    return `${base}${query}`;
  }, []);

  const close = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    ws.send(
      JSON.stringify({
        event: "message",
        data: trimmed
      })
    );

    return true;
  }, []);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING) {
      return;
    }

    setError(null);
    setConnectionState("connecting");

    const ws = new WebSocket(socketUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      setConnectionState("connected");
    };

    ws.onmessage = (event) => {
      if (!mountedRef.current) return;

      try {
        const payload = JSON.parse(event.data) as ServerSocketEvent;

        if (payload.event === "getMessages") {
          const hydrated = (payload.list || []).map((item) => ({
            id: makeId(),
            text: item.text || "",
            senderName: getDisplayName(item.memberData),
            senderType: item.memberData?.memberType || "GUEST",
            timestamp: Date.now()
          }));
          setMessages(hydrated);
          return;
        }

        if (payload.event === "message") {
          const nextMessage: ChatMessage = {
            id: makeId(),
            text: payload.text || "",
            senderName: getDisplayName(payload.memberData),
            senderType: payload.memberData?.memberType || "GUEST",
            timestamp: Date.now()
          };
          setMessages((prev) => [...prev, nextMessage]);
          return;
        }

        if (payload.event === "info") {
          if (typeof payload.totalClient === "number") {
            setOnlineCount(payload.totalClient);
          }

          const action = payload.action === "left" ? "left" : "joined";
          const displayName = getDisplayName(payload.memberData);

          setNotices((prev) => [
            ...prev,
            {
              id: makeId(),
              action,
              text: `${displayName} ${action === "joined" ? "joined" : "left"} the chat`,
              timestamp: Date.now()
            }
          ]);
        }
      } catch {
        setError("Received invalid socket payload.");
      }
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      setConnectionState("closed");
    };

    ws.onerror = () => {
      if (!mountedRef.current) return;
      setConnectionState("error");
      setError("Socket connection error. Please try reconnecting.");
    };
  }, [socketUrl]);

  useEffect(() => {
    mountedRef.current = true;
    if (enabled) {
      connect();
    }

    return () => {
      mountedRef.current = false;
      close();
    };
  }, [close, connect, enabled]);

  return {
    connectionState,
    onlineCount,
    messages,
    notices,
    error,
    socketUrl,
    connect,
    close,
    sendMessage
  };
}
