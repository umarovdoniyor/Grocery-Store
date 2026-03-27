import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import ProductGridSkeleton from "components/loading/product-grid-skeleton";

export default function ProductsLoading() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Grid container spacing={3}>
        {/* Filter sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Skeleton variant="rounded" width="100%" height={400} />
        </Grid>
        {/* Product grid */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Skeleton variant="text" width={120} height={28} />
            <Skeleton variant="rounded" width={160} height={36} />
          </Box>
          <ProductGridSkeleton count={9} columns={3} />
        </Grid>
      </Grid>
    </Box>
  );
}
