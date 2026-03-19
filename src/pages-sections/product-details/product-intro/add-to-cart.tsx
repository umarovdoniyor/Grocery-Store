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
      sx={{
        mb: 2,
        px: "2rem",
        height: 48,
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 15,
        textTransform: "none",
        background: "linear-gradient(135deg, #6f8f44 0%, #4f6d2f 100%)",
        boxShadow: "0 8px 20px rgba(51,80,30,0.22)",
        "&:hover": {
          background: "linear-gradient(135deg, #64813d 0%, #446127 100%)",
          boxShadow: "0 10px 24px rgba(51,80,30,0.3)"
        }
      }}
    >
      Add to Cart
    </Button>
  );
}
