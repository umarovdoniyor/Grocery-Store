"use client";

import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

export const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(2.5),
  borderRadius: "12px",
  border: "1px solid rgba(90, 112, 64, 0.14)",
  backgroundColor: "#f7f4ea",
  boxShadow: "none",
  transition: "all 180ms ease",
  "&:hover": {
    borderColor: "rgba(90, 112, 64, 0.4)",
    boxShadow: "0 4px 16px rgba(33, 49, 26, 0.08)",
    transform: "translateY(-2px)"
  },
  "& .shop-avatar": {
    width: 52,
    height: 52,
    borderRadius: "10px",
    border: "1px solid rgba(90, 112, 64, 0.15)"
  },
  "& .shop-name": {
    fontSize: 14,
    fontWeight: 600,
    marginTop: theme.spacing(1.25),
    color: "#2a3d1f",
    textAlign: "center"
  }
}));
