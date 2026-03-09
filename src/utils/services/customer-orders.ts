import type Order from "models/Order.model";
import { initializeApollo } from "../../../apollo/client";
import { GET_MY_ORDER_BY_ID, GET_MY_ORDERS } from "../../../apollo/user/query";

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

const mapOrder = (order: any): Order => {
  const createdAt = toDate(order?.createdAt);
  const deliveredAt = toDate(order?.deliveredAt);
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
      product_img:
        item?.productSnapshotThumbnail ||
        "/assets/images/products/Fashion/Clothes/1.SilverHighNeckSweater.png",
      product_name: item?.productSnapshotTitle || "Product",
      product_price: Number(item?.appliedPrice ?? item?.unitPrice ?? 0),
      product_quantity: Number(item?.quantity || 1),
      variant: item?.productSnapshotUnit || undefined
    })),
    createdAt,
    discount: discountAmount,
    deliveredAt,
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
