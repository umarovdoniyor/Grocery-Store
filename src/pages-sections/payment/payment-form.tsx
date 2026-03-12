import Link from "next/link";
import { Fragment, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
// MUI
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useCart from "hooks/useCart";
import {
  createOrderFromCartServer,
  type CheckoutShippingDraft,
  validateCheckoutServer
} from "utils/services/checkout-flow";

export default function PaymentForm() {
  const router = useRouter();
  const { dispatch } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const paymentMethodCode = "COD" as const;
  const paymentMethodLabel = "Demo Payment";

  const handlePlaceOrder = useCallback(async () => {
    setIsReviewing(true);
    setError(null);

    const validation = await validateCheckoutServer();

    if (validation.success && validation.validation && !validation.validation.isValid) {
      const firstIssue = validation.validation.issues?.[0]?.message;
      setError(firstIssue || "Cart validation failed. Please update your cart and try again.");
      setIsReviewing(false);
      return;
    }

    if (!validation.success) {
      setError(validation.error || "Unable to validate order request. Please try again.");
      setIsReviewing(false);
      return;
    }

    const shippingRaw =
      typeof window !== "undefined" ? window.sessionStorage.getItem("checkout_shipping") : null;

    let shipping: CheckoutShippingDraft | null = null;
    if (shippingRaw) {
      try {
        shipping = JSON.parse(shippingRaw) as CheckoutShippingDraft;
      } catch {
        shipping = null;
      }
    }

    if (!shipping?.shipping_name || !shipping?.shipping_contact || !shipping?.shipping_address1) {
      setError("Shipping information is missing. Please go back to checkout.");
      setIsReviewing(false);
      return;
    }

    const orderRes = await createOrderFromCartServer({
      paymentMethod: paymentMethodCode,
      shipping
    });

    if (!orderRes.success || !orderRes.data) {
      setError(orderRes.error || "Failed to create order. Please try again.");
      setIsReviewing(false);
      return;
    }

    // Keep client cart in sync immediately after successful server order creation.
    dispatch({ type: "HYDRATE_CART", payloads: [] });

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("checkout_shipping");
    }

    const params = new URLSearchParams({
      method: paymentMethodLabel,
      orderNo: orderRes.data.orderNo,
      orderId: orderRes.data.id
    });

    router.push(`/order-confirmation?${params.toString()}`);
  }, [dispatch, router]);

  return (
    <Fragment>
      <Card
        elevation={0}
        sx={{
          mb: 4,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "grey.50",
          padding: { sm: 3, xs: 2 }
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          Demo Payment
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Payment is simplified for this demo. Click Place Order to create the order record.
        </Typography>
      </Card>

      {error && (
        <Typography color="error.main" sx={{ mt: -2, mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* BUTTONS SECTION */}
      <Stack direction="row" spacing={3}>
        <Button
          fullWidth
          size="large"
          type="button"
          color="primary"
          href="/checkout"
          variant="outlined"
          LinkComponent={Link}
        >
          Back to checkout
        </Button>

        <Button
          fullWidth
          size="large"
          type="button"
          color="primary"
          variant="contained"
          loading={isReviewing}
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </Stack>
    </Fragment>
  );
}
