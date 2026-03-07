"use client";
import Button from "@mui/material/Button";
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ================================================================
type Props = { product: Product };
// ================================================================

export default function AddToCart({ product }: Props) {
  const { id, price, discount, title, slug, thumbnail } = product;

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
      variant="contained"
      aria-label="Add product to cart"
      onClick={handleAddToCart}
      sx={{ mb: 4.5, px: "1.75rem", height: 40 }}
    >
      Add to Cart
    </Button>
  );
}
