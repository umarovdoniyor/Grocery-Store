import { gql } from "@apollo/client";

export const REVIEW_VENDOR_APPLICATION = gql`
  mutation ReviewVendorApplication($input: ReviewVendorApplicationInput!) {
    reviewVendorApplication(input: $input) {
      _id
      memberId
      storeName
      description
      businessLicenseUrl
      status
      rejectionReason
      createdAt
      updatedAt
    }
  }
`;