import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCategoryTree, type CategoryTreeNode } from "../../../libs/category";

type CategoryTreeResponse = {
  success: boolean;
  tree?: CategoryTreeNode[];
  error?: string;
};

const getCategoryTreeResponseCached = unstable_cache(
  async (): Promise<CategoryTreeResponse> => getCategoryTree(),
  ["shared-category-tree-v1"],
  { revalidate: 300 }
);

export const getSharedCategoryTree = cache(
  async (): Promise<CategoryTreeResponse> => getCategoryTreeResponseCached()
);
