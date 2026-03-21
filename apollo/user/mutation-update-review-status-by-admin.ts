import { gql } from "@apollo/client";

export const UPDATE_REVIEW_STATUS_BY_ADMIN = gql`
  mutation UpdateReviewStatusByAdmin($input: UpdateReviewStatusByAdminInput!) {
    updateReviewStatusByAdmin(input: $input) {
      _id
      productId
      memberId
      orderId
      rating
      comment
      images
      status
      moderationReason
      moderatedBy
      moderatedAt
      createdAt
      updatedAt
      member {
        _id
        memberNickname
        memberFirstName
        memberLastName
        memberAvatar
      }
    }
  }
`;
