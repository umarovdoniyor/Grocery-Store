"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
// GLOBAL CUSTOM COMPONENTS
import LazyImage from "components/LazyImage";
import { FlexBox } from "components/flex-box";
// LOCAL CUSTOM COMPONENTS
import AddToCart from "./add-to-cart";
import DiscountChip from "../discount-chip";
// CUSTOM UTILS LIBRARY FUNCTIONS
import { calculateDiscount, currency } from "lib";
import { useAuth } from "contexts/AuthContext";
import { toggleLike } from "../../../../libs/product";
import { addToWishlist, removeFromWishlist } from "../../../../libs/wishlist";
// STYLED COMPONENTS
import { PriceText, StyledRoot } from "./styles";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ==============================================================
type Props = { product: Product };
// ==============================================================

export default function ProductCard16({ product }: Props) {
  const {
    id,
    slug,
    title,
    thumbnail,
    price,
    discount,
    rating,
    reviewsCount,
    views,
    likes,
    meLiked
  } = product;
  const { isAuthenticated } = useAuth();
  const hasReviewData = Number(rating || 0) > 0 || Number(reviewsCount || 0) > 0;
  const formattedViews = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(Number(views || 0));
  const [likesCount, setLikesCount] = useState(Number(likes || 0));
  const formattedLikes = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(likesCount);
  const [isFavorite, setFavorite] = useState(Boolean(meLiked));
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    setLikesCount(Number(likes || 0));
  }, [likes]);

  useEffect(() => {
    if (!id) return;

    try {
      const stored = JSON.parse(localStorage.getItem("liked-product-ids") || "[]");
      const likedIds = Array.isArray(stored) ? stored : [];
      setFavorite(Boolean(meLiked) || likedIds.includes(id));
    } catch {
      setFavorite(Boolean(meLiked));
    }
  }, [id, meLiked]);

  const persistLikedState = (liked: boolean) => {
    if (!id) return;

    try {
      const stored = JSON.parse(localStorage.getItem("liked-product-ids") || "[]");
      const likedIds = new Set(Array.isArray(stored) ? stored : []);

      if (liked) likedIds.add(id);
      else likedIds.delete(id);

      localStorage.setItem("liked-product-ids", JSON.stringify(Array.from(likedIds)));
    } catch {
      // Ignore localStorage errors to keep like interactions responsive.
    }
  };

  const handleFavorite = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!id || favoriteLoading || !isAuthenticated) return;

    setFavoriteLoading(true);
    const result = await toggleLike({ likeGroup: "PRODUCT", likeRefId: id });

    if (result.success) {
      const nextLiked =
        typeof result.like?.liked === "boolean" ? result.like.liked : !Boolean(isFavorite);
      setFavorite(nextLiked);
      persistLikedState(nextLiked);
      setLikesCount(Number(result.like?.totalLikes || 0));

      // Keep wishlist membership aligned with heart state.
      if (nextLiked) await addToWishlist(id);
      else await removeFromWishlist(id);
    }

    setFavoriteLoading(false);
  };

  return (
    <StyledRoot>
      <Link href={`/products/${slug}`}>
        <div className="img-wrapper">
          <LazyImage alt={title} width={380} height={379} src={thumbnail} />
          {discount ? <DiscountChip discount={discount} sx={{ left: 20, top: 20 }} /> : null}
        </div>
      </Link>

      <div className="content">
        <div>
          <Link href={`/products/${slug}`}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {title}
            </Typography>
          </Link>

          {hasReviewData ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Rating readOnly value={rating} size="small" precision={0.5} />
              <Typography variant="body2" color="text.secondary">
                ({Number(reviewsCount || 0)})
              </Typography>
            </div>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No reviews yet
            </Typography>
          )}

          <FlexBox alignItems="center" gap={1.5} flexWrap="wrap" mt={0.75}>
            <FlexBox
              alignItems="center"
              gap={0.5}
              onClick={handleFavorite}
              aria-disabled={favoriteLoading}
              sx={{ cursor: isAuthenticated ? "pointer" : "default" }}
            >
              {isFavorite ? (
                <Favorite sx={{ fontSize: 14, color: "error.main" }} />
              ) : (
                <FavoriteBorder sx={{ fontSize: 14, color: "text.secondary" }} />
              )}
              <Typography variant="caption" color="text.secondary">
                {formattedLikes}
              </Typography>
            </FlexBox>

            <FlexBox alignItems="center" gap={0.5}>
              <RemoveRedEye sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {formattedViews} views
              </Typography>
            </FlexBox>
          </FlexBox>

          <PriceText>
            {calculateDiscount(price, discount)}
            {discount && <span className="base-price">{currency(price)}</span>}
          </PriceText>
        </div>

        {/* ADD TO CART BUTTON */}
        <AddToCart product={product} />
      </div>
    </StyledRoot>
  );
}
