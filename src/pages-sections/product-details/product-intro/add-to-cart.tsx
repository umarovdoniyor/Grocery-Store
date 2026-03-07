"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ================================================================
type Props = { product: Product };
// ================================================================

export default function AddToCart({ product }: Props) {
  const { id, price, title, slug, thumbnail } = product;

  const [isLoading, setLoading] = useState(false);
  const { state, dispatch } = useCart();

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
      variant="contained"
      loading={isLoading}
      onClick={handleAddToCart}
      sx={{ mb: 4.5, px: "1.75rem", height: 40 }}
    >
      Add to Cart
    </Button>
  );
}
