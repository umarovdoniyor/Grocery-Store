"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "@mui/material/Card";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import TableContainer from "@mui/material/TableContainer";
// GLOBAL CUSTOM COMPONENTS
import OverlayScrollbar from "components/overlay-scrollbar";
import { TableHeader, TablePagination } from "components/data-table";
// LOCAL CUSTOM COMPONENT
import ReviewRow from "../review-row";
import PageWrapper from "../../page-wrapper";
// GLOBAL CUSTOM HOOK
import useMuiTable from "hooks/useMuiTable";
import {
  getReviewsByAdmin,
  type ProductReview,
  updateReviewStatusByAdmin
} from "../../../../../libs/review";
import { getProductById } from "../../../../../libs/product";
import { toPublicImageUrl } from "../../../../../libs/upload";

// TABLE HEADING DATA LIST
const tableHeading = [
  { id: "product", label: "Product", align: "left" },
  { id: "customer", label: "Customer", align: "left" },
  { id: "comment", label: "Comment", align: "left" },
  { id: "published", label: "Published", align: "left" },
  { id: "action", label: "Action", align: "center" }
];

// =============================================================================
type Props = { reviews?: any[] };
// =============================================================================

const PLACEHOLDER_PRODUCT_IMAGE = "/assets/images/products/placeholder.png";
type ReviewFilter = "ALL" | "PENDING" | "PUBLISHED" | "HIDDEN" | "REJECTED";

const getApiBaseUrl = () => {
  const explicitBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  if (explicitBase) return explicitBase;

  const graphQlUrl =
    process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
    process.env.REACT_APP_API_GRAPHQL_URL ||
    "http://localhost:3007/graphql";

  try {
    const parsed = new URL(graphQlUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return graphQlUrl.replace(/\/graphql\/?$/, "");
  }
};

const API_BASE_URL = getApiBaseUrl();

const resolveProductImage = (value?: string | null) => {
  const normalized = value?.replace(/\\/g, "/").trim();
  if (!normalized) return PLACEHOLDER_PRODUCT_IMAGE;

  if (normalized.startsWith("/assets/")) return normalized;

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    try {
      const parsed = new URL(normalized);
      return parsed.host ? normalized : PLACEHOLDER_PRODUCT_IMAGE;
    } catch {
      return PLACEHOLDER_PRODUCT_IMAGE;
    }
  }

  try {
    return toPublicImageUrl(normalized, API_BASE_URL);
  } catch {
    return PLACEHOLDER_PRODUCT_IMAGE;
  }
};

type AdminReviewRow = {
  id: string;
  status: string;
  published: boolean;
  comment: string;
  productId: string;
  product: string;
  productImage: string;
  customer: string;
};

type ModerationTarget = {
  reviewId: string;
  status: "PUBLISHED" | "HIDDEN" | "REJECTED";
};

