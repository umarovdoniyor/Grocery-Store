import { getMembersByAdmin, MemberByAdmin, updateMemberStatusByAdmin } from "../../../libs/admin";

export interface AdminCustomerRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  balance: number;
  orders: number;
  memberStatus: string;
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
    avatar: member.memberAvatar || "/assets/images/faces/propic(1).png",
    balance: 0,
    orders: 0,
    memberStatus: member.memberStatus
  };
}

export async function fetchAdminCustomersForUi(): Promise<{
  customers: AdminCustomerRow[];
  error?: string;
}> {
  const response = await getMembersByAdmin({ page: 1, limit: 50 });

  if (!response.success) {
    return { customers: [], error: response.error || "Failed to fetch admin members" };
  }

  return {
    customers: (response.list || []).map(mapMemberToCustomerRow)
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
