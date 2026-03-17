"use client";

import { styled } from "@mui/material/styles";

const LEFT_IMG = "/assets/images/headers/grocery-1.png";
const RIGHT_IMG = "/assets/images/headers/grocery-2.png";

// USED IN SECTION 1
export const SectionContainer = styled("div")(({ theme }) => ({
  height: 650,
  padding: 20,
  width: "100%",
  paddingTop: 160,
  backgroundSize: "100% 100%, 100% 100%, 40%, 40%",
  backgroundPosition: "center top, center top, left bottom, right bottom",
  backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
  transition: "all .3s",
  borderRadius: 0,
  position: "relative",
  overflow: "hidden",
  backgroundColor: "#f6f4ea",
  backgroundImage:
    theme.direction === "ltr"
      ? `radial-gradient(1200px 480px at 50% -12%, rgba(111, 143, 68, 0.24), rgba(111, 143, 68, 0)), radial-gradient(520px 320px at 82% 22%, rgba(253, 202, 90, 0.25), rgba(253, 202, 90, 0)), url('${LEFT_IMG}'), url('${RIGHT_IMG}')`
      : `radial-gradient(1200px 480px at 50% -12%, rgba(111, 143, 68, 0.24), rgba(111, 143, 68, 0)), radial-gradient(520px 320px at 82% 22%, rgba(253, 202, 90, 0.25), rgba(253, 202, 90, 0)), url('${RIGHT_IMG}'), url('${LEFT_IMG}')`,

  "& h1": {
    fontSize: 48,
    maxWidth: 600,
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    color: "#1f2a1a",
    fontWeight: 700,
    marginBottom: 40,
    textAlign: "center",
    marginInline: "auto"
  },
  "& .heroSubTitle": {
    maxWidth: 680,
    margin: "0 auto",
    fontSize: 18,
    color: "#4f5f40",
    textAlign: "center"
  },
  "& .heroActions": {
    marginTop: 28,
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexDirection: "column"
  },
  "& .heroPrimaryBtn": {
    height: 50,
    paddingInline: 28,
    borderRadius: 999,
    textTransform: "none",
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: "0.01em",
    color: "#fff",
    background: "linear-gradient(135deg, #6f8f44 0%, #4f6d2f 100%)",
    boxShadow: "0 12px 20px rgba(51, 80, 30, 0.25)",
    "&:hover": { background: "linear-gradient(135deg, #64813d 0%, #446127 100%)" }
  },
  "& .quickLinks": {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    maxWidth: 780
  },
  "& .quickChip": {
    borderRadius: 999,
    border: "1px solid rgba(65, 92, 45, 0.18)",
    backgroundColor: "rgba(255,255,255,0.8)",
    color: "#3f5130",
    textTransform: "none",
    fontWeight: 600,
    paddingInline: 14,
    minHeight: 36,
    "&:hover": { backgroundColor: "#ffffff", borderColor: "rgba(65, 92, 45, 0.32)" }
  },
  [theme.breakpoints.up("md")]: {
    backgroundSize: "100% 100%, 100% 100%, 450px, 450px"
  },
  [theme.breakpoints.down("md")]: {
    height: 550,
    paddingTop: 130,
    "& h1": { fontSize: 40, textAlign: "center" },
    "& .heroSubTitle": { fontSize: 17 }
  },
  [theme.breakpoints.down("sm")]: {
    height: 480,
    paddingTop: 100,
    "& h1": { fontSize: 32, lineHeight: 1.2 },
    "& .heroSubTitle": { fontSize: 15 },
    "& .heroPrimaryBtn": { width: "100%", maxWidth: 320 },
    "& .quickLinks": { gap: 8 }
  }
}));
