"use client";

import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

// STYLED COMPONENT
export const Wrapper = styled(Card)({
  width: "100%",
  zIndex: 0,
  overflow: "hidden",
  position: "relative",
  marginBottom: "1.25rem",
  borderRadius: "14px",
  border: "1px solid rgba(90, 112, 64, 0.16)",
  backgroundColor: "rgba(255,255,255,0.92)",
  boxShadow: "0 8px 20px rgba(33, 49, 26, 0.05)",
  transition: "all 220ms ease",
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: "rgba(90, 112, 64, 0.34)",
    boxShadow: "0 12px 26px rgba(33, 49, 26, 0.1)"
  }
});

export const ContentWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  "& .img-wrapper": {
    width: 170,
    zIndex: 0,
    flexShrink: 0,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#f7f4ea",
    backgroundImage:
      "radial-gradient(280px 120px at 50% 0%, rgba(111,143,68,0.18), rgba(111,143,68,0)), radial-gradient(190px 80px at 90% 100%, rgba(250,190,80,0.14), rgba(250,190,80,0))",
    "& img": {
      transition: "transform 240ms ease"
    }
  },
  "&:hover .img-wrapper img": { transform: "scale(1.05)" },
  "& .content": {
    flex: 1,
    padding: "1rem 1rem 0.95rem",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between"
  },

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    "& .img-wrapper": { width: "100%" },
    "& .content": { width: "100%" }
  }
}));

export const TagRoot = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  "& p": {
    fontSize: 11,
    fontWeight: 600,
    display: "inline-block",
    padding: "2px 9px",
    borderRadius: 999,
    color: "#3d5a20",
    backgroundColor: "rgba(111,143,68,0.12)",
    border: "1px solid rgba(111,143,68,0.16)"
  }
}));
