"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { OrderDetailsPageView } from "./order-details";
import type Order from "models/Order.model";
import { getCustomerOrderById } from "utils/services/customer-orders";

interface Props {
  orderId: string;
}

export default function OrderDetailsClient({ orderId }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getCustomerOrderById(orderId).then((result) => {
      if (!active) return;

      if (!result.success || !result.order) {
        setError(result.error || "Order not found");
        return;
      }

      setOrder(result.order);
    });

    return () => {
      active = false;
    };
  }, [orderId]);

  if (!order && !error) {
    return (
      <Box minHeight={280} display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box minHeight={280} display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography color="error.main">{error || "Order not found"}</Typography>
        <Button LinkComponent={Link} href="/orders" variant="outlined" color="primary">
          Back to Orders
        </Button>
      </Box>
    );
  }

  return <OrderDetailsPageView order={order} />;
}
