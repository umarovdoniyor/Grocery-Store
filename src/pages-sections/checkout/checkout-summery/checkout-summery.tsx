"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
// LOCAL CUSTOM COMPONENT
import ListItem from "./list-item";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";
import {
  getCheckoutSnapshotServer,
  type CheckoutSnapshotResult,
  type CheckoutSummaryData
} from "utils/services/checkout-flow";

export default function CheckoutSummary() {
  const { state } = useCart();
  const [snapshot, setSnapshot] = useState<CheckoutSnapshotResult | null>(null);

  const localSubtotal = state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
    let mounted = true;

    getCheckoutSnapshotServer().then((res) => {
      if (!mounted || !res.success || !res.snapshot) return;
      setSnapshot(res.snapshot);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const totals = useMemo(() => {
    const serverSummary: CheckoutSummaryData | undefined = snapshot?.summary;

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
  }, [localSubtotal, snapshot]);

  return (
    <Card
      elevation={0}
      sx={() => ({
        p: 3,
        backgroundColor: "#FEFDF9",
        border: "1px solid rgba(79,109,47,0.22)",
        borderRadius: 2,
        boxShadow: "0 8px 18px rgba(33,49,26,0.08)",
        "& .MuiInputLabel-root": {
          zIndex: 1,
          color: "#5E6F4D"
        },
        "& .MuiInputLabel-shrink": {
          px: 0.5,
          borderRadius: 0.5,
          bgcolor: "#FEFDF9"
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: 8,
          backgroundColor: "#F7F4EA",
          "& fieldset": {
            borderColor: "rgba(79,109,47,0.2)"
          },
          "&:hover fieldset": {
            borderColor: "rgba(79,109,47,0.35)"
          },
          "&.Mui-focused fieldset": {
            borderColor: "#5A7A30"
          }
        }
      })}
    >
      <Typography variant="h6" sx={{ color: "#2F4022", fontWeight: 700, mb: 2 }}>
        Order Summary
      </Typography>

      <ListItem title="Subtotal" value={totals.subtotal} />
      <ListItem title="Shipping" value={totals.shipping} />
      <ListItem title="Tax" value={totals.tax} />
      <ListItem title="Discount" value={totals.discount} />

      <Divider sx={{ my: 2 }} />

      <Typography variant="h2" sx={{ color: "#2F4022" }}>
        {currency(totals.total)}
      </Typography>

      {snapshot && !snapshot.isValid && snapshot.issues.length > 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {snapshot.issues[0].message}
        </Alert>
      )}

      <Stack direction="row" spacing={2} mt={3}>
        <TextField size="medium" placeholder="Voucher" variant="outlined" fullWidth />

        <Button
          size="large"
          variant="outlined"
          sx={{
            borderColor: "rgba(79,109,47,0.35)",
            color: "#446127",
            "&:hover": {
              borderColor: "#446127",
              backgroundColor: "rgba(79,109,47,0.08)"
            }
          }}
        >
          Apply
        </Button>
      </Stack>
    </Card>
  );
}
