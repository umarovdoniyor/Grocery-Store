"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
// MUI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Clear from "@mui/icons-material/Clear";
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";
// LOCAL CUSTOM COMPONENTS
import MiniCartItem from "./components/cart-item";
import EmptyCartView from "./components/empty-view";
// GLOBAL CUSTOM COMPONENT
import { FlexBetween } from "components/flex-box";
import OverlayScrollbar from "components/overlay-scrollbar";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";

export default function MiniCart() {
  const router = useRouter();
  const { state } = useCart();
  const CART_LENGTH = state.cart.length;

  const getTotalPrice = () => {
    return state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  };

  return (
    <Box
      height="100vh"
      width={390}
      sx={{
        backgroundColor: "#f3f7f7",
        backgroundImage:
          "radial-gradient(500px 190px at 12% -2%, rgba(59,122,129,0.16), rgba(59,122,129,0)), radial-gradient(500px 190px at 88% -2%, rgba(27,63,75,0.12), rgba(27,63,75,0))"
      }}
    >
      <FlexBetween ml={3} mr={2} height={78} sx={{ borderBottom: "1px solid rgba(27,63,75,0.12)" }}>
        <Typography variant="h6" sx={{ color: "#1f3f4b", fontWeight: 700 }}>
          Your Cart ({CART_LENGTH})
        </Typography>

        <IconButton
          size="small"
          onClick={router.back}
          sx={{
            width: 30,
            height: 30,
            color: "#1f3f4b",
            backgroundColor: "rgba(255,255,255,0.84)",
            border: "1px solid rgba(27,63,75,0.16)",
            "&:hover": { backgroundColor: "#fff" }
          }}
        >
          <Clear fontSize="small" color="inherit" />
        </IconButton>
      </FlexBetween>

      <Box height={`calc(100% - ${CART_LENGTH ? "211px" : "75px"})`}>
        {CART_LENGTH > 0 ? (
          <OverlayScrollbar>
            {state.cart.map((item) => (
              <MiniCartItem item={item} key={item.id} />
            ))}
          </OverlayScrollbar>
        ) : (
          <EmptyCartView />
        )}
      </Box>

      {CART_LENGTH > 0 && (
        <Box
          p={2.5}
          sx={{
            borderTop: "1px solid rgba(27,63,75,0.12)",
            backgroundColor: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(2px)"
          }}
        >
          <FlexBetween sx={{ mb: 1.5 }}>
            <Typography variant="body2" sx={{ color: "#5e7681", fontWeight: 600 }}>
              Subtotal
            </Typography>
            <Typography variant="h6" sx={{ color: "#1f3f4b", fontWeight: 700 }}>
              {currency(getTotalPrice())}
            </Typography>
          </FlexBetween>

          <Button
            fullWidth
            color="primary"
            variant="contained"
            LinkComponent={Link}
            href="/checkout"
            sx={{
              height: 44,
              mb: 1,
              borderRadius: 999,
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(135deg, #3b7a81 0%, #1f5b67 100%)",
              boxShadow: "0 8px 18px rgba(22, 59, 70, 0.28)",
              "&:hover": {
                background: "linear-gradient(135deg, #316a70 0%, #184c56 100%)"
              }
            }}
          >
            Proceed to Checkout
          </Button>

          <Button
            fullWidth
            color="primary"
            variant="outlined"
            LinkComponent={Link}
            href="/cart"
            sx={{
              height: 44,
              borderRadius: 999,
              fontWeight: 600,
              textTransform: "none",
              color: "#1f5b67",
              borderColor: "rgba(31,91,103,0.42)",
              "&:hover": {
                borderColor: "#1f5b67",
                backgroundColor: "rgba(31,91,103,0.06)"
              }
            }}
          >
            View Cart
          </Button>
        </Box>
      )}
    </Box>
  );
}
