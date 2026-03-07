"use client";

import Link from "next/link";
import { useState } from "react";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
// CUSTOM UTILS LIBRARY FUNCTIONS
import { currency } from "lib";
// STYLED COMPONENTS
import { ItemCard, Price } from "./styles";

const PLACEHOLDER_IMAGE = "/assets/images/products/placeholder.png";

const normalizeImage = (value?: string) => {
  const image = (value || "").trim();
  if (!image || image.includes("example.com")) return PLACEHOLDER_IMAGE;
  return image;
};

// =======================================================
interface Props {
  slug: string;
  price: number;
  discount?: number;
  title: string;
  imgUrl: string;
  id: string | number;
}
// =======================================================

export default function FrequentlyProductCard({
  slug,
  price,
  discount = 0,
  title,
  imgUrl = PLACEHOLDER_IMAGE
}: Props) {
  const comparePrice = discount > 0 ? price / (1 - Math.min(discount, 99) / 100) : null;
  const [imageSrc, setImageSrc] = useState(normalizeImage(imgUrl));

  return (
    <Link href={`/products/${slug}`}>
      <ItemCard>
        <HoverBox sx={{ mb: 1.5, borderRadius: 2 }}>
          <LazyImage
            alt={title}
            width={500}
            height={500}
            src={imageSrc}
            onError={() => setImageSrc(PLACEHOLDER_IMAGE)}
          />
        </HoverBox>

        <Typography noWrap variant="body1" sx={{ mb: 0.5 }}>
          {title}
        </Typography>

        <Price>
          <Typography variant="h6" color="primary">
            {currency(price)}
          </Typography>
          {comparePrice && <del>{currency(comparePrice)}</del>}
        </Price>
      </ItemCard>
    </Link>
  );
}
