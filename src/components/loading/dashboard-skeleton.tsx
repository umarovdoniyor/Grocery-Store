import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

// Used on all dashboard pages (customer, vendor, admin)
export default function DashboardSkeleton() {
  return (
    <Box>
      {/* Page title */}
      <Skeleton variant="text" width={200} height={36} sx={{ mb: 3 }} />

      {/* Stat cards row */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={160} height={90} sx={{ flex: "1 1 140px" }} />
        ))}
      </Box>

      {/* Table header */}
      <Skeleton variant="rounded" width="100%" height={48} sx={{ mb: 1 }} />
      {/* Table rows */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} variant="rounded" width="100%" height={52} sx={{ mb: 0.75 }} />
      ))}
    </Box>
  );
}
