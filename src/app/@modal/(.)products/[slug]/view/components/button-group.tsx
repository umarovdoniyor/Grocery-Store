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
        size="large"
        color="primary"
        variant="contained"
        aria-label="Add product to cart"
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>

      <IconLink title="View Product Details" url={`/products/${product.slug}`} sx={{ mt: 2 }} />
    </>
  );
}
