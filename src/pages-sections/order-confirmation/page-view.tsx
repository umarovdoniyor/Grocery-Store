"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// STYLED COMPONENT
import { Wrapper, StyledButton } from "./styles";

export default function OrderConfirmationPageView() {
  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get("method");
  const orderNo = searchParams.get("orderNo");
  const orderId = searchParams.get("orderId");

  return (
    <Container className="mt-2 mb-5">
      <Wrapper>
        <Image
          width={116}
          height={116}
          alt="complete"
          src="/assets/images/illustrations/party-popper.svg"
        />

        <Typography variant="h1" fontWeight={700}>
          Thank you for your purchase!
        </Typography>

        <Typography
          fontSize={16}
          variant="body1"
          color="text.secondary"
          sx={{ padding: ".5rem 2rem" }}
        >
          We have received your order and you will be receiving confirmation email with order
          details.
        </Typography>

        <Typography fontSize={16} variant="body1" color="text.secondary">
          Your order number is <strong>{orderNo ? `#${orderNo}` : "pending assignment"}</strong>.
        </Typography>

        {paymentMethod && (
          <Typography fontSize={16} variant="body1" color="text.secondary">
            Payment method: <strong>{paymentMethod}</strong>
          </Typography>
        )}

        <StyledButton
          color="primary"
          disableElevation
          variant="contained"
          className="button-link"
          LinkComponent={Link}
          href={orderId ? `/orders/${orderId}` : "/products"}
        >
          {orderId ? "View order details" : "Browse products"}
        </StyledButton>
      </Wrapper>
    </Container>
  );
}
