import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import ProductGridSkeleton from "components/loading/product-grid-skeleton";

export default function SearchLoading() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Skeleton variant="text" width={240} height={28} sx={{ mb: 3 }} />
      <ProductGridSkeleton count={12} columns={4} />
    </Box>
  );
}
