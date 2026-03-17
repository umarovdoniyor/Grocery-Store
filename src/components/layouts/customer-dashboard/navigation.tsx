"use client";

import { useEffect, useMemo, useState } from "react";
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
import { getCustomerAddressList, getCustomerPayments } from "utils/services/customer-dashboard";

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
      { icon: "Location", href: "/address", title: "Addresses", countKey: "addresses" },
      {
        icon: "CreditCard",
        href: "/payment-methods",
        title: "Demo Payments",
        countKey: "paymentMethods"
      }
    ]
  }
];

type CountKey = "orders" | "wishlist" | "addresses" | "paymentMethods";
type DashboardCounts = Partial<Record<CountKey, number>>;

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [counts, setCounts] = useState<DashboardCounts>({});

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
      const paymentCount = getCustomerPayments(1).payments.length;

      setCounts({
        orders: ordersCount,
        wishlist: wishlistCount,
        addresses: addressCount,
        paymentMethods: paymentCount
      });
    };

    loadCounts().catch(() => {
      if (!active) return;
      const addressCount = user ? getCustomerAddressList(user, 1).addressList.length : 0;
      const paymentCount = getCustomerPayments(1).payments.length;
      setCounts({ addresses: addressCount, paymentMethods: paymentCount });
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
            fontWeight={500}
            color="text.secondary"
            textTransform="uppercase"
            sx={{ padding: ".75rem 1.75rem" }}
          >
            {item.title}
          </Typography>

          {item.list.map((listItem) => (
            <NavItem item={listItem} key={listItem.title} />
          ))}
        </Box>
      ))}

      <Box px={4} mt={6} pb={2}>
        <Button disableElevation variant="outlined" color="primary" fullWidth onClick={logout}>
          Logout
        </Button>
      </Box>
    </MainContainer>
  );
}
