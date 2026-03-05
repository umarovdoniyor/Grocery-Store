"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// LOCAL CUSTOM COMPONENT
import ListItem from "./list-item";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";
import { getCheckoutSummaryServer, type CheckoutSummaryData } from "utils/services/checkout-flow";

export default function CheckoutSummary() {
  const { state } = useCart();
  const [serverSummary, setServerSummary] = useState<CheckoutSummaryData | null>(null);

  const localSubtotal = state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
    let mounted = true;

    getCheckoutSummaryServer().then((res) => {
      if (!mounted || !res.success || !res.summary) return;
      setServerSummary(res.summary);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const totals = useMemo(() => {
    if (serverSummary) {
      return {
        subtotal: serverSummary.subtotal,
        shipping: serverSummary.deliveryFee,
        tax: serverSummary.taxAmount,
        discount: serverSummary.discountAmount,
        total: serverSummary.totalAmount
      };
    }

    return {
      subtotal: localSubtotal,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: localSubtotal
    };
  }, [localSubtotal, serverSummary]);

  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        p: 3,
        backgroundColor: theme.palette.grey[50],
        border: `1px solid ${theme.palette.divider}`
      })}
    >
      <ListItem title="Subtotal" value={totals.subtotal} />
      <ListItem title="Shipping" value={totals.shipping} />
      <ListItem title="Tax" value={totals.tax} />
      <ListItem title="Discount" value={totals.discount} />

      <Divider sx={{ my: 2 }} />

      <Typography variant="h2">{currency(totals.total)}</Typography>

      <Stack direction="row" spacing={2} mt={3}>
        <TextField size="medium" placeholder="Voucher" variant="outlined" fullWidth />

        <Button size="large" variant="outlined" color="primary">
          Apply
        </Button>
      </Stack>
    </Card>
  );
}
