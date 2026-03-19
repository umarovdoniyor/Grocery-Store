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
        <Card elevation={0} sx={{ p: 3, backgroundColor: "#FAF6EF", border: "1px solid rgba(43,38,34,0.12)", borderRadius: "4px", boxShadow: "none" }}>
          <Typography variant="h5" sx={{ mb: 2, color: "#2B2622" }}>
            Shipping Address
          </Typography>

          <Typography variant="body1" sx={{ color: "#7A6C60" }}>{order.shippingAddress}</Typography>
        </Card>
      </Grid>

      <Grid size={{ md: 6, xs: 12 }}>
        <Card elevation={0} sx={{ p: 3, backgroundColor: "#FAF6EF", border: "1px solid rgba(43,38,34,0.12)", borderRadius: "4px", boxShadow: "none" }}>
          <Typography variant="h5" sx={{ mb: 2, color: "#2B2622" }}>
            Total Summary
          </Typography>

          <ListItem title="Subtotal:" value={currency(order.subtotal ?? order.totalPrice)} />
          <ListItem title="Shipping fee:" value={currency(order.shippingFee ?? 0)} />
          <ListItem title="Tax:" value={currency(order.tax || 0)} />
          <ListItem title="Discount:" value={currency(order.discount)} />

          <Divider sx={{ mb: 1, borderColor: "rgba(43,38,34,0.1)" }} />

          <FlexBetween mb={2}>
            <Typography variant="h6" sx={{ color: "#2B2622" }}>Total</Typography>
            <Typography variant="h6" sx={{ color: "#2B2622" }}>{currency(order.totalPrice)}</Typography>
          </FlexBetween>

          <Typography variant="body2" sx={{ color: "#8B6A4A" }}>
            Paid by {formatPaymentMethod(order.paymentMethod)}
          </Typography>

          {onCancelOrder ? (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={3}>
              <Button
                variant="outlined"
                disabled={!canCancel}
                loading={isCancelling}
                onClick={onCancelOrder}
                sx={{
                  borderColor: canCancel ? "#A44A3F" : "rgba(43,38,34,0.2)",
                  color: canCancel ? "#A44A3F" : "#C8B79C",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#A44A3F", borderColor: "#A44A3F", color: "#F4EEE3" }
                }}
              >
                Cancel Order
              </Button>

              {!canCancel ? (
                <Typography variant="body2" sx={{ color: "#8B6A4A", alignSelf: "center" }}>
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
      <Typography variant="body1" sx={{ color: "#8B6A4A" }}>
        {title}
      </Typography>

      <Typography variant="h6" sx={{ color: "#2B2622" }}>{value}</Typography>
    </FlexBetween>
  );
}
