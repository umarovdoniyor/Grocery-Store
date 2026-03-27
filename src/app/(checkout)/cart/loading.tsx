import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

export default function CartLoading() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Skeleton variant="text" width={100} height={36} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i} sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Skeleton variant="rounded" width={80} height={80} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="30%" height={20} />
                <Skeleton variant="text" width="20%" height={24} sx={{ mt: 1 }} />
              </Box>
            </Box>
          ))}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" width="100%" height={240} />
        </Grid>
      </Grid>
    </Box>
  );
}
