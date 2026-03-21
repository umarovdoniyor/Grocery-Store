import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const CheckoutForm = dynamic(() => import("../checkout-form"), {
  loading: () => <Box sx={{ minHeight: 520 }} />
});

const CheckoutSummary = dynamic(() => import("../checkout-summery"), {
  loading: () => <Box sx={{ minHeight: 320 }} />
});

export default function CheckoutPageView() {
  return (
    <Grid container flexWrap="wrap-reverse" spacing={3}>
      <Grid size={{ md: 8, xs: 12 }}>
        <CheckoutForm />
      </Grid>

      <Grid size={{ md: 4, xs: 12 }}>
        <CheckoutSummary />
      </Grid>
    </Grid>
  );
}
