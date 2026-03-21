"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AsyncState from "components/AsyncState";
import OrdersPageView from "pages-sections/vendor-dashboard/orders/page-view/orders";
import type Order from "models/Order.model";
import { useSnackbar } from "notistack";
import {
  fetchAdminOrdersForUiByQuery,
  markAdminOrderDeliveredForUi
} from "utils/services/admin-orders";

export default function OrdersClient() {
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const query = searchParams.get("q")?.trim() || "";
  const status = searchParams.get("status")?.trim() || "";

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const response = await fetchAdminOrdersForUiByQuery({
        page: 1,
        limit: 100,
        orderNo: query || undefined,
        status: status || undefined
      });

      if (response.error) {
        setError(response.error);
      } else {
        setError(null);
      }

      setOrders(response.orders);
      setLoading(false);
    };

    loadOrders();
  }, [query, status]);

  if (loading) {
    return <AsyncState loading />;
  }

  if (error) {
    return <AsyncState error={error} />;
  }

  const handleMarkDelivered = async (orderId: string) => {
    if (updatingOrderId) return;

    setUpdatingOrderId(orderId);
    const response = await markAdminOrderDeliveredForUi(orderId);
    setUpdatingOrderId(null);

    if (!response.order) {
      enqueueSnackbar(response.error || "Failed to update order status.", { variant: "error" });
      return;
    }

    setOrders((prev) => prev.map((item) => (item.id === orderId ? response.order! : item)));
    enqueueSnackbar("Order marked as delivered.", { variant: "success" });
  };

  return (
    <OrdersPageView
      orders={orders}
      uiMode="admin"
      showCreateButton={false}
      updatingOrderId={updatingOrderId}
      onMarkDelivered={handleMarkDelivered}
    />
  );
}
