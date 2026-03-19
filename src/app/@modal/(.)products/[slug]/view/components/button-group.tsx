"use client";

import Button from "@mui/material/Button";

import useCart from "hooks/useCart";
import IconLink from "components/icon-link";

import Product from "models/Product.model";

export default function ButtonGroup({ product }: { product: Product }) {
  const { state, dispatch } = useCart();

  const handleAddToCart = () => {
    const currentQty = state.cart.find((item) => item.id === product.id)?.qty || 0;

    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: {
        id: product.id,
        slug: product.slug,
        price: product.price,
        title: product.title,
        thumbnail: product.thumbnail,
        qty: currentQty + 1
      }
    });
  };

  return (
    <>
      <Button
        disableElevation
        fullWidth
        size="large"
        color="primary"
        variant="contained"
        aria-label="Add product to cart"
        onClick={handleAddToCart}
        sx={{
          borderRadius: 999,
          fontWeight: 700,
          fontSize: 15,
          textTransform: "none",
          py: 1.4,
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

      <IconLink
        title="View Product Details"
        url={`/products/${product.slug}`}
        sx={{
          mt: 1.5,
          display: "flex",
          justifyContent: "center",
          py: 1.2,
          borderRadius: 999,
          border: "1.5px solid rgba(79, 109, 47, 0.4)",
          color: "#4f6d2f",
          fontWeight: 600,
          fontSize: 14,
          letterSpacing: "0.01em",
          transition: "all 180ms ease",
          "&:hover": {
            textDecoration: "none",
            borderColor: "#4f6d2f",
            backgroundColor: "rgba(79, 109, 47, 0.06)"
          }
        }}
      />
    </>
  );
}
