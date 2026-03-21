"use client";

import dynamic from "next/dynamic";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
// CUSTOM DATA MODEL
import Order from "models/Order.model";

const OrderActions = dynamic(() => import("../order-actions"), { ssr: false });
const TotalSummery = dynamic(() => import("../total-summery"), { ssr: false });
const PageWrapper = dynamic(() => import("../../page-wrapper"), { ssr: false });
const OrderedProduct = dynamic(() => import("../ordered-product"), { ssr: false });
const ShippingAddress = dynamic(() => import("../shipping-address"), { ssr: false });

// ==============================================================
type Props = {
  order: Order;
  uiMode?: "vendor" | "admin";
  isUpdatingStatus?: boolean;
  onMarkDelivered?: () => void;
  updatingItemId?: string | null;
  onUpdateItemStatus?: (itemId: string, status: "PACKING" | "SHIPPED" | "DELIVERED") => void;
};
// ==============================================================

export default function OrderDetailsPageView({
  order,
  uiMode = "vendor",
  isUpdatingStatus = false,
  onMarkDelivered,
  updatingItemId = null,
  onUpdateItemStatus
}: Props) {
  const accentColor = uiMode === "admin" ? "#4F46E5" : "#14B8A6";
  const accentDark = uiMode === "admin" ? "#4338CA" : "#0F766E";

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
            <OrderActions
              id={order.id}
              createdAt={order.createdAt}
              status={order.status}
              uiMode={uiMode}
            />

            {/* ORDERED PRODUCT LIST */}
            {order.items.map((item, index) => (
              <OrderedProduct
                product={item}
                key={index}
                uiMode={uiMode}
                updating={updatingItemId === item.item_id}
                onUpdateStatus={canUpdateItems ? onUpdateItemStatus : undefined}
              />
            ))}
          </Card>
        </Grid>

        {/* SHIPPING ADDRESS & CUSTOMER NOTES */}
        <Grid size={{ md: 6, xs: 12 }}>
          <ShippingAddress address={order.shippingAddress} uiMode={uiMode} />
        </Grid>

        {/* TOTAL SUMMERY OF ORDER */}
        <Grid size={{ md: 6, xs: 12 }}>
          <TotalSummery total={order.totalPrice} discount={order.discount} uiMode={uiMode} />
        </Grid>

        {/* CHANGE BUTTON */}
        <Grid size={12}>
          {canMarkDelivered ? (
            <Button
              variant="contained"
              loading={isUpdatingStatus}
              onClick={onMarkDelivered}
              sx={{
                backgroundColor: accentColor,
                color: "#F8FAFC",
                "&:hover": {
                  backgroundColor: accentDark
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
