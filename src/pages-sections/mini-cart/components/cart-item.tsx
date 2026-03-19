"use client";

import Link from "next/link";
import Image from "next/image";
// MUI
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
// CUSTOM COMPONENTS
import Trash from "icons/Trash";
import FlexBox from "components/flex-box/flex-box";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// CUSTOM DATA MODEL
import { CartItem } from "contexts/CartContext";
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";

// STYLED COMPONENTS
const StyledRoot = styled("div")(({ theme }) => ({
  gap: "1rem",
  display: "flex",
  alignItems: "center",
  padding: "0.95rem 1.15rem",
  margin: "0.55rem 0.85rem",
  borderRadius: 12,
  border: "1px solid rgba(27,63,75,0.12)",
  backgroundColor: "rgba(255,255,255,0.86)",
  boxShadow: "0 6px 14px rgba(22, 59, 70, 0.05)"
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 74,
  height: 74,
  borderRadius: 10,
  border: "1px solid rgba(27,63,75,0.12)",
  backgroundColor: "#e9f1f1"
}));

const ContentWrapper = styled("div")(() => ({
  flex: 1,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis"
}));

const QuantityWrapper = styled("div")(({ theme }) => ({
  gap: "0.5rem",
  display: "flex",
  alignItems: "center",
  border: "1px solid rgba(27,63,75,0.2)",
  borderRadius: 8,
  backgroundColor: "#fff",
  "& .MuiButtonBase-root": {
    height: 24,
    width: 24,
    borderRadius: 7,
    color: "#1f5b67",
    "& svg": { fontSize: 16 }
  }
}));

// ==============================================================
interface Props {
  item: CartItem;
}
// ==============================================================

export default function MiniCartItem({ item }: Props) {
  const { dispatch } = useCart();

  const handleCartAmountChange = (amount: number) => () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { ...item, qty: amount }
    });
  };

  return (
    <StyledRoot>
      <Link href={`/products/${item.slug}`}>
        <StyledAvatar variant="rounded">
          <Image alt={item.title} src={item.thumbnail} fill sizes="(100px, 100px)" />
        </StyledAvatar>
      </Link>

      <ContentWrapper>
        <Typography noWrap variant="body1">
          {item.title}
        </Typography>

        <Typography variant="body1" fontWeight={700} sx={{ mt: 0.25, mb: 1.25, color: "#1f5b67" }}>
          {currency(item.price * item.qty)}
        </Typography>

        <FlexBox alignItems="center" justifyContent="space-between" gap={1}>
          <QuantityWrapper>
            <Button
              size="small"
              color="primary"
              variant="text"
              onClick={handleCartAmountChange(item.qty + 1)}
            >
              <Add fontSize="small" />
            </Button>

            <Typography variant="body1" fontSize={13} sx={{ color: "#2c4f59", fontWeight: 600 }}>
              {item.qty}
            </Typography>

            <Button
              size="small"
              color="primary"
              variant="text"
              disabled={item.qty === 1}
              onClick={handleCartAmountChange(item.qty - 1)}
            >
              <Remove fontSize="small" />
            </Button>
          </QuantityWrapper>

          <IconButton
            size="small"
            onClick={handleCartAmountChange(0)}
            sx={{
              width: 28,
              height: 28,
              color: "#a04d5f",
              backgroundColor: "rgba(160,77,95,0.08)",
              border: "1px solid rgba(160,77,95,0.18)",
              "&:hover": { backgroundColor: "rgba(160,77,95,0.14)" }
            }}
          >
            <Trash sx={{ fontSize: "1rem" }} />
          </IconButton>
        </FlexBox>
      </ContentWrapper>
    </StyledRoot>
  );
}
