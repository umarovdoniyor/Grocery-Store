import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";
// MUI
import Add from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// GLOBAL CUSTOM COMPONENTS
import SearchInput from "components/SearchInput";
import FlexBox from "components/flex-box/flex-box";

// ===============================================================
interface Props {
  url: string;
  buttonText: string;
  searchPlaceholder: string;
  showButton?: boolean;
  uiMode?: "vendor" | "admin";
}
// ===============================================================

export default function SearchArea({
  url = "/",
  buttonText = "Add Product",
  searchPlaceholder = "Search Product...",
  showButton = true,
  uiMode = "vendor"
}: Props) {
  const accentColor = uiMode === "admin" ? "#4F46E5" : "#14B8A6";
  const accentDark = uiMode === "admin" ? "#4338CA" : "#0F766E";
  const accentRing =
    uiMode === "admin" ? "0 0 0 3px rgba(79, 70, 229, 0.14)" : "0 0 0 3px rgba(20, 184, 166, 0.14)";

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const [value, setValue] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = useMemo(
    () =>
      debounce((rawValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const nextValue = rawValue.trim();

        if (nextValue) params.set("q", nextValue);
        else params.delete("q");

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
      }, 350),
    [pathname, router, searchParams]
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  return (
    <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap" alignItems="center">
      <Box
        sx={{
          width: "100%",
          maxWidth: 360,
          borderRadius: "10px",
          border: "1px solid #D1D5DB",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
          "&:focus-within": {
            borderColor: accentColor,
            boxShadow: accentRing
          }
        }}
      >
        <SearchInput
          placeholder={searchPlaceholder}
          value={value}
          onChange={(e) => {
            const nextValue = e.target.value;
            setValue(nextValue);
            handleSearch(nextValue);
          }}
          sx={{
            maxWidth: "100%",
            color: "#374151",
            backgroundColor: "transparent",
            "& .MuiSvgIcon-root": {
              color: accentColor
            }
          }}
        />
      </Box>

      {showButton && (
        <Button
          href={url}
          fullWidth={downSM}
          variant="contained"
          startIcon={<Add />}
          component={Link}
          sx={{
            minHeight: 44,
            backgroundColor: accentColor,
            color: "#F8FAFC",
            "&:hover": {
              backgroundColor: accentDark
            }
          }}
        >
          {buttonText}
        </Button>
      )}
    </FlexBox>
  );
}
