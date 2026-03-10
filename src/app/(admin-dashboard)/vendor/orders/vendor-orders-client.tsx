"use client";

import { useEffect, useState } from "react";
import AsyncState from "components/AsyncState";
import { OrdersPageView } from "pages-sections/vendor-dashboard/orders/page-view";
import type Order from "models/Order.model";
import { useAuth } from "contexts/AuthContext";
import { fetchVendorOrdersForUi } from "utils/services/vendor-orders";

export default function VendorOrdersClient() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setError("Vendor account is not available.");
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      const response = await fetchVendorOrdersForUi(user.id);

      if (response.error) {
        setError(response.error);
      }

      setOrders(response.orders);
      setLoading(false);
    };

    loadOrders();
  }, [user?.id]);

  if (loading) {
    return <AsyncState loading />;
  }

  if (error) {
    return <AsyncState error={error} />;
  }

  return <OrdersPageView orders={orders} basePath="/vendor/orders" showCreateButton={false} />;
}
