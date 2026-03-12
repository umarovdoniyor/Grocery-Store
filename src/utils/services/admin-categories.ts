import {
  getCategoriesByAdmin,
  removeCategory,
  updateCategory,
  type Category as AdminCategory
} from "../../../libs/admin";
import { getCategoryBySlug } from "../../../libs/category";

export interface AdminCategoryRow {
  id: string;
  slug: string;
  name: string;
  image: string;
  parentName: string;
  active: boolean;
}

function toPlaceholderImage() {
  return "/assets/images/products/placeholder.png";
}

function mapAdminCategoryToRow(
  category: AdminCategory,
  categoryNameLookup: Map<string, string>
): AdminCategoryRow {
  return {
    id: category._id,
    slug: category.slug,
    name: category.name,
    image: category.image || toPlaceholderImage(),
    parentName: category.parentId ? categoryNameLookup.get(category.parentId) || "-" : "-",
    active: category.status === "ACTIVE"
  };
}

function mapAdminCategoriesToRows(categories: AdminCategory[]): AdminCategoryRow[] {
  const categoryNameLookup = new Map(categories.map((category) => [category._id, category.name]));

  return categories.map((category) => mapAdminCategoryToRow(category, categoryNameLookup));
}

export async function fetchAdminCategoriesForUi(): Promise<{
  categories: AdminCategoryRow[];
  total: number;
  error?: string;
}> {
  const response = await getCategoriesByAdmin({ page: 1, limit: 100 });

  if (!response.success) {
    return {
      categories: [],
      total: 0,
      error: response.error || "Failed to fetch categories by admin"
    };
  }

  return {
    categories: mapAdminCategoriesToRows(response.list || []),
    total: Number(response.total || 0)
  };
}

export async function fetchAdminCategoriesForUiByQuery(input?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
}): Promise<{
  categories: AdminCategoryRow[];
  total: number;
  error?: string;
}> {
  const response = await getCategoriesByAdmin({
    page: input?.page || 1,
    limit: input?.limit || 100,
    search: input?.search || undefined,
    status: input?.status
  });

  if (!response.success) {
    return {
      categories: [],
      total: 0,
      error: response.error || "Failed to fetch categories by admin"
    };
  }

  return {
    categories: mapAdminCategoriesToRows(response.list || []),
    total: Number(response.total || 0)
  };
}

export async function updateAdminCategoryStatusForUi(input: {
  categoryId: string;
  active: boolean;
}): Promise<{ success: boolean; active?: boolean; error?: string }> {
  const response = await updateCategory({
    categoryId: input.categoryId,
    status: input.active ? "ACTIVE" : "INACTIVE"
  });

  if (!response.success || !response.category) {
    return { success: false, error: response.error || "Failed to update category status" };
  }

  return { success: true, active: response.category.status === "ACTIVE" };
}

export async function removeAdminCategoryForUi(categoryId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const response = await removeCategory({ categoryId });

  if (!response.success) {
    return { success: false, error: response.error || "Failed to remove category" };
  }

  return { success: true };
}

export async function fetchAdminCategoryForEditBySlug(slug: string): Promise<{
  category?: AdminCategory;
  error?: string;
}> {
  const response = await getCategoryBySlug(slug);

  if (!response.success) {
    return { error: response.error || "Failed to fetch category" };
  }

  const category = response.category;

  if (!category) {
    return { error: "Category not found" };
  }

  return { category };
}
