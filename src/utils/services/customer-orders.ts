import type Order from "models/Order.model";
import { initializeApollo } from "../../../apollo/client";
import { CANCEL_MY_ORDER } from "../../../apollo/user/mutation";
import { GET_MY_ORDER_BY_ID, GET_MY_ORDERS } from "../../../apollo/user/query";
import { toPublicImageUrl } from "../../../libs/upload";
import { getPublicApiBaseUrl as getApiBaseUrl } from "../getApiBaseUrl";

export const CUSTOMER_CANCELLABLE_ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "CONFIRMED"
] as const;

export function isCustomerOrderCancellable(status?: string | null) {
  return !!status && CUSTOMER_CANCELLABLE_ORDER_STATUSES.includes(status as any);
}

const mapStatus = (status?: string): Order["status"] => {
  if (!status) return "Pending";

  if (status === "DELIVERED") return "Delivered";
  if (status === "CANCELED" || status === "CANCELLED") return "Cancelled";

  if (
    status === "PENDING_PAYMENT" ||
    status === "PAID" ||
    status === "CONFIRMED" ||
    status === "NEW"
  ) {
    return "Pending";
  }

  if (status === "PACKING" || status === "SHIPPED" || status === "IN_TRANSIT") {
    return "Processing";
  }

  return "Processing";
};

const toDate = (value?: string | null) => {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const DEFAULT_ORDER_ITEM_THUMBNAIL =
  "/assets/images/products/Fashion/Clothes/1.SilverHighNeckSweater.png";

const resolveOrderItemImage = (value?: string | null) => {
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

const mapOrder = (order: any): Order => {
  const createdAt = toDate(order?.createdAt);
  const deliveredAt = toDate(order?.deliveredAt);
  const subtotal = Number(order?.subtotal || 0);
  const deliveryFee = Number(order?.deliveryFee || 0);
  const discountAmount = Number(order?.discountAmount || 0);
  const totalAmount = Number(order?.totalAmount || 0);

  return {
    id: order?._id || "",
    user: {
      id: order?.memberId || "",
      email: "",
      phone: order?.addressPhone || "",
      avatar: "",
      password: "",
      dateOfBirth: "",
      verified: false,
      name: {
        firstName: order?.addressFullName || "",
        lastName: ""
      }
    },
    tax: Number(order?.taxAmount || 0),
    items: (order?.items || []).map((item: any) => ({
      product_id: item?.productId || "",
      order_id: item?.orderId || order?._id || "",
      item_id: item?._id || "",
      product_img: resolveOrderItemImage(item?.productSnapshotThumbnail),
      product_name: item?.productSnapshotTitle || "Product",
      product_price: Number(item?.appliedPrice ?? item?.unitPrice ?? 0),
      product_quantity: Number(item?.quantity || 1),
      variant: item?.productSnapshotUnit || undefined,
      status: item?.status || undefined
    })),
    createdAt,
    discount: discountAmount,
    deliveredAt,
    subtotal,
    shippingFee: deliveryFee,
    totalPrice: totalAmount,
    isDelivered: order?.status === "DELIVERED",
    shippingAddress: [
      order?.addressLine1,
      order?.addressLine2,
      order?.addressCity,
      order?.addressState,
      order?.addressPostalCode,
      order?.addressCountry
    ]
      .filter(Boolean)
      .join(", "),
    paymentMethod: order?.paymentMethod || undefined,
    rawStatus: order?.status || undefined,
    status: mapStatus(order?.status)
  };
};

export async function getCustomerOrders(
  page: number,
  limit = 5
): Promise<{
  success: boolean;
  orders?: Order[];
  totalPages?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_MY_ORDERS,
      variables: { input: { page, limit } },
      fetchPolicy: "network-only"
    });

    const list = (data?.getMyOrders?.list || []).map(mapOrder);
    const total = Number(data?.getMyOrders?.metaCounter?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return { success: true, orders: list, totalPages };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch orders" };
  }
}

export async function getCustomerOrderById(orderId: string): Promise<{
  success: boolean;
  order?: Order;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_MY_ORDER_BY_ID,
      variables: { orderId },
      fetchPolicy: "network-only"
    });

    const orderData = data?.getMyOrderById;
    if (!orderData) {
      return { success: false, error: "Order not found" };
    }

    return { success: true, order: mapOrder(orderData) };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch order details" };
  }
}

export async function cancelCustomerOrder(input: {
  orderId: string;
  reason: string;
  currentStatus?: string;
}): Promise<{
  success: boolean;
  order?: Order;
  error?: string;
}> {
  try {
    const reason = input.reason.trim();

    if (!reason) {
      return { success: false, error: "Cancel reason is required" };
    }

    if (input.currentStatus && !isCustomerOrderCancellable(input.currentStatus)) {
      return { success: false, error: "This order can no longer be cancelled." };
    }

    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.mutate({
      mutation: CANCEL_MY_ORDER,
      variables: {
        input: {
          orderId: input.orderId,
          reason
        }
      }
    });

    const orderData = data?.cancelMyOrder;
    if (!orderData) {
      return { success: false, error: "Failed to cancel order" };
    }

    return { success: true, order: mapOrder(orderData) };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to cancel order" };
  }
}
