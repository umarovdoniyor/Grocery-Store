"use client";

import { styled } from "@mui/material/styles";

export const StyledRoot = styled("div")(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 14,
  zIndex: 0,
  overflow: "hidden",
  border: "1px solid rgba(90, 112, 64, 0.14)",
  boxShadow: "0 4px 16px rgba(33, 49, 26, 0.06)",
  position: "relative",
  transition: "all 220ms ease",
  "&:hover": {
    borderColor: "rgba(90, 112, 64, 0.35)",
    boxShadow: "0 10px 24px rgba(33, 49, 26, 0.1)",
    transform: "translateY(-2px)"
  },
  "&:hover .img-wrapper img": { scale: 1.05 },
  "& .img-wrapper": {
    height: 260,
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#f7f4ea",
    img: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      transition: "0.3s"
    }
  },
  "& .content": {
    flex: 1,
    padding: "0.95rem 1rem",
    display: "flex",
    gap: "0.75rem",
    alignItems: "flex-end",
    justifyContent: "space-between"
  },
  "& .content > div": {
    flex: 1,
    minWidth: 0
  }
}));

export const PriceText = styled("p")(({ theme }) => ({
  fontSize: 18,
  lineHeight: 1,
  fontWeight: 700,
  marginTop: ".75rem",
  color: "#3d6b2a",
  ".base-price": {
    fontSize: 13,
    marginLeft: 8,
    textDecoration: "line-through",
    color: theme.palette.grey[600]
  }
}));
