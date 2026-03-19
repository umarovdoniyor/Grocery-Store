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
        backgroundColor: "#FAF6EF",
        border: "1px solid rgba(43, 38, 34, 0.12)",
        borderRadius: "4px",
        boxShadow: "none"
      }}
    >
      <FlexBetween
        px={3}
        py={2}
        flexWrap="wrap"
        gap={1}
        sx={{ backgroundColor: "#F4EEE3", borderBottom: "1px solid rgba(43,38,34,0.08)" }}
      >
        <Item title="Order ID:" value={id} />
        <Item title="Placed on:" value={format(new Date(createdAt), "dd MMM, yyyy")} />
        <Item
          title="Delivered on:"
          value={deliveredAt ? format(new Date(deliveredAt), "dd MMM, yyyy") : "None"}
        />
      </FlexBetween>

      {!order.isDelivered && (
        <Typography px={2} py={1.5} variant="body2" sx={{ color: "#8B6A4A" }}>
          Reviews are available after the order is marked as delivered.
        </Typography>
      )}

      {items.map((item, ind) => {
        const canReview = order.isDelivered && Boolean(item.product_id);

        return (
          <FlexBetween px={2} py={1} flexWrap="wrap" key={`${item.product_id || ind}`} gap={1}>
            <FlexBox gap={2} alignItems="center">
              <Avatar
                variant="rounded"
                sx={{ height: 60, width: 60, borderRadius: "4px", backgroundColor: "#EDE8DF" }}
              >
                <Image fill alt={item.product_name} src={item.product_img} sizes="(60px, 60px)" />
              </Avatar>

              <div>
                <Typography noWrap variant="h6" sx={{ color: "#2B2622" }}>
                  {item.product_name}
                </Typography>

                <Typography lineHeight={2} variant="body1" sx={{ color: "#7A6C60" }}>
                  {currency(item.product_price)} x {item.product_quantity}
                </Typography>
              </div>
            </FlexBox>

            {item.variant && (
              <Typography noWrap variant="body1" sx={{ color: "#8B6A4A" }}>
                Product properties: {item.variant}
              </Typography>
            )}

            <Button
              variant="text"
              disabled={!canReview}
              sx={{
                color: canReview ? "#A44A3F" : "#C8B79C",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.8rem"
              }}
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
          <Button
            variant="outlined"
            onClick={() => setSelectedReviewItem(null)}
            sx={{ borderColor: "rgba(43,38,34,0.3)", color: "#2B2622", textTransform: "none" }}
          >
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
      <Typography
        variant="body1"
        sx={{
          color: "#8B6A4A",
          fontWeight: 600,
          fontSize: "0.8rem",
          textTransform: "uppercase",
          letterSpacing: "0.04em"
        }}
      >
        {title}
      </Typography>

      <Typography variant="body1" sx={{ color: "#2B2622", fontWeight: 500 }}>
        {value}
      </Typography>
    </FlexBox>
  );
}
