"use client";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
// LOCAL CUSTOM COMPONENT
import OrderActions from "../order-actions";
import TotalSummery from "../total-summery";
import PageWrapper from "../../page-wrapper";
import OrderedProduct from "../ordered-product";
import ShippingAddress from "../shipping-address";
// CUSTOM DATA MODEL
import Order from "models/Order.model";

// ==============================================================
type Props = {
  order: Order;
  isUpdatingStatus?: boolean;
  onMarkDelivered?: () => void;
  updatingItemId?: string | null;
  onUpdateItemStatus?: (itemId: string, status: "PACKING" | "SHIPPED" | "DELIVERED") => void;
};
// ==============================================================

export default function OrderDetailsPageView({
  order,
  isUpdatingStatus = false,
  onMarkDelivered,
  updatingItemId = null,
  onUpdateItemStatus
}: Props) {
  const canMarkDelivered =
    Boolean(onMarkDelivered) && order.status !== "Delivered" && order.status !== "Cancelled";
  const canUpdateItems = order.status !== "Delivered" && order.status !== "Cancelled";

  return (
    <PageWrapper title="Order Details">
      <Grid container spacing={3}>
        <Grid size={12}>
          <Card
            sx={{
              p: 3,
              borderRadius: "10px",
              border: "1px solid #D1D5DB",
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)"
            }}
          >
            {/* ADD PRODUCT & CHANGE ORDER STATUS ACTION  */}
            <OrderActions id={order.id} createdAt={order.createdAt} status={order.status} />

            {/* ORDERED PRODUCT LIST */}
            {order.items.map((item, index) => (
              <OrderedProduct
                product={item}
                key={index}
                updating={updatingItemId === item.item_id}
                onUpdateStatus={canUpdateItems ? onUpdateItemStatus : undefined}
              />
            ))}
          </Card>
        </Grid>

        {/* SHIPPING ADDRESS & CUSTOMER NOTES */}
        <Grid size={{ md: 6, xs: 12 }}>
          <ShippingAddress address={order.shippingAddress} />
        </Grid>

        {/* TOTAL SUMMERY OF ORDER */}
        <Grid size={{ md: 6, xs: 12 }}>
          <TotalSummery total={order.totalPrice} discount={order.discount} />
        </Grid>

        {/* CHANGE BUTTON */}
        <Grid size={12}>
          {canMarkDelivered ? (
            <Button
              variant="contained"
              loading={isUpdatingStatus}
              onClick={onMarkDelivered}
              sx={{
                backgroundColor: "#14B8A6",
                color: "#F8FAFC",
                "&:hover": {
                  backgroundColor: "#0F766E"
                }
              }}
            >
              Mark as Delivered
            </Button>
          ) : onMarkDelivered ? (
            <Button
              variant="outlined"
              disabled
              sx={{
                color: "#6B7280",
                borderColor: "#D1D5DB"
              }}
            >
              {order.status === "Delivered" ? "Already Delivered" : "Status Locked"}
            </Button>
          ) : null}
        </Grid>
      </Grid>
    </PageWrapper>
  );
}
