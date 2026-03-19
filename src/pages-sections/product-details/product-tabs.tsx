"use client";

import { Fragment, ReactNode, SyntheticEvent, cloneElement, isValidElement, useState } from "react";
// MUI
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { styled } from "@mui/material/styles";

// STYLED COMPONENT
const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 0,
  marginTop: 64,
  marginBottom: 24,
  borderBottom: "1px solid rgba(90, 112, 64, 0.18)",
  "& .inner-tab": {
    minHeight: 44,
    fontWeight: 600,
    fontSize: "0.9rem",
    textTransform: "none",
    color: theme.palette.text.secondary,
    "&.Mui-selected": { color: "#3d6b2a" }
  },
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: "3px 3px 0 0",
    background: "linear-gradient(90deg, #7a974f, #567235)"
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
