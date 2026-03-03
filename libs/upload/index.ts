import { initializeApollo } from "../../apollo/client";
import { IMAGE_UPLOADER, IMAGES_UPLOADER } from "../../apollo/user/mutation";

export type UploadTarget = "member" | "product" | "vendor" | "category" | "general";
export type UploadFieldKey =
  | "memberAvatar"
  | "productThumbnail"
  | "productGallery"
  | "vendorImage"
  | "categoryImage"
  | "generalImage";

export const UPLOAD_TARGET_BY_FIELD: Record<UploadFieldKey, UploadTarget> = {
  memberAvatar: "member",
  productThumbnail: "product",
  productGallery: "product",
  vendorImage: "vendor",
  categoryImage: "category",
  generalImage: "general"
};

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 10;

function validateImageFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Unsupported file type. Allowed: jpeg, jpg, png, webp";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File size exceeds 15MB limit";
  }

  return null;
}

function validateImageFiles(files: File[]): string | null {
  if (!files.length) {
    return "At least one file is required";
  }

  if (files.length > MAX_FILES_PER_REQUEST) {
    return `You can upload up to ${MAX_FILES_PER_REQUEST} files per request`;
  }

  for (const file of files) {
    const error = validateImageFile(file);
    if (error) return `${file.name}: ${error}`;
  }

  return null;
}

export async function uploadSingleImage(
  file: File,
  target: UploadTarget,
  token?: string
): Promise<{
  success: boolean;
  path?: string;
  error?: string;
}> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: IMAGE_UPLOADER,
      variables: { file, target },
      context: {
        headers: {
          "apollo-require-preflight": "true",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    });

    const path = data?.imageUploader;

    if (!path) {
      return { success: false, error: "Upload failed" };
    }

    return { success: true, path };
  } catch (error: any) {
    const message = error?.message || "Upload failed";
    return { success: false, error: message };
  }
}

export async function uploadByField(
  file: File,
  field: UploadFieldKey,
  token?: string
): Promise<{
  success: boolean;
  path?: string;
  error?: string;
}> {
  return uploadSingleImage(file, UPLOAD_TARGET_BY_FIELD[field], token);
}

export async function uploadMultipleImages(
  files: File[],
  target: UploadTarget,
  token?: string
): Promise<{
  success: boolean;
  paths?: string[];
  error?: string;
}> {
  const validationError = validateImageFiles(files);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: IMAGES_UPLOADER,
      variables: { files, target },
      context: {
        headers: {
          "apollo-require-preflight": "true",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    });

    const paths = data?.imagesUploader || [];

    return { success: true, paths };
  } catch (error: any) {
    const message = error?.message || "Upload failed";
    return { success: false, error: message };
  }
}

export async function uploadManyByField(
  files: File[],
  field: UploadFieldKey,
  token?: string
): Promise<{
  success: boolean;
  paths?: string[];
  error?: string;
}> {
  return uploadMultipleImages(files, UPLOAD_TARGET_BY_FIELD[field], token);
}

export async function uploadMemberAvatar(file: File, token?: string) {
  return uploadByField(file, "memberAvatar", token);
}

export async function uploadProductThumbnail(file: File, token?: string) {
  return uploadByField(file, "productThumbnail", token);
}

export async function uploadProductGallery(files: File[], token?: string) {
  return uploadManyByField(files, "productGallery", token);
}

export async function uploadCategoryImage(file: File, token?: string) {
  return uploadByField(file, "categoryImage", token);
}

export async function uploadVendorImage(file: File, token?: string) {
  return uploadByField(file, "vendorImage", token);
}

export function toPublicImageUrl(path: string, apiBaseUrl: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
