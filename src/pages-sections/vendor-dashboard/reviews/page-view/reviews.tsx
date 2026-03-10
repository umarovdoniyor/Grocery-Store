"use client";

import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
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
import { Review, ReviewSummary } from "../types";

// =============================================================================
type Props = {
  reviews: Review[];
  summary: ReviewSummary;
  total: number;
  error?: string;
};
// =============================================================================

export default function ReviewsPageView({ reviews, summary, total, error }: Props) {
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

      {reviews.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No published reviews yet for your products.
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
