import type Ticket from "models/Ticket.model";
import { ticketList } from "__server__/__db__/ticket/data";
import { cardList, recentPurchase, stockOutProducts } from "__server__/__db__/dashboard/data";
import {
  productReviews,
  payoutRequests as vendorPayoutRequests
} from "__server__/__db__/vendor/data";
import { payouts } from "__server__/__db__/dashboard/payouts";
import { refundRequest } from "__server__/__db__/dashboard/refundRequests";
import { earningHistory } from "__server__/__db__/dashboard/earning-history";
import { getMyProducts } from "../../../libs/product";

function formatMetric(value: number) {
  return value.toLocaleString();
}

export async function getVendorDashboardCards() {
  const response = await getMyProducts({ page: 1, limit: 200 });

  if (!response.success || !response.list) {
    return cardList;
  }

  const products = response.list;
  const totalProducts = products.length;
  const publishedProducts = products.filter((item) => item.status === "PUBLISHED").length;
  const lowStockProducts = products.filter((item) => item.stockQty <= 5).length;
  const totalOrders = products.reduce((sum, item) => sum + (item.ordersCount || 0), 0);

  return [
    {
      id: 1,
      title: "Total Products",
      color: "primary",
      amount1: formatMetric(totalProducts),
      amount2: totalProducts,
      percentage: "0%",
      status: "up"
    },
    {
      id: 2,
      title: "Published Products",
      color: "success",
      amount1: formatMetric(publishedProducts),
      amount2: publishedProducts,
      percentage: "0%",
      status: "up"
    },
    {
      id: 3,
      title: "Low Stock Items",
      color: "warning",
      amount1: formatMetric(lowStockProducts),
      amount2: lowStockProducts,
      percentage: "0%",
      status: lowStockProducts > 0 ? "down" : "up"
    },
    {
      id: 4,
      title: "Product Orders",
      color: "info",
      amount1: formatMetric(totalOrders),
      amount2: totalOrders,
      percentage: "0%",
      status: "up"
    }
  ];
}

export async function getVendorStockOutProducts() {
  const response = await getMyProducts({ page: 1, limit: 200 });

  if (!response.success || !response.list) {
    return stockOutProducts;
  }

  const mapped = response.list
    .filter((item) => item.stockQty <= 10)
    .sort((a, b) => a.stockQty - b.stockQty)
    .slice(0, 8)
    .map((item) => ({
      product: item.title,
      stock: String(item.stockQty),
      amount: item.salePrice || item.price
    }));

  return mapped.length ? mapped : stockOutProducts;
}

export async function getVendorRecentPurchase() {
  const response = await getMyProducts({ page: 1, limit: 200 });

  if (!response.success || !response.list) {
    return recentPurchase;
  }

  const mapped = response.list
    .filter((item) => (item.ordersCount || 0) > 0)
    .sort((a, b) => (b.ordersCount || 0) - (a.ordersCount || 0))
    .slice(0, 8)
    .map((item) => ({
      id: item._id,
      product: item.title,
      payment: "Card",
      amount: (item.salePrice || item.price) * Math.max(item.ordersCount || 1, 1)
    }));

  return mapped.length ? mapped : recentPurchase;
}

export async function getVendorSupportTickets(): Promise<Ticket[]> {
  return ticketList;
}

export async function getVendorReviews() {
  return productReviews;
}

export async function getVendorPayoutRequests() {
  return vendorPayoutRequests;
}

export async function getVendorPayouts() {
  return payouts;
}

export async function getVendorRefundRequests() {
  return refundRequest;
}

export async function getVendorEarningHistory() {
  return earningHistory;
}
