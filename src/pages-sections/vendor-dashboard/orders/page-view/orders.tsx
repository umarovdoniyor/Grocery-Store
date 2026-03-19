"use client";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
// GLOBAL CUSTOM COMPONENTS
import OverlayScrollbar from "components/overlay-scrollbar";
import { TableHeader, TablePagination } from "components/data-table";
// GLOBAL CUSTOM HOOK
import useMuiTable from "hooks/useMuiTable";
// LOCAL CUSTOM COMPONENT
import OrderRow from "../order-row";
import SearchArea from "../../search-box";
import PageWrapper from "../../page-wrapper";
// CUSTOM DATA MODEL
import Order from "models/Order.model";
// TABLE HEAD COLUMN DATA
import { tableHeading } from "../table-heading";

// =============================================================================
type Props = {
  orders: Order[];
  basePath?: string;
  showCreateButton?: boolean;
  updatingOrderId?: string | null;
  onMarkDelivered?: (orderId: string) => void;
};
// =============================================================================

export default function OrdersPageView({
  orders,
  basePath = "/admin/orders",
  showCreateButton = true,
  updatingOrderId = null,
  onMarkDelivered
}: Props) {
  // RESHAPE THE ORDER LIST BASED TABLE HEAD CELL ID
  const filteredOrders = orders.map((item) => ({
    id: item.id,
    status: item.status,
    qty: item.items.length,
    amount: item.totalPrice,
    purchaseDate: item.createdAt,
    billingAddress: item.shippingAddress
  }));

  const { order, orderBy, rowsPerPage, filteredList, handleChangePage, handleRequestSort } =
    useMuiTable({ listData: filteredOrders, defaultSort: "purchaseDate", defaultOrder: "desc" });

  return (
    <PageWrapper title="Orders">
      <SearchArea
        url={basePath}
        buttonText="Create Order"
        searchPlaceholder="Search Order..."
        showButton={showCreateButton}
      />

      <Card
        sx={{
          borderRadius: "10px",
          border: "1px solid #D1D5DB",
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
          "& .MuiTableHead-root": {
            backgroundColor: "#F0FDFA"
          },
          "& .MuiTableSortLabel-root": {
            color: "#374151"
          },
          "& .MuiTableSortLabel-root.Mui-active": {
            color: "#0F766E"
          },
          "& .MuiTableSortLabel-icon": {
            color: "#14B8A6 !important"
          }
        }}
      >
        <OverlayScrollbar>
          <TableContainer sx={{ minWidth: 900 }}>
            <Table>
              <TableHeader
                order={order}
                orderBy={orderBy}
                heading={tableHeading}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {filteredList.map((order) => (
                  <OrderRow
                    order={order}
                    basePath={basePath}
                    key={order.id}
                    isUpdating={updatingOrderId === order.id}
                    onMarkDelivered={onMarkDelivered}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </OverlayScrollbar>

        <Stack
          alignItems="center"
          my={4}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#1F2937"
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              color: "#0F766E",
              borderColor: "#14B8A6"
            },
            "& .MuiPaginationItem-previousNext": {
              color: "#0F766E",
              borderColor: "#14B8A6"
            }
          }}
        >
          <TablePagination
            onChange={handleChangePage}
            count={Math.ceil(filteredList.length / rowsPerPage)}
          />
        </Stack>
      </Card>
    </PageWrapper>
  );
}
