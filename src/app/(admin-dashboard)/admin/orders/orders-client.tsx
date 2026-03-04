"use client";

import { useEffect, useState } from "react";
import AsyncState from "components/AsyncState";
import { OrdersPageView } from "pages-sections/vendor-dashboard/orders/page-view";
import type Order from "models/Order.model";
import { fetchAdminOrdersForUi } from "utils/services/admin-orders";

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      const response = await fetchAdminOrdersForUi();

      if (response.error) {
        setError(response.error);
      }

      setOrders(response.orders);
      setLoading(false);
    };

    loadOrders();
  }, []);

  if (loading) {
    return <AsyncState loading />;
  }

  if (error) {
    return <AsyncState error={error} />;
  }

  return <OrdersPageView orders={orders} />;
}
