"use client";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const PaymentForm = dynamic(() => import("../payment-form"), {
  loading: () => <Box sx={{ minHeight: 360 }} />
});

const PaymentSummary = dynamic(() => import("../payment-summery"), {
  loading: () => <Box sx={{ minHeight: 280 }} />
});

export default function PaymentPageView() {
  return (
    <Grid container flexWrap="wrap-reverse" spacing={3}>
      <Grid size={{ md: 8, xs: 12 }}>
        <PaymentForm />
      </Grid>

      <Grid size={{ md: 4, xs: 12 }}>
        <PaymentSummary />
      </Grid>
    </Grid>
  );
}
