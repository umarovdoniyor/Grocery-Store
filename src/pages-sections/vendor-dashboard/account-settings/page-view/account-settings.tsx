"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
// MUI
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
// LOCAL CUSTOM COMPONENT
import PageWrapper from "../../page-wrapper";
import { useAuth } from "contexts/AuthContext";
import { toPublicImageUrl } from "../../../../../libs/upload/url";
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from "../../../../../libs/sweetAlert";
import { getApiBaseUrl } from "../../../../../utils/getApiBaseUrl";

const CoverPicSection = dynamic(() => import("../cover-pic-section"), { ssr: false });
const AccountSettingsFormSection = dynamic(() => import("./account-settings-form-section"), {
  loading: () => null,
  ssr: false
});

const DEFAULT_COVER = "/assets/images/banners/banner-10.png";

const toImageSrc = (value?: string | null) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:")) {
    return value;
  }

  const apiBase = getApiBaseUrl();
  if (!apiBase) return value;

  return toPublicImageUrl(value, apiBase);
};

export default function AccountSettingsPageView({
  uiMode = "vendor"
}: {
  uiMode?: "vendor" | "admin";
}) {
  const isAdminMode = uiMode === "admin";
  const accentMain = isAdminMode ? "#4F46E5" : "#14B8A6";
  const accentDark = isAdminMode ? "#4338CA" : "#0F766E";
  const accentSoft = isAdminMode ? "#EEF2FF" : "#F0FDFA";

  const { user, updateMemberProfile } = useAuth();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverImagePath, setCoverImagePath] = useState("");
  const [shopImageNotice, setShopImageNotice] = useState<string | null>(null);

  const storageKey = useMemo(
    () => (user?.id ? `vendor-shop-cover-${user.id}` : "vendor-shop-cover"),
    [user?.id]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedCover = localStorage.getItem(storageKey) || "";
    setCoverImagePath(storedCover);
  }, [storageKey]);

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const { uploadMemberAvatar } = await import("../../../../../libs/upload/member-vendor");
      const uploadResult = await uploadMemberAvatar(file);

      if (!uploadResult.success || !uploadResult.path) {
        await sweetMixinErrorAlert(uploadResult.error || "Failed to upload profile image");
        return;
      }

      const updateResult = await updateMemberProfile({ avatar: uploadResult.path });
      if (!updateResult.success) {
        await sweetMixinErrorAlert(updateResult.error || "Failed to save profile image");
        return;
      }

      await sweetTopSmallSuccessAlert("Profile image updated successfully");
    } catch (error: any) {
      await sweetMixinErrorAlert(error?.message || "Failed to upload profile image");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    setShopImageNotice(null);

    try {
      const { uploadVendorImage } = await import("../../../../../libs/upload/member-vendor");
      const { updateMyVendorProfile } = await import("../../../../../libs/vendor/profile");
      const uploadResult = await uploadVendorImage(file);

      if (!uploadResult.success || !uploadResult.path) {
        await sweetMixinErrorAlert(uploadResult.error || "Failed to upload shop image");
        return;
      }

      setCoverImagePath(uploadResult.path);

      const vendorUpdateResult = await updateMyVendorProfile({
        coverImageUrl: uploadResult.path.trim()
      });

      if (!vendorUpdateResult.success) {
        await sweetMixinErrorAlert(vendorUpdateResult.error || "Failed to save shop image");
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, uploadResult.path);
      }

      setShopImageNotice("Shop image uploaded and saved to your vendor profile.");
      await sweetTopSmallSuccessAlert("Shop image updated");
    } catch (error: any) {
      await sweetMixinErrorAlert(error?.message || "Failed to upload shop image");
    } finally {
      setUploadingCover(false);
    }
  };

  const coverSrc = toImageSrc(coverImagePath) || DEFAULT_COVER;
  const avatarSrc = user?.avatar || "/assets/images/faces/propic(9).png";

  return (
    <PageWrapper title="Account Setting">
      <Card
        sx={{
          p: 2,
          borderRadius: "10px",
          border: "1px solid #D1D5DB",
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)"
        }}
      >
        {/* COVER SECTION */}
        <CoverPicSection
          uiMode={uiMode}
          avatarSrc={avatarSrc}
          coverSrc={coverSrc}
          onAvatarUpload={handleAvatarUpload}
          onCoverUpload={handleCoverUpload}
          uploadingAvatar={uploadingAvatar}
          uploadingCover={uploadingCover}
        />

        {shopImageNotice && (
          <Alert
            severity="info"
            sx={{
              mb: 2,
              border: `1px solid ${isAdminMode ? "#C7D2FE" : "#99F6E4"}`,
              backgroundColor: accentSoft,
              color: isAdminMode ? "#3730A3" : "#115E59"
            }}
          >
            {shopImageNotice}
          </Alert>
        )}

        {/* FORM SECTION */}
        <AccountSettingsFormSection accentMain={accentMain} accentDark={accentDark} />
      </Card>
    </PageWrapper>
  );
}
