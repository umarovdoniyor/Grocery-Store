import Link from "next/link";
import Box from "@mui/material/Box";
import IconComponent from "components/IconComponent";
import { Circle, StyledList } from "../styles";

// ==============================================================
type Child = { title: string; href: string; icon?: string; image?: string };
// ==============================================================

export const renderChild = (child: Child[], active: string) => {
  return child.map(({ title, href }, index) => (
    <Link href={href} key={index}>
      <StyledList active={active === title}>
        {child[index].image ? (
          <Box
            component="img"
            src={child[index].image}
            alt={title}
            sx={{ width: 14, height: 14, borderRadius: 0.5, objectFit: "cover", flexShrink: 0 }}
          />
        ) : child[index].icon && /^[A-Za-z][A-Za-z0-9]*$/.test(child[index].icon!) ? (
          <IconComponent icon={child[index].icon!} fontSize="small" color="inherit" />
        ) : child[index].icon ? (
          <Box component="span" sx={{ fontSize: 12, lineHeight: 1 }}>
            {child[index].icon}
          </Box>
        ) : (
          <Circle className="dot" />
        )}
        <p>{title}</p>
      </StyledList>
    </Link>
  ));
};
