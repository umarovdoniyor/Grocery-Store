"use client";

import { useEffect, useState, type MouseEvent } from "react";
import IconButton from "@mui/material/IconButton";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { addToWishlist, getWishlistStatus, removeFromWishlist } from "../../../../libs/wishlist";
import { useAuth } from "contexts/AuthContext";

type Props = {
  productId: string;
};

export default function FavoriteButton({ productId }: Props) {
  const [isFavorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let mounted = true;

    if (!isAuthenticated || !productId) {
      setFavorite(false);
      return () => {
        mounted = false;
      };
    }

    getWishlistStatus([productId]).then((result) => {
      if (!mounted || !result.success || !result.list?.length) return;
      setFavorite(Boolean(result.list[0]?.isWishlisted));
    });

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, productId]);

  const handleFavorite = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (loading || !isAuthenticated || !productId) return;

    setLoading(true);

    const result = isFavorite
      ? await removeFromWishlist(productId)
      : await addToWishlist(productId);

    if (result.success) {
      setFavorite((state) => !state);
    }

    setLoading(false);
  };

  return (
    <IconButton
      size="small"
      onClick={handleFavorite}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      disabled={loading}
      sx={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 2,
        bgcolor: "background.paper",
        "&:hover": { bgcolor: "background.paper" }
      }}
    >
      {isFavorite ? (
        <Favorite color="primary" fontSize="small" />
      ) : (
        <FavoriteBorder fontSize="small" />
      )}
    </IconButton>
  );
}
