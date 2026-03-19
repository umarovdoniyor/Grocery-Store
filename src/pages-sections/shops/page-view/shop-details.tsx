"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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
  const searchValue = searchParams.get("q") || "";
  const [searchDraft, setSearchDraft] = useState(searchValue);

  useEffect(() => {
    setSearchDraft(searchValue);
  }, [searchValue]);

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

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    const value = searchDraft.trim();

    if (value) params.set("q", value);
    else params.delete("q");

    params.delete("page");
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false
    });
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");

    setSearchDraft("");

    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false
    });
  };

  const handleSearchDraftChange = (value: string) => {
    setSearchDraft(value);

    // If user manually clears an active query, immediately restore full listing.
    if (!value.trim() && searchValue) {
      handleClearSearch();
    }
  };

  return (
    <Container className="mt-2 mb-3">
      {/* SHOP INTRODUCTION AREA */}
      <ShopIntroCard shop={shop} />

      <FlexBetween
        flexWrap="wrap"
        gap={2}
        mb={3}
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid rgba(90, 112, 64, 0.14)",
          backgroundColor: "#f7f4ea"
        }}
      >
        <Typography variant="body1" sx={{ color: "grey.600" }}>
          Showing {firstIndex}-{lastIndex} of {totalProducts} Products
        </Typography>

        <FlexBox alignItems="center" gap={1} sx={{ width: { xs: "100%", md: "auto" } }}>
          <TextField
            size="small"
            placeholder="Search this shop"
            value={searchDraft}
            onChange={(event) => handleSearchDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSearch();
            }}
            sx={{
              minWidth: { xs: "100%", md: 280 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#fff",
                "& fieldset": { borderColor: "rgba(90,112,64,0.25)" },
                "&:hover fieldset": { borderColor: "rgba(90,112,64,0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#5a7a30" }
              }
            }}
          />

          <Button
            variant="outlined"
            onClick={handleSearch}
            sx={{
              whiteSpace: "nowrap",
              borderRadius: 999,
              borderColor: "rgba(90,112,64,0.42)",
              color: "#4f6d2f",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { borderColor: "#4f6d2f", backgroundColor: "rgba(79,109,47,0.06)" }
            }}
          >
            Search
          </Button>

          {searchValue ? (
            <Button
              variant="text"
              onClick={handleClearSearch}
              sx={{ whiteSpace: "nowrap", color: "#5f6f4c", textTransform: "none" }}
            >
              Clear
            </Button>
          ) : null}
        </FlexBox>

        <FlexBox alignItems="center" gap={1}>
          <Typography variant="body1" sx={{ color: "grey.600" }}>
            Sort by:
          </Typography>

          <TextField
            select
            size="small"
            value={sortValue}
            onChange={(event) => handleSortChange(event.target.value)}
            sx={{
              minWidth: 190,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#fff",
                "& fieldset": { borderColor: "rgba(90,112,64,0.25)" },
                "&:hover fieldset": { borderColor: "rgba(90,112,64,0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#5a7a30" }
              }
            }}
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
          {(shop.products || []).length > 0 ? (
            <ProductsGridView products={shop.products || []} />
          ) : (
            <Box
              sx={{
                py: 8,
                px: 3,
                textAlign: "center",
                borderRadius: 3,
                border: "1px dashed",
                borderColor: "rgba(90,112,64,0.28)",
                backgroundColor: "#f7f4ea"
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {searchValue ? "No matching products found" : "No products available yet"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchValue
                  ? "Try a different keyword or clear the search to see all products from this shop."
                  : "This vendor has not published any products yet. Please check back soon."}
              </Typography>
            </Box>
          )}

          <FlexBetween
            flexWrap="wrap"
            mt={5}
            sx={{ pt: 2, borderTop: "1px solid rgba(90, 112, 64, 0.14)" }}
          >
            <Typography variant="body1" sx={{ color: "grey.600" }}>
              Showing {firstIndex}-{lastIndex} of {totalProducts} Products
            </Typography>

            <Pagination
              color="primary"
              variant="outlined"
              page={page}
              count={pageCount}
              onChange={handlePageChange}
              sx={{
                "& .MuiPaginationItem-root": {
                  borderColor: "rgba(90,112,64,0.22)",
                  color: "#5f6f4c"
                },
                "& .Mui-selected": {
                  color: "#fff",
                  borderColor: "#5a7a30",
                  backgroundColor: "#5a7a30"
                }
              }}
            />
          </FlexBetween>
        </Grid>
      </Grid>
    </Container>
  );
}
