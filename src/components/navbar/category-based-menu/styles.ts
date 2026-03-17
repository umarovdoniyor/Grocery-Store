import List from "@mui/material/List";
import Card from "@mui/material/Card";
import ListItem from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";

export const Wrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "active"
})<{ active: number }>(({ theme, active }) => ({
  cursor: "pointer",
  transition: "color 150ms ease-in-out",
  ...(active && { color: "#2f421f" }),
  "& .menu-title": {
    fontWeight: 600,
    color: "#334327",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: theme.spacing(0.3),
    ".icon": {
      fontSize: "1.1rem",
      color: theme.palette.grey[500],
      transition: "transform 180ms ease, color 180ms ease"
    }
  },
  "&:hover .menu-title": { color: "#2f421f" },
  "&:hover .menu-title .icon": { color: "#4f6d2f" },
  ...(active && {
    "& .menu-title .icon": {
      transform: "rotate(180deg)",
      color: "#4f6d2f"
    }
  })
}));

export const MenusContainer = styled("div")({
  left: 0,
  zIndex: 2,
  top: "68%",
  width: "100%",
  height: "100%",
  display: "none",
  minHeight: "500px",
  maxHeight: "500px",
  position: "absolute"
});

export const StyledCard = styled(Card)({
  marginTop: 20,
  height: "100%",
  display: "flex",
  borderRadius: 0,
  overflow: "unset",
  border: "1px solid rgba(90, 112, 64, 0.12)",
  background: "linear-gradient(180deg, #ffffff 0%, #fcfbf6 100%)",
  boxShadow: "0 20px 40px rgba(33, 49, 26, 0.14)"
});

export const CategoryList = styled(List)(({ theme }) => ({
  padding: 0,
  width: 300,
  height: "100%",
  overflowY: "auto",
  overscrollBehavior: "contain",
  backgroundColor: "#f7f4ea",
  borderRight: `1px solid rgba(90, 112, 64, 0.12)`,
  "&::-webkit-scrollbar": {
    width: 8
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: 8,
    backgroundColor: "rgba(116, 132, 97, 0.35)"
  }
}));

export const CategoryListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "active"
})<{ active: boolean }>(({ theme, active }) => ({
  padding: "0.8rem 1.25rem",
  transition: "all 0.3s",
  justifyContent: "space-between",
  color: "#2f3f24",
  fontWeight: 500,
  "& .icon": {
    fontSize: "1rem",
    color: theme.palette.grey[500],
    transition: "transform 180ms ease, color 180ms ease"
  },
  ":dir(rtl) .icon": { rotate: "180deg" },
  "&:hover": {
    color: "#2f421f",
    backgroundColor: "rgba(111, 143, 68, 0.1)",
    "& .icon": {
      color: "#4f6d2f",
      transform: "translateX(2px)"
    }
  },
  ...(active && {
    color: "#2f421f",
    backgroundColor: "rgba(111, 143, 68, 0.15)",
    "& .icon": { color: "#4f6d2f" }
  })
}));

export const SubCategoryList = styled(List)(({ theme }) => ({
  padding: 0,
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  [theme.breakpoints.down("xl")]: { gridTemplateColumns: "repeat(5, 1fr)" },
  [theme.breakpoints.down("lg")]: { gridTemplateColumns: "repeat(4, 1fr)" }
}));

export const SubCategoryListItem = styled(ListItem)(({ theme }) => ({
  gap: 12,
  // fontSize: 13,
  padding: "0",
  alignItems: "center",
  marginBottom: "1.5rem",
  transition: "all 0.3s",
  color: "#36462b",
  ":hover": {
    color: "#2f421f",
    transform: "translateX(2px)"
  },
  "& .sub-item-avatar": {
    width: 32,
    height: 32,
    borderRadius: "4px",
    border: "1px solid rgba(90, 112, 64, 0.14)",
    backgroundColor: "#f2efe4"
  }
}));
