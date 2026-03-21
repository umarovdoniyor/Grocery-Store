import Card from "@mui/material/Card";
import ButtonBase from "@mui/material/ButtonBase";
import { styled } from "@mui/material/styles";

export const Wrapper = styled(Card)(({ theme }) => ({
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  position: "relative",
  borderRadius: 12,
  marginBottom: "1.5rem",
  backgroundColor: "#FEFDF9",
  border: "1px solid rgba(79,109,47,0.2)",
  boxShadow: "0 6px 14px rgba(33,49,26,0.08)"
}));

export const QuantityButton = styled(ButtonBase)(({ theme }) => ({
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 6,
  backgroundColor: "rgba(79,109,47,0.1)",
  transition: theme.transitions.create(["background-color"], {
    duration: theme.transitions.duration.short
  }),
  "&:hover": {
    backgroundColor: "rgba(79,109,47,0.2)"
  },
  "&:disabled": {
    backgroundColor: "rgba(79,109,47,0.06)",
    cursor: "not-allowed",
    color: theme.palette.text.disabled
  },
  "& svg": {
    fontSize: 16
  }
}));

export const ImageWrapper = styled("div")(({ theme }) => ({
  width: 100,
  height: 100,
  position: "relative",
  backgroundColor: "#F7F4EA",
  borderInlineEnd: "1px solid rgba(79,109,47,0.12)",
  img: {
    objectFit: "contain",
    objectPosition: "center"
  }
}));

export const ContentWrapper = styled("div")(({ theme }) => ({
  flex: 1,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",
  paddingInline: "1rem",
  gap: "0.5rem",
  ".remove-item": {
    width: "fit-content",
    color: "#C2410C",
    marginInlineStart: "auto"
  },
  ".quantity-buttons-wrapper": {
    gap: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "end"
  },
  [theme.breakpoints.up("sm")]: {
    gap: "1rem",
    padding: "1rem",
    gridTemplateColumns: "3fr 2fr 1fr 1fr",
    ".quantity-buttons-wrapper": {
      justifyContent: "start"
    }
  }
}));
