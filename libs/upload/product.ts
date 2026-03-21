import { initializeApollo } from "../../apollo/client";
import { IMAGE_UPLOADER, IMAGES_UPLOADER } from "../../apollo/user/mutation";

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

export async function uploadProductThumbnail(file: File, token?: string) {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: IMAGE_UPLOADER,
      variables: { file, target: "product" },
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

export async function uploadProductGallery(files: File[], token?: string) {
  const validationError = validateImageFiles(files);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const apolloClient = await initializeApollo();

    const { data } = await apolloClient.mutate({
      mutation: IMAGES_UPLOADER,
      variables: { files, target: "product" },
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

export function toPublicImageUrl(path: string, apiBaseUrl: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}