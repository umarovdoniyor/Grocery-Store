"use client";

import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

const TableRow = styled(Card)(({ theme }) => ({
  gap: 16,
  display: "grid",
  borderRadius: "4px",
  cursor: "pointer",
  alignItems: "center",
  padding: "1rem 1.2rem",
  marginBottom: "1.25rem",
  gridTemplateColumns: "1.5fr 2fr 1.5fr auto",
  backgroundColor: "#FAF6EF",
  border: "1px solid rgba(43, 38, 34, 0.12)",
  boxShadow: "none",
  transition: "background-color 150ms ease, border-color 150ms ease",
  "&:hover": {
    backgroundColor: "#F4EEE3",
    borderColor: "rgba(43, 38, 34, 0.22)"
  },
  [theme.breakpoints.down("sm")]: {
    gap: 8,
    gridTemplateColumns: "repeat(2, 1fr)"
  },
  ".east": {
    color: "#A44A3F",
    ":dir(rtl) &": { transform: "rotate(180deg)" }
  }
}));

export default TableRow;
