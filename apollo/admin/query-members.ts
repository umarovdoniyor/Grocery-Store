import { gql } from "@apollo/client";

export const GET_MEMBERS_BY_ADMIN = gql`
  query GetMembersByAdmin($input: MembersInquiryByAdminInput!) {
    getMembersByAdmin(input: $input) {
      list {
        _id
        ordersCount
        memberEmail
        memberPhone
        memberNickname
        memberFirstName
        memberLastName
        memberAvatar
        memberType
        memberStatus
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;
