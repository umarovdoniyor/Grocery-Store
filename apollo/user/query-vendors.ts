import { gql } from "@apollo/client";

export const GET_VENDORS = gql`
  query GetVendors($input: VendorsInquiry!) {
    getVendors(input: $input) {
      list {
        _id
        slug
        storeName
        memberPhone
        memberAddress
        memberImage
        coverImage
        verified
        status
        productsCount
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;