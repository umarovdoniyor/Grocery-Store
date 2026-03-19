import Link from "next/link";
import { format } from "date-fns/format";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";
// CUSTOM DATA MODEL
import User from "models/User.model";

// ==============================================================
type Props = { user: User };
// ==============================================================

export default function UserInfo({ user }: Props) {
  const birthDate = new Date(user.dateOfBirth);
  const formattedBirthDate = Number.isNaN(birthDate.getTime())
    ? "N/A"
    : format(birthDate, "dd MMM, yyyy");

  return (
    <Link href={`/profile/${user.id}`}>
      <Card
        elevation={0}
        sx={{
          marginTop: 3,
          display: "flex",
          flexWrap: "wrap",
          border: "1px solid rgba(43, 38, 34, 0.15)",
          borderRadius: "4px",
          backgroundColor: "#F4EEE3",
          padding: "0.75rem 1.5rem",
          flexDirection: { md: "row", xs: "column" },
          alignItems: { md: "center", xs: "flex-start" },
          justifyContent: { md: "space-between", xs: "flex-start" },
          boxShadow: "none",
          transition: "background-color 180ms ease, border-color 180ms ease",
          "&:hover": {
            backgroundColor: "#ede4d5",
            borderColor: "rgba(43, 38, 34, 0.28)"
          }
        }}
      >
        <TableRowItem title="First Name" value={user.name.firstName} />
        <TableRowItem title="Last Name" value={user.name.lastName} />
        <TableRowItem title="Email" value={user.email} />
        <TableRowItem title="Phone" value={user.phone} />
        <TableRowItem title="Birth date" value={formattedBirthDate} />
      </Card>
    </Link>
  );
}

function TableRowItem({ title, value }: { title: string; value: string }) {
  return (
    <FlexBox flexDirection="column" p={1}>
      <Typography
        variant="caption"
        sx={{
          mb: 0.5,
          color: "#8B6A4A",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          fontWeight: 600
        }}
      >
        {title}
      </Typography>

      <Typography sx={{ color: "#2B2622", fontWeight: 600 }}>{value || "-"}</Typography>
    </FlexBox>
  );
}
