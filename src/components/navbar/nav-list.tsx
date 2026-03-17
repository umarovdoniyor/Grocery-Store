"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
// GLOBAL CUSTOM COMPONENTS
import { NavLink } from "components/nav-link";
import FlexBox from "components/flex-box/flex-box";
// LOCAL CUSTOM COMPONENTS
import MegaMenu from "./mega-menu";
import NavItemChild from "./nav-item-child";
import { CategoryBasedMenu } from "./category-based-menu";
// STYLED COMPONENTS
import { NAV_LINK_STYLES, ChildNavListWrapper } from "./styles";
// DATA TYPES
import { Menu, MenuItemWithChild } from "models/Navigation.model";

// ==============================================================
type Props = { navigation: Menu[] };
// ==============================================================

export function NavigationList({ navigation }: Props) {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setActiveMenu(null);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  const renderNestLevel = (children: MenuItemWithChild[]) => {
    return children.map((nav) => {
      if (nav.child) {
        return (
          <NavItemChild nav={nav} key={nav.title}>
            {renderNestLevel(nav.child)}
          </NavItemChild>
        );
      }

      return (
        <NavLink href={nav.url!} key={nav.title}>
          <MenuItem>{nav.title}</MenuItem>
        </NavLink>
      );
    });
  };

  const renderRootLevel = (list: Menu[]) => {
    return list.map((nav) => {
      // SHOW GRID MEGA MENU
      if (nav.megaMenu) {
        return <MegaMenu key={nav.title} title={nav.title} menuList={nav.child} />;
      }

      // SHOW CATEGORY BASED MEGA MENU WITH SUB ITEMS
      if (nav.megaMenuWithSub) {
        return (
          <CategoryBasedMenu
            key={nav.title}
            title={nav.title}
            menuList={nav.child}
            isOpen={activeMenu === nav.title}
            onToggle={() =>
              setActiveMenu((prev) => (prev === nav.title ? null : nav.title))
            }
          />
        );
      }

      // SHOW LIST MENU WITH CHILD
      if (nav.child && nav.megaMenu === false && nav.megaMenuWithSub === false) {
        const isOpen = activeMenu === nav.title;

        return (
          <FlexBox key={nav.title} alignItems="center" position="relative" flexDirection="column">
            <FlexBox
              alignItems="flex-end"
              gap={0.3}
              sx={NAV_LINK_STYLES}
              onClick={(event) => {
                event.stopPropagation();
                setActiveMenu((prev) => (prev === nav.title ? null : nav.title));
              }}
            >
              {nav.title}{" "}
              <KeyboardArrowDown
                sx={{
                  color: "grey.500",
                  fontSize: "1.1rem"
                }}
              />
            </FlexBox>

            <ChildNavListWrapper
              className="child-nav-item"
              sx={{ display: isOpen ? "block" : "none" }}
            >
              <Card
                elevation={5}
                sx={{
                  mt: 2.5,
                  py: 1,
                  minWidth: 100,
                  overflow: "unset",
                  borderRadius: 3,
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
                {renderNestLevel(nav.child)}
              </Card>
            </ChildNavListWrapper>
          </FlexBox>
        );
      }

      return null;
    });
  };

  return (
    <FlexBox gap={4} ref={rootRef}>
      {renderRootLevel(navigation)}
    </FlexBox>
  );
}
