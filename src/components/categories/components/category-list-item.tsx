import Link from "next/link";
import { ReactNode } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
// ICON COMPONENTS
import ChevronRight from "icons/ChevronRight";
// GLOBAL CUSTOM COMPONENTS
import IconComponent from "components/IconComponent";

// STYLED COMPONENT
export const Wrapper = styled("div")(({ theme }) => ({
  "& .category-dropdown-link": {
    height: 40,
    display: "flex",
    minWidth: "278px",
    cursor: "pointer",
    whiteSpace: "pre",
    padding: "0px 1rem",
    alignItems: "center",
    transition: "all 300ms ease-in-out",
    ".title": {
      flexGrow: 1,
      paddingInlineStart: "0.75rem"
    }
  },
  ":hover": {
    color: theme.palette.primary.main,
    background: theme.palette.action.hover,
    "& > .mega-menu": { display: "block" },
    "& > a .caret-icon": { color: theme.palette.primary.main }
  },
  ".mega-menu": {
    top: 0,
    zIndex: 1601,
    left: "100%",
    right: "auto",
    display: "none",
    position: "absolute"
  },
  ".caret-icon": {
    fontSize: "1rem",
    color: theme.palette.grey[400],
    ":dir(rtl)": { rotate: "180deg" }
  }
}));

// =============================================================
interface Props {
  href: string;
  title: string;
  icon?: string;
  img?: string;
  caret?: boolean;
  render?: ReactNode;
}
// =============================================================

export default function CategoryListItem({ href, title, render, icon, img, caret = true }: Props) {
  const iconKey = icon?.trim();
  const hasIconComponent = Boolean(iconKey && /^[A-Za-z][A-Za-z0-9]*$/.test(iconKey));
  const hasRawIcon = Boolean(iconKey && !hasIconComponent);

  return (
    <Wrapper>
      <Link href={href}>
        <div className="category-dropdown-link">
          {img ? (
            <Box
              component="img"
              src={img}
              alt={title}
              sx={{ width: 22, height: 22, borderRadius: 0.75, objectFit: "cover", flexShrink: 0 }}
            />
          ) : hasIconComponent ? (
            <IconComponent icon={iconKey!} fontSize="small" color="inherit" />
          ) : hasRawIcon ? (
            <Box
              component="span"
              sx={{ fontSize: 18, lineHeight: 1, width: 22, textAlign: "center" }}
            >
              {iconKey}
            </Box>
          ) : null}
          <span className="title">{title}</span>
          {caret && <ChevronRight fontSize="small" className="caret-icon" />}
        </div>
      </Link>

      {render && <div className="mega-menu">{render}</div>}
    </Wrapper>
  );
}
