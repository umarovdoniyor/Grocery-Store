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
import { getPublicApiBaseUrl as getApiBaseUrl } from "../../../utils/getApiBaseUrl";
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
        tooltip: "Total orders linked to your account",
        accent: "#2B2622"
      },
      {
        title: String(orderSummary.awaitingPayment),
        subtitle: "Awaiting Payments",
        tooltip: "Orders currently in pending payment status",
        accent: "#A44A3F"
      },
      {
        title: String(orderSummary.awaitingShipment),
        subtitle: "Awaiting Shipment",
        tooltip: "Paid/confirmed orders waiting to be shipped",
        accent: "#5D6B3F"
      },
      {
        title: String(orderSummary.awaitingDelivery),
        subtitle: "Awaiting Delivery",
        tooltip: "Shipped orders that are still in transit",
        accent: "#8B6A4A"
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
            border: "1px solid rgba(43, 38, 34, 0.18)",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderRadius: "6px",
            backgroundColor: "#2B2622",
            boxShadow: "4px 4px 0px rgba(164, 74, 63, 0.35)"
          }}
        >
          <Avatar
            variant="rounded"
            src={avatarSrc}
            alt={user.name.firstName}
            sx={{
              height: 66,
              width: 66,
              borderRadius: "4px",
              border: "2px solid rgba(200, 183, 156, 0.5)",
              boxShadow: "none"
            }}
          />

          <FlexBetween flexWrap="wrap" flex={1}>
            <div>
              <Typography variant="h5" sx={{ color: "#F4EEE3", fontWeight: 700 }}>
                {`${user.name.firstName} ${user.name.lastName}`}
              </Typography>

              <FlexBox alignItems="center" gap={1}>
                <Typography variant="body1" sx={{ color: "#C8B79C" }}>
                  Balance:
                </Typography>

                <Typography
                  fontWeight={700}
                  lineHeight={2}
                  variant="body1"
                  sx={{ color: "#C8B79C" }}
                >
                  {currency(balance)}
                </Typography>
              </FlexBox>
            </div>

            <Typography
              variant="caption"
              letterSpacing={1.8}
              textTransform="uppercase"
              sx={{
                px: 1.2,
                py: 0.45,
                borderRadius: "3px",
                border: "1px solid #A44A3F",
                color: "#F4EEE3",
                fontWeight: 600,
                backgroundColor: "rgba(164, 74, 63, 0.2)"
              }}
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
                  borderRadius: "4px",
                  border: `1px solid ${item.accent}`,
                  borderLeft: `3px solid ${item.accent}`,
                  backgroundColor: "#F4EEE3",
                  boxShadow: "none",
                  transition: "background-color 180ms ease",
                  "&:hover": {
                    backgroundColor: "#ede4d5"
                  }
                }}
              >
                <Typography variant="h3" sx={{ color: item.accent, fontWeight: 700 }}>
                  {item.title}
                </Typography>

                <Typography
                  fontSize={13}
                  variant="body1"
                  sx={{ textAlign: "center", color: "#7A6C60", fontWeight: 500 }}
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
