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
  updatingCategoryId?: string | null;
  removingCategoryId?: string | null;
  onToggleStatus: (category: AdminCategoryRow) => void;
  onRemoveCategory: (category: AdminCategoryRow) => void;
};
// =============================================================================

const CategoriesPageView = ({
  categories,
  updatingCategoryId,
  removingCategoryId,
  onToggleStatus,
  onRemoveCategory
}: Props) => {
  const { order, orderBy, rowsPerPage, filteredList, handleChangePage, handleRequestSort } =
    useMuiTable({ listData: categories });

  return (
    <PageWrapper title="Product Categories">
      <SearchArea
        buttonText="Add Category"
        url="/admin/categories/create"
        searchPlaceholder="Search Category..."
      />

      <Card>
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

        <Stack alignItems="center" my={4}>
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
