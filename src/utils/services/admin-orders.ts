import type Order from "models/Order.model";
import type { OrderStatus } from "models/Order.model";
import type User from "models/User.model";
import {
  getOrderByIdByAdmin,
  getOrdersByAdmin,
  OrderByAdmin,
  updateOrderStatusByAdmin
} from "../../../libs/admin";
import { toPublicImageUrl } from "../../../libs/upload";
import { getPublicApiBaseUrl as getApiBaseUrl } from "../getApiBaseUrl";

const DEFAULT_ORDER_ITEM_THUMBNAIL = "/assets/images/products/placeholder.png";

const resolveAdminOrderItemImage = (value?: string | null) => {
  const normalized = (value || "").replace(/\\/g, "/").trim();
  if (!normalized) return DEFAULT_ORDER_ITEM_THUMBNAIL;

  if (normalized.startsWith("/assets/")) return normalized;

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    try {
      const parsed = new URL(normalized);
      return parsed.host ? normalized : DEFAULT_ORDER_ITEM_THUMBNAIL;
    } catch {
      return DEFAULT_ORDER_ITEM_THUMBNAIL;
    }
  }

  const apiBase = getApiBaseUrl();
  if (!apiBase) return normalized.startsWith("/") ? normalized : `/${normalized}`;

  return toPublicImageUrl(normalized, apiBase);
};

function toUiOrderStatus(status: string): OrderStatus {
  if (status === "DELIVERED") return "Delivered";
  if (status === "CANCELED") return "Cancelled";
  if (["PAID", "CONFIRMED", "PACKING", "SHIPPED"].includes(status)) return "Processing";
  return "Pending";
}

function toShippingAddress(order: OrderByAdmin): string {
  const addressParts = [
    order.addressLine1,
    order.addressLine2,
    order.addressCity,
    order.addressState,
    order.addressPostalCode,
    order.addressCountry
  ].filter(Boolean);

  return addressParts.join(", ");
}

function toPlaceholderUser(memberId: string): User {
  return {
    id: memberId,
    email: "",
    phone: "",
    avatar: "",
    password: "",
    dateOfBirth: "",
    verified: false,
    name: { firstName: "", lastName: "" }
  };
}

export function mapAdminOrderToUi(order: OrderByAdmin): Order {
  const createdAt = new Date(order.createdAt);
  const deliveredAt = order.deliveredAt ? new Date(order.deliveredAt) : createdAt;

  return {
    id: order._id,
    user: toPlaceholderUser(order.memberId),
    tax: order.taxAmount,
    items: order.items.map((item) => ({
      product_img: resolveAdminOrderItemImage(item.productSnapshotThumbnail),
      product_name: item.productSnapshotTitle,
      product_price: item.appliedPrice,
      product_quantity: item.quantity,
      variant: item.productSnapshotUnit || undefined
    })),
    createdAt,
    discount: order.discountAmount,
    deliveredAt,
    totalPrice: order.totalAmount,
    isDelivered: order.status === "DELIVERED",
    shippingAddress: toShippingAddress(order),
    status: toUiOrderStatus(order.status)
  };
}

export async function fetchAdminOrdersForUi(): Promise<{ orders: Order[]; error?: string }> {
  const response = await getOrdersByAdmin({ page: 1, limit: 50 });

  if (!response.success) {
    return { orders: [], error: response.error || "Failed to fetch admin orders" };
  }

  return { orders: (response.list || []).map(mapAdminOrderToUi) };
}

export async function fetchAdminOrdersForUiByQuery(input?: {
  page?: number;
  limit?: number;
  orderNo?: string;
  status?: string;
}): Promise<{ orders: Order[]; total: number; error?: string }> {
  const response = await getOrdersByAdmin({
    page: input?.page || 1,
    limit: input?.limit || 50,
    orderNo: input?.orderNo || undefined,
    status: input?.status || undefined
  });

  if (!response.success) {
    return { orders: [], total: 0, error: response.error || "Failed to fetch admin orders" };
  }

  return {
    orders: (response.list || []).map(mapAdminOrderToUi),
    total: Number(response.total || 0)
  };
}

export async function fetchAdminOrderByIdForUi(
  orderId: string
): Promise<{ order: Order | null; error?: string }> {
  const response = await getOrderByIdByAdmin(orderId);

  if (!response.success) {
    return { order: null, error: response.error || "Failed to fetch admin order" };
  }

  if (!response.order) {
    return { order: null };
  }

  return { order: mapAdminOrderToUi(response.order) };
}

export async function markAdminOrderDeliveredForUi(
  orderId: string
): Promise<{ order: Order | null; error?: string }> {
  const response = await updateOrderStatusByAdmin({
    orderId,
    status: "DELIVERED"
  });

  if (!response.success) {
    return { order: null, error: response.error || "Failed to mark order as delivered" };
  }

  if (!response.order) {
    return { order: null, error: "Updated order was not returned" };
  }

  return { order: mapAdminOrderToUi(response.order) };
}
