import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

export const CardRoot = styled(Card)(({ theme }) => ({
  padding: "1.5rem",
  marginBottom: "2rem",
  backgroundColor: "#FEFDF9",
  border: "1px solid rgba(79,109,47,0.22)",
  borderRadius: 12,
  boxShadow: "0 8px 18px rgba(33,49,26,0.08)",
  "& .MuiInputLabel-root": {
    zIndex: 1,
    color: "#5E6F4D"
  },
  "& .MuiInputLabel-shrink": {
    px: 0.5,
    borderRadius: 0.5,
    bgcolor: "#FEFDF9"
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    backgroundColor: "#F7F4EA",
    "& fieldset": {
      borderColor: "rgba(79,109,47,0.2)"
    },
    "&:hover fieldset": {
      borderColor: "rgba(79,109,47,0.35)"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#5A7A30"
    }
  }
}));

export const FormWrapper = styled("div")(({ theme }) => ({
  gap: 18,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "1fr" }
}));

export const ButtonWrapper = styled("div")(({ theme }) => ({
  gap: 16,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "1fr" }
}));
