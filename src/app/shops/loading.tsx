import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";

export default function ShopsLoading() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Skeleton variant="text" width={160} height={32} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid key={i} item xs={12} sm={6} md={3}>
            <Skeleton variant="rounded" width="100%" height={180} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="40%" height={16} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
