import Brand from "models/Brand.model";
import Review from "models/Review.model";
import type { Card, StockOut } from "pages-sections/vendor-dashboard/dashboard/types";
import {
  getMembersByAdmin,
  getOrdersByAdmin,
  getProductsByAdmin,
  getVendorApplicationsByAdmin
} from "../../../libs/admin";

function formatMetric(value: number) {
  return value.toLocaleString();
}

export async function getAdminBrands(): Promise<Brand[]> {
  return [];
}

export async function getAdminProductReviews(): Promise<Review[]> {
  return [];
}

export async function getAdminPackagePayments() {
  return [];
}

export async function getAdminRefundRequests() {
  return [];
}

export async function getAdminEarningHistory() {
  return [];
}

export async function getAdminPayouts() {
  return [];
}

export async function getAdminPayoutRequests() {
  return [];
}

export async function getAdminDashboardCards() {
  const [ordersRes, productsRes, membersRes, applicationsRes] = await Promise.all([
    getOrdersByAdmin({ page: 1, limit: 1 }),
    getProductsByAdmin({ page: 1, limit: 1 }),
    getMembersByAdmin({ page: 1, limit: 1 }),
    getVendorApplicationsByAdmin({ page: 1, limit: 1, status: "PENDING" })
  ]);

  const totalOrders = ordersRes.success ? Number(ordersRes.total || 0) : 0;
  const totalProducts = productsRes.success ? Number(productsRes.total || 0) : 0;
  const totalCustomers = membersRes.success ? Number(membersRes.total || 0) : 0;
  const pendingApplications = applicationsRes.success ? Number(applicationsRes.total || 0) : 0;

  const cards: Card[] = [
    {
      id: 1,
      title: "Total Orders",
      color: "info.main",
      amount1: formatMetric(totalOrders),
      amount2: totalOrders,
      percentage: "0%",
      status: "up"
    },
    {
      id: 2,
      title: "Total Products",
      color: "success.main",
      amount1: formatMetric(totalProducts),
      amount2: totalProducts,
      percentage: "0%",
      status: "up"
    },
    {
      id: 3,
      title: "Total Customers",
      color: "primary.main",
      amount1: formatMetric(totalCustomers),
      amount2: totalCustomers,
      percentage: "0%",
      status: "up"
    },
    {
      id: 4,
      title: "Pending Applications",
      color: "warning.main",
      amount1: formatMetric(pendingApplications),
      amount2: pendingApplications,
      percentage: "0%",
      status: pendingApplications > 0 ? "down" : "up"
    }
  ];

  return cards;
}

export async function getAdminRecentPurchase() {
  const response = await getOrdersByAdmin({ page: 1, limit: 5 });

  if (!response.success || !response.list) {
    return [];
  }

  return response.list.map((order) => ({
    id: order.orderNo || order._id,
    amount: Number(order.totalAmount || 0),
    payment: order.paymentStatus || "-",
    product: order.items?.[0]?.productSnapshotTitle || "Order items"
  }));
}

export async function getAdminStockOutProducts() {
  const response = await getProductsByAdmin({ page: 1, limit: 200, status: "PUBLISHED" });

  if (!response.success || !response.list) {
    return [];
  }

  const stockOut: StockOut[] = response.list
    .filter((item) => Number(item.stockQty || 0) <= 10)
    .sort((a, b) => Number(a.stockQty || 0) - Number(b.stockQty || 0))
    .slice(0, 8)
    .map((item) => ({
      product: item.title,
      stock: String(item.stockQty || 0),
      amount: Number(item.salePrice ?? item.price ?? 0)
    }));

  return stockOut;
}
