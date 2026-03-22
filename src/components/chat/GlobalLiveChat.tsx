"use client";

import { FormEvent, useMemo, useState } from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Chat from "icons/duotone/Chat";
import { useSocketChat } from "hooks/useSocketChat";

const statusColor: Record<string, "default" | "success" | "warning" | "error"> = {
  idle: "default",
  connecting: "warning",
  connected: "success",
  closed: "default",
  error: "error"
};

export default function GlobalLiveChat() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const { connectionState, onlineCount, messages, notices, sendMessage } = useSocketChat({
    enabled: open
  });

  const timeline = useMemo(() => {
    const messageItems = messages.map((item) => ({
      id: item.id,
      kind: "message" as const,
      timestamp: item.timestamp,
      text: `${item.senderName}: ${item.text}`
    }));

    const noticeItems = notices.map((item) => ({
      id: item.id,
      kind: "notice" as const,
      timestamp: item.timestamp,
      text: item.text
    }));

    return [...messageItems, ...noticeItems].sort((a, b) => a.timestamp - b.timestamp).slice(-30);
  }, [messages, notices]);

  const canSend = connectionState === "connected" && draft.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = sendMessage(draft);
    if (ok) setDraft("");
  };

  return (
    <>
      <Badge
        color="success"
        badgeContent={onlineCount}
        overlap="circular"
        sx={{ position: "fixed", right: 20, bottom: 24, zIndex: 1400 }}
      >
        <IconButton
          aria-label="Open Live Chat"
          onClick={() => setOpen(true)}
          sx={{
            width: 56,
            height: 56,
            backgroundColor: "#4f6d2f",
            color: "#fff",
            boxShadow: "0 8px 24px rgba(33,49,26,0.2)",
            "&:hover": { backgroundColor: "#446127" }
          }}
        >
          <Chat fontSize="small" />
        </IconButton>
      </Badge>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: { xs: "100vw", sm: 420 },
            height: "100%",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: "1px solid rgba(79,109,47,0.16)",
              backgroundColor: "#f7f4ea"
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={700} color="#2B2622">
                Bazaar Live Chat
              </Typography>
              <Typography variant="caption" color="#7A6C60">
                Guests are welcome
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Chip
                label={connectionState.toUpperCase()}
                size="small"
                color={statusColor[connectionState] || "default"}
                variant={connectionState === "connected" ? "filled" : "outlined"}
              />
              <Button size="small" onClick={() => setOpen(false)}>
                Close
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1.5, backgroundColor: "#fefdf9" }}>
            <Stack spacing={1}>
              {timeline.length === 0 ? (
                <Typography variant="body2" color="#7A6C60">
                  Live Chat is ready. Say hello.
                </Typography>
              ) : (
                timeline.map((item) => (
                  <Typography
                    key={item.id}
                    variant="body2"
                    sx={{
                      border: "1px solid rgba(79,109,47,0.16)",
                      borderRadius: 1,
                      px: 1.25,
                      py: 0.8,
                      backgroundColor: item.kind === "notice" ? "#f5f8ef" : "#fff"
                    }}
                  >
                    {item.text}
                  </Typography>
                ))
              )}
            </Stack>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: 1.5, borderTop: "1px solid rgba(79,109,47,0.16)" }}
          >
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                fullWidth
                placeholder="Write a message"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <Button type="submit" variant="contained" disabled={!canSend} sx={{ minWidth: 84 }}>
                Send
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
