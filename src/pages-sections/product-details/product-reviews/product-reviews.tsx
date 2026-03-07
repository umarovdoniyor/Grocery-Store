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
      <div style={{ marginBottom: 24 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          {displayAverage.toFixed(1)} out of 5
        </Typography>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Rating readOnly size="small" color="warn" value={displayAverage} precision={0.1} />
          <Typography variant="body2" color="text.secondary">
            {knownTotal} {knownTotal === 1 ? "review" : "reviews"}
          </Typography>
        </div>
      </div>

      <TextField
        select
        size="small"
        label="Sort reviews"
        value={sortBy}
        onChange={(event) => handleSortChange(event.target.value as ProductReviewSortBy)}
        sx={{ mb: 3, minWidth: 220 }}
      >
        <MenuItem value="NEWEST">Newest</MenuItem>
        <MenuItem value="OLDEST">Oldest</MenuItem>
        <MenuItem value="RATING_DESC">Highest Rating</MenuItem>
        <MenuItem value="RATING_ASC">Lowest Rating</MenuItem>
      </TextField>

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
                <Typography variant="h5" sx={{ mb: 1 }}>
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
        <Button variant="outlined" onClick={handleLoadMore} disabled={loading} sx={{ mb: 2 }}>
          {loading ? "Loading..." : "Load More Reviews"}
        </Button>
      )}

      <Typography variant="h3" sx={{ mt: 7, mb: 2.5 }}>
        Write a Review for this product
      </Typography>

      <ReviewForm productId={productId} onReviewChanged={handleReviewChanged} />
    </div>
  );
}
