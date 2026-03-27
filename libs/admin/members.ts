import { initializeApollo } from "../../apollo/client";
import { UPDATE_MEMBER_STATUS_BY_ADMIN } from "../../apollo/admin/mutation-member-status";
import { GET_MEMBERS_BY_ADMIN } from "../../apollo/admin/query-members";

export interface MembersInquiryByAdminInput {
  page: number;
  limit: number;
  memberType?: string;
  memberStatus?: string;
  type?: string;
  status?: string;
  search?: string;
}

export interface UpdateMemberStatusByAdminInput {
  memberId: string;
  status: string;
  reason?: string;
}

export interface MemberByAdmin {
  _id: string;
  ordersCount?: number;
  memberEmail: string;
  memberPhone?: string | null;
  memberNickname?: string | null;
  memberFirstName?: string | null;
  memberLastName?: string | null;
  memberAvatar?: string | null;
  memberType: string;
  memberStatus: string;
  vendorProfile?: {
    storeName?: string | null;
    coverImageUrl?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export async function getMembersByAdmin(input: MembersInquiryByAdminInput): Promise<{
  success: boolean;
  list?: MemberByAdmin[];
  total?: number;
  error?: string;
}> {
  const run = async (variablesInput: Record<string, any>) => {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_MEMBERS_BY_ADMIN,
      variables: { input: variablesInput },
      fetchPolicy: "cache-first"
    });

    const list = data?.getMembersByAdmin?.list || [];
    const total = data?.getMembersByAdmin?.metaCounter?.total || 0;

    return { list, total };
  };

  try {
    const primaryInput = {
      page: input.page,
      limit: input.limit,
      search: input.search,
      status: input.status || input.memberStatus,
      type: input.type || input.memberType,
      memberStatus: input.memberStatus,
      memberType: input.memberType
    };

    const { list, total } = await run(primaryInput);

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch members by admin";

    const canRetryWithLegacyInput =
      /Field\s+"status"\s+is not defined|Field\s+"type"\s+is not defined/i.test(message);

    if (canRetryWithLegacyInput) {
      try {
        const legacyInput = {
          page: input.page,
          limit: input.limit,
          search: input.search,
          memberStatus: input.memberStatus || input.status,
          memberType: input.memberType || input.type
        };

        const { list, total } = await run(legacyInput);
        return { success: true, list, total };
      } catch (retryError: any) {
        const retryMessage = retryError?.message || "Failed to fetch members by admin";
        return { success: false, error: retryMessage };
      }
    }

    return { success: false, error: message };
  }
}

export async function updateMemberStatusByAdmin(input: UpdateMemberStatusByAdminInput): Promise<{
  success: boolean;
  member?: MemberByAdmin;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_MEMBER_STATUS_BY_ADMIN,
      variables: { input }
    });

    const member = data?.updateMemberStatusByAdmin;

    if (!member) {
      return { success: false, error: "Failed to update member status by admin" };
    }

    return { success: true, member };
  } catch (error: any) {
    const message = error?.message || "Failed to update member status by admin";
    return { success: false, error: message };
  }
}
