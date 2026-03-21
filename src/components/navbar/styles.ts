"use client";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

// COMMON STYLED OBJECT
export const NAV_LINK_STYLES = {
  fontWeight: 600,
  fontSize: "0.92rem",
  color: "#2e3f22",
  letterSpacing: "0.01em",
  cursor: "pointer",
  position: "relative",
  transition: "color 150ms ease-in-out",
  "&::after": {
    left: 0,
    right: 0,
    bottom: -10,
    content: '""',
    margin: "auto",
    width: "0%",
    height: "2.5px",
    borderRadius: 3,
    position: "absolute",
    background: "linear-gradient(90deg, #7a974f, #567235)",
    transition: "width 180ms ease"
  },
  "&:hover": {
    color: "#25361b",
    "&::after": { width: "100%" }
  },
  "&:last-child": { marginRight: 0 }
};

export const ParentNav = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active"
})<{ active: number }>(({ theme, active }) => ({
  position: "relative",
  ...(active && { color: theme.palette.primary.main }),
  "& .arrow": { fontSize: ".875rem" },
  ":dir(rtl) .arrow": { transform: "rotate(180deg)" },
  "&:hover": {
    color: theme.palette.primary.main,
    "& > .parent-nav-item": { display: "block" }
  }
}));

export const ParentNavItem = styled("div", {
  shouldForwardProp: (prop) => prop !== "right"
})<{ right: boolean }>(({ right }) => ({
  top: 0,
  zIndex: 5,
  left: "100%",
  paddingLeft: 8,
  display: "none",
  position: "absolute",
  ...(right && { right: "100%", left: "auto", paddingRight: 8 })
}));

export const ChildNavListWrapper = styled("div")({
  zIndex: 5,
  left: "50%",
  top: "100%",
  display: "none",
  position: "absolute",
  transform: "translate(-50%, 0%)"
});
