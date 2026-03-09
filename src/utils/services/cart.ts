import { initializeApollo } from "../../../apollo/client";
import {
  ADD_TO_CART,
  CLEAR_CART,
  REMOVE_CART_ITEM,
  UPDATE_CART_ITEM_QTY
} from "../../../apollo/user/mutation";
import { GET_MY_CART } from "../../../apollo/user/query";

export interface CartItemView {
  id: string;
  qty: number;
  title: string;
  slug: string;
  price: number;
  thumbnail: string;
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const DEFAULT_THUMBNAIL = "/assets/images/products/Fashion/Clothes/1.SilverHighNeckSweater.png";

const mapCartItems = (items: any[] = []): CartItemView[] =>
  items.map((item: any) => ({
    id: item.productId || item._id,
    qty: item.quantity || 1,
    title: item.productSnapshotTitle || "Product",
    slug: toSlug(item.productSnapshotTitle || item.productId || "product"),
    price: Number(item.appliedPrice ?? item.unitPrice ?? 0),
    thumbnail: item.productSnapshotThumbnail || DEFAULT_THUMBNAIL
  }));

export async function getMyCartItems(): Promise<{
  success: boolean;
  items?: CartItemView[];
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.query({
      query: GET_MY_CART,
      fetchPolicy: "network-only"
    });

    const items = mapCartItems(data?.getMyCart?.items || []);

    return { success: true, items };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch cart" };
  }
}

export async function addToCartServer(input: {
  productId: string;
  quantity: number;
}): Promise<{ success: boolean; items?: CartItemView[]; error?: string }> {
  try {
    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.mutate({
      mutation: ADD_TO_CART,
      variables: { input }
    });

    return { success: true, items: mapCartItems(data?.addToCart?.items || []) };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to add item to cart" };
  }
}

export async function updateCartItemQtyServer(input: {
  productId: string;
  quantity: number;
}): Promise<{ success: boolean; items?: CartItemView[]; error?: string }> {
  try {
    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_CART_ITEM_QTY,
      variables: { input }
    });

    return { success: true, items: mapCartItems(data?.updateCartItemQty?.items || []) };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update cart item quantity" };
  }
}

export async function removeCartItemServer(input: {
  productId: string;
}): Promise<{ success: boolean; items?: CartItemView[]; error?: string }> {
  try {
    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_CART_ITEM,
      variables: { input }
    });

    return { success: true, items: mapCartItems(data?.removeCartItem?.items || []) };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to remove item from cart" };
  }
}

export async function clearCartServer(): Promise<{
  success: boolean;
  items?: CartItemView[];
  error?: string;
}> {
  try {
    const apolloClient = await initializeApollo();
    const { data } = await apolloClient.mutate({ mutation: CLEAR_CART });

    return { success: true, items: mapCartItems(data?.clearCart?.items || []) };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to clear cart" };
  }
}
