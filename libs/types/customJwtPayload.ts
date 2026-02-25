/** JWT Token Payload Structure based on backend auth response */
export interface CustomJwtPayload {
  // JWT standard claims
  sub?: string; // member ID
  iat?: number; // issued at
  exp?: number; // expiration time

  // Member identity
  _id: string;
  memberEmail: string;
  memberType: string; // CUSTOMER, VENDOR, ADMIN
  memberStatus: string; // ACTIVE, BLOCKED, SUSPENDED

  // Optional fields (not in minimal token but in userVar state)
  memberPhone?: string;
  memberNickname?: string;
  memberFirstName?: string;
  memberLastName?: string;
  memberAvatar?: string;
  memberAddress?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
