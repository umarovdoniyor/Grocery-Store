"use client";

import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MuiCard from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Card1 from "pages-sections/vendor-dashboard/dashboard/card-1";
import DataListTable from "pages-sections/vendor-dashboard/dashboard/table";
import { getAdminDashboardCards, getAdminStockOutProducts } from "utils/services/admin-dashboard";
import type {
  Card as DashboardCard,
  StockOut
} from "pages-sections/vendor-dashboard/dashboard/types";

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
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading && (
        <MuiCard sx={{ p: 4, mb: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
            <CircularProgress size={22} />
            <Typography variant="body2" color="text.secondary">
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
                amount1={item.amount1}
                amount2={item.amount2}
                percentage={item.percentage}
                status={item.status === "down" ? "down" : "up"}
              />
            </Grid>
          ))}
        </Grid>

        <Grid size={12}>
          <MuiCard>
            <Box px={3} py={2.5}>
              <Typography variant="h5">Low Stock Products</Typography>
            </Box>

            {stockOutProducts.length === 0 ? (
              <Box px={3} pb={3}>
                <Typography variant="body2" color="text.secondary">
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
