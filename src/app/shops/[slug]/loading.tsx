import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import ProductGridSkeleton from "components/loading/product-grid-skeleton";

export default function ShopDetailLoading() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Shop banner */}
      <Skeleton variant="rounded" width="100%" height={200} sx={{ mb: 3 }} />
      {/* Shop info row */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 4 }}>
        <Skeleton variant="circular" width={80} height={80} />
        <Box>
          <Skeleton variant="text" width={180} height={28} />
          <Skeleton variant="text" width={120} height={20} />
        </Box>
      </Box>
      {/* Products */}
      <Skeleton variant="text" width={140} height={28} sx={{ mb: 2 }} />
      <ProductGridSkeleton count={8} columns={4} />
    </Box>
  );
}
