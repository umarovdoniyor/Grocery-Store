"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
// LOCAL CUSTOM COMPONENT
import PaymentItem from "./payment-item";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
import useCart from "hooks/useCart";
import { getCheckoutSummaryServer, type CheckoutSummaryData } from "utils/services/checkout-flow";

export default function PaymentSummary() {
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
      sx={{
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "grey.50",
        padding: { sm: 3, xs: 2 }
      }}
    >
      <PaymentItem title="Subtotal:" amount={totals.subtotal} />
      <PaymentItem title="Shipping:" amount={totals.shipping} />
      <PaymentItem title="Tax:" amount={totals.tax} />
      <PaymentItem title="Discount:" amount={totals.discount} />

      <Divider sx={{ my: 2 }} />

      <Typography variant="h4" textAlign="right">
        {currency(totals.total)}
      </Typography>
    </Card>
  );
}
