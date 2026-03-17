"use client";

import { styled } from "@mui/material/styles";

export const Section3Wrapper = styled("section")(({ theme }) => ({
  paddingBlock: 12,
  "& .sectionHeader": {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 18
  },
  "& h2": {
    margin: 0,
    color: "#21311a",
    letterSpacing: "-0.02em"
  },
  "& p": {
    marginBottom: 0,
    color: "#627058"
  },
  [theme.breakpoints.down("sm")]: {
    "& .sectionHeader": {
      alignItems: "flex-start",
      flexDirection: "column",
      marginBottom: 14
    }
  }
}));
