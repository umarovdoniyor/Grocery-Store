import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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

export default async function AdminDashboardPageView() {
  const [cardList, stockOutProducts]: [DashboardCard[], StockOut[]] = await Promise.all([
    getAdminDashboardCards(),
    getAdminStockOutProducts()
  ]);

  return (
    <div className="pt-2 pb-2">
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
          <Card>
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
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
