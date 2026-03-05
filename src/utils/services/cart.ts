import { initializeApollo } from "../../../apollo/client";
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

    const items = (data?.getMyCart?.items || []).map((item: any) => ({
      id: item.productId || item._id,
      qty: item.quantity || 1,
      title: item.productSnapshotTitle || "Product",
      slug: toSlug(item.productSnapshotTitle || item.productId || "product"),
      price: Number(item.appliedPrice ?? item.unitPrice ?? 0),
      thumbnail:
        item.productSnapshotThumbnail ||
        "/assets/images/products/Fashion/Clothes/1.SilverHighNeckSweater.png"
    }));

    return { success: true, items };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch cart" };
  }
}
