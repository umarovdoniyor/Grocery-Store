"use client";

import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MuiCard from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
// LOCAL CUSTOM COMPONENTS
import Card1 from "../card-1";
import StockOutProducts from "../stock-out-products";
import { getMyProducts } from "../../../../../libs/product";
import { getVendorDashboardSummary } from "../../../../../libs/vendor";
// DATA TYPES
import type { Card, StockOut } from "../types";

function formatMetric(value: number) {
  return value.toLocaleString();
}

const getFallbackCards = (): Card[] => [
  {
    id: 1,
    title: "Total Products",
    color: "primary",
    amount1: "0",
    amount2: 0,
    percentage: "0%",
    status: "up"
  },
  {
    id: 2,
    title: "Published Products",
    color: "success",
    amount1: "0",
    amount2: 0,
    percentage: "0%",
    status: "up"
  },
  {
    id: 3,
    title: "Low Stock Items",
    color: "warning",
    amount1: "0",
    amount2: 0,
    percentage: "0%",
    status: "up"
  },
  {
    id: 4,
    title: "Product Orders",
    color: "info",
    amount1: "0",
    amount2: 0,
    percentage: "0%",
    status: "up"
  }
];

const mapProductsToCards = (products: any[]): Card[] => {
  const totalProducts = products.length;
  const publishedProducts = products.filter((item) => item.status === "PUBLISHED").length;
  const lowStockProducts = products.filter((item) => Number(item.stockQty || 0) <= 5).length;
  const totalOrders = products.reduce((sum, item) => sum + Number(item.ordersCount || 0), 0);

  return [
    {
      id: 1,
      title: "Total Products",
      color: "primary",
      amount1: formatMetric(totalProducts),
      amount2: totalProducts,
      percentage: "0%",
      status: "up"
    },
    {
      id: 2,
      title: "Published Products",
      color: "success",
      amount1: formatMetric(publishedProducts),
      amount2: publishedProducts,
      percentage: "0%",
      status: "up"
    },
    {
      id: 3,
      title: "Low Stock Items",
      color: "warning",
      amount1: formatMetric(lowStockProducts),
      amount2: lowStockProducts,
      percentage: "0%",
      status: lowStockProducts > 0 ? "down" : "up"
    },
    {
      id: 4,
      title: "Product Orders",
      color: "info",
      amount1: formatMetric(totalOrders),
      amount2: totalOrders,
      percentage: "0%",
      status: "up"
    }
  ];
};

const mapProductsToStockOut = (products: any[]): StockOut[] =>
  products
    .filter((item) => Number(item.stockQty || 0) <= 10)
    .sort((a, b) => Number(a.stockQty || 0) - Number(b.stockQty || 0))
    .slice(0, 8)
    .map((item) => ({
      product: item.title,
      stock: String(item.stockQty),
      amount: Number(item.salePrice || item.price || 0)
    }));

export default function DashboardPageView() {
  const [cardList, setCardList] = useState<Card[]>(getFallbackCards());
  const [stockOutProducts, setStockOutProducts] = useState<StockOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isActive = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError(undefined);

      const [summaryResponse, productsResponse] = await Promise.all([
        getVendorDashboardSummary(),
        getMyProducts({ page: 1, limit: 200 })
      ]);

      if (!isActive) return;

      if (summaryResponse.success && summaryResponse.summary) {
        const summary = summaryResponse.summary;
        setCardList([
          {
            id: 1,
            title: "Total Products",
            color: "primary",
            amount1: formatMetric(summary.products.total),
            amount2: summary.products.total,
            percentage: "0%",
            status: "up"
          },
          {
            id: 2,
            title: "Published Products",
            color: "success",
            amount1: formatMetric(summary.products.published),
            amount2: summary.products.published,
            percentage: "0%",
            status: "up"
          },
          {
            id: 3,
            title: "Low Stock Items",
            color: "warning",
            amount1: formatMetric(summary.products.lowStock),
            amount2: summary.products.lowStock,
            percentage: "0%",
            status: summary.products.lowStock > 0 ? "down" : "up"
          },
          {
            id: 4,
            title: `Revenue (${summary.revenue.currency || "USD"})`,
            color: "info",
            amount1: formatMetric(summary.revenue.gross),
            amount2: summary.orders.delivered,
            percentage: "0%",
            status: "up"
          }
        ]);
      } else if (productsResponse.success && productsResponse.list) {
        setCardList(mapProductsToCards(productsResponse.list));
      } else {
        setCardList(getFallbackCards());
      }

      if (productsResponse.success && productsResponse.list) {
        setStockOutProducts(mapProductsToStockOut(productsResponse.list));
      } else {
        setStockOutProducts([]);
      }

      if (!summaryResponse.success && !productsResponse.success) {
        setError(summaryResponse.error || productsResponse.error || "Failed to load dashboard data.");
      }

      setIsLoading(false);
    };

    loadDashboard();

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
        {/* ALL TRACKING CARDS */}
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

        {/* STOCK OUT PRODUCTS */}
        <Grid size={12}>
          <StockOutProducts stockOutProducts={stockOutProducts} />
        </Grid>
      </Grid>
    </div>
  );
}
