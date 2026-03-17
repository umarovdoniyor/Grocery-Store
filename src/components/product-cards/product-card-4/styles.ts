"use client";

import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

export const StyledCard = styled(Card)(() => ({
  height: "100%",
  margin: "auto",
  display: "flex",
  overflow: "hidden",
  borderRadius: "18px",
  position: "relative",
  flexDirection: "column",
  justifyContent: "space-between",
  border: "1px solid rgba(69, 93, 48, 0.1)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 100%)",
  boxShadow: "0 16px 34px rgba(29, 42, 20, 0.08)",
  transition: "transform 250ms ease-in-out, box-shadow 250ms ease-in-out",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 22px 40px rgba(29, 42, 20, 0.14)"
  },
  "&:hover .controller": { display: "flex", bottom: 24 },
  "&:hover .productImage": {
    transform: "scale(1.04)"
  },
  "& .title": {
    color: "#24331c",
    fontSize: "1rem",
    fontWeight: 700,
    lineHeight: 1.35,
    letterSpacing: "-0.01em"
  }
}));

export const HoverWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  left: 0,
  right: 0,
  width: 150,
  bottom: -40,
  margin: "auto",
  borderRadius: 999,
  overflow: "hidden",
  position: "absolute",
  backgroundColor: "rgba(255,255,255,0.96)",
  boxShadow: "0 10px 24px rgba(24, 33, 17, 0.16)",
  color: theme.palette.grey[500],
  transition: "bottom 0.3s ease-in-out",
  "& span": { padding: ".5rem" },
  "& svg": { fontSize: 18 },
  "& span, & a": {
    width: "100%",
    height: "100%",
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": { backgroundColor: theme.palette.action.hover }
  }
}));

export const ImageWrapper = styled("div")(({ theme }) => ({
  height: 288,
  display: "grid",
  overflow: "hidden",
  textAlign: "center",
  position: "relative",
  padding: "40px 34px 28px",
  placeItems: "center",
  background:
    "radial-gradient(120px 90px at 18% 20%, rgba(249, 221, 133, 0.25), rgba(249, 221, 133, 0)), linear-gradient(180deg, #f8f5eb 0%, #f2efe4 100%)",
  "& .productImage": {
    transition: "transform 250ms ease"
  }
}));

export const ContentWrapper = styled("div")(({ theme }) => ({
  gap: 8,
  display: "flex",
  padding: "1rem 1rem 1.1rem",
  ".content": {
    flex: 1,
    paddingTop: "3px",
    overflow: "hidden"
  },
  "& .metaRow": {
    paddingBottom: 10,
    borderBottom: "1px solid rgba(84, 101, 73, 0.12)",
    color: theme.palette.text.secondary
  },
  "& .priceRow": {
    paddingTop: 2
  },
  "& .MuiButton-outlined": {
    minWidth: 38,
    minHeight: 38,
    borderRadius: 12,
    borderColor: "rgba(79, 109, 47, 0.2)",
    backgroundColor: "rgba(111, 143, 68, 0.06)",
    color: "#496331",
    "&:hover": {
      borderColor: "rgba(79, 109, 47, 0.34)",
      backgroundColor: "rgba(111, 143, 68, 0.12)"
    }
  }
}));
