import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

export default function CheckoutLoading() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Skeleton variant="text" width={140} height={36} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Skeleton variant="rounded" width="100%" height={300} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" width="100%" height={160} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Skeleton variant="rounded" width="100%" height={320} />
        </Grid>
      </Grid>
    </Box>
  );
}
