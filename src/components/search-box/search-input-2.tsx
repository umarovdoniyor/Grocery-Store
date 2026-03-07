"use client";

import { useState, useCallback, useEffect, useMemo, KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// MUI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Close from "@mui/icons-material/Close";
// STYLED COMPONENT
import { SearchOutlinedIcon } from "./styles";

export function SearchInput2() {
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
      border: 0,
      height: 44,
      paddingRight: 0,
      overflow: "hidden",
      backgroundColor: "grey.50",
      "& .MuiOutlinedInput-notchedOutline": { border: 0 }
    },
    endAdornment: (
      <Box display="flex" alignItems="center" height="100%">
        {search.length > 0 && (
          <IconButton aria-label="Clear search" size="small" onClick={handleClear} sx={{ mr: 1 }}>
            <Close sx={{ fontSize: 16, color: "grey.500" }} />
          </IconButton>
        )}

        <Button
          color="primary"
          disableElevation
          variant="contained"
          onClick={handleSearch}
          sx={{ px: "3rem", height: "100%", borderRadius: "0 4px 4px 0" }}
        >
          Search
        </Button>
      </Box>
    ),
    startAdornment: <SearchOutlinedIcon fontSize="small" />
  };

  return (
    <Box position="relative" flex="1 1 0" maxWidth={670} mx="auto">
      <TextField
        fullWidth
        value={search}
        variant="outlined"
        onKeyDown={handleEnter}
        placeholder="Searching for..."
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{ input: INPUT_PROPS }}
      />
    </Box>
  );
}
