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
import { validateCheckoutServer } from "utils/services/checkout-flow";

export default function PaymentForm() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [error, setError] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const paymentMethodLabel = useMemo(() => {
    if (paymentMethod === "paypal") return "PayPal";
    if (paymentMethod === "cod") return "COD";
    return "CARD";
  }, [paymentMethod]);

  const handleChangeTo = useCallback((e: React.SyntheticEvent<Element, Event>) => {
    setPaymentMethod((e.target as HTMLInputElement).name);
  }, []);

  const handleReview = useCallback(async () => {
    setIsReviewing(true);
    setError(null);

    const validation = await validateCheckoutServer();

    if (validation.success && validation.validation && !validation.validation.isValid) {
      const firstIssue = validation.validation.issues?.[0]?.message;
      setError(firstIssue || "Cart validation failed. Please update your cart and try again.");
      setIsReviewing(false);
      return;
    }

    router.push(`/order-confirmation?method=${paymentMethodLabel}`);
  }, [paymentMethodLabel, router]);

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
          onClick={handleReview}
        >
          Review
        </Button>
      </Stack>
    </Fragment>
  );
}
