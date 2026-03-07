"use client";

import { Fragment, ReactNode, SyntheticEvent, cloneElement, isValidElement, useState } from "react";
// MUI
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { styled } from "@mui/material/styles";

// STYLED COMPONENT
const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 0,
  marginTop: 80,
  marginBottom: 24,
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .inner-tab": {
    minHeight: 40,
    fontWeight: 500,
    textTransform: "capitalize"
  }
}));

// ==============================================================
interface Props {
  reviews: ReactNode;
  description: ReactNode;
  reviewCount?: number;
}
// ==============================================================

export default function ProductTabs({ reviews, description, reviewCount = 0 }: Props) {
  const [selectedOption, setSelectedOption] = useState(0);
  const [currentReviewCount, setCurrentReviewCount] = useState(reviewCount);
  const handleChangeTab = (_: SyntheticEvent, value: number) => setSelectedOption(value);

  const reviewsContent = isValidElement(reviews)
    ? cloneElement(reviews as React.ReactElement<any>, {
        onReviewCountChange: setCurrentReviewCount
      })
    : reviews;

  return (
    <Fragment>
      <StyledTabs
        textColor="primary"
        value={selectedOption}
        indicatorColor="primary"
        onChange={handleChangeTab}
      >
        <Tab className="inner-tab" label="Description" />
        <Tab className="inner-tab" label={`Review (${currentReviewCount})`} />
      </StyledTabs>

      <div className="mb-3">
        <div style={{ display: selectedOption === 0 ? "block" : "none" }}>{description}</div>
        <div style={{ display: selectedOption === 1 ? "block" : "none" }}>{reviewsContent}</div>
      </div>
    </Fragment>
  );
}
