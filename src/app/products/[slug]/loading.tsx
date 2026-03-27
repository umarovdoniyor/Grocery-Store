import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

export default function ProductDetailLoading() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Breadcrumb */}
      <Skeleton variant="text" width={260} height={20} sx={{ mb: 3 }} />
      <Grid container spacing={4}>
        {/* Image gallery */}
        <Grid item xs={12} md={6}>
          <Skeleton variant="rounded" width="100%" sx={{ paddingTop: "100%" }} />
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" width={64} height={64} />
            ))}
          </Box>
        </Grid>
        {/* Product info */}
        <Grid item xs={12} md={6}>
          <Skeleton variant="text" width="80%" height={36} />
          <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="60%" height={20} sx={{ mt: 2 }} />
          <Skeleton variant="text" width="55%" height={20} sx={{ mt: 1 }} />
          <Skeleton variant="rounded" width={180} height={44} sx={{ mt: 3 }} />
          <Skeleton variant="rounded" width="100%" height={60} sx={{ mt: 3 }} />
        </Grid>
      </Grid>
      {/* Description tabs */}
      <Skeleton variant="rounded" width="100%" height={200} sx={{ mt: 5 }} />
    </Box>
  );
}
