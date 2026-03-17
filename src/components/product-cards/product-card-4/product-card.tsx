"use client";

import Link from "next/link";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
// GLOBAL CUSTOM COMPONENTS
import LazyImage from "components/LazyImage";
import { FlexBox } from "components/flex-box";
// LOCAL CUSTOM COMPONENTS
import AddToCart from "./add-to-cart";
import HoverActions from "./hover-actions";
import DiscountChip from "../discount-chip";
import ProductPrice from "../product-price";
import ProductTitle from "../product-title";
import ProductRating from "../product-rating";
// STYLED COMPONENTS
import { ContentWrapper, ImageWrapper, StyledCard } from "./styles";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ===============================================================
type Props = { product: Product };
// ===============================================================

export default function ProductCard4({ product }: Props) {
  const { discount, title, price, thumbnail, rating, reviewsCount, likes, views, slug } = product;
  const [likesCount, setLikesCount] = useState(Number(likes || 0));

  return (
    <StyledCard>
      <ImageWrapper>
        {/* DISCOUNT PERCENT CHIP IF AVAILABLE */}
        <DiscountChip discount={discount} />

        {/* PRODUCT IMAGE / THUMBNAIL */}
        <Link href={`/products/${slug}`}>
          <LazyImage
            alt={title}
            src={thumbnail}
            width={450}
            height={450}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Link>

        {/* HOVER ACTION ICONS */}
        <HoverActions product={product} onLikesChange={setLikesCount} />
      </ImageWrapper>

      <ContentWrapper>
        <div className="content">
          {/* PRODUCT NAME / TITLE */}
          <ProductTitle title={title} slug={slug} />

          {/* PRODUCT RATING / REVIEW  */}
          <ProductRating my={1} rating={rating} />

          <FlexBox alignItems="center" flexWrap="wrap" gap={1.5} mb={1}>
            <Typography variant="caption" color="text.secondary">
              {Number(reviewsCount || 0)} reviews
            </Typography>

            <FlexBox alignItems="center" gap={0.5}>
              <FavoriteBorder sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {likesCount}
              </Typography>
            </FlexBox>

            <FlexBox alignItems="center" gap={0.5}>
              <RemoveRedEye sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {Number(views || 0)}
              </Typography>
            </FlexBox>
          </FlexBox>

          {/* PRODUCT PRICE WITH DISCOUNT */}
          <ProductPrice discount={discount} price={price} />
        </div>

        {/* ADD TO CART BUTTON */}
        <AddToCart product={product} />
      </ContentWrapper>
    </StyledCard>
  );
}
