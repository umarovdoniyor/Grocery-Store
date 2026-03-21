import Typography from "@mui/material/Typography";
import FlexBetween from "components/flex-box/flex-between";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";

// ==============================================================
type Props = { title: string; amount?: number };
// ==============================================================

export default function PaymentItem({ title, amount }: Props) {
  return (
    <FlexBetween mb={1.2}>
      <Typography variant="body1" sx={{ color: "#5E6F4D", fontWeight: 500 }}>
        {title}
      </Typography>

      <Typography variant="h6" sx={{ color: "#2F4022", fontWeight: 600 }}>
        {amount ? currency(amount) : "-"}
      </Typography>
    </FlexBetween>
  );
}
