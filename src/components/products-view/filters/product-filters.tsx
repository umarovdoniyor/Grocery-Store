"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
// MUI
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import { FlexBetween, FlexBox } from "components/flex-box";
// LOCAL CUSTOM COMPONENTS
import CheckboxLabel from "./checkbox-label";
// CUSTOM LOCAL HOOK
import useProductFilterCard from "./use-product-filter-card";
// TYPES
import Filters from "models/Filters";

export default function ProductFilters({ filters }: { filters: Filters }) {
  const { brands: BRANDS, others: OTHERS, colors: COLORS } = filters;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    sales,
    brands,
    rating,
    colors,
    prices,
    handleChangeColor,
    handleChangePrice,
    handleChangeSales,
    handleToggleSearchParam
  } = useProductFilterCard();

  const selectedShops = (() => {
    try {
      const parsed = JSON.parse(searchParams.get("brands") || "[]");
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
    } catch {
      return [];
    }
  })();
  const hasShopFilter = selectedShops.length > 0;

  const handleClearFilters = () => {
    router.push(pathname);
  };

  const handleChangeShop = (value: string) => {
    const params = new URLSearchParams(searchParams);

    const nextShops = brands.includes(value)
      ? brands.filter((item) => item !== value)
      : [...brands, value];

    if (nextShops.length) {
      params.set("brands", JSON.stringify(nextShops));

      // Shop products endpoint does not support these filters.
      params.delete("category");
      params.delete("prices");
      params.delete("sales");
      params.delete("sale");
      params.delete("rating");
      params.delete("colors");
    } else {
      params.delete("brands");
    }

    params.delete("page");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <Box>
      {!hasShopFilter && (
        <>
          {/* PRICE VARIANT FILTER */}
          <Typography variant="h6" sx={{ mb: 1.5, fontSize: 15, fontWeight: 700, color: "#2c3f1f" }}>
            Price Range
          </Typography>

          <Slider
            min={0}
            max={300}
            size="small"
            value={prices}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `$${v}`}
            onChange={(_, v) => handleChangePrice(v as number[])}
            sx={{
              color: "#5a7a30",
              "& .MuiSlider-thumb": {
                width: 15,
                height: 15,
                boxShadow: "0 0 0 4px rgba(90,122,48,0.16)"
              },
              "& .MuiSlider-track": { border: "none" }
            }}
          />

          <FlexBetween>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="0"
              value={prices[0]}
              onChange={(e) => handleChangePrice([+e.target.value, prices[1]])}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9px",
                  backgroundColor: "#fff",
                  "& fieldset": { borderColor: "rgba(90,112,64,0.25)" }
                }
              }}
            />

            <Typography variant="h5" sx={{ px: 1, color: "grey.600" }}>
              -
            </Typography>

            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="250"
              value={prices[1]}
              onChange={(e) => handleChangePrice([prices[0], +e.target.value])}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9px",
                  backgroundColor: "#fff",
                  "& fieldset": { borderColor: "rgba(90,112,64,0.25)" }
                }
              }}
            />
          </FlexBetween>

          <Box component={Divider} my={3} sx={{ borderColor: "rgba(90,112,64,0.16)" }} />
        </>
      )}

      {/* SHOP FILTER */}
      <Typography variant="h6" sx={{ mb: 1.5, fontSize: 15, fontWeight: 700, color: "#2c3f1f" }}>
        Shops
      </Typography>

      <FormGroup>
        {BRANDS.map(({ label, value }) => (
          <CheckboxLabel
            key={value}
            label={label}
            checked={brands.includes(value)}
            onChange={() => handleChangeShop(value)}
          />
        ))}
      </FormGroup>

      {hasShopFilter && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            p: 1,
            borderRadius: 2,
            color: "#5f6f4c",
            backgroundColor: "rgba(90,112,64,0.08)",
            border: "1px solid rgba(90,112,64,0.16)"
          }}
        >
          Shop mode is active. Price, sale, rating, and color filters are hidden because the
          selected shop endpoint does not support them.
        </Typography>
      )}

      {!hasShopFilter && <Box component={Divider} my={3} sx={{ borderColor: "rgba(90,112,64,0.16)" }} />}

      {/* SALES OPTIONS */}
      {!hasShopFilter && (
        <FormGroup>
          {OTHERS.map(({ label, value }) => (
            <CheckboxLabel
              key={value}
              label={label}
              checked={sales.includes(value)}
              onChange={() => handleChangeSales(value)}
            />
          ))}
        </FormGroup>
      )}

      {!hasShopFilter && <Box component={Divider} my={3} sx={{ borderColor: "rgba(90,112,64,0.16)" }} />}

      {/* RATINGS FILTER */}
      {!hasShopFilter && (
        <>
          <Typography variant="h6" sx={{ mb: 1.5, fontSize: 15, fontWeight: 700, color: "#2c3f1f" }}>
            Ratings
          </Typography>

          <FormGroup>
            {[5, 4, 3, 2, 1].map((item) => (
              <CheckboxLabel
                key={item}
                checked={rating === item}
                onChange={() => handleToggleSearchParam("rating", item.toString())}
                label={<Rating size="small" value={item} color="warn" readOnly />}
              />
            ))}
          </FormGroup>
        </>
      )}

      {!hasShopFilter && <Box component={Divider} my={3} sx={{ borderColor: "rgba(90,112,64,0.16)" }} />}

      {/* COLORS VARIANT FILTER */}
      {!hasShopFilter && (
        <>
          <Typography variant="h6" sx={{ mb: 1.5, fontSize: 15, fontWeight: 700, color: "#2c3f1f" }}>
            Colors
          </Typography>

          <FlexBox mb={2} flexWrap="wrap" gap={1.5}>
            {COLORS.map((item) => (
              <Box
                key={item}
                bgcolor={item}
                onClick={() => handleChangeColor(item)}
                sx={{
                  width: 24,
                  height: 24,
                  flexShrink: 0,
                  outlineOffset: 2,
                  cursor: "pointer",
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,0.08)",
                  outline: colors.includes(item) ? "2px solid #5a7a30" : "none"
                }}
              />
            ))}
          </FlexBox>
        </>
      )}

      {searchParams.size > 0 && (
        <Button
          fullWidth
          disableElevation
          color="primary"
          variant="contained"
          onClick={handleClearFilters}
          sx={{
            mt: 4,
            borderRadius: 999,
            fontWeight: 700,
            textTransform: "none",
            background: "linear-gradient(135deg, #6f8f44 0%, #4f6d2f 100%)",
            boxShadow: "0 8px 18px rgba(51,80,30,0.22)",
            "&:hover": {
              background: "linear-gradient(135deg, #64813d 0%, #446127 100%)"
            }
          }}
        >
          Clear all filters
        </Button>
      )}
    </Box>
  );
}
