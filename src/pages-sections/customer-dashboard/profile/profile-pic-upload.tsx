"use client";

import { ChangeEvent, useEffect, useState } from "react";
// MUI
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import CameraEnhance from "@mui/icons-material/CameraEnhance";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";
import { useAuth } from "contexts/AuthContext";
import { toPublicImageUrl, uploadMemberAvatar } from "../../../../libs/upload";
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from "../../../../libs/sweetAlert";
import { getApiBaseUrl } from "../../../utils/getApiBaseUrl";

const FALLBACK_AVATAR = "/assets/images/faces/propic(9).png";

const normalizeMemberAvatarPath = (value: string) => {
  const normalized = value.replace(/\\/g, "/").trim();
  if (!normalized) return "";

  if (!normalized.includes("/")) {
    return `/uploads/member/${normalized}`;
  }

  return normalized;
};

const normalizeImageSrc = (value?: string) => {
  if (!value) return FALLBACK_AVATAR;
  const normalized = normalizeMemberAvatarPath(value);

  if (
    normalized.startsWith("blob:") ||
    normalized.startsWith("http://") ||
    normalized.startsWith("https://")
  ) {
    return normalized;
  }

  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) return normalized.startsWith("/") ? normalized : `/${normalized}`;

  return toPublicImageUrl(normalized, apiBaseUrl);
};

export default function ProfilePicUpload({ image }: { image: string }) {
  const { updateMemberProfile, refreshUser } = useAuth();
  const [preview, setPreview] = useState(normalizeImageSrc(image));
  const [latestUploadedPath, setLatestUploadedPath] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const normalizedImage = normalizeImageSrc(image);
    const normalizedLatestUploaded = normalizeImageSrc(latestUploadedPath);

    // Keep latest uploaded preview until global auth state reflects the same value.
    if (latestUploadedPath) {
      if (normalizedImage === normalizedLatestUploaded) {
        setLatestUploadedPath("");
        setPreview(normalizedImage);
        return;
      }

      setPreview(normalizedLatestUploaded);
      return;
    }

    setPreview(normalizedImage);
  }, [image, latestUploadedPath]);

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || uploading) return;

    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);
    setUploading(true);

    try {
      const uploadResult = await uploadMemberAvatar(file);

      if (!uploadResult.success || !uploadResult.path) {
        setPreview(normalizeImageSrc(image));
        await sweetMixinErrorAlert(uploadResult.error || "Failed to upload profile image");
        return;
      }

      const updateResult = await updateMemberProfile({ avatar: uploadResult.path });

      if (!updateResult.success) {
        setPreview(normalizeImageSrc(image));
        await sweetMixinErrorAlert(updateResult.error || "Failed to update profile image");
        return;
      }

      setLatestUploadedPath(uploadResult.path);
      setPreview(normalizeImageSrc(uploadResult.path));
      await refreshUser();

      await sweetTopSmallSuccessAlert("Profile image updated successfully!");
    } catch (error: any) {
      setPreview(normalizeImageSrc(image));
      await sweetMixinErrorAlert(error?.message || "Failed to update profile image");
    } finally {
      setUploading(false);
      event.target.value = "";
      URL.revokeObjectURL(localPreviewUrl);
    }
  };

  return (
    <FlexBox alignItems="flex-end" mb={4}>
      <Avatar
        src={preview}
        alt="user"
        variant="rounded"
        sx={{
          height: 72,
          width: 72,
          borderRadius: "4px",
          border: "2px solid rgba(43, 38, 34, 0.2)"
        }}
      />

      <IconButton
        size="small"
        component="label"
        htmlFor="profile-image"
        disabled={uploading}
        sx={{
          bgcolor: "#2B2622",
          ml: -2.5,
          color: "#F4EEE3",
          borderRadius: "3px",
          "&:hover": { bgcolor: "#A44A3F" },
          transition: "background-color 180ms ease"
        }}
      >
        {uploading ? (
          <CircularProgress size={16} sx={{ color: "#F4EEE3" }} />
        ) : (
          <CameraEnhance fontSize="small" />
        )}
      </IconButton>

      <Box
        type="file"
        display="none"
        accept="image/*"
        component="input"
        id="profile-image"
        onChange={handleAvatarChange}
      />
    </FlexBox>
  );
}
