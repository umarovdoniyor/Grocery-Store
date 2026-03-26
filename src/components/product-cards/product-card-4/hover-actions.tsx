"use client";

import { MouseEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// MUI
import Typography from "@mui/material/Typography";
import Favorite from "@mui/icons-material/Favorite";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { useSnackbar } from "notistack";
// GLOBAL CUSTOM HOOKS
import useCart from "hooks/useCart";
import { useAuth } from "contexts/AuthContext";
import { recordView, toggleLike } from "../../../../libs/product";
import { addToWishlist, removeFromWishlist } from "../../../../libs/wishlist";
// STYLED COMPONENT
import { HoverWrapper } from "./styles";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ==============================================================
type Props = { product: Product; onLikesChange?: (likes: number) => void };
// ==============================================================

export default function HoverActions({ product, onLikesChange }: Props) {
  const { id, title, price, thumbnail, slug, meLiked } = product;

  const { dispatch } = useCart();
  const { isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();
  const [isFavorite, setFavorite] = useState(Boolean(meLiked));
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

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
      // Ignore localStorage parsing errors and keep UI state functional.
    }
  };

  const handleFavorite = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      enqueueSnackbar("Please log in to like products.", { variant: "info" });
      return;
    }

    if (!id || favoriteLoading) return;

    setFavoriteLoading(true);
    const result = await toggleLike({ likeGroup: "PRODUCT", likeRefId: id });

    if (result.success) {
      const nextLiked =
        typeof result.like?.liked === "boolean" ? result.like.liked : !Boolean(isFavorite);
      setFavorite(nextLiked);
      persistLikedState(nextLiked);
      onLikesChange?.(Number(result.like?.totalLikes || 0));

      // Keep wishlist membership aligned with heart state.
      if (nextLiked) await addToWishlist(id);
      else await removeFromWishlist(id);
    }

    setFavoriteLoading(false);
  };

  const handleView = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isAuthenticated && !viewLoading && id) {
      setViewLoading(true);
      await recordView({ viewGroup: "PRODUCT", viewRefId: id });
      setViewLoading(false);
    }

    router.push(`/products/${slug}/view`, { scroll: false });
  };

  const handleAddToCart = () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { id, slug, price, title, thumbnail, qty: 1 }
    });
  };

  return (
    <HoverWrapper className="controller">
      <span onClick={handleView}>
        <RemoveRedEye />
      </span>

      <Typography
        component="span"
        onClick={handleFavorite}
        aria-disabled={favoriteLoading}
        sx={{ borderLeft: "1px solid", borderRight: "1px solid", borderColor: "divider" }}
      >
        {isFavorite ? (
          <Favorite fontSize="small" sx={{ color: "error.main" }} />
        ) : (
          <FavoriteBorder fontSize="small" color="disabled" />
        )}
      </Typography>

      <span onClick={handleAddToCart}>
        <ShoppingCart />
      </span>
    </HoverWrapper>
  );
}
