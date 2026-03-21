"use client";

import dynamic from "next/dynamic";
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
// TABLE HEAD COLUMN DATA
import { tableHeading } from "../table-heading";

const SearchArea = dynamic(() => import("../../search-box"), { ssr: false });
const CustomerRow = dynamic(() => import("../customer-row"), { ssr: false });
const PageWrapper = dynamic(() => import("../../page-wrapper"), { ssr: false });

// =============================================================================
type Props = {
  customers: any[];
  showCreateButton?: boolean;
  uiMode?: "vendor" | "admin";
  updatingMemberId?: string | null;
  onToggleMemberStatus: (customer: any) => void;
  onSoftDeleteMember: (customer: any) => void;
};
// =============================================================================

export default function CustomersPageView({
  customers,
  showCreateButton = true,
  uiMode = "vendor",
  updatingMemberId,
  onToggleMemberStatus,
  onSoftDeleteMember
}: Props) {
  const accentColor = uiMode === "admin" ? "#4F46E5" : "#14B8A6";
  const accentDark = uiMode === "admin" ? "#4338CA" : "#0F766E";
  const headTint = uiMode === "admin" ? "#EEF2FF" : "#F0FDFA";

  const { order, orderBy, rowsPerPage, filteredList, handleChangePage, handleRequestSort } =
    useMuiTable({ listData: customers });

  return (
    <PageWrapper title="Customers">
      <SearchArea
        buttonText="Add Customer"
        url="/admin/customers"
        searchPlaceholder="Search Customer..."
        uiMode={uiMode}
        showButton={showCreateButton}
      />

      <Card
        sx={{
          borderRadius: "10px",
          border: "1px solid #D1D5DB",
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
          "& .MuiTableHead-root": {
            backgroundColor: headTint
          },
          "& .MuiTableSortLabel-root": {
            color: "#374151"
          },
          "& .MuiTableSortLabel-root.Mui-active": {
            color: accentDark
          },
          "& .MuiTableSortLabel-icon": {
            color: `${accentColor} !important`
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
                {filteredList.map((customer) => (
                  <CustomerRow
                    customer={customer}
                    key={customer.id}
                    uiMode={uiMode}
                    isUpdating={updatingMemberId === customer.id}
                    onToggleMemberStatus={onToggleMemberStatus}
                    onSoftDeleteMember={onSoftDeleteMember}
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
              color: accentDark,
              borderColor: accentColor
            },
            "& .MuiPaginationItem-previousNext": {
              color: accentDark,
              borderColor: accentColor
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
