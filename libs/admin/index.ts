import { initializeApollo } from "../../apollo/client";
import { REVIEW_VENDOR_APPLICATION } from "../../apollo/user/mutation";
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  REMOVE_CATEGORY,
  UPDATE_PRODUCT_STATUS_BY_ADMIN,
  REMOVE_PRODUCT_BY_ADMIN,
  UPDATE_ORDER_STATUS_BY_ADMIN,
  CANCEL_ORDER_BY_ADMIN,
  UPDATE_MEMBER_STATUS_BY_ADMIN
} from "../../apollo/admin/mutation";
import {
  GET_CATEGORIES_BY_ADMIN,
  GET_PRODUCTS_BY_ADMIN,
  GET_PRODUCT_BY_ID_BY_ADMIN,
  GET_VENDOR_APPLICATIONS_BY_ADMIN,
  GET_ORDERS_BY_ADMIN,
  GET_ORDER_BY_ID_BY_ADMIN,
  GET_MEMBERS_BY_ADMIN
} from "../../apollo/admin/query";

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortOrder?: number;
  parentId?: string | null;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  status: "ACTIVE" | "INACTIVE";
  sortOrder: number;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCategoryInput {
  categoryId: string;
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortOrder?: number;
  parentId?: string | null;
}

export interface CategoryInquiryInput {
  page: number;
  limit: number;
  status?: "ACTIVE" | "INACTIVE";
  search?: string;
  parentId?: string | null;
}

export interface AdminProductsInquiryInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface MembersInquiryByAdminInput {
  page: number;
  limit: number;
  memberType?: string;
  memberStatus?: string;
  search?: string;
}

export interface UpdateMemberStatusByAdminInput {
  memberId: string;
  status: string;
  reason?: string;
}

export interface RemoveCategoryInput {
  categoryId: string;
}

export interface UpdateProductStatusByAdminInput {
  productId: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface RemoveProductByAdminInput {
  productId: string;
}

export interface VendorApplicationsInquiryInput {
  page: number;
  limit: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  search?: string;
}

export interface AdminOrdersInquiryInput {
  page: number;
  limit: number;
  status?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  memberId?: string;
  orderNo?: string;
}

export interface UpdateOrderStatusByAdminInput {
  orderId: string;
  status: string;
  note?: string;
}

export interface CancelOrderByAdminInput {
  orderId: string;
  reason: string;
  currentStatus?: string;
}

export const CANCELLABLE_ORDER_STATUSES = ["PENDING_PAYMENT", "PAID", "CONFIRMED"] as const;

export function isOrderCancellableByAdmin(status: string): boolean {
  return (CANCELLABLE_ORDER_STATUSES as readonly string[]).includes(status);
}

export interface ProductByAdmin {
  _id: string;
  memberId: string;
  title: string;
  description: string;
  categoryIds: string[];
  brand?: string;
  sku?: string;
  unit: string;
  price: number;
  salePrice?: number;
  stockQty: number;
  minOrderQty: number;
  tags: string[];
  images: string[];
  thumbnail: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  views: number;
  likes: number;
  ordersCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ReviewVendorApplicationInput =
  | {
      applicationId: string;
      status: "APPROVED";
      rejectionReason?: never;
    }
  | {
      applicationId: string;
      status: "REJECTED";
      rejectionReason: string;
    };

export interface VendorApplicationByAdmin {
  _id: string;
  memberId: string;
  storeName: string;
  description?: string;
  businessLicenseUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemByAdmin {
  _id: string;
  orderId: string;
  productId: string;
  vendorId: string;
  quantity: number;
  unitPrice: number;
  salePrice?: number | null;
  appliedPrice: number;
  lineTotal: number;
  productSnapshotTitle: string;
  productSnapshotThumbnail?: string | null;
  productSnapshotUnit?: string | null;
  productSnapshotSku?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderByAdmin {
  _id: string;
  orderNo: string;
  memberId: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  addressFullName: string;
  addressPhone: string;
  addressLine1: string;
  addressLine2?: string | null;
  addressCity: string;
  addressState?: string | null;
  addressPostalCode: string;
  addressCountry: string;
  note?: string | null;
  placedAt?: string | null;
  canceledAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemByAdmin[];
}

export interface MemberByAdmin {
  _id: string;
  memberEmail: string;
  memberPhone?: string | null;
  memberNickname?: string | null;
  memberFirstName?: string | null;
  memberLastName?: string | null;
  memberAvatar?: string | null;
  memberType: string;
  memberStatus: string;
  createdAt: string;
  updatedAt: string;
}

export async function reviewVendorApplication(input: ReviewVendorApplicationInput): Promise<{
  success: boolean;
  application?: VendorApplicationByAdmin;
  error?: string;
}> {
  try {
    if (input.status === "REJECTED" && !input.rejectionReason.trim()) {
      return {
        success: false,
        error: "Rejection reason is required when rejecting an application"
      };
    }

    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: REVIEW_VENDOR_APPLICATION,
      variables: { input }
    });

    const application = data?.reviewVendorApplication;

    if (!application) {
      return { success: false, error: "Failed to review vendor application" };
    }

    return { success: true, application };
  } catch (error: any) {
    const message = error?.message || "Failed to review vendor application";
    return { success: false, error: message };
  }
}

export async function getVendorApplicationsByAdmin(input: VendorApplicationsInquiryInput): Promise<{
  success: boolean;
  list?: VendorApplicationByAdmin[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_VENDOR_APPLICATIONS_BY_ADMIN,
      variables: { input },
      fetchPolicy: "network-only"
    });

