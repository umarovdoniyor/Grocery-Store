"use client";

import { useEffect, useState } from "react";
import AsyncState from "components/AsyncState";
import { OrderDetailsPageView } from "pages-sections/vendor-dashboard/orders/page-view";
import type Order from "models/Order.model";
import { fetchAdminOrderByIdForUi } from "utils/services/admin-orders";

type Props = { id: string };

export default function OrderDetailsClient({ id }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
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

  return <OrderDetailsPageView order={order} />;
}
