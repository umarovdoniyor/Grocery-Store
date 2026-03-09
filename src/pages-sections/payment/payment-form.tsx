import Link from "next/link";
import { Fragment, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
// MUI
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";
// LOCAL CUSTOM COMPONENTS
import FormLabel from "./form-label";
import CreditCardForm from "./credit-card-form";
import useCart from "hooks/useCart";
import {
  createOrderFromCartServer,
  type CheckoutPaymentMethod,
  type CheckoutShippingDraft,
  validateCheckoutServer
} from "utils/services/checkout-flow";

export default function PaymentForm() {
  const router = useRouter();
  const { dispatch } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [error, setError] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const paymentMethodCode = useMemo<CheckoutPaymentMethod>(() => {
    if (paymentMethod === "paypal") return "PAYPAL";
    if (paymentMethod === "cod") return "COD";
    return "CARD";
  }, [paymentMethod]);

  const paymentMethodLabel = useMemo(() => {
    if (paymentMethodCode === "PAYPAL") return "PayPal";
    if (paymentMethodCode === "COD") return "COD";
    return "CARD";
  }, [paymentMethodCode]);

  const handleChangeTo = useCallback((e: React.SyntheticEvent<Element, Event>) => {
    setPaymentMethod((e.target as HTMLInputElement).name);
  }, []);

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
  }, [dispatch, paymentMethodCode, paymentMethodLabel, router]);

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
        {/* CREDIT CARD OPTION */}
        <FormLabel
          name="credit-card"
          title="Pay with credit card"
          checked={paymentMethod === "credit-card"}
          handleChange={handleChangeTo}
        />

        {paymentMethod === "credit-card" && <CreditCardForm />}

        <Divider sx={{ my: 3, mx: -4 }} />

        {/* PAYPAL CARD OPTION */}
        <FormLabel
          name="paypal"
          title="Pay with Paypal"
          checked={paymentMethod === "paypal"}
          handleChange={handleChangeTo}
        />

        {paymentMethod === "paypal" && (
          <FlexBox alignItems="center" gap={2} mt={1} mb={4}>
            <TextField fullWidth name="email" type="email" label="Paypal Email" />
            <Button variant="outlined" color="primary" type="button">
              Submit
            </Button>
          </FlexBox>
        )}

        <Divider sx={{ my: 3, mx: -4 }} />

        {/* CASH ON DELIVERY OPTION */}
        <FormLabel
          name="cod"
          title="Cash On Delivery"
          checked={paymentMethod === "cod"}
          handleChange={handleChangeTo}
        />
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
