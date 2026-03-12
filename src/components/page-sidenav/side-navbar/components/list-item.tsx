"use client";

import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
// GLOBAL CUSTOM COMPONENTS
import IconComponent from "components/IconComponent";
// CUSTOM DATA MODEL
import { CategoryNavItem } from "models/CategoryNavList.model";

// ==============================================================
type Props = { item: CategoryNavItem };
// ==============================================================

export default function ListItem({ item }: Props) {
  const { category } = useParams();
  const iconKey = item.icon?.trim();
  const hasIconComponent = Boolean(iconKey && /^[A-Za-z][A-Za-z0-9]*$/.test(iconKey));
  const hasRawIcon = Boolean(iconKey && !hasIconComponent);

  return (
    <div className={clsx({ "list-item": true, active: item.href!.endsWith(category as string) })}>
      {item.image ? (
        <Box
          component="img"
          src={item.image}
          alt={item.title}
          sx={{ width: 20, height: 20, borderRadius: 0.5, objectFit: "cover", flexShrink: 0 }}
        />
      ) : hasIconComponent ? (
        <IconComponent icon={iconKey!} fontSize="small" color="inherit" />
      ) : hasRawIcon ? (
        <Box component="span" sx={{ fontSize: 16, lineHeight: 1, width: 20, textAlign: "center" }}>
          {iconKey}
        </Box>
      ) : null}
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {item.title}
      </Typography>
    </div>
  );
}
