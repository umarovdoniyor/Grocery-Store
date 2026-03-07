"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import ProductsGridView from "components/products-view/products-grid-view";
import { FlexBetween, FlexBox } from "components/flex-box";
// LOCAL CUSTOM COMPONENTS
import ShopIntroCard from "../shop-intro-card";
// CUSTOM DATA MODEL
import Shop from "models/Shop.model";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Popular", value: "popular" },
  { label: "Price Low to High", value: "asc" },
  { label: "Price High to Low", value: "desc" }
];

// ============================================================
type Props = {
  shop: Shop;
  pageCount: number;
  firstIndex: number;
  lastIndex: number;
  totalProducts: number;
  selectedSort: string;
};
// ============================================================

export default function ShopDetailsPageView({
  shop,
  pageCount,
  firstIndex,
  lastIndex,
  totalProducts,
  selectedSort
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parsedPage = Number(searchParams.get("page") || "1");
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const sortValue = SORT_OPTIONS.some((option) => option.value === selectedSort)
    ? selectedSort
    : "newest";

  const setQueryParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) params.delete(key);
    else params.set(key, value);

    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false
    });
  };

  const handlePageChange = (_: unknown, nextPage: number) => {
    setQueryParam("page", nextPage > 1 ? String(nextPage) : undefined);
  };

  const handleSortChange = (nextSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!nextSort || nextSort === "newest") params.delete("sort");
    else params.set("sort", nextSort);

    params.delete("page");
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false
    });
  };

  return (
    <Container className="mt-2 mb-3">
      {/* SHOP INTRODUCTION AREA */}
      <ShopIntroCard shop={shop} />

      <FlexBetween flexWrap="wrap" gap={2} mb={3}>
        <Typography variant="body1" sx={{ color: "grey.600" }}>
          Showing {firstIndex}-{lastIndex} of {totalProducts} Products
        </Typography>

        <FlexBox alignItems="center" gap={1}>
          <Typography variant="body1" sx={{ color: "grey.600" }}>
            Sort by:
          </Typography>

          <TextField
            select
            size="small"
            value={sortValue}
            onChange={(event) => handleSortChange(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FlexBox>
      </FlexBetween>

      <Grid container>
        <Grid size={{ xs: 12 }}>
          <ProductsGridView products={shop.products || []} />

          <FlexBetween flexWrap="wrap" mt={5}>
            <Typography variant="body1" sx={{ color: "grey.600" }}>
              Showing {firstIndex}-{lastIndex} of {totalProducts} Products
            </Typography>

            <Pagination
              color="primary"
              variant="outlined"
              page={page}
              count={pageCount}
              onChange={handlePageChange}
            />
          </FlexBetween>
        </Grid>
      </Grid>
    </Container>
  );
}
