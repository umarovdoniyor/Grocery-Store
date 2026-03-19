import Link from "next/link";
import { format } from "date-fns/format";
// MUI
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import East from "@mui/icons-material/East";
// LOCAL CUSTOM COMPONENT
import TableRow from "../table-row";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// CUSTOM DATA MODEL
import Order from "models/Order.model";

// =================================================
type Props = { order: Order };
// =================================================

const getChipSx = (status: string) => {
  const base = { fontWeight: 600, fontSize: "0.72rem" };
  if (status === "Pending")
    return {
      ...base,
      backgroundColor: "#F0E8DE",
      color: "#8B6A4A",
      border: "1px solid rgba(139,106,74,0.3)"
    };
  if (status === "Processing")
    return {
      ...base,
      backgroundColor: "#E8EDE0",
      color: "#5D6B3F",
      border: "1px solid rgba(93,107,63,0.3)"
    };
  if (status === "Delivered")
    return {
      ...base,
      backgroundColor: "#F5EBE9",
      color: "#A44A3F",
      border: "1px solid rgba(164,74,63,0.3)"
    };
  if (status === "Cancelled")
    return {
      ...base,
      backgroundColor: "rgba(43,38,34,0.06)",
      color: "#7A6C60",
      border: "1px solid rgba(43,38,34,0.15)"
    };
  return base;
};

export default function OrderRow({ order }: Props) {
  return (
    <Link href={`/orders/${order.id}`}>
      <TableRow elevation={0} sx={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
        <Typography noWrap variant="h5" sx={{ color: "#2B2622" }}>
          #{order.id.substring(0, 18)}
        </Typography>

        <Box textAlign={{ sm: "center", xs: "right" }}>
          <Chip size="small" label={order.status} sx={getChipSx(order.status)} />
        </Box>

        <Typography
          noWrap
          variant="body1"
          sx={{ textAlign: { sm: "center", xs: "left" }, color: "#7A6C60" }}
        >
          {format(new Date(order.createdAt), "MMM dd, yyyy")}
        </Typography>

        <Typography
          variant="body1"
          fontWeight={600}
          sx={{ textAlign: { sm: "center", xs: "right" }, color: "#2B2622" }}
        >
          {currency(order.totalPrice)}
        </Typography>

        <Box justifyContent="end" display={{ sm: "inline-flex", xs: "none" }}>
          <IconButton>
            <East className="east" fontSize="small" />
          </IconButton>
        </Box>
      </TableRow>
    </Link>
  );
}
