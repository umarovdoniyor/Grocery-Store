"use client";

import { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import {
  getJwtToken,
  logIn as authLogIn,
  logOut as authLogOut,
  signUp as authSignUp,
  updateUserInfo
} from "../../libs/auth";
import { initializeApollo } from "../../apollo/client";
import { GET_MEMBER_PROFILE, ME, GET_MY_VENDOR_APPLICATION } from "../../apollo/user/query";
import { UPDATE_MEMBER, CHANGE_MEMBER_PASSWORD, APPLY_VENDOR } from "../../apollo/user/mutation";
import { userVar } from "../../apollo/store";
import { toPublicImageUrl } from "../../libs/upload";
import User, { UserRole } from "models/User.model";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  updateMemberProfile: (data: UpdateProfileData) => Promise<{
    success: boolean;
    error?: string;
    avatar?: string;
  }>;
  changePassword: (data: ChangePasswordData) => Promise<{ success: boolean; error?: string }>;
  applyVendor: (
    data: ApplyVendorData
  ) => Promise<{ success: boolean; applicationId?: string; error?: string }>;
  getMyVendorApplication: () => Promise<{
    success: boolean;
    application?: VendorApplication | null;
    error?: string;
  }>;
  refreshUser: () => Promise<{ success: boolean; error?: string; avatar?: string }>;
  getMemberProfile: (
    memberId: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  // Vendor-specific fields
  storeName?: string;
  storeDescription?: string;
  businessLicense?: string;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ApplyVendorData {
  storeName: string;
  description: string;
  businessLicenseUrl: string;
}

interface VendorApplication {
  _id: string;
  memberId: string;
  storeName: string;
  description: string;
  businessLicenseUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapMemberTypeToRole = (memberType?: string): UserRole => {
  if (memberType === "ADMIN") return "admin";
  if (memberType === "VENDOR") return "vendor";
  return "customer";
};

const getApiBaseUrl = () => {
  const explicitBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  if (explicitBase) return explicitBase;

  const graphQlUrl =
    process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
    process.env.REACT_APP_API_GRAPHQL_URL ||
    "http://localhost:3007/graphql";

  try {
    const parsed = new URL(graphQlUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return graphQlUrl.replace(/\/graphql\/?$/, "");
  }
};

const normalizeMemberAvatarPath = (value: string) => {
  const normalized = value.replace(/\\/g, "/").trim();
  if (!normalized) return "";

  // Backend can return only filename for member avatar in some environments.
  if (!normalized.includes("/")) {
    return `/uploads/member/${normalized}`;
  }

  return normalized;
};

const resolveMemberAvatarUrl = (value?: string) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:")) {
    return value;
  }

  const apiBaseUrl = getApiBaseUrl();
  const normalizedPath = normalizeMemberAvatarPath(value);
  if (!apiBaseUrl) return value.startsWith("/") ? value : `/${value}`;

  return toPublicImageUrl(normalizedPath, apiBaseUrl);
};

const mapMemberToUser = (member: any): User => ({
  id: member?._id || "",
  email: member?.memberEmail || "",
  phone: member?.memberPhone || "",
  avatar: resolveMemberAvatarUrl(member?.memberAvatar),
  address: member?.memberAddress || "",
  password: "",
  dateOfBirth: member?.memberBirthDate || member?.birthDate || member?.createdAt || "",
  verified: Boolean(member?.isEmailVerified || member?.isPhoneVerified),
  role: mapMemberTypeToRole(member?.memberType),
  name: {
    firstName: member?.memberFirstName || member?.memberNickname || "",
    lastName: member?.memberLastName || ""
  },
  vendorProfile: member?.vendorProfile
    ? {
        storeName: member.vendorProfile.storeName || "",
        storeDescription: member.vendorProfile.storeDescription || "",
        businessLicense: member.vendorProfile.businessLicense || "",
        taxId: member.vendorProfile.taxId || ""
      }
    : undefined
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const restoreFromToken = async () => {
    const token = getJwtToken();

    if (!token) {
      return { success: false, error: "No token" };
    }

    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.query({
      query: ME,
      fetchPolicy: "network-only"
    });

    const member = data?.me;

    if (!member) {
      return { success: false, error: "Failed to restore user" };
    }

    updateUserInfo(token, member);
    const userData = mapMemberToUser(member);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    return { success: true };
  };

  // Restore auth state on app load using JWT + me query
  useEffect(() => {
    let isMounted = true;

    const restoreAuthState = async () => {
      try {
        await restoreFromToken();
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
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
          isEmailVerified: false,
          isPhoneVerified: false
        });

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }

      return;
    };

    restoreAuthState();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await authLogIn(email, password);
      const memberData = userVar();
      const userData = mapMemberToUser(memberData);

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    } catch (error: any) {
      const message = error?.message || "Login failed";
      return { success: false, error: message };
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const { name, email, password, role = "customer" } = registerData;

      if (role === "vendor") {
        return { success: false, error: "Vendor registration is not enabled yet." };
      }

      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0] || name;
      const lastName = nameParts.slice(1).join(" ") || "User";
      const nickname = firstName;

      await authSignUp(email, password, nickname, firstName, lastName);

      const memberData = userVar();
      const userData = mapMemberToUser(memberData);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    } catch (error: any) {
      const message = error?.message || "Registration failed";
      return { success: false, error: message };
    }
  };

  const refreshUser = async () => {
    try {
      const result = await restoreFromToken();
      return { success: true, avatar: result?.success ? userVar()?.memberAvatar : undefined };
    } catch (error: any) {
      const message = error?.message || "Failed to refresh user";
      return { success: false, error: message };
    }
  };

  const getMemberProfile = async (memberId: string) => {
    try {
      const apolloClient = await initializeApollo();
      const { data } = await apolloClient.query({
        query: GET_MEMBER_PROFILE,
        variables: { memberId },
        fetchPolicy: "network-only"
      });

      const member = data?.getMemberProfile;

      if (!member) {
        return { success: false, error: "Profile not found" };
      }

      return { success: true, user: mapMemberToUser(member) };
    } catch (error: any) {
      const message = error?.message || "Failed to load profile";
      return { success: false, error: message };
    }
  };

  const updateMemberProfile = async (profileData: UpdateProfileData) => {
    try {
      // Check if user is authenticated
      const token = getJwtToken();
      if (!token || !user) {
        return { success: false, error: "You must be logged in to update your profile" };
      }

      const apolloClient = await initializeApollo();
      const input: any = {};

      if (profileData.firstName) input.memberFirstName = profileData.firstName;
      if (profileData.lastName) input.memberLastName = profileData.lastName;
      if (profileData.phone) input.memberPhone = profileData.phone;
      if (profileData.address) input.memberAddress = profileData.address;
      if (profileData.avatar) input.memberAvatar = profileData.avatar;

      const { data } = await apolloClient.mutate({
        mutation: UPDATE_MEMBER,
        variables: { input }
      });

      const updatedMember = data?.updateMember;

      if (!updatedMember) {
        return { success: false, error: "Failed to update profile" };
      }

      // Update global state
      updateUserInfo(token, updatedMember);
      const userData = mapMemberToUser(updatedMember);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true, avatar: resolveMemberAvatarUrl(updatedMember.memberAvatar) };
    } catch (error: any) {
      const message = error?.message || "Failed to update profile";
      return { success: false, error: message };
    }
  };

  const changePassword = async (passwordData: ChangePasswordData) => {
    try {
      // Check if user is authenticated
      const token = getJwtToken();
      if (!token || !user) {
        return { success: false, error: "You must be logged in to change your password" };
      }

      const apolloClient = await initializeApollo();

      const { data } = await apolloClient.mutate({
        mutation: CHANGE_MEMBER_PASSWORD,
        variables: {
          input: {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          }
        }
      });

      const updatedMember = data?.changeMemberPassword;

      if (!updatedMember) {
        return { success: false, error: "Failed to change password" };
      }

      // Update global state
      updateUserInfo(token, updatedMember);
      const userData = mapMemberToUser(updatedMember);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error: any) {
      const message = error?.message || "Failed to change password";
      return { success: false, error: message };
    }
  };

  const applyVendor = async (vendorData: ApplyVendorData) => {
    try {
      // Check if user is authenticated
      const token = getJwtToken();
      if (!token || !user) {
        return { success: false, error: "You must be logged in to apply as a vendor" };
      }

      // Check if user is already a vendor
      if (user.role === "vendor") {
        return { success: false, error: "You are already a vendor" };
      }

      const apolloClient = await initializeApollo();

      const { data } = await apolloClient.mutate({
        mutation: APPLY_VENDOR,
        variables: {
          input: {
            storeName: vendorData.storeName,
            description: vendorData.description,
            businessLicenseUrl: vendorData.businessLicenseUrl
          }
        }
      });

      const application = data?.applyVendor;

      if (!application) {
        return { success: false, error: "Failed to apply for vendor" };
      }

      return { success: true, applicationId: application._id };
    } catch (error: any) {
      const message = error?.message || "Failed to apply for vendor";
      return { success: false, error: message };
    }
  };

  const getMyVendorApplication = async () => {
    try {
      // Check if user is authenticated
      const token = getJwtToken();
      if (!token || !user) {
        return { success: false, error: "You must be logged in to view vendor application" };
      }

      const apolloClient = await initializeApollo();

      const { data } = await apolloClient.query({
        query: GET_MY_VENDOR_APPLICATION,
        fetchPolicy: "network-only"
      });

      const application = data?.getMyVendorApplication;

      return { success: true, application };
    } catch (error: any) {
      const message = error?.message || "Failed to fetch vendor application";
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    authLogOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        updateMemberProfile,
        changePassword,
        applyVendor,
        getMyVendorApplication,
        refreshUser,
        getMemberProfile,
        logout,
        isAuthenticated: !!user,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
