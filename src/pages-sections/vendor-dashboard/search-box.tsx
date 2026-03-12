import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";
// MUI
import Add from "@mui/icons-material/Add";
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
}
// ===============================================================

export default function SearchArea({
  url = "/",
  buttonText = "Add Product",
  searchPlaceholder = "Search Product...",
  showButton = true
}: Props) {
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
    <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
      <SearchInput
        placeholder={searchPlaceholder}
        value={value}
        onChange={(e) => {
          const nextValue = e.target.value;
          setValue(nextValue);
          handleSearch(nextValue);
        }}
      />

      {showButton && (
        <Button
          href={url}
          color="info"
          fullWidth={downSM}
          variant="contained"
          startIcon={<Add />}
          component={Link}
          sx={{ minHeight: 44 }}
        >
          {buttonText}
        </Button>
      )}
    </FlexBox>
  );
}
