"use client";

import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
// GLOBAL CUSTOM HOOK
import useMuiTable from "hooks/useMuiTable";
// GLOBAL CUSTOM COMPONENTS
import OverlayScrollbar from "components/overlay-scrollbar";
// LOCAL CUSTOM COMPONENT
import TableHeader from "./table-head";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";

// STYLED COMPONENTS
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 13,
  paddingTop: 16,
  fontWeight: 500,
  paddingBottom: 16,
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  ":first-of-type": { paddingLeft: 24 }
}));

const StyledTableRow = styled(TableRow)({
  ":last-child .MuiTableCell-root": { border: 0 }
});

// =============================================================================
interface Props {
  dataList: any[];
  tableHeading: any[];
}
// =============================================================================

export default function DataListTable({ dataList, tableHeading }: Props) {
  const { order, orderBy, filteredList, handleRequestSort } = useMuiTable({
    listData: dataList
  });

  const BODY_CONTENT = (
    <TableBody>
      {filteredList.map((row, index) => {
        const { amount, stock, product } = row;

        return (
          <StyledTableRow key={index}>
            <StyledTableCell align="left">{product}</StyledTableCell>
            <StyledTableCell align="center" sx={{ color: "error.main" }}>
              {stock}
            </StyledTableCell>

            <StyledTableCell align="center">{currency(amount)}</StyledTableCell>
          </StyledTableRow>
        );
      })}
    </TableBody>
  );

  return (
    <OverlayScrollbar>
      <TableContainer>
        <Table>
          <TableHeader
            order={order}
            orderBy={orderBy}
            heading={tableHeading}
            onRequestSort={handleRequestSort}
          />

          {BODY_CONTENT}
        </Table>
      </TableContainer>
    </OverlayScrollbar>
  );
}
