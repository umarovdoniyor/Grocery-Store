import { Fragment } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import DashboardHeader from "../../dashboard-header";
// CUSTOM DATA MODEL
import Address from "models/Address.model";

const AddressForm = dynamic(() => import("../address-form"), {
  loading: () => <Box sx={{ minHeight: 280 }} />
});

// =============================================================
type Props = { address: Address };
// =============================================================

export function AddressDetailsPageView({ address }: Props) {
  return (
    <Fragment>
      <DashboardHeader href="/address" title="Edit Address" />

      <Card
        sx={{
          padding: { xs: 3, sm: 4 },
          backgroundColor: "#FAF6EF",
          border: "1px solid rgba(43,38,34,0.12)",
          borderRadius: "4px",
          boxShadow: "none"
        }}
      >
        <AddressForm address={address} />
      </Card>
    </Fragment>
  );
}
