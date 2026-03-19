"use client";

import { styled } from "@mui/material/styles";

export const ReviewRoot = styled("div")(({ theme }) => ({
  maxWidth: 680,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2.25),
  borderRadius: "12px",
  backgroundColor: "#fff",
  border: "1px solid rgba(90, 112, 64, 0.12)",
  borderLeft: "3px solid rgba(90, 112, 64, 0.3)",
  "& .user-info": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
    "& .user-avatar": {
      width: 44,
      height: 44,
      borderRadius: "10px",
      border: "1px solid rgba(90, 112, 64, 0.18)"
    },
    "& .user-rating": { display: "flex", alignItems: "center", gap: theme.spacing(1) }
  }
}));

export const RatingGroup = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "center",
  marginBottom: theme.spacing(2.5)
}));
