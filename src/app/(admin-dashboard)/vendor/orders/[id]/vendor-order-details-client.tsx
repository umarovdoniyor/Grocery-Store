"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import AsyncState from "components/AsyncState";
import type Order from "models/Order.model";
import { useAuth } from "contexts/AuthContext";
import { useSnackbar } from "notistack";
import {
  fetchVendorOrderByIdForUi,
  updateVendorOrderItemStatusForUi
} from "utils/services/vendor-orders";

const OrderDetailsPageView = dynamic(
  () => import("pages-sections/vendor-dashboard/orders/page-view/order-details"),
  {
    loading: () => <AsyncState loading />,
    ssr: false
  }
);

type Props = { id: string };

export default function VendorOrderDetailsClient({ id }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setError("Vendor account is not available.");
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      const response = await fetchVendorOrderByIdForUi(id, user.id);

      if (response.error) {
        setError(response.error);
      }

      setOrder(response.order);
      setLoading(false);
    };

    loadOrder();
  }, [id, user?.id]);

  if (loading) {
    return <AsyncState loading />;
  }

  if (error) {
    return <AsyncState error={error} />;
  }

  if (!order) {
    return <AsyncState emptyText="Order not found." />;
  }

  const handleUpdateItemStatus = async (
    itemId: string,
    status: "PACKING" | "SHIPPED" | "DELIVERED"
  ) => {
    if (!order || updatingItemId) return;

    setUpdatingItemId(itemId);
    const response = await updateVendorOrderItemStatusForUi({
      orderId: order.id,
      itemId,
      status
    });
    setUpdatingItemId(null);

    if (!response.success || !response.status) {
      enqueueSnackbar(response.error || "Failed to update order item status", { variant: "error" });
      return;
    }

    setOrder((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        items: prev.items.map((item) =>
          item.item_id === itemId ? { ...item, status: response.status } : item
        )
      };
    });
    enqueueSnackbar("Order item status updated.", { variant: "success" });
  };

  return (
    <OrderDetailsPageView
      order={order}
      updatingItemId={updatingItemId}
      onUpdateItemStatus={handleUpdateItemStatus}
    />
  );
}
