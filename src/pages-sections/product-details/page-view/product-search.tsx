"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
// MUI
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
// MUI ICON COMPONENTS
import Apps from "@mui/icons-material/Apps";
import ViewList from "@mui/icons-material/ViewList";
import FilterList from "@mui/icons-material/FilterList";
// GLOBAL CUSTOM COMPONENTS
import Sidenav from "components/side-nav";
import { FlexBetween, FlexBox } from "components/flex-box";
import ProductFilters from "components/products-view/filters";
import ProductsGridView from "components/products-view/products-grid-view";
import ProductsListView from "components/products-view/products-list-view";
// TYPES
import Filters from "models/Filters";
import Product from "models/Product.model";

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Date", value: "date" },
  { label: "Price Low to High", value: "asc" },
  { label: "Price High to Low", value: "desc" }
];

// ==============================================================
interface Props {
  filters: Filters;
  products: Product[];
  pageCount: number;
  lastIndex: number;
  firstIndex: number;
  totalProducts: number;
}
// ==============================================================

export default function ProductSearchPageView({
  filters,
  products,
  pageCount,
  lastIndex,
  firstIndex,
  totalProducts
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");
  const page = searchParams.get("page") || "1";
  const view = searchParams.get("view") || "grid";
  const sort = searchParams.get("sort") || "relevance";

  const handleChangeSearchParams = (key: string, value: string) => {
    if (!key || !value) return;
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        pt: 2,
        pb: 4,
        backgroundColor: "#f8f6ec",
        backgroundImage:
          "radial-gradient(760px 240px at 12% -2%, rgba(111,143,68,0.18), rgba(111,143,68,0)), radial-gradient(720px 220px at 88% 0%, rgba(250, 190, 80, 0.16), rgba(250, 190, 80, 0))"
      }}
    >
      <Container sx={{ pt: { xs: 1.5, md: 2.5 } }}>
        {/* FILTER ACTION AREA */}
        <FlexBetween
          flexWrap="wrap"
          gap={2}
          mb={3}
          sx={{
            p: 2.25,
            borderRadius: 3,
            border: "1px solid rgba(90, 112, 64, 0.16)",
            backgroundColor: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(2px)",
            boxShadow: "0 12px 26px rgba(33, 49, 26, 0.06)"
          }}
        >
          {query ? (
            <div>
              <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700, color: "#1f2a1a" }}>
                Searching for “{query}”
              </Typography>
              <Typography variant="body1" sx={{ color: "#5c6f4a" }}>
                {totalProducts} results found
              </Typography>
            </div>
          ) : (
            <div>
              <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700, color: "#1f2a1a" }}>
                Curated Product Search
              </Typography>
              <Typography variant="body1" sx={{ color: "#5c6f4a" }}>
                Filter by shop, ratings, and attributes to find your next pick.
              </Typography>
            </div>
          )}

          <FlexBox alignItems="center" columnGap={3} rowGap={1.5} flexWrap="wrap">
            <FlexBox alignItems="center" gap={1} flex="1 1 0">
              <Typography variant="body1" sx={{ color: "#5f6f4c", whiteSpace: "pre" }}>
                Sort by:
              </Typography>

              <TextField
                select
                fullWidth
                size="small"
                value={sort}
                variant="outlined"
                placeholder="Sort by"
                onChange={(e) => handleChangeSearchParams("sort", e.target.value)}
                sx={{
                  flex: "1 1 0",
                  minWidth: "170px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#fff",
                    "& fieldset": { borderColor: "rgba(90,112,64,0.25)" },
                    "&:hover fieldset": { borderColor: "rgba(90,112,64,0.5)" },
                    "&.Mui-focused fieldset": { borderColor: "#5a7a30" }
                  }
                }}
              >
                {SORT_OPTIONS.map((item) => (
                  <MenuItem value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            </FlexBox>

            <FlexBox
              alignItems="center"
              my="0.25rem"
              sx={{
                border: "1px solid rgba(90,112,64,0.2)",
                borderRadius: 999,
                p: "3px",
                backgroundColor: "#fff"
              }}
            >
              <Typography variant="body1" sx={{ color: "#5f6f4c", mr: 1, ml: 0.75 }}>
                View:
              </Typography>

              <IconButton
                onClick={() => handleChangeSearchParams("view", "grid")}
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: view === "grid" ? "rgba(90,112,64,0.16)" : "transparent",
                  color: view === "grid" ? "#3f5a27" : "#77846a"
                }}
              >
                <Apps fontSize="small" color="inherit" />
              </IconButton>

              <IconButton
                onClick={() => handleChangeSearchParams("view", "list")}
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: view === "list" ? "rgba(90,112,64,0.16)" : "transparent",
                  color: view === "list" ? "#3f5a27" : "#77846a"
                }}
              >
                <ViewList fontSize="small" color="inherit" />
              </IconButton>

              {/* SHOW IN THE SMALL DEVICE */}
              <Box display={{ md: "none", xs: "block" }}>
                <Sidenav
                  handler={(close) => (
                    <IconButton
                      onClick={close}
                      sx={{
                        ml: 0.5,
                        width: 30,
                        height: 30,
                        color: "#3f5a27",
                        backgroundColor: "rgba(90,112,64,0.12)"
                      }}
                    >
                      <FilterList fontSize="small" color="inherit" />
                    </IconButton>
                  )}
                >
                  <Box px={3} py={2}>
                    <ProductFilters filters={filters} />
                  </Box>
                </Sidenav>
              </Box>
            </FlexBox>
          </FlexBox>
        </FlexBetween>

        <Grid container spacing={4}>
          {/* PRODUCT FILTER SIDEBAR AREA */}
          <Grid size={{ xl: 2, md: 3 }} sx={{ display: { md: "block", xs: "none" } }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid rgba(90, 112, 64, 0.14)",
                backgroundColor: "rgba(255,255,255,0.92)",
                boxShadow: "0 10px 20px rgba(33, 49, 26, 0.05)",
                position: "sticky",
                top: 84
              }}
            >
              <ProductFilters filters={filters} />
            </Box>
          </Grid>

          {/* PRODUCT VIEW AREA */}
          <Grid size={{ xl: 10, md: 9, xs: 12 }}>
            {products.length ? (
              view === "grid" ? (
                <ProductsGridView products={products} />
              ) : (
                <ProductsListView products={products} />
              )
            ) : (
              <Box
                sx={{
                  py: 8,
                  px: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  border: "1px dashed",
                  borderColor: "rgba(90,112,64,0.28)",
                  backgroundColor: "rgba(255,255,255,0.86)"
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your filters or search keyword.
                </Typography>
              </Box>
            )}

            <FlexBetween
              flexWrap="wrap"
              mt={6}
              sx={{
                p: 2,
                borderRadius: 2,
                borderTop: "1px solid rgba(90, 112, 64, 0.2)",
                backgroundColor: "rgba(255,255,255,0.72)"
              }}
            >
              <Typography variant="body1" sx={{ color: "grey.600" }}>
                Showing {firstIndex}-{lastIndex} of {totalProducts} Products
              </Typography>

              <Pagination
                color="primary"
                variant="outlined"
                page={+page}
                count={pageCount}
                onChange={(_, page) => handleChangeSearchParams("page", page.toString())}
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderColor: "rgba(90,112,64,0.25)",
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
    </Box>
  );
}
