"use client";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";
// CUSTOM COMPONENTS
import Trash from "icons/Trash";
import CartItem from "../cart-item";
import EmptyCart from "../empty-cart";

const CheckoutForm = dynamic(() => import("../checkout-form"));

export default function CartPageView() {
  const { t } = useTranslation();
  const { state, dispatch } = useCart();

  if (state.cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Box
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            border: "1px solid rgba(79,109,47,0.2)",
            background: "linear-gradient(135deg, rgba(248,246,236,1) 0%, rgba(247,244,234,1) 100%)"
          }}
        >
          <Typography variant="h5" sx={{ color: "#2F4022", fontWeight: 700 }}>
            {t("Your Cart")}
          </Typography>
          <Typography variant="body2" sx={{ color: "#5E6F4D", mt: 0.5 }}>
            {t("Review your items and proceed to checkout when ready.")}
          </Typography>
        </Box>
      </Grid>

      <Grid size={{ md: 8, xs: 12 }}>
        {state.cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}

        <Box textAlign="end">
          <Button
            disableElevation
            color="error"
            variant="outlined"
            startIcon={<Trash fontSize="small" />}
            sx={{
              borderColor: "rgba(185, 28, 28, 0.35)",
              color: "#B91C1C",
              "&:hover": {
                borderColor: "rgba(185, 28, 28, 0.55)",
                backgroundColor: "rgba(185, 28, 28, 0.06)"
              }
            }}
            onClick={() => dispatch({ type: "CLEAR_CART" })}
          >
            {t("Clear Cart")}
          </Button>
        </Box>
      </Grid>

      <Grid size={{ md: 4, xs: 12 }}>
        <CheckoutForm />
      </Grid>
    </Grid>
  );
}
