"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ReviewForm from "./review-form";
import {
  getProductReviews,
  type ProductReview as ProductReviewDto,
  type ProductReviewSortBy
} from "../../../../libs/review";
// STYLED COMPONENTS
import { ReviewRoot } from "./styles";
import type Review from "models/Review.model";
import type Product from "models/Product.model";

const REVIEW_PAGE_LIMIT = 10;

const mapDtoToReview = (review: ProductReviewDto): Review => {
  const firstName = review.member?.memberFirstName || review.member?.memberNickname || "Customer";
  const lastName = review.member?.memberLastName || "";

  return {
    id: review._id,
    rating: Number(review.rating || 0),
    comment: review.comment || "",
    customer: {
      id: review.member?._id || review.memberId,
      email: "",
      phone: "",
      avatar: review.member?.memberAvatar || "/assets/images/faces/propic.png",
      password: "",
      dateOfBirth: "",
      verified: true,
      name: {
        firstName,
        lastName
      }
    },
    product: {} as Product,
    published: review.status === "PUBLISHED"
  };
};

type Props = {
  productId: string;
  reviews?: Review[];
  totalReviews?: number;
  averageRating?: number;
  onReviewCountChange?: (count: number) => void;
};

export default function ProductReviews({
  productId,
  reviews = [],
  totalReviews = 0,
  averageRating = 0,
  onReviewCountChange
}: Props) {
  const [sortBy, setSortBy] = useState<ProductReviewSortBy>("NEWEST");
  const [items, setItems] = useState<Review[]>(reviews);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [knownTotal, setKnownTotal] = useState(Math.max(totalReviews, reviews.length));
  const [summaryAverage, setSummaryAverage] = useState(Number(averageRating || 0));

  const hasMore = useMemo(() => items.length < knownTotal, [items.length, knownTotal]);
  const listAverage = useMemo(() => {
    if (items.length === 0) return 0;
    const sum = items.reduce((total, review) => total + Number(review.rating || 0), 0);
    return sum / items.length;
  }, [items]);

  const displayAverage = summaryAverage > 0 ? summaryAverage : listAverage;

  useEffect(() => {
    onReviewCountChange?.(knownTotal);
  }, [knownTotal, onReviewCountChange]);

  const fetchReviews = useCallback(
    async (nextPage: number, nextSort: ProductReviewSortBy, replace = false) => {
      setLoading(true);
      setFetchError(null);

      const response = await getProductReviews({
        productId,
        page: nextPage,
        limit: REVIEW_PAGE_LIMIT,
        sortBy: nextSort
      });

      if (!response.success) {
        setFetchError(response.error || "Failed to load reviews.");
        setLoading(false);
        return;
      }

      const mapped = (response.list || []).map(mapDtoToReview);
      setKnownTotal(Math.max(response.total || 0, mapped.length));
      setSummaryAverage(Number(response.summary?.ratingAvg || 0));

      if (replace) {
        setItems(mapped);
      } else {
        setItems((prev) => {
          const seenIds = new Set(prev.map((item) => item.id));
          const unique = mapped.filter((item) => !seenIds.has(item.id));
          return [...prev, ...unique];
        });
      }

      setPage(nextPage);
      setLoading(false);
    },
    [productId]
  );

  const handleSortChange = async (value: ProductReviewSortBy) => {
    setSortBy(value);
    await fetchReviews(1, value, true);
  };

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;
    await fetchReviews(page + 1, sortBy, false);
  };

  const handleReviewChanged = async () => {
    await fetchReviews(1, sortBy, true);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap"
        }}
      >
        <div>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2a1a", fontSize: 18, mb: 0.5 }}>
            Customer Reviews
          </Typography>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#2f4a1f", fontSize: 24, lineHeight: 1 }}>
              {displayAverage.toFixed(1)}
            </Typography>

            <Rating readOnly size="small" color="warn" value={displayAverage} precision={0.1} />

            <Typography variant="body2" color="text.secondary">
              {knownTotal} {knownTotal === 1 ? "review" : "reviews"}
            </Typography>
          </div>
        </div>

        <div style={{ minWidth: 260, width: "100%", maxWidth: 320 }}>
          <Typography variant="body2" sx={{ mb: 0.75, color: "#5f6f4c", fontWeight: 600 }}>
            Sort reviews
          </Typography>

          <TextField
            select
            size="small"
            value={sortBy}
            onChange={(event) => handleSortChange(event.target.value as ProductReviewSortBy)}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#fff",
                "& fieldset": { borderColor: "rgba(90,112,64,0.25)" },
                "&:hover fieldset": { borderColor: "rgba(90,112,64,0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#5a7a30" }
              }
            }}
          >
            <MenuItem value="NEWEST">Newest</MenuItem>
            <MenuItem value="OLDEST">Oldest</MenuItem>
            <MenuItem value="RATING_DESC">Highest Rating</MenuItem>
            <MenuItem value="RATING_ASC">Lowest Rating</MenuItem>
          </TextField>
        </div>
      </div>

      {/* REVIEW LIST */}
      {items.map((review, ind) => {
        const name =
          `${review.customer?.name?.firstName || ""} ${review.customer?.name?.lastName || ""}`.trim() ||
          review.customer?.email ||
          "Customer";

        return (
          <ReviewRoot key={ind}>
            <div className="user-info">
              <Avatar variant="rounded" className="user-avatar">
                <Image
                  src={review.customer?.avatar || "/assets/images/faces/propic.png"}
                  alt={name}
                  fill
                  sizes="(48px 48px)"
                />
              </Avatar>

              <div>
                <Typography variant="h6" sx={{ mb: 0.25, fontWeight: 700, color: "#1f2a1a", fontSize: 15 }}>
                  {name}
                </Typography>

                <div className="user-rating">
                  <Rating size="small" value={review.rating || 0} color="warn" readOnly />
                  <Typography variant="h6">{review.rating || 0}</Typography>
                  <Typography component="span">Verified customer</Typography>
                </div>
              </div>
            </div>

            <Typography variant="body1" sx={{ color: "grey.700" }}>
              {review.comment}
            </Typography>
          </ReviewRoot>
        );
      })}

      {items.length === 0 && !loading && (
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
          No reviews yet.
        </Typography>
      )}

      {fetchError && (
        <Typography variant="body2" sx={{ color: "error.main", mb: 2 }}>
          {fetchError}
        </Typography>
      )}

      {hasMore && (
        <Button
          variant="outlined"
          onClick={handleLoadMore}
          disabled={loading}
          sx={{
            mb: 2,
            borderRadius: 999,
            borderColor: "rgba(90,112,64,0.4)",
            color: "#4f6d2f",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": { borderColor: "#4f6d2f", backgroundColor: "rgba(79,109,47,0.06)" }
          }}
        >
          {loading ? "Loading..." : "Load More Reviews"}
        </Button>
      )}

      <Typography
        variant="h6"
        sx={{
          mt: 5,
          mb: 2.5,
          fontWeight: 700,
          color: "#1f2a1a",
          fontSize: 16,
          paddingBottom: 1.5,
          borderBottom: "2px solid rgba(90, 112, 64, 0.18)"
        }}
      >
        Write a Review
      </Typography>

      <ReviewForm productId={productId} onReviewChanged={handleReviewChanged} />
    </div>
  );
}
