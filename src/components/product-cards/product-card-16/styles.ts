"use client";

import { styled } from "@mui/material/styles";

export const StyledRoot = styled("div")(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 12,
  zIndex: 0,
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
  position: "relative",
  "&:hover .img-wrapper img": { scale: 1.1 },
  "& .img-wrapper": {
    height: 260,
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
    position: "relative",
    overflow: "hidden",
    backgroundColor: theme.palette.grey[50],
    img: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      transition: "0.3s"
    }
  },
  "& .content": {
    flex: 1,
    padding: "1rem",
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
  fontSize: 17,
  lineHeight: 1,
  fontWeight: 600,
  marginTop: ".75rem",
  color: theme.palette.primary.main,
  ".base-price": {
    fontSize: 13,
    marginLeft: 8,
    textDecoration: "line-through",
    color: theme.palette.grey[600]
  }
}));
