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
import SellerRow from "../seller-row";
import SearchArea from "../../search-box";
import PageWrapper from "../../page-wrapper";
// TABLE HEAD COLUMN DATA
import { tableHeading } from "../table-heading";
// DATA TYPES
import { Seller } from "../types";

// =============================================================================
type Props = {
  sellers: Seller[];
  showCreateButton?: boolean;
  uiMode?: "vendor" | "admin";
  updatingSellerId?: string | null;
  onApproveSeller: (seller: Seller) => void;
  onRejectSeller: (seller: Seller) => void;
};
// =============================================================================

export default function SellersPageView({
  sellers,
  showCreateButton = true,
  uiMode = "vendor",
  updatingSellerId,
  onApproveSeller,
  onRejectSeller
}: Props) {
  const accentColor = uiMode === "admin" ? "#4F46E5" : "#14B8A6";
  const accentDark = uiMode === "admin" ? "#4338CA" : "#0F766E";
  const headTint = uiMode === "admin" ? "#EEF2FF" : "#F0FDFA";

  const { order, orderBy, rowsPerPage, filteredList, handleChangePage, handleRequestSort } =
    useMuiTable({ listData: sellers });

  return (
    <PageWrapper title="Sellers">
      <SearchArea
        url="/admin/sellers"
        buttonText="Vendor Applications"
        searchPlaceholder="Search application..."
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
          <TableContainer sx={{ minWidth: 1100 }}>
            <Table>
              <TableHeader
                order={order}
                orderBy={orderBy}
                heading={tableHeading}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {filteredList.map((seller, index) => (
                  <SellerRow
                    seller={seller}
                    key={index}
                    uiMode={uiMode}
                    isUpdating={updatingSellerId === seller.id}
                    onApproveSeller={onApproveSeller}
                    onRejectSeller={onRejectSeller}
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
            count={Math.ceil(sellers.length / rowsPerPage)}
          />
        </Stack>
      </Card>
    </PageWrapper>
  );
}
