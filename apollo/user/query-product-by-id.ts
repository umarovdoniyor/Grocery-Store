import { gql } from "@apollo/client";

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($productId: String!) {
    getProductById(productId: $productId) {
      _id
      memberId
      title
      slug
      description
      categoryIds
      brand
      sku
      unit
      price
      salePrice
      stockQty
      minOrderQty
      tags
      images
      thumbnail
      status
      views
      likes
      ordersCount
      meLiked
      meViewed
      createdAt
      updatedAt
      vendor {
        _id
        memberNickname
        memberFirstName
        memberLastName
        memberAvatar
        memberType
      }
    }
  }
`;
