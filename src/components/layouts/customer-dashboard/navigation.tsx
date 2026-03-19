"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// CUSTOM COMPONENTS
import NavItem from "./nav-item";
// STYLED COMPONENTS
import { MainContainer } from "./styles";
import { initializeApollo } from "../../../../apollo/client";
import { GET_MY_ORDERS, GET_MY_WISHLIST } from "../../../../apollo/user/query";
import { useAuth } from "contexts/AuthContext";
import { getCustomerAddressList } from "utils/services/customer-dashboard";

const BASE_MENUS = [
  {
    title: "DASHBOARD",
    list: [
      { icon: "Packages", href: "/orders", title: "Orders", countKey: "orders" },
      { icon: "HeartLine", href: "/wish-list", title: "Wishlist", countKey: "wishlist" }
    ]
  },
  {
    title: "ACCOUNT SETTINGS",
    list: [
      { icon: "User3", href: "/profile", title: "Profile Info" },
      { icon: "Location", href: "/address", title: "Addresses", countKey: "addresses" }
    ]
  }
];

type CountKey = "orders" | "wishlist" | "addresses";
type DashboardCounts = Partial<Record<CountKey, number>>;

export function Navigation() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [counts, setCounts] = useState<DashboardCounts>({});

  const handleLogout = async () => {
    await logout();

    if (typeof window !== "undefined") {
      window.location.replace("/");
      return;
    }

    router.replace("/");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setCounts({});
      return;
    }

    let active = true;

    const loadCounts = async () => {
      const apolloClient = await initializeApollo();

      const [ordersResult, wishlistResult] = await Promise.allSettled([
        apolloClient.query({
          query: GET_MY_ORDERS,
          variables: { input: { page: 1, limit: 1 } },
          fetchPolicy: "network-only"
        }),
        apolloClient.query({
          query: GET_MY_WISHLIST,
          variables: { input: { page: 1, limit: 1 } },
          fetchPolicy: "network-only"
        })
      ]);

      if (!active) return;

      const ordersCount =
        ordersResult.status === "fulfilled"
          ? Number(ordersResult.value.data?.getMyOrders?.metaCounter?.total || 0)
          : 0;
      const wishlistCount =
        wishlistResult.status === "fulfilled"
          ? Number(wishlistResult.value.data?.getMyWishlist?.metaCounter?.total || 0)
          : 0;

      const addressCount = user ? getCustomerAddressList(user, 1).addressList.length : 0;

      setCounts({
        orders: ordersCount,
        wishlist: wishlistCount,
        addresses: addressCount
      });
    };

    loadCounts().catch(() => {
      if (!active) return;
      const addressCount = user ? getCustomerAddressList(user, 1).addressList.length : 0;
      setCounts({ addresses: addressCount });
    });

    return () => {
      active = false;
    };
  }, [isAuthenticated, user]);

  const menus = useMemo(
    () =>
      BASE_MENUS.map((section) => ({
        ...section,
        list: section.list.map((item) => ({
          ...item,
          count: item.countKey ? counts[item.countKey as CountKey] : undefined
        }))
      })),
    [counts]
  );

  return (
    <MainContainer>
      {menus.map((item) => (
        <Box mt={2} key={item.title}>
          <Typography
            fontSize={12}
            variant="body1"
            fontWeight={600}
            textTransform="uppercase"
            sx={{ padding: ".75rem 1.75rem", color: "#8B6A4A", letterSpacing: "0.06em" }}
          >
            {item.title}
          </Typography>

          {item.list.map((listItem) => (
            <NavItem item={listItem} key={listItem.title} />
          ))}
        </Box>
      ))}

      <Box px={4} mt={6} pb={2}>
        <Button
          disableElevation
          variant="outlined"
          fullWidth
          onClick={handleLogout}
          sx={{
            borderColor: "rgba(43, 38, 34, 0.3)",
            color: "#2B2622",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#2B2622",
              borderColor: "#2B2622",
              color: "#F4EEE3"
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </MainContainer>
  );
}
