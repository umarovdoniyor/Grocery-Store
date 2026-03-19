"use client";

import Link from "next/link";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

export const MainContainer = styled(Card)(({ theme }) => ({
  paddingBottom: "1rem",
  backgroundColor: "#FAF6EF",
  border: "1px solid rgba(43, 38, 34, 0.12)",
  borderRadius: "4px",
  boxShadow: "none",
  [theme.breakpoints.down("md")]: {
    boxShadow: "none",
    overflowY: "auto",
    height: "calc(100vh - 64px)"
  }
}));

export const StyledLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "isActive"
})<{ isActive: boolean }>(({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  padding: ".5rem 1.5rem",
  borderLeft: "3px solid transparent",
  justifyContent: "space-between",
  transition: "color 150ms ease, border-color 150ms ease, background-color 150ms ease",
  color: "#7A6C60",
  textDecoration: "none",
  ".title": {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  ":hover": {
    color: "#2B2622",
    backgroundColor: "#EDE8DF",
    borderColor: "#C8B79C",
    ".nav-icon": { color: "#2B2622" }
  },
  ...(isActive && {
    color: "#A44A3F",
    borderColor: "#A44A3F",
    backgroundColor: "rgba(164, 74, 63, 0.06)",
    "& .nav-icon": { color: "#A44A3F" }
  })
}));
