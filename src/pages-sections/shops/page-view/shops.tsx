"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FlexBetween, FlexBox } from "components/flex-box";
// LOCAL CUSTOM COMPONENT
import ShopCard from "../shop-card";
import ShopPagination from "../shop-pagination";
// CUSTOM DATA MODEL
import Shop from "models/Shop.model";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Name A-Z", value: "az" },
  { label: "Name Z-A", value: "za" },
  { label: "Popular", value: "popular" }
];

// =============================================
interface Props {
  shops: Shop[];
  totalShops: number;
  totalPages: number;
  firstIndex: number;
  lastIndex: number;
  selectedSort: string;
}
// =============================================

export default function ShopsPageView({
  totalShops,
  totalPages,
  firstIndex,
  lastIndex,
  shops,
  selectedSort
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryValue = searchParams.get("q") || "";
  const [searchDraft, setSearchDraft] = useState(queryValue);

  useEffect(() => {
    setSearchDraft(queryValue);
  }, [queryValue]);

  const pushQuery = (params: URLSearchParams) => {
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false
    });
  };

  const handleSortChange = (nextSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!nextSort || nextSort === "newest") params.delete("sort");
    else params.set("sort", nextSort);

    params.delete("page");
    pushQuery(params);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    const value = searchDraft.trim();
    if (value) params.set("q", value);
    else params.delete("q");

    params.delete("page");
    pushQuery(params);
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    setSearchDraft("");
    pushQuery(params);
  };

  const handleSearchDraftChange = (value: string) => {
    setSearchDraft(value);

    if (!value.trim() && queryValue) {
      handleClearSearch();
    }
  };

  return (
    <Container className="mt-2 mb-3">
      <Typography variant="h2" sx={{ mb: 2 }}>
        All Shops
      </Typography>

      <FlexBetween flexWrap="wrap" gap={2} mb={3}>
        <Typography variant="body1" sx={{ color: "grey.600" }}>
          Showing {firstIndex}-{lastIndex} of {totalShops} Shops
        </Typography>

        <FlexBox alignItems="center" gap={1} sx={{ width: { xs: "100%", md: "auto" } }}>
          <TextField
            size="small"
            placeholder="Search shops"
            value={searchDraft}
            onChange={(event) => handleSearchDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSearch();
            }}
            sx={{ minWidth: { xs: "100%", md: 260 } }}
          />

          <Button variant="outlined" onClick={handleSearch} sx={{ whiteSpace: "nowrap" }}>
            Search
          </Button>

          {queryValue ? (
            <Button variant="text" onClick={handleClearSearch} sx={{ whiteSpace: "nowrap" }}>
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
            value={selectedSort}
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

      {/* ALL SHOP LIST AREA */}
      <Grid container spacing={3}>
        {shops.map((item) => (
          <Grid size={{ lg: 4, sm: 6, xs: 12 }} key={item.id}>
            <ShopCard
              name={item.name}
              slug={item.slug}
              phone={item.phone}
              address={item.address}
              coverPicture={item.coverPicture}
              profilePicture={item.profilePicture}
            />
          </Grid>
        ))}
      </Grid>

      {/* PAGINATION AREA */}
      <ShopPagination
        lastIndex={lastIndex}
        firstIndex={firstIndex}
        totalPages={totalPages}
        totalShops={totalShops}
      />
    </Container>
  );
}
