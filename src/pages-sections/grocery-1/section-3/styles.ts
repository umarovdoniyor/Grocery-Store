"use client";

import { styled } from "@mui/material/styles";

export const Section3Wrapper = styled("section")(({ theme }) => ({
  background: "#f7f4ea",
  borderRadius: "20px",
  padding: "28px 28px 20px",
  marginBottom: "1.5rem",

  "& .sectionHeader": {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20
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
    padding: "20px 16px 16px",
    "& .sectionHeader": {
      alignItems: "flex-start",
      flexDirection: "column",
      marginBottom: 14
    }
  }
}));
