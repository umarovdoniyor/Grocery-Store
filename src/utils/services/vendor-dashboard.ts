import type Ticket from "models/Ticket.model";
import { getMyProducts } from "../../../libs/product";
import { getVendorProductReviews, type ProductReviewStatus } from "../../../libs/review";
import { toPublicImageUrl } from "../../../libs/upload";
import { getVendorDashboardSummary } from "../../../libs/vendor";

interface VendorReviewRow {
  name: string;
  image: string;
  rating: number;
  comment: string;
  customer: string;
}

interface VendorReviewSummary {
  ratingAvg: number;
  reviewsCount: number;
  rating1Count: number;
  rating2Count: number;
  rating3Count: number;
  rating4Count: number;
  rating5Count: number;
}

const DEFAULT_REVIEW_PRODUCT_IMAGE = "/assets/images/products/placeholder.png";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
  "http://localhost:3001";

function resolveReviewProductImage(value?: string | null) {
  const normalized = value?.trim();
  if (!normalized) return DEFAULT_REVIEW_PRODUCT_IMAGE;

  try {
    return toPublicImageUrl(normalized, API_BASE);
  } catch {
    return DEFAULT_REVIEW_PRODUCT_IMAGE;
  }
}

function formatMetric(value: number) {
  return value.toLocaleString();
}

export async function getVendorDashboardCards() {
  const summaryResponse = await getVendorDashboardSummary();
  if (summaryResponse.success && summaryResponse.summary) {
    const summary = summaryResponse.summary;

    return [
      {
        id: 1,
        title: "Total Products",
        color: "primary",
        amount1: formatMetric(summary.products.total),
        amount2: summary.products.total,
        percentage: "0%",
        status: "up"
      },
      {
        id: 2,
        title: "Published Products",
        color: "success",
        amount1: formatMetric(summary.products.published),
        amount2: summary.products.published,
        percentage: "0%",
        status: "up"
      },
      {
        id: 3,
        title: "Low Stock Items",
        color: "warning",
        amount1: formatMetric(summary.products.lowStock),
        amount2: summary.products.lowStock,
        percentage: "0%",
        status: summary.products.lowStock > 0 ? "down" : "up"
      },
      {
        id: 4,
        title: `Revenue (${summary.revenue.currency || "USD"})`,
        color: "info",
        amount1: formatMetric(summary.revenue.gross),
        amount2: summary.orders.delivered,
        percentage: "0%",
        status: "up"
      }
    ];
  }

  const response = await getMyProducts({ page: 1, limit: 200 });

  if (!response.success || !response.list) {
    return [
      {
        id: 1,
        title: "Total Products",
        color: "primary",
        amount1: "0",
        amount2: 0,
        percentage: "0%",
        status: "up"
      },
      {
        id: 2,
        title: "Published Products",
        color: "success",
        amount1: "0",
        amount2: 0,
        percentage: "0%",
        status: "up"
      },
      {
        id: 3,
        title: "Low Stock Items",
        color: "warning",
        amount1: "0",
        amount2: 0,
        percentage: "0%",
        status: "up"
      },
      {
        id: 4,
        title: "Product Orders",
        color: "info",
        amount1: "0",
        amount2: 0,
        percentage: "0%",
        status: "up"
      }
    ];
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
    return [];
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

  return mapped;
}

export async function getVendorSupportTickets(): Promise<Ticket[]> {
  return [];
}

export async function getVendorReviews(status?: ProductReviewStatus) {
  const response = await getVendorProductReviews({
    page: 1,
    limit: 50,
    status,
    search: "",
    sortBy: "NEWEST"
  });

  if (!response.success || !response.list) {
    return {
      reviews: [] as VendorReviewRow[],
      summary: {
        ratingAvg: 0,
        reviewsCount: 0,
        rating1Count: 0,
        rating2Count: 0,
        rating3Count: 0,
        rating4Count: 0,
        rating5Count: 0
      } as VendorReviewSummary,
      total: 0,
      error: response.error
    };
  }

  const reviews = response.list.map((item) => {
    const firstName = item.member?.memberFirstName || item.member?.memberNickname || "Customer";
    const lastName = item.member?.memberLastName || "";
    const customerName = `${firstName} ${lastName}`.trim();

    return {
      name: item.product?.title || "Product",
      image: resolveReviewProductImage(item.product?.thumbnail),
      rating: Number(item.rating || 0),
      comment: item.comment || "-",
      customer: customerName || "Customer"
    };
  });

  return {
    reviews,
    summary: response.summary || {
      ratingAvg: 0,
      reviewsCount: reviews.length,
      rating1Count: 0,
      rating2Count: 0,
      rating3Count: 0,
      rating4Count: 0,
      rating5Count: 0
    },
    total: response.meta?.total || reviews.length
  };
}

export async function getVendorPayoutRequests() {
  return [];
}

export async function getVendorPayouts() {
  return [];
}

export async function getVendorRefundRequests() {
  return [];
}

export async function getVendorEarningHistory() {
  return [];
}
