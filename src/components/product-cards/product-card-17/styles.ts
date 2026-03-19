"use client";

import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

export const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "bgWhite"
})<{ bgWhite?: boolean }>(({ theme, bgWhite }) => ({
  height: "100%",
  margin: "auto",
  display: "flex",
  overflow: "hidden",
  position: "relative",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 250ms ease-in-out",
  backgroundColor: theme.palette.grey[50],
  ":hover": {
    ".has-hover-image .thumbnail": {
      display: "none"
    },
    ".hover-box": {
      opacity: 1,
      bottom: 5
    },
    ".has-hover-image .hover-thumbnail": {
      display: "flex",
      transition: "all 0.3s ease-in-out"
    }
  },
  ...(bgWhite && {
    backgroundColor: "#FAF6EF",
    border: "1px solid rgba(43, 38, 34, 0.12)",
    borderRadius: "4px",
    boxShadow: "none",
    ":hover": {
      backgroundColor: "#F4EEE3",
      borderColor: "rgba(43, 38, 34, 0.22)",
      ".has-hover-image .thumbnail": {
        display: "none"
      },
      ".hover-box": {
        opacity: 1,
        bottom: 5
      },
      ".has-hover-image .hover-thumbnail": {
        display: "flex",
        transition: "all 0.3s ease-in-out"
      }
    }
  })
}));

export const ImageWrapper = styled("div")(({ theme }) => ({
  height: 370,
  aspectRatio: 1,
  display: "grid",
  cursor: "pointer",
  overflow: "hidden",
  textAlign: "center",
  position: "relative",
  placeItems: "center",
  // [theme.breakpoints.down("md")]: {
  //   height: 370
  // },
  [theme.breakpoints.down("sm")]: {
    height: 320
  },
  ".hover-thumbnail": {
    // scale: 1,
    display: "none",
    transition: "all 0.3s ease-in-out"
  },
  ".thumbnail, .hover-thumbnail": {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }
}));

export const HoverWrapper = styled("div")(() => ({
  zIndex: 2,
  bottom: 0,
  opacity: 0,
  width: "100%",
  cursor: "pointer",
  position: "absolute",
  transition: "all 0.3s ease-in-out",
  gap: "0",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  padding: 0,
  a: { width: "100%" },
  // Add to cart
  "& > .MuiButton-root": {
    borderRadius: 0,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "none",
    fontSize: "0.85rem",
    padding: "0.85rem 1rem",
    backgroundColor: "#2B2622",
    color: "#F4EEE3",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "#A44A3F",
      boxShadow: "none"
    }
  },
  // Quick View
  ".view-btn": {
    borderRadius: 0,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "none",
    fontSize: "0.82rem",
    padding: "0.7rem 1rem",
    backgroundColor: "#F4EEE3",
    color: "#2B2622",
    borderTop: "1px solid rgba(43, 38, 34, 0.12)",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "#EDE8DF",
      boxShadow: "none"
    }
  }
}));

export const ContentWrapper = styled("div")(({ theme }) => ({
  zIndex: 2,
  position: "relative",
  paddingTop: "1rem",
  textAlign: "center",
  paddingInline: "1rem",
  paddingBottom: "1.5rem",
  ".title": {
    cursor: "pointer",
    marginBottom: ".5rem",
    ":hover": {
      textDecoration: "underline"
    }
  },
  ".category": {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 1.4,
    marginBottom: 6,
    textTransform: "uppercase",
    color: "#8B6A4A"
  }
}));
