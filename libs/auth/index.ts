/** This file handles all authentication logic - login, signup, logout, and token management. */
import { jwtDecode } from "jwt-decode";
import { initializeApollo } from "../../apollo/client";
import { userVar } from "../../apollo/store";
import { CustomJwtPayload } from "../types/customJwtPayload";
import { sweetMixinErrorAlert } from "../sweetAlert";
import { LOGIN, SIGN_UP } from "../../apollo/user/mutation";

const getAuthErrorMessage = (error: any, fallback: string) => {
  const graphQLError = error?.graphQLErrors?.[0];
  const networkError = error?.networkError;
  const code =
    graphQLError?.extensions?.code || networkError?.result?.errors?.[0]?.extensions?.code || "";
  const message =
    graphQLError?.message ||
    networkError?.result?.errors?.[0]?.message ||
    error?.message ||
    fallback;

  if (/SUSPENDED_USER/i.test(code) || /suspended/i.test(message)) {
    return "Your account is suspended.";
  }

  if (/BLOCKED_USER/i.test(code) || /blocked/i.test(message)) {
    return "Your account is blocked.";
  }

  if (
    /WRONG_PASSWORD/i.test(code) ||
    /wrong password|invalid credentials|unauthorized/i.test(message)
  ) {
    return "Invalid credentials. Please check your identifier and password.";
  }

  if (/password/i.test(message))
    return "Invalid credentials. Please check your identifier and password.";

  if (/already exists|duplicate|taken/i.test(message))
    return "An account with this email already exists.";

  return message;
};

/** =============== getJwtToken ===============*/
/** Purpose: Retrieve JWT token from browser's localStorage */
export function getJwtToken(): any {
  if (typeof window !== "undefined") {
    //Check if code is running in browser (not server-side)
    return localStorage.getItem("accessToken") ?? "";
  }
}

/** =============== setJwtToken ===============*/
/** Purpose: Store JWT token in browser's localStorage */
export function setJwtToken(token: string) {
  localStorage.setItem("accessToken", token);

  document.cookie = [
    `accessToken=${encodeURIComponent(token)}`,
    "Path=/",
    "SameSite=Lax",
    "Max-Age=2592000"
  ].join("; ");
}

/** =============== logIn ===============*/
/** Purpose: Authenticate user and store JWT token */
export const logIn = async (identifier: string, password: string): Promise<void> => {
  try {
    // 1. Request JWT token from server
    const { jwtToken, member } = await requestJwtToken({ identifier, password });

    // 2. If token received, store it and update user info
    if (jwtToken) {
      updateStorage({ jwtToken });
      updateUserInfo(jwtToken, member);
    }
  } catch (err) {
    // 3. Handle errors during login process
    console.warn("login err", err);
    logOut(); // Clear any existing user data on error
    throw err instanceof Error ? err : new Error("Login failed");
  }
};

/** =============== requestJwtToken ===============*/
/** Purpose: Request JWT token from server during login */
const requestJwtToken = async ({
  identifier,
  password
}: {
  identifier: string;
  password: string;
}): Promise<{ jwtToken: string; member: any }> => {
  // 1. Get Apollo Client instance
  const apolloClient = await initializeApollo();

  try {
    // 2. Execute login mutation
    const result = await apolloClient.mutate({
      mutation: LOGIN,
      variables: { input: { identifier, memberPassword: password } },
      fetchPolicy: "network-only" // Don't use cache, always fetch fresh
    });

    console.log("---------- login ----------");
    // 3. Extract accessToken and member from response
    const { accessToken, member } = result?.data?.logIn;

    return { jwtToken: accessToken, member };
  } catch (err: any) {
    // 4. Handle errors from server
    console.log("request token err", err.graphQLErrors);
    const message = getAuthErrorMessage(err, "Login failed");
    await sweetMixinErrorAlert(message);
    throw new Error(message);
  }
};

/** =============== signUp ===============*/
/** Purpose: Register new user and store JWT token */
export const signUp = async (
  email: string,
  password: string,
  nickname: string,
  firstName: string,
  lastName: string,
  phone?: string,
  address?: string
): Promise<void> => {
  try {
    // 1. Request JWT token from server after signup
    const { jwtToken, member } = await requestSignUpJwtToken({
      email,
      password,
      nickname,
      firstName,
      lastName,
      phone,
      address
    });

    // 2. If token received, store it and update user info
    if (jwtToken) {
      updateStorage({ jwtToken });
      updateUserInfo(jwtToken, member);
    }
  } catch (err) {
    // 3. Handle errors during signup process
    console.warn("signup err", err);
    logOut(); // Clear any existing user data on error
    throw err instanceof Error ? err : new Error("Registration failed");
  }
};

