"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AsyncState from "components/AsyncState";
import { OrdersPageView } from "pages-sections/vendor-dashboard/orders/page-view";
import type Order from "models/Order.model";
import { fetchAdminOrdersForUiByQuery } from "utils/services/admin-orders";

export default function OrdersClient() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return <OrdersPageView orders={orders} />;
}