    const list = data?.getVendorApplicationsByAdmin?.list || [];
    const total = data?.getVendorApplicationsByAdmin?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch vendor applications by admin";
    return { success: false, error: message };
  }
}

export async function getMembersByAdmin(input: MembersInquiryByAdminInput): Promise<{
  success: boolean;
  list?: MemberByAdmin[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_MEMBERS_BY_ADMIN,
      variables: { input },
      fetchPolicy: "network-only"
    });

    const list = data?.getMembersByAdmin?.list || [];
    const total = data?.getMembersByAdmin?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch members by admin";
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

export async function getOrdersByAdmin(input: AdminOrdersInquiryInput): Promise<{
  success: boolean;
  list?: OrderByAdmin[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_ORDERS_BY_ADMIN,
      variables: { input },
      fetchPolicy: "network-only"
    });

    const list = data?.getOrdersByAdmin?.list || [];
    const total = data?.getOrdersByAdmin?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch orders by admin";
    return { success: false, error: message };
  }
}

export async function getOrderByIdByAdmin(orderId: string): Promise<{
  success: boolean;
  order?: OrderByAdmin | null;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_ORDER_BY_ID_BY_ADMIN,
      variables: { orderId },
      fetchPolicy: "network-only"
    });

    const order = data?.getOrderByIdByAdmin || null;

    return { success: true, order };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch order by admin";
    return { success: false, error: message };
  }
}

export async function updateOrderStatusByAdmin(input: UpdateOrderStatusByAdminInput): Promise<{
  success: boolean;
  order?: OrderByAdmin;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_ORDER_STATUS_BY_ADMIN,
      variables: { input }
    });

    const order = data?.updateOrderStatusByAdmin;

    if (!order) {
      return { success: false, error: "Failed to update order status by admin" };
    }

    return { success: true, order };
  } catch (error: any) {
    const message = error?.message || "Failed to update order status by admin";
    return { success: false, error: message };
  }
}

export async function cancelOrderByAdmin(input: CancelOrderByAdminInput): Promise<{
  success: boolean;
  order?: OrderByAdmin;
  error?: string;
}> {
  try {
    if (!input.reason.trim()) {
      return { success: false, error: "Cancel reason is required" };
    }

    if (input.currentStatus && !isOrderCancellableByAdmin(input.currentStatus)) {
      return { success: false, error: "Order cannot be canceled at current status" };
    }

    const apolloClient = await initializeApollo();
    const payload: { orderId: string; reason: string } = {
      orderId: input.orderId,
      reason: input.reason
    };

    const { data } = await apolloClient.mutate({
      mutation: CANCEL_ORDER_BY_ADMIN,
      variables: { input: payload }
    });

    const order = data?.cancelOrderByAdmin;

    if (!order) {
      return { success: false, error: "Failed to cancel order by admin" };
    }

    return { success: true, order };
  } catch (error: any) {
    const message = error?.message || "Failed to cancel order by admin";
    return { success: false, error: message };
  }
}

