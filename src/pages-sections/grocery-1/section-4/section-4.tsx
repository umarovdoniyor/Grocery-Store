import Link from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import FlexRowCenter from "components/flex-box/flex-row-center";
import ProductCard4 from "components/product-cards/product-card-4";
// CUSTOM DATA MODEL
import Product from "models/Product.model";
// STYLED COMPONENT
import { SubTitle } from "../styles";

// ========================================================
type Props = {
  products: Product[];
  title?: string;
  parentCategory?: { title: string; slug: string } | null;
};
// ========================================================

export default function AllProducts({ products, title = "All Products", parentCategory }: Props) {
  return (
    <div className="mb-3" id="products">
      <Typography variant="h2">{title}</Typography>
      <SubTitle>Best collection in {new Date().getFullYear()} for you!</SubTitle>

      {products.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                <ProductCard4 product={product} />
              </Grid>
            ))}
          </Grid>

          <FlexRowCenter mt={6}>
            <Button variant="contained" color="primary" sx={{ fontSize: 13 }}>
              Load More...
            </Button>
          </FlexRowCenter>
        </>
      ) : (
        <Box
          sx={{
            mt: 2,
            py: 7,
            px: 3,
            borderRadius: 2,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider"
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            No products in {title} yet
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try another sub-category or browse the broader category for more options.
          </Typography>

          <FlexRowCenter gap={1.5} flexWrap="wrap">
            {parentCategory ? (
              <Link href={`/grocery-1/${parentCategory.slug}`}>
                <Button variant="contained" color="primary">
                  View All {parentCategory.title}
                </Button>
              </Link>
            ) : null}

            <Link href="/grocery-1">
              <Button variant="outlined" color="primary">
                Back to Grocery
              </Button>
            </Link>
          </FlexRowCenter>
        </Box>
      )}
    </div>
  );
}
