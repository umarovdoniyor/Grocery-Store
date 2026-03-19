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
//  LOCAL CUSTOM COMPONENT
import ProductRow from "../product-row";
import type { ProductRowItem } from "../product-row";
import SearchArea from "../../search-box";
import PageWrapper from "../../page-wrapper";

// TABLE HEADING DATA LIST
const defaultTableHeading = [
  { id: "name", label: "Name", align: "left" },
  { id: "category", label: "Category", align: "left" },
  { id: "brand", label: "Brand", align: "left" },
  { id: "price", label: "Price", align: "left" },
  { id: "published", label: "Published", align: "left" },
  { id: "action", label: "Action", align: "center" }
];

// =============================================================================
type Props = {
  products: ProductRowItem[];
  basePath?: string;
  showCreateButton?: boolean;
  showFeaturedToggle?: boolean;
  updatingProductId?: string | null;
  updatingFeaturedProductId?: string | null;
  removingProductId?: string | null;
  onTogglePublished: (product: any) => void;
  onToggleFeatured?: (product: any) => void;
  onUpdateFeaturedRank?: (product: any, featuredRank: number) => void;
  onRemoveProduct: (product: any) => void;
};
// =============================================================================

export default function ProductsPageView({
  products,
  basePath = "/admin/products",
  showCreateButton = true,
  showFeaturedToggle = false,
  updatingProductId,
  updatingFeaturedProductId,
  removingProductId,
  onTogglePublished,
  onToggleFeatured,
  onUpdateFeaturedRank,
  onRemoveProduct
}: Props) {
  const reshapedProducts = products;
  const tableHeading = showFeaturedToggle
    ? [
        { id: "name", label: "Name", align: "left" },
        { id: "category", label: "Category", align: "left" },
        { id: "brand", label: "Brand", align: "left" },
        { id: "price", label: "Price", align: "left" },
        { id: "published", label: "Published", align: "left" },
        { id: "featured", label: "Featured", align: "left" },
        { id: "action", label: "Action", align: "center" }
      ]
    : defaultTableHeading;

  const { order, orderBy, rowsPerPage, filteredList, handleChangePage, handleRequestSort } =
    useMuiTable({ listData: reshapedProducts });

  return (
    <PageWrapper title="Product List">
      <SearchArea
        buttonText="Add Product"
        url={`${basePath}/create`}
        searchPlaceholder="Search Product..."
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
                {filteredList.map((product, index) => (
                  <ProductRow
                    key={index}
                    product={product}
                    basePath={basePath}
                    isUpdating={updatingProductId === product.id}
                    isUpdatingFeatured={updatingFeaturedProductId === product.id}
                    isRemoving={removingProductId === product.id}
                    showFeaturedToggle={showFeaturedToggle}
                    onTogglePublished={onTogglePublished}
                    onToggleFeatured={onToggleFeatured}
                    onUpdateFeaturedRank={onUpdateFeaturedRank}
                    onRemoveProduct={onRemoveProduct}
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
            count={Math.ceil(products.length / rowsPerPage)}
          />
        </Stack>
      </Card>
    </PageWrapper>
  );
}
