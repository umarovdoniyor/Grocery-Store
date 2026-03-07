"use client";

import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
// STYLED COMPONENTS
import { PreviewImage, ProductImageWrapper } from "./styles";

const PLACEHOLDER_IMAGE = "/assets/images/products/placeholder.png";

const normalizeImage = (value?: string) => {
  const image = (value || "").trim();
  if (!image || image.includes("example.com")) return PLACEHOLDER_IMAGE;
  return image;
};

export default function ProductGallery({ images }: { images: string[] }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [mainImageSrc, setMainImageSrc] = useState(PLACEHOLDER_IMAGE);
  const safeImages = (images || []).map((image) => normalizeImage(image)).filter(Boolean);
  const galleryImages = safeImages.length > 0 ? safeImages : [PLACEHOLDER_IMAGE];

  const currentImageSrc = galleryImages[currentImage] || PLACEHOLDER_IMAGE;

  useEffect(() => {
    setMainImageSrc(currentImageSrc);
  }, [currentImageSrc]);

  return (
    <Fragment>
      <ProductImageWrapper>
        <Image
          fill
          alt="product"
          src={mainImageSrc}
          sizes="(400px 400px)"
          onError={() => setMainImageSrc(PLACEHOLDER_IMAGE)}
        />
      </ProductImageWrapper>

      <div className="preview-images">
        {galleryImages.map((url, ind) => (
          <PreviewImage
            key={ind}
            onClick={() => setCurrentImage(ind)}
            selected={currentImage === ind}
          >
            <Image fill alt="product" src={url} sizes="(48px 48px)" />
          </PreviewImage>
        ))}
      </div>
    </Fragment>
  );
}
