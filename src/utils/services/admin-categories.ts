import type Category from "models/Category.model";
import { getCategoriesByAdmin } from "../../../libs/admin";

export function mapAdminCategoryToUi(input: {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  parentId?: string | null;
  status: "ACTIVE" | "INACTIVE";
}): Category {
  return {
    id: input._id,
    name: input.name,
    slug: input.slug,
    icon: input.icon,
    image: input.image || "/assets/images/products/placeholder.png",
    parent: input.parentId ? [input.parentId] : [],
    featured: input.status === "ACTIVE",
    description: input.description
  };
}

export async function fetchAdminCategoriesForUi(): Promise<{
  categories: Category[];
  error?: string;
}> {
  const response = await getCategoriesByAdmin({ page: 1, limit: 100 });

  if (!response.success) {
    return { categories: [], error: response.error || "Failed to fetch categories by admin" };
  }

  return {
    categories: (response.list || []).map(mapAdminCategoryToUi)
  };
}
