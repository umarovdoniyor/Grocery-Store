import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import ProductGridSkeleton from "components/loading/product-grid-skeleton";

export default function GroceryLoading() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Hero banner */}
      <Skeleton variant="rounded" width="100%" height={300} sx={{ mb: 4 }} />
      {/* Product sections */}
      <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
      <ProductGridSkeleton count={8} columns={4} />
    </Box>
  );
}
