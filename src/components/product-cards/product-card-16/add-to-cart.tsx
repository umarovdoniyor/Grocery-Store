"use client";
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

export default function AddToCart({ product }: Props) {
  const { slug, title, thumbnail, price, discount, id } = product;

  const { state, dispatch } = useCart();

  const handleAddToCart = () => {
    const currentQty = state.cart.find((item) => item.id === id)?.qty || 0;
    const effectivePrice =
      discount > 0 ? Number((price * (1 - Math.min(discount, 99) / 100)).toFixed(2)) : price;

    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { id, slug, price: effectivePrice, title, thumbnail, qty: currentQty + 1 }
    });
  };

  return (
    <Button
      color="primary"
      variant="outlined"
      aria-label="Add product to cart"
      onClick={handleAddToCart}
      sx={{ padding: "3px" }}
    >
      <Add fontSize="small" />
    </Button>
  );
}
