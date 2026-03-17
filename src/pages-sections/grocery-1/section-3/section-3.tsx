import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import ProductsCarousel from "./products-carousel";
import ProductCard4 from "components/product-cards/product-card-4";
// CUSTOM DATA MODEL
import Product from "models/Product.model";
// STYLED COMPONENT
import { SubTitle } from "../styles";
import { Section3Wrapper } from "./styles";

// =================================================================
type Props = { title: string; products: Product[] };
// =================================================================

export default function Section3({ products, title }: Props) {
  return (
    <Section3Wrapper>
      <div className="sectionHeader">
        <Typography variant="h2">{title}</Typography>
        <SubTitle>Fresh picks curated for your kitchen this week.</SubTitle>
      </div>

      <ProductsCarousel>
        {products.map((product) => (
          <Box pb={1} key={product.id}>
            <ProductCard4 product={product} />
          </Box>
        ))}
      </ProductsCarousel>
    </Section3Wrapper>
  );
}
