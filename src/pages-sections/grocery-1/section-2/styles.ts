"use client";

import { styled } from "@mui/material/styles";

export const ServiceCard = styled("div")(({ theme }) => ({
  gap: 14,
  display: "flex",
  flexWrap: "nowrap",
  padding: "1.5rem",
  minHeight: 132,
  background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.92) 100%)",
  borderRadius: "14px",
  alignItems: "center",
  border: "1px solid rgba(73, 99, 49, 0.12)",
  boxShadow: "0 14px 30px rgba(37, 52, 27, 0.08)",
  transition: "transform .25s ease, box-shadow .25s ease, border-color .25s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    borderColor: "rgba(73, 99, 49, 0.24)",
    boxShadow: "0 18px 34px rgba(37, 52, 27, 0.14)"
  },
  "& .iconBadge": {
    width: 52,
    height: 52,
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    color: "#3f5f2e",
    background: "linear-gradient(145deg, rgba(111, 143, 68, 0.2), rgba(111, 143, 68, 0.08))",
    border: "1px solid rgba(63, 95, 46, 0.2)",
    "& svg": {
      fontSize: 26
    }
  },
  "& .serviceContent": {
    minWidth: 0
  },
  [theme.breakpoints.down("sm")]: {
    textAlign: "center",
    padding: "1.1rem 0.8rem",
    flexDirection: "column"
  },
  "& h4": {
    margin: 0,
    fontSize: "1.02rem",
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
    fontWeight: 700,
    color: "#22301a"
  },
  "& p": {
    marginTop: 6,
    marginBottom: 0,
    lineHeight: 1.5,
    color: "#5a6950"
  }
}));