/** =============== requestSignUpJwtToken ===============*/
/** Purpose: Request JWT token from server during signup */
const requestSignUpJwtToken = async ({
  email,
  password,
  nickname,
  firstName,
  lastName,
  phone,
  address
}: {
  email: string;
  password: string;
  nickname: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}): Promise<{ jwtToken: string; member: any }> => {
  // 1. Get Apollo Client instance
  const apolloClient = await initializeApollo();

  try {
    // 2. Execute signup mutation
    const result = await apolloClient.mutate({
      mutation: SIGN_UP,
      variables: {
        input: {
          memberEmail: email,
          memberPassword: password,
          memberNickname: nickname,
          memberFirstName: firstName,
          memberLastName: lastName,
          memberPhone: phone,
          memberAddress: address
        }
      },
      fetchPolicy: "network-only" // Don't use cache, always fetch fresh
    });

    console.log("---------- signup ----------");
    // 3. Extract accessToken and member from response
    const { accessToken, member } = result?.data?.signUp;

    return { jwtToken: accessToken, member };
  } catch (err: any) {
    console.log("request token err", err.graphQLErrors);
    const message = getAuthErrorMessage(err, "Registration failed");
    await sweetMixinErrorAlert(message);
    throw new Error(message);
  }
};

/** =============== updateStorage ===============*/
/** Purpose: Update localStorage with new JWT token and login timestamp */
export const updateStorage = ({ jwtToken }: { jwtToken: any }) => {
  // 1. Store JWT token in localStorage under 'accessToken' key
  setJwtToken(jwtToken);
  // 2. Update login timestamp to notify other tabs/windows
  window.localStorage.setItem("login", Date.now().toString());

  /** LocalStorage after login: {
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "login": "1675434567890"
} */
};

/** =============== updateUserInfo ===============*/
/** Purpose: Decode JWT token and update user information in Apollo Client state */
export const updateUserInfo = (jwtToken: any, member?: any) => {
  if (!jwtToken) return false;

  const claims = jwtDecode<CustomJwtPayload>(jwtToken);

  userVar({
    _id: member?._id || claims.sub || claims._id || "",
    memberEmail: member?.memberEmail || claims.memberEmail || "",
    memberType: member?.memberType || claims.memberType || "",
    memberStatus: member?.memberStatus || claims.memberStatus || "",
    memberPhone: member?.memberPhone || claims.memberPhone || "",
    memberNickname: member?.memberNickname || claims.memberNickname || "",
    memberFirstName: member?.memberFirstName || claims.memberFirstName || "",
    memberLastName: member?.memberLastName || claims.memberLastName || "",
    memberAvatar: member?.memberAvatar || claims.memberAvatar || "",
    memberAddress: member?.memberAddress || claims.memberAddress || "",
    memberDob: member?.memberDob || claims.memberDob || "",
    isEmailVerified: member?.isEmailVerified || claims.isEmailVerified || false,
    isPhoneVerified: member?.isPhoneVerified || claims.isPhoneVerified || false
  });
};

/** =============== logOut ===============*/
/** Purpose: Log out user by clearing JWT token and user info */
export const logOut = () => {
  deleteStorage();
  deleteUserInfo();
};

/** =============== deleteStorage ===============*/
/** Purpose: Remove JWT token from localStorage and notify other tabs/windows */
const deleteStorage = () => {
  // 1. Remove JWT token from localStorage under 'accessToken' key
  localStorage.removeItem("accessToken");
  document.cookie = "accessToken=; Path=/; Max-Age=0; SameSite=Lax";
  // 2. Update logout timestamp to notify other tabs/windows
  window.localStorage.setItem("logout", Date.now().toString());
};

/** =============== deleteUserInfo ===============*/
/** Purpose: Clear user information from Apollo Client state */
const deleteUserInfo = () => {
  userVar({
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
    memberDob: "",
    isEmailVerified: false,
    isPhoneVerified: false
  });
};

/**
 * Effect:

Updates userVar with empty/zero values
All components using useReactiveVar(userVar) re-render
{user?._id && <Chat />} becomes false → Chat disappears
Header shows "Login" button again
Protected routes redirect to login page
This is the inverse of updateUserInfo()
 */
