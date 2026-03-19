import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import FlexRowCenter from "components/flex-box/flex-row-center";

export const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  zIndex: 11,
  paddingTop: "1rem",
  paddingBottom: "1rem",
  backgroundColor: "#111827",
  boxShadow: theme.shadows[6],
  color: "#F3F4F6"
}));

export const StyledToolBar = styled(Toolbar)({
  "@media (min-width: 0px)": {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: "auto"
  }
});

export const ToggleWrapper = styled(FlexRowCenter)(({ theme }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  display: "none",
  cursor: "pointer",
  borderRadius: "8px",
  backgroundColor: "#374151",
  color: "#F3F4F6",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#4B5563"
  },
  [theme.breakpoints.down("lg")]: { display: "flex" }
}));

export const CustomButton = styled(Button)(({ theme }) => ({
  minHeight: 40,
  flexShrink: 0,
  marginLeft: 16,
  padding: "0 20px",
  borderRadius: "8px",
  backgroundColor: "#374151",
  color: "#F3F4F6",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#4B5563",
    borderColor: "#14B8A6"
  },
  [theme.breakpoints.down("xs")]: { display: "none" }
}));"#9CA3AF",
  backgroundColor: "#374151",
  transition: "all 0.2s ease",
  "& input::placeholder": {
    color: "#6B7280",
    opacity: 1
  },
  "&:hover": {
    backgroundColor: "#4B5563"
  }
export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: 200,
  padding: "5px 10px",
  borderRadius: "8px",
  color: theme.palette.grey[500],
  backgroundColor: theme.palette.grey[100],
  [theme.breakpoints.down("md")]: { display: "none" }
}));
