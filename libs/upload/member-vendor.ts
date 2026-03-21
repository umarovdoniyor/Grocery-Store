import { initializeApollo } from "../../apollo/client";
import { IMAGE_UPLOADER } from "../../apollo/user/mutation";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

function validateImageFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Unsupported file type. Allowed: jpeg, jpg, png, webp";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File size exceeds 15MB limit";
  }

  return null;
}

async function uploadSingleImage(file: File, target: "member" | "vendor", token?: string) {
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

export async function uploadMemberAvatar(file: File, token?: string) {
  return uploadSingleImage(file, "member", token);
}

export async function uploadVendorImage(file: File, token?: string) {
  return uploadSingleImage(file, "vendor", token);
}

export function toPublicImageUrl(path: string, apiBaseUrl: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
