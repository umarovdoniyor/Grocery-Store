import {
  getMembersByAdmin,
  MemberByAdmin,
  updateMemberStatusByAdmin
} from "../../../libs/admin/members";
import { toPublicImageUrl } from "../../../libs/upload/url";

export interface AdminCustomerRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  balance: number;
  orders: number;
  memberType: string;
  memberStatus: string;
}

const DEFAULT_CUSTOMER_AVATAR = "/assets/images/faces/propic(1).png";

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

function resolveCustomerAvatar(value?: string | null): string {
  const normalized = value?.replace(/\\/g, "/").trim();
  if (!normalized) return DEFAULT_CUSTOMER_AVATAR;

  if (normalized.startsWith("/assets/")) return normalized;

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    try {
      const parsed = new URL(normalized);
      return parsed.host ? normalized : DEFAULT_CUSTOMER_AVATAR;
    } catch {
      return DEFAULT_CUSTOMER_AVATAR;
    }
  }

  try {
    return toPublicImageUrl(normalized, getApiBaseUrl());
  } catch {
    return DEFAULT_CUSTOMER_AVATAR;
  }
}

function toDisplayName(member: MemberByAdmin): string {
  const fullName = [member.memberFirstName, member.memberLastName].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;
  if (member.memberNickname) return member.memberNickname;
  return member.memberEmail;
}

export function mapMemberToCustomerRow(member: MemberByAdmin): AdminCustomerRow {
  return {
    id: member._id,
    name: toDisplayName(member),
    phone: member.memberPhone || "-",
    email: member.memberEmail,
    avatar: resolveCustomerAvatar(member.memberAvatar),
    balance: 0,
    orders: Number(member.ordersCount || 0),
    memberType: member.memberType,
    memberStatus: member.memberStatus
  };
}

export async function fetchAdminCustomersForUi(): Promise<{
  customers: AdminCustomerRow[];
  total: number;
  error?: string;
}> {
  const response = await getMembersByAdmin({ page: 1, limit: 50 });

  if (!response.success) {
    return { customers: [], total: 0, error: response.error || "Failed to fetch admin members" };
  }

  return {
    customers: (response.list || []).map(mapMemberToCustomerRow),
    total: Number(response.total || 0)
  };
}

export async function fetchAdminCustomersForUiByQuery(input?: {
  page?: number;
  limit?: number;
  search?: string;
  memberStatus?: string;
}): Promise<{
  customers: AdminCustomerRow[];
  total: number;
  error?: string;
}> {
  const response = await getMembersByAdmin({
    page: input?.page || 1,
    limit: input?.limit || 50,
    search: input?.search || undefined,
    memberStatus: input?.memberStatus || undefined
  });

  if (!response.success) {
    return { customers: [], total: 0, error: response.error || "Failed to fetch admin members" };
  }

  return {
    customers: (response.list || []).map(mapMemberToCustomerRow),
    total: Number(response.total || 0)
  };
}

export async function updateAdminMemberStatusForUi(input: {
  memberId: string;
  status: string;
  reason?: string;
}): Promise<{ success: boolean; status?: string; error?: string }> {
  const response = await updateMemberStatusByAdmin(input);

  if (!response.success || !response.member) {
    return {
      success: false,
      error: response.error || "Failed to update member status"
    };
  }

  return {
    success: true,
    status: response.member.memberStatus
  };
}
