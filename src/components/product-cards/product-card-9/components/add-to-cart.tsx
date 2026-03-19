"use client";

import { useState } from "react";
// MUI
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
// GLOBAL CUSTOM HOOKS
import useCart from "hooks/useCart";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ==============================================================
type Props = { product: Product };
// ==============================================================

export default function AddToCartButton({ product }: Props) {
  const { thumbnail, title, price, id, slug } = product;

  const { state, dispatch } = useCart();
  const [isLoading, setLoading] = useState(false);

  const handleAddToCart = () => {
    setLoading(true);

    const currentQty = state.cart.find((item) => item.id === id)?.qty || 0;

    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { id, slug, price, title, thumbnail, qty: currentQty + 1 }
    });

    setLoading(false);
  };

  return (
    <Button
      color="primary"
      loading={isLoading}
      variant="contained"
      sx={{
        padding: 0,
        minHeight: 0,
        minWidth: 34,
        width: 34,
        height: 34,
        borderRadius: "9px",
        background: "linear-gradient(135deg, #6f8f44 0%, #4f6d2f 100%)",
        boxShadow: "0 5px 12px rgba(51,80,30,0.24)",
        "&:hover": {
          background: "linear-gradient(135deg, #64813d 0%, #446127 100%)"
        }
      }}
      onClick={handleAddToCart}
    >
      <Add fontSize="small" />
    </Button>
  );
}
