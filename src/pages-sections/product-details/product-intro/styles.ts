"use client";

import { styled } from "@mui/material/styles";

export const StyledRoot = styled("div")(({ theme }) => ({
  width: "100%",
  padding: "2rem",
  borderRadius: "16px",
  backgroundColor: "#f7f4ea",
  border: "1px solid rgba(90, 112, 64, 0.12)",
  boxShadow: "0 4px 24px rgba(33, 49, 26, 0.06)",
  "& strong": { fontWeight: 600 },
  "& .rating": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(0.75)
  },
  "& .views": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.75),
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary
  },
  "& .price": {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    borderTop: "1px solid rgba(90, 112, 64, 0.12)",
    borderBottom: "1px solid rgba(90, 112, 64, 0.12)"
  },
  "& .shop": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
    "& a": { color: "#3d6b2a", fontWeight: 600 }
  },
  "& .variant-group": {
    gap: "0.5rem",
    display: "flex",
    alignItems: "center",
    "& .MuiChip-root": { height: 28, cursor: "pointer", borderRadius: "6px" }
  }
}));

export const ProductImageWrapper = styled("div")(({ theme }) => ({
  height: 420,
  display: "flex",
  overflow: "hidden",
  position: "relative",
  justifyContent: "center",
  borderRadius: "12px",
  backgroundColor: "#fff",
  border: "1px solid rgba(90, 112, 64, 0.1)",
  marginBottom: theme.spacing(2),
  "& img": { objectFit: "contain", padding: "16px" },
  [theme.breakpoints.down("sm")]: { height: 280 },
  "& + .preview-images": {
    overflow: "auto",
    display: "flex",
    gap: theme.spacing(1),
    justifyContent: "center"
  }
}));

export const PreviewImage = styled("div", {
  shouldForwardProp: (prop) => prop !== "selected"
})<{ selected: boolean }>(({ theme, selected }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  overflow: "hidden",
  width: 68,
  height: 68,
  cursor: "pointer",
  position: "relative",
  backgroundColor: "#fff",
  opacity: selected ? 1 : 0.55,
  transition: "all 0.2s ease-in-out",
  boxShadow: selected ? "0 0 0 2px #5a7a30" : "none",
  border: `1px solid ${selected ? "#5a7a30" : "rgba(90,112,64,0.18)"}`
}));
