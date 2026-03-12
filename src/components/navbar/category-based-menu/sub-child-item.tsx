import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
// ICON COMPONENTS
import Icons from "icons/duotone";
// DATA TYPES
import { CategoryMenuItemWithChild } from "models/Navigation.model";
// STYLED COMPONENTS
import { SubCategoryListItem } from "./styles";

export function SubChildItem({ item }: { item: CategoryMenuItemWithChild }) {
  const { title, url = "/", icon, img } = item;

  const Icon = icon ? Icons[icon as keyof typeof Icons] : null;
  const iconIsComponentKey = Boolean(icon && /^[A-Za-z][A-Za-z0-9]*$/.test(icon));

  return (
    <Link href={url}>
      <SubCategoryListItem>
        {img && (
          <Avatar className="sub-item-avatar">
            <Box
              component="img"
              alt={title}
              src={img}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Avatar>
        )}

        {!img && Icon && iconIsComponentKey && <Icon sx={{ fontSize: 16 }} />}
        {!img && icon && !iconIsComponentKey && <span style={{ fontSize: 16 }}>{icon}</span>}
        {title}
      </SubCategoryListItem>
    </Link>
  );
}
