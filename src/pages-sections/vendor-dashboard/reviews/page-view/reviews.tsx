"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import { getVendorProductReviews } from "../../../../../libs/review";
import { toPublicImageUrl } from "../../../../../libs/upload";
import { getApiBaseUrl } from "../../../../../utils/getApiBaseUrl";
// GLOBAL CUSTOM COMPONENTS
import OverlayScrollbar from "components/overlay-scrollbar";
import { TableHeader, TablePagination } from "components/data-table";
// GLOBAL CUSTOM HOOK
import useMuiTable from "hooks/useMuiTable";
// LOCAL CUSTOM COMPONENT
import ReviewRow from "../review-row";
import PageWrapper from "../../page-wrapper";
import { tableHeading } from "../table-heading";
// CUSTOM DATA MODEL
import { Review, ReviewStatusFilter, ReviewSummary } from "../types";

// =============================================================================
type Props = {
  selectedStatus: ReviewStatusFilter;
};
// =============================================================================

const DEFAULT_REVIEW_PRODUCT_IMAGE = "/assets/images/products/placeholder.png";

const API_BASE = getApiBaseUrl();

const statusFilters: { label: string; value: ReviewStatusFilter; href: string }[] = [
  { label: "All", value: "ALL", href: "/vendor/reviews" },
  { label: "Published", value: "PUBLISHED", href: "/vendor/reviews?status=PUBLISHED" },
  { label: "Pending", value: "PENDING", href: "/vendor/reviews?status=PENDING" },
  { label: "Rejected", value: "REJECTED", href: "/vendor/reviews?status=REJECTED" },
  { label: "Hidden", value: "HIDDEN", href: "/vendor/reviews?status=HIDDEN" }
];

const getEmptyStateText = (selectedStatus: ReviewStatusFilter) => {
  if (selectedStatus === "ALL") return "No reviews yet for your products.";
  return `No ${selectedStatus.toLowerCase()} reviews yet for your products.`;
};

const resolveReviewProductImage = (value?: string | null) => {
  const normalized = value?.replace(/\\/g, "/").trim();
  if (!normalized) return DEFAULT_REVIEW_PRODUCT_IMAGE;

  if (normalized.startsWith("/assets/")) return normalized;

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    try {
      const parsed = new URL(normalized);
      return parsed.host ? normalized : DEFAULT_REVIEW_PRODUCT_IMAGE;
    } catch {
      return DEFAULT_REVIEW_PRODUCT_IMAGE;
    }
  }

  try {
    return toPublicImageUrl(normalized, API_BASE);
  } catch {
    return DEFAULT_REVIEW_PRODUCT_IMAGE;
  }
};

const emptySummary: ReviewSummary = {
  ratingAvg: 0,
  reviewsCount: 0,
  rating1Count: 0,
  rating2Count: 0,
  rating3Count: 0,
  rating4Count: 0,
  rating5Count: 0
};

export default function ReviewsPageView({ selectedStatus }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>(emptySummary);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadReviews = async () => {
      setIsLoading(true);
      setError(undefined);

      const response = await getVendorProductReviews({
        page: 1,
        limit: 50,
        status: selectedStatus === "ALL" ? undefined : selectedStatus,
        search: "",
        sortBy: "NEWEST"
      });

      if (!isActive) return;

      if (!response.success || !response.list) {
        setReviews([]);
        setSummary(emptySummary);
        setTotal(0);
        setError(response.error || "Failed to load reviews.");
        setIsLoading(false);
        return;
      }

      const nextReviews = response.list.map((item) => {
        const firstName = item.member?.memberFirstName || item.member?.memberNickname || "Customer";
        const lastName = item.member?.memberLastName || "";
        const customerName = `${firstName} ${lastName}`.trim();

        return {
          name: item.product?.title || "Product",
          image: resolveReviewProductImage(item.product?.thumbnail),
          rating: Number(item.rating || 0),
          comment: item.comment || "-",
          customer: customerName || "Customer"
        };
      });

      setReviews(nextReviews);
      setSummary(response.summary || { ...emptySummary, reviewsCount: nextReviews.length });
      setTotal(response.meta?.total || nextReviews.length);
      setIsLoading(false);
    };

    loadReviews();

    return () => {
      isActive = false;
    };
  }, [selectedStatus]);

  const { order, orderBy, rowsPerPage, filteredList, handleChangePage, handleRequestSort } =
    useMuiTable({ listData: reviews });

  return (
    <PageWrapper title="Product Reviews">
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Failed to load latest reviews. Showing available data.
        </Alert>
      )}

      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="body2" color="text.secondary">
              Total Reviews
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {total}
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="body2" color="text.secondary">
              Average Rating
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {summary.ratingAvg.toFixed(1)} / 5
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="body2" color="text.secondary">
              5-Star Reviews
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {summary.rating5Count}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
        {statusFilters.map((filter) => (
          <Chip
            key={filter.value}
            label={filter.label}
            clickable
            component={Link}
            href={filter.href}
            color={selectedStatus === filter.value ? "primary" : "default"}
            variant={selectedStatus === filter.value ? "filled" : "outlined"}
          />
        ))}
      </Stack>

      {isLoading && (
        <Card sx={{ p: 4, mb: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
            <CircularProgress size={22} />
            <Typography variant="body2" color="text.secondary">
              Loading reviews...
            </Typography>
          </Stack>
        </Card>
      )}

      {!isLoading && reviews.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {getEmptyStateText(selectedStatus)}
        </Alert>
      )}

      <Card>
        <OverlayScrollbar>
          <TableContainer sx={{ minWidth: 1000 }}>
            <Table>
              <TableHeader
                order={order}
                orderBy={orderBy}
                heading={tableHeading}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {filteredList.map((review, index) => (
                  <ReviewRow review={review} key={index} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </OverlayScrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination
            onChange={handleChangePage}
            count={Math.max(1, Math.ceil(total / rowsPerPage))}
          />
        </Stack>
      </Card>
    </PageWrapper>
  );
}
