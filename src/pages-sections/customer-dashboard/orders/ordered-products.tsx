"use client";

import Image from "next/image";
import { useState } from "react";
import { format } from "date-fns/format";
// MUI
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useSnackbar } from "notistack";
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// CUSTOM DATA MODEL
import Order from "models/Order.model";
import ReviewForm from "pages-sections/product-details/product-reviews/review-form";

// ==============================================================
type Props = { order: Order };
// ==============================================================

export default function OrderedProducts({ order }: Props) {
  const { id, createdAt, items, deliveredAt } = order;
  const { enqueueSnackbar } = useSnackbar();
  const [selectedReviewItem, setSelectedReviewItem] = useState<{
    productId: string;
    productName: string;
  } | null>(null);

  const handleReviewSubmitted = () => {
    setSelectedReviewItem(null);
    enqueueSnackbar("Review submitted and is pending approval.", { variant: "success" });
  };

  return (
    <Card
      elevation={0}
      sx={{
        p: 0,
        mb: 4,
        border: "1px solid",
        borderColor: "grey.100"
      }}
    >
      <FlexBetween px={3} py={2} flexWrap="wrap" gap={1} bgcolor="grey.50">
        <Item title="Order ID:" value={id} />
        <Item title="Placed on:" value={format(new Date(createdAt), "dd MMM, yyyy")} />
        <Item
          title="Delivered on:"
          value={deliveredAt ? format(new Date(deliveredAt), "dd MMM, yyyy") : "None"}
        />
      </FlexBetween>

      {!order.isDelivered && (
        <Typography px={2} py={1.5} variant="body2" color="text.secondary">
          Reviews are available after the order is marked as delivered.
        </Typography>
      )}

      {items.map((item, ind) => {
        const canReview = order.isDelivered && Boolean(item.product_id);

        return (
          <FlexBetween px={2} py={1} flexWrap="wrap" key={`${item.product_id || ind}`} gap={1}>
            <FlexBox gap={2} alignItems="center">
              <Avatar variant="rounded" sx={{ height: 60, width: 60, backgroundColor: "grey.50" }}>
                <Image fill alt={item.product_name} src={item.product_img} sizes="(60px, 60px)" />
              </Avatar>

              <div>
                <Typography noWrap variant="h6">
                  {item.product_name}
                </Typography>

                <Typography lineHeight={2} variant="body1" color="text.secondary">
                  {currency(item.product_price)} x {item.product_quantity}
                </Typography>
              </div>
            </FlexBox>

            {item.variant && (
              <Typography noWrap variant="body1" color="text.secondary">
                Product properties: {item.variant}
              </Typography>
            )}

            <Button
              variant="text"
              color="primary"
              disabled={!canReview}
              onClick={() =>
                canReview &&
                setSelectedReviewItem({
                  productId: item.product_id || "",
                  productName: item.product_name
                })
              }
            >
              {canReview ? "Write a Review" : "Review Locked"}
            </Button>
          </FlexBetween>
        );
      })}

      <Dialog
        fullWidth
        maxWidth="md"
        open={Boolean(selectedReviewItem)}
        onClose={() => setSelectedReviewItem(null)}
      >
        <DialogTitle>
          {selectedReviewItem
            ? `Write a Review: ${selectedReviewItem.productName}`
            : "Write a Review"}
        </DialogTitle>

        <DialogContent>
          {selectedReviewItem && (
            <ReviewForm
              productId={selectedReviewItem.productId}
              onSubmitted={handleReviewSubmitted}
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={() => setSelectedReviewItem(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

function Item({ title, value }: { title: string; value: string }) {
  return (
    <FlexBox gap={1} alignItems="center">
      <Typography variant="body1" color="text.secondary">
        {title}
      </Typography>

      <Typography variant="body1">{value}</Typography>
    </FlexBox>
  );
}
