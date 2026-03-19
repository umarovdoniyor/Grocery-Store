"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
// GLOBAL CUSTOM HOOKS
import useCart from "hooks/useCart";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ==============================================================
type Props = { product: Product };
// ==============================================================

export default function AddToCart({ product }: Props) {
  const { id, slug, title, price, thumbnail } = product;

  const { dispatch } = useCart();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const handleAddToCart = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch({
        type: "CHANGE_CART_AMOUNT",
        payload: { id, slug, price, title, thumbnail, qty: 1 }
      });

      setLoading(false);
    }, 500);
  };

  return (
    <Button
      color="primary"
      variant="contained"
      loading={isLoading}
      onClick={handleAddToCart}
      sx={{
        padding: 0,
        minWidth: 32,
        width: 32,
        height: 32,
        borderRadius: "8px",
        alignSelf: "self-end",
        background: "linear-gradient(135deg, #6f8f44 0%, #4f6d2f 100%)",
        boxShadow: "0 4px 10px rgba(51,80,30,0.2)",
        "&:hover": {
          background: "linear-gradient(135deg, #64813d 0%, #446127 100%)",
          boxShadow: "0 6px 14px rgba(51,80,30,0.3)"
        }
      }}
    >
      <Add fontSize="small" />
    </Button>
  );
}
