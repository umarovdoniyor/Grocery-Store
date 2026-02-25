import { makeVar } from "@apollo/client";

import { CustomJwtPayload } from "../libs/types/customJwtPayload";
export const themeVar = makeVar({});

export const userVar = makeVar<CustomJwtPayload>({
  _id: "",
  memberEmail: "",
  memberType: "",
  memberStatus: "",
  memberPhone: "",
  memberNickname: "",
  memberFirstName: "",
  memberLastName: "",
  memberAvatar: "",
  memberAddress: "",
  isEmailVerified: false,
  isPhoneVerified: false
});
