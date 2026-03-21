"use client";

import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// MUI
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Close from "@mui/icons-material/Close";
// CUSTOM ICON COMPONENT
import Search from "icons/Search";
// CUSTOM DATA MODEL
import { CategoryLink } from "models/Layout.model";

// ==============================================================
interface Props {
  categories: CategoryLink[];
}
// ==============================================================

export function SearchInput1({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchFromQuery = useMemo(() => searchParams.get("q") ?? "", [searchParams]);
  const [search, setSearch] = useState(searchFromQuery);

  useEffect(() => {
    setSearch(searchFromQuery);
  }, [searchFromQuery]);

  const pushWithParams = useCallback(
    (params: URLSearchParams) => {
      const nextQuery = params.toString();
      const href = nextQuery ? `/products/search?${nextQuery}` : "/products/search";
      router.push(href);
    },
    [router]
  );

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    const query = search.trim();

    if (query) params.set("q", query);
    else params.delete("q");

    pushWithParams(params);
  }, [search, searchParams, pushWithParams]);

  const handleClear = useCallback(() => {
    setSearch("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    pushWithParams(params);
  }, [searchParams, pushWithParams]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleEnter = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      handleClear();
    }
  };

  const INPUT_PROPS = {
    sx: {
      padding: 0,
      borderRadius: 999,
      border: "1px solid rgba(93, 112, 68, 0.3)",
      overflow: "hidden",
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      boxShadow: "0 6px 18px rgba(33, 49, 26, 0.1)",
      "& .MuiOutlinedInput-notchedOutline": {
        border: 0,
        borderColor: "transparent"
      },
      "&:hover": {
        borderColor: "rgba(86, 114, 53, 0.45)"
      },
      "&.Mui-focused": {
        borderColor: "rgba(86, 114, 53, 0.62)",
        boxShadow: "0 0 0 3px rgba(122, 151, 79, 0.18)"
      }
    },
    endAdornment: (
      <Box display="flex" alignItems="center">
        {search.length > 0 && (
          <IconButton aria-label="Clear search" size="small" onClick={handleClear}>
            <Close sx={{ fontSize: 16, color: "grey.500" }} />
          </IconButton>
        )}

        <IconButton
          aria-label="Search products"
          size="small"
          onClick={handleSearch}
          sx={{
            ml: 1,
            px: 2,
            borderLeft: "1px solid",
            borderColor: "rgba(93, 112, 68, 0.25)",
            borderRadius: 0
          }}
        >
          <Search sx={{ fontSize: 17, color: "#4f6d2f" }} />
        </IconButton>
      </Box>
    )
  };

  if (!categories || !categories.length) return null;

  return (
    <TextField
      fullWidth
      value={search}
      variant="outlined"
      onKeyDown={handleEnter}
      onChange={handleChange}
      placeholder="Searching for..."
      slotProps={{ input: INPUT_PROPS }}
      aria-label="Search products"
      role="searchbox"
    />
  );
}
