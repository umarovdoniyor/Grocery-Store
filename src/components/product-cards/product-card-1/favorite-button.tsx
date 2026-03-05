"use client";

import { useEffect, useState } from "react";
// MUI
import IconButton from "@mui/material/IconButton";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { addToWishlist, getWishlistStatus, removeFromWishlist } from "../../../../libs/wishlist";
import { useAuth } from "contexts/AuthContext";

interface Props {
  productId: string;
}

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

  const handleFavorite = async () => {
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
    <IconButton onClick={handleFavorite} disabled={loading}>
      {isFavorite ? (
        <Favorite color="primary" fontSize="small" />
      ) : (
        <FavoriteBorder fontSize="small" color="inherit" />
      )}
    </IconButton>
  );
}
