import Link from "next/link";
import Image from "next/image";
// MUI
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
// STYLED COMPONENTS
import { StyledCard } from "./styles";
import { getAvailableShops, getAvailableShopsByCategory } from "utils/services/shop-directory";

type Props = {
  categoryId?: string;
  categoryName?: string;
  excludedShopId?: string;
};

export default async function AvailableShops({ categoryId, categoryName, excludedShopId }: Props) {
  const shops = categoryId
    ? await getAvailableShopsByCategory(categoryId, excludedShopId)
    : await getAvailableShops();

  const heading = categoryName
    ? `Also available from shops selling ${categoryName}`
    : "Also available from shops selling similar category products";

  const hasShops = Boolean(shops && shops.length > 0);

  return (
    <div className="mb-4">
      <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 700, color: "#1f2a1a", fontSize: 16 }}>
        {heading}
      </Typography>

      {hasShops ? (
        <Grid container spacing={4}>
          {shops.map(({ imgUrl, name, url }) => (
            <Grid size={{ lg: 2, md: 3, sm: 4, xs: 12 }} key={name}>
              <Link href={url}>
                <StyledCard>
                  <Avatar className="shop-avatar" variant="rounded">
                    <Image alt={name} src={imgUrl} fill sizes="(48px 48px)" />
                  </Avatar>

                  <p className="shop-name">{name}</p>
                </StyledCard>
              </Link>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          We could not find other shops with this category right now. Please check again later.
        </Typography>
      )}
    </div>
  );
}
