import Link from "next/link";
import Image from "next/image";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";

export default function EmptyCartView() {
  return (
    <FlexBox
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      height="calc(100% - 74px)"
      sx={{ px: 3 }}
    >
      <Image width={90} height={100} alt="banner" src="/assets/images/logos/shopping-bag.svg" />

      <Typography
        variant="body1"
        fontSize={16}
        color="#47616a"
        sx={{
          my: 2,
          maxWidth: 200,
          textAlign: "center"
        }}
      >
        No products in the cart
      </Typography>

      <Link href="/products/search">
        <Button
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 999,
            fontWeight: 700,
            textTransform: "none",
            px: 2.4,
            background: "linear-gradient(135deg, #3b7a81 0%, #1f5b67 100%)",
            boxShadow: "0 8px 18px rgba(22, 59, 70, 0.24)",
            "&:hover": {
              background: "linear-gradient(135deg, #316a70 0%, #184c56 100%)"
            }
          }}
        >
          Continue Shopping
        </Button>
      </Link>
    </FlexBox>
  );
}