export async function createCategory(input: CreateCategoryInput): Promise<{
  success: boolean;
  category?: Category;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: CREATE_CATEGORY,
      variables: { input }
    });

    const category = data?.createCategory;

    if (!category) {
      return { success: false, error: "Failed to create category" };
    }

    return { success: true, category };
  } catch (error: any) {
    const message = error?.message || "Failed to create category";
    return { success: false, error: message };
  }
}

export async function updateCategory(input: UpdateCategoryInput): Promise<{
  success: boolean;
  category?: Category;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_CATEGORY,
      variables: { input }
    });

    const category = data?.updateCategory;

    if (!category) {
      return { success: false, error: "Failed to update category" };
    }

    return { success: true, category };
  } catch (error: any) {
    const message = error?.message || "Failed to update category";
    return { success: false, error: message };
  }
}

export async function getCategoriesByAdmin(input: CategoryInquiryInput): Promise<{
  success: boolean;
  list?: Category[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_CATEGORIES_BY_ADMIN,
      variables: { input },
      fetchPolicy: "network-only"
    });

    const list = data?.getCategoriesByAdmin?.list || [];
    const total = data?.getCategoriesByAdmin?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch categories by admin";
    return { success: false, error: message };
  }
}

export async function removeCategory(input: RemoveCategoryInput): Promise<{
  success: boolean;
  category?: Category;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: REMOVE_CATEGORY,
      variables: { input }
    });

    const category = data?.removeCategory;

    if (!category) {
      return { success: false, error: "Failed to remove category" };
    }

    return { success: true, category };
  } catch (error: any) {
    const message = error?.message || "Failed to remove category";
    return { success: false, error: message };
  }
}

export async function getProductsByAdmin(input?: AdminProductsInquiryInput): Promise<{
  success: boolean;
  list?: ProductByAdmin[];
  total?: number;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_PRODUCTS_BY_ADMIN,
      variables: { input },
      fetchPolicy: "network-only"
    });

    const list = data?.getProductsByAdmin?.list || [];
    const total = data?.getProductsByAdmin?.metaCounter?.total || 0;

    return { success: true, list, total };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch products by admin";
    return { success: false, error: message };
  }
}

export async function getProductByIdByAdmin(productId: string): Promise<{
  success: boolean;
  product?: ProductByAdmin | null;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.query({
      query: GET_PRODUCT_BY_ID_BY_ADMIN,
      variables: { productId },
      fetchPolicy: "network-only"
    });

    const product = data?.getProductByIdByAdmin || null;

    return { success: true, product };
  } catch (error: any) {
    const message = error?.message || "Failed to fetch product by admin";
    return { success: false, error: message };
  }
}

export async function updateProductStatusByAdmin(input: UpdateProductStatusByAdminInput): Promise<{
  success: boolean;
  product?: ProductByAdmin;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_PRODUCT_STATUS_BY_ADMIN,
      variables: { input }
    });

    const product = data?.updateProductStatusByAdmin;

    if (!product) {
      return { success: false, error: "Failed to update product status by admin" };
    }

    return { success: true, product };
  } catch (error: any) {
    const message = error?.message || "Failed to update product status by admin";
    return { success: false, error: message };
  }
}

export async function removeProductByAdmin(input: RemoveProductByAdminInput): Promise<{
  success: boolean;
  product?: ProductByAdmin;
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: REMOVE_PRODUCT_BY_ADMIN,
      variables: { input }
    });

    const product = data?.removeProductByAdmin;

    if (!product) {
      return { success: false, error: "Failed to remove product by admin" };
    }

    return { success: true, product };
  } catch (error: any) {
    const message = error?.message || "Failed to remove product by admin";
    return { success: false, error: message };
  }
}
