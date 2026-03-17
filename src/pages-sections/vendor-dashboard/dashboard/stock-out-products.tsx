import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween } from "components/flex-box";
// LOCAL CUSTOM COMPONENT
import DataListTable from "./table";
// DATA TYPES
import type { StockOut } from "./types";

// table column list
const tableHeading = [
  { id: "product", label: "Product", alignRight: false },
  { id: "stock", label: "Stock", alignRight: false },
  { id: "amount", label: "Amount", alignCenter: true }
];

interface Props {
  stockOutProducts: StockOut[];
}

export default function StockOutProducts({ stockOutProducts }: Props) {

  return (
    <Card>
      <FlexBetween px={3} py={2.5}>
        <Typography variant="h5">Stock Out Products</Typography>
        <Button size="small" color="info" variant="outlined">
          All Products
        </Button>
      </FlexBetween>

      {stockOutProducts.length === 0 ? (
        <Box px={3} pb={3}>
          <Typography variant="body2" color="text.secondary">
            No low-stock products right now.
          </Typography>
        </Box>
      ) : (
        <DataListTable dataList={stockOutProducts} tableHeading={tableHeading} />
      )}
    </Card>
  );
}
