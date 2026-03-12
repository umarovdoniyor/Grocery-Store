import Image from "next/image";
// MUI
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// CUSTOM DATA MODEL
import Order from "models/Order.model";

// ==============================================================
type Status = "PACKING" | "SHIPPED" | "DELIVERED";

type Props = {
  product: Order["items"][0];
  updating?: boolean;
  onUpdateStatus?: (itemId: string, status: Status) => void;
};
// ==============================================================

export default function OrderedProduct({ product, updating = false, onUpdateStatus }: Props) {
  const { item_id, product_img, product_name, product_price, product_quantity, status } =
    product || {};

  const normalizedStatus =
    status === "DELIVERED" || status === "Delivered"
      ? "DELIVERED"
      : status === "SHIPPED"
        ? "SHIPPED"
        : "PACKING";

  const statusValue: Status = normalizedStatus;
  const nextStatusOptions: Status[] =
    normalizedStatus === "DELIVERED"
      ? ["DELIVERED"]
      : normalizedStatus === "SHIPPED"
        ? ["SHIPPED", "DELIVERED"]
        : ["PACKING", "SHIPPED"];
  const isLocked = normalizedStatus === "DELIVERED";

  return (
    <Box my={2} gap={2} display="grid" gridTemplateColumns={{ md: "1fr 1fr", xs: "1fr" }}>
      <FlexBox flexShrink={0} gap={1.5} alignItems="center">
        <Avatar variant="rounded" sx={{ height: 64, width: 64 }}>
          <Image fill alt={product_name} src={product_img} sizes="(64px, 64px)" />
        </Avatar>

        <div>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {product_name}
          </Typography>

          <FlexBox alignItems="center" gap={1}>
            <Typography variant="body1" sx={{ color: "grey.600" }}>
              {currency(product_price)} x
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Qty: {product_quantity}
            </Typography>
          </FlexBox>
        </div>
      </FlexBox>

      <FlexBetween flexShrink={0}>
        <Typography variant="body2" sx={{ color: "grey.600" }}>
          Product properties: {product.variant || "-"}
        </Typography>

        {onUpdateStatus && item_id ? (
          <TextField
            select
            size="small"
            value={statusValue}
            disabled={updating || isLocked}
            sx={{ minWidth: 170 }}
            onChange={(event) => onUpdateStatus(item_id, event.target.value as Status)}
          >
            {nextStatusOptions.map((option) => (
              <MenuItem value={option} key={option}>
                {option === "PACKING" ? "Packing" : option === "SHIPPED" ? "Shipped" : "Delivered"}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
      </FlexBetween>
    </Box>
  );
}
