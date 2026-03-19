"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
// MUI
import MuiPagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";

// STYLED COMPONENT
export const StyledPagination = styled(MuiPagination)({
  display: "flex",
  marginTop: "2.5rem",
  justifyContent: "center"
});

// ==============================================================
type Props = { count: number };
// ==============================================================

export default function Pagination({ count }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = useCallback(
    (_: unknown, page: number) => {
      const searchParams = new URLSearchParams();

      if (page === 1) {
        searchParams.delete("page");
      } else {
        searchParams.set("page", page.toString());
      }

      router.push(`${pathname}?${searchParams.toString()}`);
    },
    [router, pathname]
  );

  if (count <= 1) return null;

  return (
    <StyledPagination
      count={count}
      onChange={handlePageChange}
      sx={{
        "& .MuiPaginationItem-root": {
          color: "#7A6C60",
          borderColor: "rgba(43, 38, 34, 0.2)",
          "&.Mui-selected": {
            backgroundColor: "#2B2622",
            color: "#F4EEE3",
            "&:hover": { backgroundColor: "#A44A3F" }
          },
          "&:hover": { backgroundColor: "rgba(43, 38, 34, 0.08)" }
        }
      }}
    />
  );
}
