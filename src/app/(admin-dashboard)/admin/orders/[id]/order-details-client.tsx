"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import AsyncState from "components/AsyncState";
import type Order from "models/Order.model";
import { useSnackbar } from "notistack";
import {
  fetchAdminOrderByIdForUi,
  markAdminOrderDeliveredForUi
} from "utils/services/admin-orders";

const OrderDetailsPageView = dynamic(
  () => import("pages-sections/vendor-dashboard/orders/page-view/order-details"),
  {
    loading: () => <AsyncState loading />,
    ssr: false
  }
);

type Props = { id: string };

export default function OrderDetailsClient({ id }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [order, setOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      const response = await fetchAdminOrderByIdForUi(id);

      if (response.error) {
        setError(response.error);
      }

      setOrder(response.order);
      setLoading(false);
    };

    loadOrder();
  }, [id]);

  if (loading) {
    return <AsyncState loading />;
  }

  if (error) {
    return <AsyncState error={error} />;
  }

  if (!order) {
    return <AsyncState emptyText="Order not found." />;
  }

  const handleMarkDelivered = async () => {
    if (!order || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    const response = await markAdminOrderDeliveredForUi(order.id);
    setIsUpdatingStatus(false);

    if (!response.order) {
      enqueueSnackbar(response.error || "Failed to update order status.", { variant: "error" });
      return;
    }

    setOrder(response.order);
    enqueueSnackbar("Order marked as delivered.", { variant: "success" });
  };

  return (
    <OrderDetailsPageView
      order={order}
      uiMode="admin"
      isUpdatingStatus={isUpdatingStatus}
      onMarkDelivered={handleMarkDelivered}
    />
  );
}