export default function ProductReviewsPageView(_: Props) {
  const [statusFilter, setStatusFilter] = useState<ReviewFilter>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<AdminReviewRow[]>([]);
  const [moderationTarget, setModerationTarget] = useState<ModerationTarget | null>(null);
  const [moderationReason, setModerationReason] = useState("");

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const response = await getReviewsByAdmin({
      page: 1,
      limit: 50,
      search: "",
      status: statusFilter === "ALL" ? undefined : statusFilter
    });
    if (!response.success) {
      setError(response.error || "Failed to load reviews.");
      setIsLoading(false);
      return;
    }

    const list = response.list || [];
    const productIds = Array.from(new Set(list.map((item) => item.productId).filter(Boolean)));
    const productMap = new Map<string, { title: string; thumbnail: string }>();

    const productResults = await Promise.allSettled(productIds.map((id) => getProductById(id)));
    productResults.forEach((result, index) => {
      if (result.status !== "fulfilled") return;
      if (!result.value.success || !result.value.product) return;

      const product = result.value.product;
      const productId = productIds[index];
      productMap.set(productId, {
        title: product.title || `Product #${productId.slice(-6)}`,
        thumbnail: resolveProductImage(product.thumbnail)
      });
    });

    const mapped = list.map((item: ProductReview) => {
      const customer =
        `${item.member?.memberFirstName || ""} ${item.member?.memberLastName || ""}`.trim() ||
        item.member?.memberNickname ||
        item.memberId;

      const productInfo = productMap.get(item.productId);

      return {
        id: item._id,
        status: item.status,
        published: item.status === "PUBLISHED",
        comment: item.comment || "",
        productId: item.productId,
        product: productInfo?.title || `Product #${item.productId.slice(-6)}`,
        productImage: productInfo?.thumbnail || PLACEHOLDER_PRODUCT_IMAGE,
        customer
      };
    });

    setReviews(mapped);
    setIsLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const filteredReviews = useMemo(() => {
    if (statusFilter === "ALL") return reviews;
    return reviews.filter((item) => item.status === statusFilter);
  }, [reviews, statusFilter]);

  const openModerationDialog = (reviewId: string, status: "PUBLISHED" | "HIDDEN" | "REJECTED") => {
    setModerationTarget({ reviewId, status });

    if (status === "PUBLISHED") {
      setModerationReason("Approved by admin moderation.");
      return;
    }

    if (status === "HIDDEN") {
      setModerationReason("Hidden by admin moderation.");
      return;
    }

    setModerationReason("Rejected by admin moderation.");
  };

  const closeModerationDialog = () => {
    if (updatingId) return;
    setModerationTarget(null);
    setModerationReason("");
  };

  const handleModerationConfirm = async () => {
    if (!moderationTarget) return;

    const reason = moderationReason.trim();
    const { reviewId, status } = moderationTarget;

    setUpdatingId(reviewId);
    setError(null);

    const response = await updateReviewStatusByAdmin({
      reviewId,
      status,
      reason
    });

    if (!response.success || !response.review) {
      setError(response.error || "Failed to update review status.");
      setUpdatingId(null);
      return;
    }

    setReviews((prev) =>
      prev.map((item) =>
        item.id === reviewId
          ? {
              ...item,
              status: response.review!.status,
              published: response.review!.status === "PUBLISHED"
            }
          : item
      )
    );

    setUpdatingId(null);
    setModerationTarget(null);
    setModerationReason("");
  };

  const handleQuickApprove = async (reviewId: string) => {
    setUpdatingId(reviewId);
    setError(null);

    const response = await updateReviewStatusByAdmin({
      reviewId,
      status: "PUBLISHED",
      reason: "Approved by admin moderation."
    });

    if (!response.success || !response.review) {
      setError(response.error || "Failed to approve review.");
      setUpdatingId(null);
      return;
    }

    setReviews((prev) =>
      prev.map((item) =>
        item.id === reviewId
          ? {
              ...item,
              status: response.review!.status,
              published: response.review!.status === "PUBLISHED"
            }
          : item
      )
    );

    setUpdatingId(null);
  };

  const { order, orderBy, rowsPerPage, filteredList, handleChangePage, handleRequestSort } =
    useMuiTable({ listData: filteredReviews, defaultSort: "product" });

  return (
    <PageWrapper title="Product Reviews">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <Tabs
          value={statusFilter}
          onChange={(_, value: ReviewFilter) => setStatusFilter(value)}
          sx={{ px: 2, pt: 2 }}
        >
          <Tab value="ALL" label="All" />
          <Tab value="PENDING" label="Pending" />
          <Tab value="PUBLISHED" label="Published" />
          <Tab value="HIDDEN" label="Hidden" />
          <Tab value="REJECTED" label="Rejected" />
        </Tabs>

        {isLoading ? (
          <Box
            sx={{ py: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
          >
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Loading reviews...
            </Typography>
          </Box>
        ) : (
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
                  {filteredList.map((review) => (
                    <ReviewRow
                      review={review}
                      key={review.id}
                      isUpdating={updatingId === review.id}
                      onQuickApprove={handleQuickApprove}
                      onTogglePublish={(id, checked) =>
                        openModerationDialog(id, checked ? "PUBLISHED" : "HIDDEN")
                      }
                      onHideReview={(id) => openModerationDialog(id, "HIDDEN")}
                      onRejectReview={(id) => openModerationDialog(id, "REJECTED")}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </OverlayScrollbar>
        )}

        <Stack alignItems="center" my={4}>
          <TablePagination
            onChange={handleChangePage}
            count={Math.ceil(filteredList.length / rowsPerPage)}
          />
        </Stack>
      </Card>

      <Dialog
        open={Boolean(moderationTarget)}
        onClose={closeModerationDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {moderationTarget?.status === "PUBLISHED"
            ? "Publish Review"
            : moderationTarget?.status === "HIDDEN"
              ? "Hide Review"
              : "Reject Review"}
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {moderationTarget?.status === "PUBLISHED"
              ? "Please provide a moderation reason before publishing this review."
              : moderationTarget?.status === "HIDDEN"
                ? "Please provide a moderation reason before hiding this review."
                : "Please provide a moderation reason before rejecting this review."}
          </Typography>

          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            label="Moderation Reason"
            placeholder="Enter reason"
            value={moderationReason}
            onChange={(event) => setModerationReason(event.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModerationDialog} disabled={Boolean(updatingId)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleModerationConfirm}
            disabled={!moderationReason.trim() || Boolean(updatingId)}
          >
            {moderationTarget?.status === "PUBLISHED"
              ? "Publish"
              : moderationTarget?.status === "HIDDEN"
                ? "Hide"
                : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
}
