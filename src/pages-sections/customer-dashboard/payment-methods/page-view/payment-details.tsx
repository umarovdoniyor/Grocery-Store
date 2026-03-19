import { Fragment } from "react";
import Card from "@mui/material/Card";
// LOCAL CUSTOM COMPONENT
import PaymentForm from "../payment-form";
import DashboardHeader from "../../dashboard-header";
// CUSTOM DATA MODEL
import Payment from "models/Payment.model";

// ==============================================================
type Props = { payment: Payment };
// ==============================================================

export function PaymentDetailsPageView({ payment }: Props) {
  return (
    <Fragment>
      <DashboardHeader title="Demo Payment Profile" href="/payment-methods" />

      <Card sx={{ padding: { xs: 3, sm: 4 }, backgroundColor: "#FAF6EF", border: "1px solid rgba(43,38,34,0.12)", borderRadius: "4px", boxShadow: "none" }}>
        <PaymentForm payment={payment} />
      </Card>
    </Fragment>
  );
}
