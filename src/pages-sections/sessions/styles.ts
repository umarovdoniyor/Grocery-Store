"use client";

import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

export const Wrapper = styled(Card)(({ theme }) => ({
  width: 500,
  padding: "2rem 3rem",
  backgroundColor: "#fefdf9",
  border: "1px solid rgba(79, 109, 47, 0.12)",
  borderRadius: "16px",
  boxShadow: "0 12px 48px rgba(33, 49, 26, 0.12)",
  [theme.breakpoints.down("sm")]: { width: "100%" },
  ".agreement": {
    marginTop: 12,
    marginBottom: 24,
    "& .MuiFormControlLabel-root": {
      "& .MuiCheckbox-root": {
        color: "rgba(79, 109, 47, 0.5)",
        "&.Mui-checked": {
          color: "#4f6d2f"
        }
      }
    }
  },
  ".social-button": {
    fontWeight: 400,
    padding: "0.75rem 1rem",
    color: theme.palette.text.secondary,
    border: "1px solid rgba(79, 109, 47, 0.12)",
    borderRadius: "10px",
    transition: "all 220ms ease",
    "&:first-of-type": { marginBottom: "1rem" },
    "&:hover": {
      borderColor: "rgba(79, 109, 47, 0.3)",
      backgroundColor: "rgba(79, 109, 47, 0.04)"
    },
    "& svg": { fontSize: 16 }
  }
}));
