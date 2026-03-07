"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import FlexBetween from "components/flex-box/flex-between";

// ==============================================================
interface Props {
  totalShops: number;
  totalPages: number;
  lastIndex: number;
  firstIndex: number;
}
// ==============================================================

export default function ShopPagination({ totalShops, totalPages, firstIndex, lastIndex }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parsedPage = Number(searchParams.get("page") || "1");
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  return (
    <FlexBetween flexWrap="wrap" mt={4}>
      <Typography component="span" sx={{ color: "grey.600" }}>
        Showing {firstIndex}-{lastIndex} of {totalShops} Shops
      </Typography>

      <Pagination
        page={page}
        count={totalPages}
        variant="outlined"
        color="primary"
        onChange={(_, nextPage) => {
          const params = new URLSearchParams(searchParams.toString());
          if (nextPage === 1) params.delete("page");
          else params.set("page", nextPage.toString());

          router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
            scroll: false
          });
        }}
      />
    </FlexBetween>
  );
}
