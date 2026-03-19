"use client";

import { useEffect, useState } from "react";
// MUI
import IconButton from "@mui/material/IconButton";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { useSnackbar } from "notistack";
import { addToWishlist, getWishlistStatus, removeFromWishlist } from "../../../../../libs/wishlist";
import { useAuth } from "contexts/AuthContext";

type Props = {
  productId: string;
};

export default function FavoriteButton({ productId }: Props) {
  const [isFavorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

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
    if (!isAuthenticated) {
      enqueueSnackbar("Please log in to like products.", { variant: "info" });
      return;
    }

    if (loading || !productId) return;

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
      disabled={loading}
      sx={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 1,
        width: 32,
        height: 32,
        color: "#4f6d2f",
        backgroundColor: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(90,112,64,0.18)",
        backdropFilter: "blur(2px)",
        "&:hover": {
          backgroundColor: "#fff",
          boxShadow: "0 3px 10px rgba(33,49,26,0.18)"
        }
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
