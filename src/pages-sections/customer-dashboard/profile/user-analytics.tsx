"use client";

import { useEffect, useMemo, useState } from "react";
// MUI
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
import { toPublicImageUrl } from "../../../../libs/upload";
import { initializeApollo } from "../../../../apollo/client";
import { GET_MY_ORDERS } from "../../../../apollo/user/query";
import { useAuth } from "contexts/AuthContext";
// CUSTOM DATA MODEL
import User from "models/User.model";

// ==============================================================
type Props = { user: User };
// ==============================================================

const DEFAULT_ORDER_SUMMARY = {
  total: 0,
  awaitingPayment: 0,
  awaitingShipment: 0,
  awaitingDelivery: 0
};

const FALLBACK_AVATAR = "/assets/images/faces/propic(9).png";

const getApiBaseUrl = () => {
  const explicitBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  if (explicitBase) return explicitBase;

  const graphQlUrl =
    process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
    process.env.REACT_APP_API_GRAPHQL_URL ||
    "http://localhost:3007/graphql";

  try {
    const parsed = new URL(graphQlUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return graphQlUrl.replace(/\/graphql\/?$/, "");
  }
};

const normalizeMemberAvatarPath = (value: string) => {
  const normalized = value.replace(/\\/g, "/").trim();
  if (!normalized) return "";

  if (!normalized.includes("/")) {
    return `/uploads/member/${normalized}`;
  }

  return normalized;
};

const normalizeImageSrc = (value?: string) => {
  if (!value) return FALLBACK_AVATAR;
  const normalized = normalizeMemberAvatarPath(value);
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) return normalized;

  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) return normalized.startsWith("/") ? normalized : `/${normalized}`;

  return toPublicImageUrl(normalized, apiBaseUrl);
};

export default function UserAnalytics({ user }: Props) {
  const { isAuthenticated } = useAuth();
  const balance = 0;
  const type = `${(user.role || "customer").toUpperCase()} USER`;
  const [orderSummary, setOrderSummary] = useState(DEFAULT_ORDER_SUMMARY);
  const avatarSrc = normalizeImageSrc(user.avatar);

  useEffect(() => {
    if (!isAuthenticated) {
      setOrderSummary(DEFAULT_ORDER_SUMMARY);
      return;
    }

    let active = true;

    const loadOrderSummary = async () => {
      try {
        const apolloClient = await initializeApollo();
        const { data } = await apolloClient.query({
          query: GET_MY_ORDERS,
          variables: { input: { page: 1, limit: 200 } },
          fetchPolicy: "network-only"
        });

        if (!active) return;

        const list = data?.getMyOrders?.list || [];

        const awaitingPayment = list.filter(
          (item: any) => item.status === "PENDING_PAYMENT"
        ).length;
        const awaitingShipment = list.filter((item: any) =>
          ["PAID", "CONFIRMED", "PACKING"].includes(item.status)
        ).length;
        const awaitingDelivery = list.filter((item: any) =>
          ["SHIPPED", "IN_TRANSIT"].includes(item.status)
        ).length;

        setOrderSummary({
          total: Number(data?.getMyOrders?.metaCounter?.total || list.length || 0),
          awaitingPayment,
          awaitingShipment,
          awaitingDelivery
        });
      } catch {
        if (!active) return;
        setOrderSummary(DEFAULT_ORDER_SUMMARY);
      }
    };

    loadOrderSummary();

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const orderSummaryCards = useMemo(
    () => [
      {
        title: String(orderSummary.total),
        subtitle: "All Orders",
        tooltip: "Total orders linked to your account"
      },
      {
        title: String(orderSummary.awaitingPayment),
        subtitle: "Awaiting Payments",
        tooltip: "Orders currently in pending payment status"
      },
      {
        title: String(orderSummary.awaitingShipment),
        subtitle: "Awaiting Shipment",
        tooltip: "Paid/confirmed orders waiting to be shipped"
      },
      {
        title: String(orderSummary.awaitingDelivery),
        subtitle: "Awaiting Delivery",
        tooltip: "Shipped orders that are still in transit"
      }
    ],
    [orderSummary]
  );

  return (
    <Grid container spacing={3}>
      <Grid size={{ md: 6, xs: 12 }}>
        <Card
          elevation={0}
          sx={{
            gap: 2,
            height: "100%",
            display: "flex",
            border: "1px solid",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderColor: "grey.100"
          }}
        >
          <Avatar
            variant="rounded"
            src={avatarSrc}
            alt={user.name.firstName}
            sx={{ height: 65, width: 65 }}
          />

          <FlexBetween flexWrap="wrap" flex={1}>
            <div>
              <Typography variant="h5">{`${user.name.firstName} ${user.name.lastName}`}</Typography>

              <FlexBox alignItems="center" gap={1}>
                <Typography variant="body1" color="text.secondary">
                  Balance:
                </Typography>

                <Typography fontWeight={500} lineHeight={2} variant="body1" color="primary">
                  {currency(balance)}
                </Typography>
              </FlexBox>
            </div>

            <Typography
              variant="body1"
              letterSpacing={3}
              color="text.secondary"
              textTransform="uppercase"
            >
              {type}
            </Typography>
          </FlexBetween>
        </Card>
      </Grid>

      <Grid container spacing={3} size={{ md: 6, xs: 12 }}>
        {orderSummaryCards.map((item) => (
          <Grid size={{ lg: 3, xs: 6 }} key={item.subtitle}>
            <Tooltip title={item.tooltip} arrow>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  padding: "1rem 1.25rem",
                  borderColor: "grey.100",
                  borderStyle: "solid",
                  borderWidth: 1
                }}
              >
                <Typography variant="h3" color="primary">
                  {item.title}
                </Typography>

                <Typography
                  fontSize={13}
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center" }}
                >
                  {item.subtitle}
                </Typography>
              </Card>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
