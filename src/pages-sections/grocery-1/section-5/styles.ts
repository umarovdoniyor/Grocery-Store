"use client";

import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

export const DiscountWrapper = styled(Card)(({ theme }) => ({
  padding: "60px 50px",
  marginBottom: "3rem",
  borderRadius: "24px",
  overflow: "hidden",
  position: "relative",
  backgroundImage: "linear-gradient(135deg, #2d4a14 0%, #4a7228 55%, #60922e 100%)",
  boxShadow: "0 20px 60px rgba(45, 74, 20, 0.35)",

  "& h1": {
    fontSize: 38,
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    marginBottom: "0.25rem"
  },

  ".MuiButton-root": {
    marginTop: "2rem",
    backgroundColor: "#fff",
    color: "#4f6d2f",
    fontWeight: 700,
    borderRadius: "50px",
    padding: "10px 32px",
    fontSize: 14,
    boxShadow: "0 4px 14px rgba(255,255,255,0.25)",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.92)",
      boxShadow: "0 6px 20px rgba(255,255,255,0.35)"
    }
  },

  "& p": {
    fontSize: 11,
    marginBottom: ".5rem",
    fontWeight: 700,
    color: "rgba(255,255,255,0.65)",
    textTransform: "uppercase",
    letterSpacing: "0.1em"
  },

  [theme.breakpoints.down("sm")]: {
    marginInline: "auto",
    padding: "36px 24px",
    "& .content": {
      marginBottom: 30,
      textAlign: "center",
      "& h1": { fontSize: 26 }
    }
  }
}));
