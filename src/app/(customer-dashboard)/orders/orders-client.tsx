"use client";

import { useEffect, useState } from "react";
import AsyncState from "components/AsyncState";
import { useAuth } from "contexts/AuthContext";
import { OrdersPageView } from "pages-sections/customer-dashboard/orders/page-view";
import type Order from "models/Order.model";
import { getCustomerOrders } from "utils/services/customer-orders";

type Props = { page?: string };

export default function OrdersClient({ page }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      setError("Please login to view your orders.");
      return;
    }

    let active = true;
    const currentPage = Number.parseInt(page || "1", 10) || 1;

    const load = async () => {
      setLoading(true);
      setError(null);

      const data = await getCustomerOrders(currentPage);
      if (!active) return;

      if (!data.success) {
        setOrders([]);
        setTotalPages(1);
        setError(data.error || "Failed to load orders");
      } else {
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
      }

      setLoading(false);
    };

    load();

    return () => {
      active = false;
    };
  }, [isAuthenticated, isLoading, page]);

  if (isLoading || loading) return <AsyncState loading />;
  if (error) return <AsyncState error={error} />;
  if (orders.length === 0) return <AsyncState emptyText="You have no orders yet." />;

  return <OrdersPageView orders={orders} totalPages={totalPages} />;
}
