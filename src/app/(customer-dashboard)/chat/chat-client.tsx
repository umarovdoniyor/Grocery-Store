"use client";

import { FormEvent, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSocketChat } from "hooks/useSocketChat";

const statusColor: Record<string, "default" | "success" | "warning" | "error"> = {
  idle: "default",
  connecting: "warning",
  connected: "success",
  closed: "default",
  error: "error"
};

export default function ChatClient() {
  const [draft, setDraft] = useState("");
  const {
    connectionState,
    onlineCount,
    messages,
    notices,
    error,
    socketUrl,
    connect,
    close,
    sendMessage
  } = useSocketChat();

  const canSend = connectionState === "connected" && draft.trim().length > 0;

  const timeline = useMemo(() => {
    const messageItems = messages.map((item) => ({
      id: item.id,
      kind: "message" as const,
      timestamp: item.timestamp,
      payload: item
    }));

    const noticeItems = notices.map((item) => ({
      id: item.id,
      kind: "notice" as const,
      timestamp: item.timestamp,
      payload: item
    }));

    return [...messageItems, ...noticeItems].sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, notices]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = sendMessage(draft);
    if (ok) {
      setDraft("");
    }
  };

  return (
    <Stack spacing={3}>
      <Card sx={{ p: 3, border: "1px solid rgba(43, 38, 34, 0.12)", boxShadow: "none" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h5" fontWeight={700} color="#2B2622">
              Bazaar Live Chat
            </Typography>
            <Typography variant="body2" color="#7A6C60" mt={0.5}>
              Connected endpoint: {socketUrl}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={connectionState.toUpperCase()}
              color={statusColor[connectionState] || "default"}
              size="small"
              variant={connectionState === "connected" ? "filled" : "outlined"}
            />
            <Chip label={`Online: ${onlineCount}`} size="small" variant="outlined" />
            <Button
              variant="outlined"
              size="small"
              onClick={connect}
              disabled={connectionState === "connected" || connectionState === "connecting"}
            >
              Reconnect
            </Button>
            <Button variant="text" size="small" onClick={close}>
              Disconnect
            </Button>
          </Stack>
        </Stack>

        {error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : null}
      </Card>

      <Card
        sx={{
          border: "1px solid rgba(43, 38, 34, 0.12)",
          boxShadow: "none",
          overflow: "hidden"
        }}
      >
        <Box sx={{ maxHeight: 420, overflowY: "auto", p: 2, backgroundColor: "#FCFAF6" }}>
          {timeline.length === 0 ? (
            <Typography variant="body2" color="#8D8073">
              No messages yet. Start the conversation.
            </Typography>
          ) : (
            <Stack spacing={1.25}>
              {timeline.map((item) => {
                if (item.kind === "notice") {
                  return (
                    <Alert key={item.id} severity="info" variant="outlined">
                      {item.payload.text}
                    </Alert>
                  );
                }

                return (
                  <Box
                    key={item.id}
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 1,
                      border: "1px solid rgba(79,109,47,0.2)",
                      backgroundColor: "#fff"
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Typography variant="body2" fontWeight={700} color="#3F5A26">
                        {item.payload.senderName}
                      </Typography>
                      <Typography variant="caption" color="#8D8073">
                        {new Date(item.payload.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="#2B2622" mt={0.25}>
                      {item.payload.text}
                    </Typography>
                    <Typography variant="caption" color="#8D8073" display="block" mt={0.5}>
                      {item.payload.senderType}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>

        <Divider />

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              fullWidth
              placeholder="Type a message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <Button type="submit" variant="contained" disabled={!canSend}>
              Send
            </Button>
          </Stack>
        </Box>
      </Card>
    </Stack>
  );
}
