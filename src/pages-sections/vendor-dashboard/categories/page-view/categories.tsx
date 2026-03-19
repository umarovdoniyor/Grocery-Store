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
import type { AdminCategoryRow } from "utils/services/admin-categories";
// LOCAL CUSTOM COMPONENT
import CategoryRow from "../category-row";
import SearchArea from "../../search-box";
import PageWrapper from "../../page-wrapper";
// TABLE HEAD COLUMN DATA
import { tableHeading } from "../table-heading";

// =============================================================================
type Props = {
  categories: AdminCategoryRow[];
  uiMode?: "vendor" | "admin";
  updatingCategoryId?: string | null;
  removingCategoryId?: string | null;
  onToggleStatus: (category: AdminCategoryRow) => void;
  onRemoveCategory: (category: AdminCategoryRow) => void;
};
// =============================================================================

const CategoriesPageView = ({
  categories,
  uiMode = "vendor",
  updatingCategoryId,
  removingCategoryId,
  onToggleStatus,
  onRemoveCategory
}: Props) => {
  const accentColor = uiMode === "admin" ? "#4F46E5" : "#14B8A6";
  const accentDark = uiMode === "admin" ? "#4338CA" : "#0F766E";
  const headTint = uiMode === "admin" ? "#EEF2FF" : "#F0FDFA";

  const { order, orderBy, rowsPerPage, filteredList, handleChangePage, handleRequestSort } =
    useMuiTable({ listData: categories });

  return (
    <PageWrapper title="Product Categories">
      <SearchArea
        buttonText="Add Category"
        url="/admin/categories/create"
        searchPlaceholder="Search Category..."
        uiMode={uiMode}
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
                {filteredList.map((category) => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    uiMode={uiMode}
                    isUpdating={updatingCategoryId === category.id}
                    isRemoving={removingCategoryId === category.id}
                    onToggleStatus={onToggleStatus}
                    onRemoveCategory={onRemoveCategory}
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
            count={Math.ceil(categories.length / rowsPerPage)}
          />
        </Stack>
      </Card>
    </PageWrapper>
  );
};

export default CategoriesPageView;
