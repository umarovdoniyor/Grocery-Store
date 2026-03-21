import { gql } from "@apollo/client";

export const UPDATE_MEMBER_STATUS_BY_ADMIN = gql`
  mutation UpdateMemberStatusByAdmin($input: UpdateMemberStatusByAdminInput!) {
    updateMemberStatusByAdmin(input: $input) {
      _id
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
  }
`;
