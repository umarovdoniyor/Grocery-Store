"use client";

import { usePathname, useRouter } from "next/navigation";
import Drawer from "@mui/material/Drawer";
// GLOBAL CUSTOM COMPONENTS
import { MiniCart } from "pages-sections/mini-cart";

export default function MiniCartDrawer() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname !== "/mini-cart") return null;

  return (
    <Drawer
      open
      anchor="right"
      onClose={router.back}
      sx={{
        zIndex: 9999,
        "& .MuiDrawer-paper": {
          borderLeft: "1px solid rgba(27,63,75,0.2)",
          boxShadow: "-16px 0 36px rgba(22, 59, 70, 0.2)",
          background: "transparent"
        }
      }}
    >
      <MiniCart />
    </Drawer>
  );
}
