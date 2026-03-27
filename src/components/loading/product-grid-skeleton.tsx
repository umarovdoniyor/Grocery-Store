import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

// Skeleton for a single product card
function ProductCardSkeleton() {
  return (
    <Box>
      <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: "100%", borderRadius: 2 }} />
      <Box sx={{ pt: 1 }}>
        <Skeleton variant="text" width="60%" height={14} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mt: 0.5 }} />
      </Box>
    </Box>
  );
}

interface Props {
  count?: number;
  columns?: number;
}

// Used on storefront product listing pages (home, grocery, shops, search)
export default function ProductGridSkeleton({ count = 12, columns = 4 }: Props) {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 6, sm: 4, md: 12 / columns }}>
          <ProductCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}
