import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
// MUI
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
// ICON COMPONENTS
import ChevronRight from "icons/ChevronRight";
// GLOBAL CUSTOM HOOKS
import useOverflowDetect from "hooks/useOverflowDetect";
// STYLED COMPONENTS
import { ParentNav, ParentNavItem } from "./styles";
// DATA TYPES
import { MenuItemWithChild } from "models/Navigation.model";

// ==============================================================
interface Props extends PropsWithChildren {
  nav: MenuItemWithChild;
}
// ==============================================================

export default function NavItemChild({ nav, children }: Props) {
  const pathname = usePathname();
  const { checkOverflow, elementRef, isRightOverflowing } = useOverflowDetect();

  const isActive = nav.child!.flat().find((item) => item.url === pathname);

  return (
    <ParentNav minWidth={200} active={isActive ? 1 : 0} onMouseEnter={checkOverflow}>
      <MenuItem
        color="grey.700"
        sx={{
          color: "#334327",
          fontWeight: 500,
          transition: "all 180ms ease",
          "&:hover": {
            color: "#2f421f",
            backgroundColor: "rgba(111, 143, 68, 0.1)",
            "& .arrow": { color: "#4f6d2f" }
          }
        }}
      >
        <Typography component="span" sx={{ flex: "1 1 0" }}>
          {nav.title}
        </Typography>

        <ChevronRight className="arrow" />
      </MenuItem>

      <ParentNavItem ref={elementRef} right={isRightOverflowing} className="parent-nav-item">
        <Card
          elevation={5}
          sx={{
            py: "0.5rem",
            minWidth: 180,
            overflow: "unset",
            borderRadius: 2.5,
            border: "1px solid",
            borderColor: "rgba(90, 112, 64, 0.15)",
            background: "linear-gradient(180deg, #ffffff 0%, #fcfbf6 100%)",
            boxShadow: "0 14px 30px rgba(33, 49, 26, 0.12)",
            "& .MuiMenuItem-root": {
              color: "#334327",
              fontWeight: 500,
              transition: "all 180ms ease",
              "&:hover": {
                color: "#2f421f",
                backgroundColor: "rgba(111, 143, 68, 0.1)"
              }
            }
          }}
        >
          {children}
        </Card>
      </ParentNavItem>
    </ParentNav>
  );
}
