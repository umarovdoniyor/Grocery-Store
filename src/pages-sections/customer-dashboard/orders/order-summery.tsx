import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import FlexBetween from "components/flex-box/flex-between";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// CUSTOM DATA MODEL
import Order from "models/Order.model";

// ==============================================================
type Props = {
  order: Order;
  canCancel?: boolean;
  isCancelling?: boolean;
  onCancelOrder?: () => void;
};
// ==============================================================

const formatPaymentMethod = (value?: string) => {
  if (!value) return "Payment method unavailable";
  if (value === "COD") return "Demo Payment";
  if (value === "PAYPAL") return "PayPal";
  if (value === "CARD") return "Demo Payment";
  return value.replace(/_/g, " ");
};

export default function OrderSummery({
  order,
  canCancel = false,
  isCancelling = false,
  onCancelOrder
}: Props) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ md: 6, xs: 12 }}>
        <Card elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "grey.100" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Shipping Address
          </Typography>

          <Typography variant="body1">{order.shippingAddress}</Typography>
        </Card>
      </Grid>

      <Grid size={{ md: 6, xs: 12 }}>
        <Card elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "grey.100" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Total Summary
          </Typography>

          <ListItem title="Subtotal:" value={currency(order.subtotal ?? order.totalPrice)} />
          <ListItem title="Shipping fee:" value={currency(order.shippingFee ?? 0)} />
          <ListItem title="Tax:" value={currency(order.tax || 0)} />
          <ListItem title="Discount:" value={currency(order.discount)} />

          <Divider sx={{ mb: 1 }} />

          <FlexBetween mb={2}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">{currency(order.totalPrice)}</Typography>
          </FlexBetween>

          <Typography variant="body2" color="text.secondary">
            Paid by {formatPaymentMethod(order.paymentMethod)}
          </Typography>

          {onCancelOrder ? (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={3}>
              <Button
                variant="outlined"
                color="error"
                disabled={!canCancel}
                loading={isCancelling}
                onClick={onCancelOrder}
              >
                Cancel Order
              </Button>

              {!canCancel ? (
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
                  Only pending or confirmed orders can be cancelled.
                </Typography>
              ) : null}
            </Stack>
          ) : null}
        </Card>
      </Grid>
    </Grid>
  );
}

function ListItem({ title, value }: { title: string; value: string }) {
  return (
    <FlexBetween mb={1}>
      <Typography color="text.secondary" variant="body1">
        {title}
      </Typography>

      <Typography variant="h6">{value}</Typography>
    </FlexBetween>
  );
}
