"use client";

import { Fragment } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// LOCAL CUSTOM COMPONENT
import FrequentlyProductCard from "./frequently-product-card";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
import useCart from "hooks/useCart";
// CUSTOM DATA MODEL
import Product from "models/Product.model";
// STYLED COMPONENTS
import { Icon, StyledRoot, TotalCount } from "./styles";

// ============================================================
type Props = { products: Product[] };
// ============================================================

export default function FrequentlyBought({ products }: Props) {
  const { state, dispatch } = useCart();

  // IF NO PRODUCTS RETURN NULL
  if (!products || !products.length) return null;

  const bundleTotal = products.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const bundleCompareTotal = products.reduce((sum, item) => {
    const discount = Number(item.discount || 0);
    if (discount <= 0) return sum + Number(item.price || 0);

    const comparePrice = Number(item.price || 0) / (1 - Math.min(discount, 99) / 100);
    return sum + comparePrice;
  }, 0);

  const bundleSavings = Math.max(0, bundleCompareTotal - bundleTotal);

  const handleAddBundleToCart = () => {
    products.forEach((item) => {
      const currentQty = state.cart.find((cartItem) => cartItem.id === item.id)?.qty || 0;

      dispatch({
        type: "CHANGE_CART_AMOUNT",
        payload: {
          id: item.id,
          slug: item.slug,
          price: item.price,
          title: item.title,
          thumbnail: item.thumbnail,
          qty: currentQty + 1
        }
      });
    });
  };

  return (
    <StyledRoot>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Frequently Bought Together
      </Typography>

      <div className="content-wrapper">
        {products.map((item, ind) => (
          <Fragment key={item.id}>
            <FrequentlyProductCard
              id={item.id}
              key={item.id}
              slug={item.slug}
              price={item.price}
              discount={item.discount}
              title={item.title}
              imgUrl={item.thumbnail}
            />

            {ind < products.length - 1 && <Icon>+</Icon>}
          </Fragment>
        ))}

        <Icon>=</Icon>

        <TotalCount>
          <Typography variant="h3" color="primary">
            {currency(bundleTotal)}
          </Typography>

          <Typography component="span" sx={{ mb: 2, fontWeight: "600", color: "grey.600" }}>
            Save {currency(bundleSavings)}
          </Typography>

          <div className="btn-wrapper">
            <Button variant="contained" color="primary" onClick={handleAddBundleToCart}>
              Add Bundle to Cart
            </Button>
          </div>
        </TotalCount>
      </div>
    </StyledRoot>
  );
}
