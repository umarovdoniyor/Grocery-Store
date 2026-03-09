import { initializeApollo } from "../../../apollo/client";
import { GET_CHECKOUT_SUMMARY } from "../../../apollo/user/query";
import { CREATE_ORDER_FROM_CART, VALIDATE_CART_FOR_CHECKOUT } from "../../../apollo/user/mutation";

export interface CheckoutSummaryData {
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
}

export interface CheckoutValidationIssue {
  code: string;
  message: string;
  productId?: string;
  requestedQty?: number;
  availableQty?: number;
}

export interface CheckoutValidationResult {
  isValid: boolean;
  issues: CheckoutValidationIssue[];
  summary?: CheckoutSummaryData;
}

export interface CheckoutSnapshotResult {
  isValid: boolean;
  summary?: CheckoutSummaryData;
  issues: CheckoutValidationIssue[];
}

export interface CheckoutShippingDraft {
  shipping_name: string;
  shipping_contact: string;
  shipping_address1: string;
  shipping_address2?: string;
  shipping_zip: string;
  shipping_country?: { label?: string; value?: string } | string;
}

export type CheckoutPaymentMethod = "CARD" | "PAYPAL" | "COD";

interface CreateOrderFromCartPayload {
  paymentMethod: CheckoutPaymentMethod;
  shipping: CheckoutShippingDraft;
  note?: string;
}

export interface CreatedOrderData {
  id: string;
  orderNo: string;
  paymentMethod: string;
  totalAmount: number;
  currency: string;
}

export async function getCheckoutSummaryServer(): Promise<{
  success: boolean;
  summary?: CheckoutSummaryData;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.query({
      query: GET_CHECKOUT_SUMMARY,
      fetchPolicy: "network-only"
    });

    const summary = data?.getCheckoutSummary;
    if (!summary) {
      return { success: false, error: "Checkout summary is unavailable" };
    }

    return { success: true, summary };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch checkout summary" };
  }
}

export async function validateCheckoutServer(): Promise<{
  success: boolean;
  validation?: CheckoutValidationResult;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.mutate({
      mutation: VALIDATE_CART_FOR_CHECKOUT
    });

    const validation = data?.validateCartForCheckout;
    if (!validation) {
      return { success: false, error: "Checkout validation is unavailable" };
    }

    return { success: true, validation };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to validate checkout" };
  }
}

export async function getCheckoutSnapshotServer(): Promise<{
  success: boolean;
  snapshot?: CheckoutSnapshotResult;
  error?: string;
}> {
  const validation = await validateCheckoutServer();

  if (validation.success && validation.validation) {
    const summary = validation.validation.summary;

    if (summary) {
      return {
        success: true,
        snapshot: {
          isValid: validation.validation.isValid,
          issues: validation.validation.issues || [],
          summary
        }
      };
    }
  }

  const summaryRes = await getCheckoutSummaryServer();
  if (!summaryRes.success || !summaryRes.summary) {
    return {
      success: false,
      error: validation.error || summaryRes.error || "Checkout snapshot is unavailable"
    };
  }

  return {
    success: true,
    snapshot: {
      isValid: true,
      summary: summaryRes.summary,
      issues: []
    }
  };
}

export async function createOrderFromCartServer(input: CreateOrderFromCartPayload): Promise<{
  success: boolean;
  data?: CreatedOrderData;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();
    const countryValue =
      typeof input.shipping.shipping_country === "string"
        ? input.shipping.shipping_country
        : input.shipping.shipping_country?.value || input.shipping.shipping_country?.label || "";

    const safeValue = (value: string | undefined, fallback = "N/A") => {
      const trimmed = (value || "").trim();
      return trimmed.length > 0 ? trimmed : fallback;
    };

    const mutationInput = {
      paymentMethod: input.paymentMethod,
      address: {
        fullName: safeValue(input.shipping.shipping_name),
        phone: safeValue(input.shipping.shipping_contact),
        line1: safeValue(input.shipping.shipping_address1),
        line2: input.shipping.shipping_address2 || "",
        city: "N/A",
        state: "N/A",
        postalCode: safeValue(input.shipping.shipping_zip),
        country: safeValue(countryValue, "KR")
      },
      note: input.note || ""
    };

    const { data } = await apolloClient.mutate({
      mutation: CREATE_ORDER_FROM_CART,
      variables: { input: mutationInput }
    });

    const order = data?.createOrderFromCart;
    if (!order?._id || !order?.orderNo) {
      return { success: false, error: "Order was not created" };
    }

    return {
      success: true,
      data: {
        id: order._id,
        orderNo: order.orderNo,
        paymentMethod: order.paymentMethod || input.paymentMethod,
        totalAmount: Number(order.totalAmount || 0),
        currency: order.currency || "USD"
      }
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to place order" };
  }
}
