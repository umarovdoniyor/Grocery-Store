"use client";

import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

export const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  margin: "auto",
  display: "flex",
  overflow: "hidden",
  position: "relative",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: "14px",
  border: "1px solid rgba(90, 112, 64, 0.12)",
  backgroundColor: "#fff",
  boxShadow: "0 2px 8px rgba(33, 49, 26, 0.05)",
  transition: "all 220ms ease-in-out",
  "&:hover": {
    borderColor: "rgba(90, 112, 64, 0.35)",
    boxShadow: "0 8px 24px rgba(33, 49, 26, 0.10)",
    transform: "translateY(-2px)"
  },
  ":hover .hover-box": { opacity: 1 }
}));

export const ImageWrapper = styled("div")(({ theme }) => ({
  textAlign: "center",
  position: "relative",
  display: "inline-block",
  backgroundColor: "#f7f4ea",
  [theme.breakpoints.down("sm")]: { display: "block" },
  transition: "0.3s",
  ":hover .thumbnail": { scale: 0.93 },
  "& .thumbnail": { transition: "0.3s" }
}));

export const HoverIconWrapper = styled("div")(({ theme }) => ({
  zIndex: 2,
  top: "8px",
  opacity: 0,
  right: "10px",
  display: "flex",
  cursor: "pointer",
  position: "absolute",
  flexDirection: "column",
  gap: "4px",
  transition: "all 0.3s ease-in-out",
  color: "#4f6d2f",
  "& .MuiIconButton-root": {
    width: 30,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(90,112,64,0.18)",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#fff",
      boxShadow: "0 2px 8px rgba(33,49,26,0.15)"
    }
  }
}));

export const ContentWrapper = styled("div")(({ theme }) => ({
  gap: 8,
  display: "flex",
  padding: "0.875rem 1rem",
  borderTop: "1px solid rgba(90, 112, 64, 0.1)",
  "& .title": { marginBottom: ".4rem" },
  "& > .content": { flex: "1 1 0", marginInlineEnd: ".5rem" },
  "& .size": { marginBottom: ".5rem", color: theme.palette.grey[600] }
}));
