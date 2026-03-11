"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Search from "@mui/icons-material/Search";
import FlexBox from "components/flex-box/flex-box";
import { useAuth } from "contexts/AuthContext";
// LOCAL CUSTOM COMPONENTS
import AccountPopover from "./account-popover";
import NotificationsPopover from "./notification-popover";
// STYLED COMPONENTS
import { StyledInputBase } from "./styles";

const ADMIN_SEARCH_PATHS = [
  "/admin/orders",
  "/admin/products",
  "/admin/categories",
  "/admin/customers",
  "/admin/sellers"
];

const VENDOR_SEARCH_PATHS = ["/vendor/orders", "/vendor/products", "/vendor/reviews"];

function resolveSearchPath(pathname: string, role?: string) {
  if (role === "admin") {
    const matched = ADMIN_SEARCH_PATHS.find((path) => pathname.startsWith(path));
    return matched || "/admin/orders";
  }

  if (role === "vendor") {
    const matched = VENDOR_SEARCH_PATHS.find((path) => pathname.startsWith(path));
    return matched || "/vendor/products";
  }

  return pathname || "/";
}

export default function RightContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [value, setValue] = useState("");

  const searchPath = useMemo(
    () => resolveSearchPath(pathname, user?.role),
    [pathname, user?.role]
  );

  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  const applySearch = (input: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const normalized = input.trim();

    if (normalized) params.set("q", normalized);
    else params.delete("q");

    const query = params.toString();
    router.push(query ? `${searchPath}?${query}` : searchPath);
  };

  return (
    <FlexBox alignItems="center" gap={2}>
      <StyledInputBase
        value={value}
        placeholder={user?.role === "admin" ? "Search admin data..." : "Search dashboard data..."}
        startAdornment={<Search sx={{ color: "grey.500" }} />}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") applySearch(value);
        }}
      />

      <NotificationsPopover />
      <AccountPopover />
    </FlexBox>
  );
}
