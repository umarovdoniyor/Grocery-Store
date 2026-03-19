"use client";

import { Fragment } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
// GLOBAL CUSTOM COMPONENTS
import { Carousel, CarouselArrows, useCarousel } from "components/slider";

const carouselArrowStyles = {
  sx: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    color: "#fff",
    background: "linear-gradient(135deg, #6f8f44 0%, #4f6d2f 100%)",
    boxShadow: "0 4px 12px rgba(51, 80, 30, 0.35)",
    border: "none",
    opacity: 1,
    "&:hover": {
      background: "linear-gradient(135deg, #64813d 0%, #446127 100%)",
      boxShadow: "0 6px 16px rgba(51, 80, 30, 0.45)"
    },
    "&:disabled": {
      opacity: 0.3
    }
  }
};

interface Props {
  title: string;
  images: string[];
}

export default function ImageCarousel({ images, title }: Props) {
  const { ref, api, arrows } = useCarousel();

  return (
    <Fragment>
      <Carousel ref={ref} api={api}>
        {images!.map((item: string, index: number) => (
          <Box
            key={index}
            height={320}
            sx={{
              display: "flex",
              backgroundColor: "#f7f4ea",
              img: {
                objectFit: "contain",
                objectPosition: "center"
              }
            }}
          >
            <Image fill src={item} alt={title} sizes="100vw" />
          </Box>
        ))}
      </Carousel>

      <CarouselArrows
        onClickNext={arrows.onClickNext}
        onClickPrev={arrows.onClickPrev}
        disableNext={arrows.disableNext}
        disablePrev={arrows.disablePrev}
        slotProps={{
          prev: carouselArrowStyles,
          next: carouselArrowStyles
        }}
      />
    </Fragment>
  );
}
