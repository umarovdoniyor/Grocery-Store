import Grid from "@mui/material/Grid";
// LOCAL CUSTOM COMPONENTS
import Card1 from "../card-1";
import StockOutProducts from "../stock-out-products";
import { getVendorDashboardCards } from "utils/services/vendor-dashboard";
// DATA TYPES
import { Card } from "../types";

export default async function DashboardPageView() {
  const cardList: Card[] = await getVendorDashboardCards();

  return (
    <div className="pt-2 pb-2">
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
          <StockOutProducts />
        </Grid>
      </Grid>
    </div>
  );
}
