import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import FlexBetween from "components/flex-box/flex-between";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";

// ==============================================================
interface Props {
  title: string;
  value?: number;
}
// ==============================================================

export default function ListItem({ title, value }: Props) {
  return (
    <FlexBetween mb={1}>
      <Typography variant="body1" sx={{ color: "#5E6F4D" }}>
        {title}:
      </Typography>

      <Typography variant="h6" sx={{ color: "#2F4022" }}>
        {value ? currency(value) : "-"}
      </Typography>
    </FlexBetween>
  );
}
