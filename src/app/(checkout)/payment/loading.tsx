import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";

export default function PaymentLoading() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Skeleton variant="text" width={120} height={36} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Skeleton variant="rounded" width="100%" height={280} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Skeleton variant="rounded" width="100%" height={240} />
        </Grid>
      </Grid>
    </Box>
  );
}
