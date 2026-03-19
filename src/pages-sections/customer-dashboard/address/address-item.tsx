import Link from "next/link";
// MUI
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
// CUSTOM COMPONENTS
import Pencil from "icons/Pencil";
import TableRow from "../table-row";
import DeleteAddressBtn from "./delete-btn";
// CUSTOM DATA MODEL
import Address from "models/Address.model";

// ==============================================================
type Props = { address: Address };
// ==============================================================

export default function AddressListItem({ address }: Props) {
  return (
    <Link href={`/address/${address.id}`}>
      <TableRow elevation={0}>
        <Typography noWrap fontWeight={600} variant="body1" sx={{ color: "#2B2622" }}>
          {address.title}
        </Typography>

        <Typography noWrap variant="body1" sx={{ color: "#7A6C60" }}>
          {`${address.street}, ${address.city}`}
        </Typography>

        <Typography noWrap variant="body1" sx={{ color: "#7A6C60" }}>
          {address.phone}
        </Typography>

        <Typography noWrap variant="body1" textAlign="right" sx={{ color: "#8B6A4A" }}>
          <IconButton>
            <Pencil fontSize="small" color="inherit" />
          </IconButton>

          <DeleteAddressBtn id={address.id} />
        </Typography>
      </TableRow>
    </Link>
  );
}
