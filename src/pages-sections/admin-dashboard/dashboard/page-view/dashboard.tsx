"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MuiCard from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { getAdminDashboardCards, getAdminStockOutProducts } from "utils/services/admin-dashboard";
import type {
  Card as DashboardCard,
  StockOut
} from "pages-sections/vendor-dashboard/dashboard/types";

const Card1 = dynamic(() => import("pages-sections/vendor-dashboard/dashboard/card-1"), {
  ssr: false
});

const DataListTable = dynamic(() => import("pages-sections/vendor-dashboard/dashboard/table"), {
  ssr: false
});

const tableHeading = [
  { id: "product", label: "Product", alignRight: false },
  { id: "stock", label: "Stock", alignRight: false },
  { id: "amount", label: "Amount", alignCenter: true }
];

export default function AdminDashboardPageView() {
  const [cardList, setCardList] = useState<DashboardCard[]>([]);
  const [stockOutProducts, setStockOutProducts] = useState<StockOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [cards, stockOut] = await Promise.all([
          getAdminDashboardCards(),
          getAdminStockOutProducts()
        ]);

        if (!isActive) return;

        setCardList(cards || []);
        setStockOutProducts(stockOut || []);
      } catch (err: any) {
        if (!isActive) return;
        setCardList([]);
        setStockOutProducts([]);
        setError(err?.message || "Failed to load dashboard data.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="pt-2 pb-2">
      {error && (
        <Alert
          severity="warning"
          sx={{
            mb: 2,
            border: "1px solid #FCD34D",
            backgroundColor: "#FFFBEB",
            color: "#92400E"
          }}
        >
          {error}
        </Alert>
      )}

      {isLoading && (
        <MuiCard
          sx={{
            p: 4,
            mb: 2,
            borderRadius: "10px",
            border: "1px solid #D1D5DB",
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)"
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
            <CircularProgress size={22} sx={{ color: "#4F46E5" }} />
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              Loading dashboard data...
            </Typography>
          </Stack>
        </MuiCard>
      )}

      <Grid container spacing={3}>
        <Grid container spacing={3} size={12}>
          {cardList.map((item) => (
            <Grid size={{ md: 3, sm: 6, xs: 12 }} key={item.id}>
              <Card1
                title={item.title}
                color={item.color}
                accentColor="#4F46E5"
                amount1={item.amount1}
                amount2={item.amount2}
                percentage={item.percentage}
                status={item.status === "down" ? "down" : "up"}
              />
            </Grid>
          ))}
        </Grid>

        <Grid size={12}>
          <MuiCard
            sx={{
              borderRadius: "10px",
              border: "1px solid #D1D5DB",
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
              "& .MuiTableHead-root": {
                backgroundColor: "#EEF2FF"
              },
              "& .MuiTableSortLabel-root": {
                color: "#374151"
              },
              "& .MuiTableSortLabel-root.Mui-active": {
                color: "#4338CA"
              },
              "& .MuiTableSortLabel-icon": {
                color: "#4F46E5 !important"
              }
            }}
          >
            <Box px={3} py={2.5}>
              <Typography variant="h5" sx={{ color: "#1F2937" }}>
                Low Stock Products
              </Typography>
            </Box>

            {stockOutProducts.length === 0 ? (
              <Box px={3} pb={3}>
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  No low-stock products right now.
                </Typography>
              </Box>
            ) : (
              <DataListTable dataList={stockOutProducts} tableHeading={tableHeading} />
            )}
          </MuiCard>
        </Grid>
      </Grid>
    </div>
  );
}
