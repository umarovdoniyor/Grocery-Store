import { gql } from "@apollo/client";

export const GET_VENDOR_APPLICATIONS_BY_ADMIN = gql`
  query GetVendorApplicationsByAdmin($input: VendorApplicationsInquiryInput!) {
    getVendorApplicationsByAdmin(input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;