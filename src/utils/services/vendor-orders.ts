import type Order from "models/Order.model";
import type { OrderStatus } from "models/Order.model";
import type User from "models/User.model";
import { updateMyVendorOrderItemStatus, type VendorOrderItemStatus } from "../../../libs/vendor";
import { initializeApollo } from "../../../apollo/client";
import { GET_MY_VENDOR_ORDER_BY_ID, GET_MY_VENDOR_ORDERS } from "../../../apollo/user/query";
import { toPublicImageUrl } from "../../../libs/upload";
import { getPublicApiBaseUrl as getApiBaseUrl } from "../getApiBaseUrl";

interface MyOrderItem {
  _id: string;
  orderId: string;
  productId: string;
  vendorId: string;
  status?: string;
  quantity: number;
  unitPrice: number;
  salePrice?: number | null;
  appliedPrice: number;
  lineTotal: number;
  productSnapshotTitle: string;
  productSnapshotThumbnail?: string | null;
  productSnapshotUnit?: string | null;
}

interface MyOrder {
  _id: string;
  memberId: string;
  status: string;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  addressLine1: string;
  addressLine2?: string | null;
  addressCity: string;
  addressState?: string | null;
  addressPostalCode: string;
  addressCountry: string;
  deliveredAt?: string | null;
  createdAt: string;
  items: MyOrderItem[];
}

const mapStatus = (status?: string): OrderStatus => {
  if (!status) return "Pending";
  if (status === "DELIVERED") return "Delivered";
  if (status === "CANCELED" || status === "CANCELLED") return "Cancelled";
  if (status === "PAID" || status === "CONFIRMED" || status === "PACKING" || status === "SHIPPED") {
    return "Processing";
  }
  return "Pending";
};

const toShippingAddress = (order: MyOrder) => {
  return [
    order.addressLine1,
    order.addressLine2,
    order.addressCity,
    order.addressState,
    order.addressPostalCode,
    order.addressCountry
  ]
    .filter(Boolean)
    .join(", ");
};

const toPlaceholderUser = (memberId: string): User => ({
  id: memberId,
  email: "",
  phone: "",
  avatar: "",
  password: "",
  dateOfBirth: "",
  verified: false,
  name: { firstName: "", lastName: "" }
});

const mapVendorOrdersError = (message?: string) => {
  const fallback = "Failed to load vendor orders.";
  if (!message) return fallback;

  const normalized = message.toLowerCase();
  if (
    normalized.includes("forbidden") ||
    normalized.includes("unauthorized") ||
    normalized.includes("permission") ||
    normalized.includes("not allowed")
  ) {
    return "Vendor orders API permission is not enabled yet for this account. Please enable vendor order access on backend.";
  }

  return message;
};

const DEFAULT_ORDER_ITEM_THUMBNAIL = "/assets/images/products/placeholder.png";

const resolveVendorOrderItemImage = (value?: string | null) => {
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

function mapVendorOrderToUi(order: MyOrder): Order {
  const createdAt = new Date(order.createdAt);
  const deliveredAt = order.deliveredAt ? new Date(order.deliveredAt) : createdAt;
  const vendorItems = order.items || [];
  const vendorTotal = vendorItems.reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);

  return {
    id: order._id,
    user: toPlaceholderUser(order.memberId),
    tax: Number(order.taxAmount || 0),
    items: vendorItems.map((item) => ({
      item_id: item._id,
      product_id: item.productId,
      order_id: item.orderId,
      product_img: resolveVendorOrderItemImage(item.productSnapshotThumbnail),
      product_name: item.productSnapshotTitle || "Product",
      product_price: Number(item.appliedPrice || 0),
      product_quantity: Number(item.quantity || 1),
      variant: item.productSnapshotUnit || undefined,
      status: item.status || order.status
    })),
    createdAt,
    discount: Number(order.discountAmount || 0),
    deliveredAt,
    totalPrice: vendorTotal,
    isDelivered: order.status === "DELIVERED",
    shippingAddress: toShippingAddress(order),
    rawStatus: order.status,
    status: mapStatus(order.status)
  };
}

export async function fetchVendorOrdersForUi(
  vendorId: string
): Promise<{ orders: Order[]; error?: string }> {
  if (!vendorId) {
    return { orders: [], error: "Vendor account is not available." };
  }

  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_MY_VENDOR_ORDERS,
      variables: { input: { page: 1, limit: 100 } },
      fetchPolicy: "network-only"
    });

    const list: MyOrder[] = data?.getMyVendorOrders?.list || [];

    const orders = list.map(mapVendorOrderToUi);

    return { orders };
  } catch (error: any) {
    return { orders: [], error: mapVendorOrdersError(error?.message) };
  }
}

export async function fetchVendorOrderByIdForUi(
  orderId: string,
  vendorId: string
): Promise<{ order: Order | null; error?: string }> {
  if (!vendorId) {
    return { order: null, error: "Vendor account is not available." };
  }

  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_MY_VENDOR_ORDER_BY_ID,
      variables: { orderId },
      fetchPolicy: "network-only"
    });

    const order: MyOrder | null = data?.getMyVendorOrderById || null;

    if (!order) {
      return { order: null, error: "Order not found." };
    }

    const mapped = mapVendorOrderToUi(order);
    if (!mapped) {
      return { order: null, error: "You do not have access to this order." };
    }

    return { order: mapped };
  } catch (error: any) {
    return { order: null, error: mapVendorOrdersError(error?.message) };
  }
}

export async function updateVendorOrderItemStatusForUi(input: {
  orderId: string;
  itemId: string;
  status: VendorOrderItemStatus;
}): Promise<{ success: boolean; status?: VendorOrderItemStatus; error?: string }> {
  const response = await updateMyVendorOrderItemStatus(input);

  if (!response.success || !response.result) {
    return { success: false, error: response.error || "Failed to update order item status" };
  }

  return { success: true, status: response.result.status };
}
