"use client";

import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
// CONSTANT VARIABLES
import { layoutConstant } from "utils/constants";

export const HeaderWrapper = styled("div")(({ theme }) => ({
  zIndex: 3,
  position: "relative",
  height: layoutConstant.headerHeight,
  transition: "height 250ms ease-in-out",
  borderBottom: "1px solid rgba(93, 112, 68, 0.24)",
  background:
    "linear-gradient(180deg, rgba(248, 244, 230, 0.97) 0%, rgba(241, 236, 215, 0.95) 100%)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 10px 24px rgba(34, 49, 26, 0.08)",
  [theme.breakpoints.down("sm")]: {
    height: layoutConstant.mobileHeaderHeight
  }
}));

export const StyledContainer = styled(Container)(({ theme }) => ({
  height: "100%",
  "& .main-header": {
    gap: 10
  },
  "& > div": {
    gap: 2,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  "& .mobile-header": { display: "none" },
  [theme.breakpoints.down(1150)]: {
    "& .mobile-header": { display: "flex" },
    "& .main-header": { display: "none" }
  }
}));
