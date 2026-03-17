"use client";

import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";

export const StyledRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "bgColor"
})<{ bgColor?: string }>(({ theme, bgColor }) => ({
  fontSize: 12,
  paddingBlock: 7,
  color: "#2a3823",
  borderBottom: "1px solid rgba(96, 114, 73, 0.22)",
  background:
    bgColor ||
    "linear-gradient(90deg, rgba(244, 240, 224, 0.98) 0%, rgba(236, 231, 209, 0.98) 100%)"
}));

export const StyledContainer = styled(Container)(() => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem"
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
  color: "#fff",
  height: 22,
  fontWeight: 600,
  borderRadius: 999,
  letterSpacing: "0.02em",
  background: "linear-gradient(135deg, #7a974f 0%, #567235 100%)",
  "& .MuiChip-label": { paddingInline: ".8rem" }
}));

export const LeftContent = styled("div")(() => ({
  overflow: "hidden",
  ".tag": {
    fontSize: 13,
    gap: ".5rem",
    display: "flex",
    alignItems: "center"
  },
  span: {
    fontWeight: 500,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  }
}));

export const RightContent = styled("div")(() => ({
  gap: "1rem",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  "a": {
    color: "#4b5c3e",
    transition: "color 180ms ease",
    ":hover": { color: "#2f421f" }
  }
}));
