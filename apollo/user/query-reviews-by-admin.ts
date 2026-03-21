import { gql } from "@apollo/client";

export const GET_REVIEWS_BY_ADMIN = gql`
  query GetReviewsByAdmin($input: ReviewsByAdminInquiry!) {
    getReviewsByAdmin(input: $input) {
      list {
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
      metaCounter {
        total
      }
      summary {
        ratingAvg
        reviewsCount
        rating1Count
        rating2Count
        rating3Count
        rating4Count
        rating5Count
      }
    }
  }
`;
