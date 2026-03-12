"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
// GLOBAL CUSTOM COMPONENTS
import { Autocomplete, FormProvider, TextField } from "components/form-hook";
// DATA
import countryList from "data/countryList";
// LOCAL CUSTOM COMPONENT
import PageWrapper from "../../page-wrapper";
import CoverPicSection from "../cover-pic-section";
import { useAuth } from "contexts/AuthContext";
import {
  toPublicImageUrl,
  uploadMemberAvatar,
  uploadVendorImage
} from "../../../../../libs/upload";
import { updateMyVendorProfile } from "../../../../../libs/vendor";
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from "../../../../../libs/sweetAlert";

const validationSchema = yup.object().shape({
  city: yup.string().notRequired(),
  country: yup.mixed().notRequired(),
  contact: yup.string().required("Contact is required"),
  last_name: yup.string().required("Last name is required"),
  first_name: yup.string().required("First name is required"),
  email: yup.string().email("Invalid Email").required("Email is required")
});

type CountryOption = { label: string; value: string };

type AccountSettingsFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  city: string;
  country: CountryOption | null;
};

const DEFAULT_COVER = "/assets/images/banners/banner-10.png";

const getApiBaseUrl = () => {
  const explicitBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
  if (explicitBase) return explicitBase;

  const graphQlUrl =
    process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
    process.env.REACT_APP_API_GRAPHQL_URL ||
    "http://localhost:3007/graphql";

  try {
    const parsed = new URL(graphQlUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return graphQlUrl.replace(/\/graphql\/?$/, "");
  }
};

const toImageSrc = (value?: string | null) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:")) {
    return value;
  }

  const apiBase = getApiBaseUrl();
  if (!apiBase) return value;

  return toPublicImageUrl(value, apiBase);
};

export default function AccountSettingsPageView() {
  const { user, updateMemberProfile } = useAuth();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverImagePath, setCoverImagePath] = useState("");
  const [shopImageNotice, setShopImageNotice] = useState<string | null>(null);

  const storageKey = useMemo(
    () => (user?.id ? `vendor-shop-cover-${user.id}` : "vendor-shop-cover"),
    [user?.id]
  );

  const initialValues = useMemo<AccountSettingsFormValues>(
    () => ({
      city: "",
      email: user?.email || "",
      contact: user?.phone || "",
      last_name: user?.name?.lastName || "",
      first_name: user?.name?.firstName || "",
      country: { label: "", value: "" }
    }),
    [user]
  );

  const methods = useForm<AccountSettingsFormValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema) as Resolver<AccountSettingsFormValues>
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedCover = localStorage.getItem(storageKey) || "";
    setCoverImagePath(storedCover);
  }, [storageKey]);

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    try {
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

  // FORM SUBMIT HANDLER
  const handleSubmitForm = handleSubmit(async (values) => {
    const addressParts = [values.city, values.country?.label].filter(Boolean).join(", ");

    const response = await updateMemberProfile({
      firstName: values.first_name,
      lastName: values.last_name,
      email: values.email.trim().toLowerCase(),
      phone: values.contact,
      address: addressParts || undefined
    });

    if (!response.success) {
      await sweetMixinErrorAlert(response.error || "Failed to update profile");
      return;
    }

    await sweetTopSmallSuccessAlert("Profile details updated successfully");
  });

  const coverSrc = toImageSrc(coverImagePath) || DEFAULT_COVER;
  const avatarSrc = user?.avatar || "/assets/images/faces/propic(9).png";

  return (
    <PageWrapper title="Account Setting">
      <Card className="p-2">
        {/* COVER SECTION */}
        <CoverPicSection
          avatarSrc={avatarSrc}
          coverSrc={coverSrc}
          onAvatarUpload={handleAvatarUpload}
          onCoverUpload={handleCoverUpload}
          uploadingAvatar={uploadingAvatar}
          uploadingCover={uploadingCover}
        />

        {shopImageNotice && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {shopImageNotice}
          </Alert>
        )}

        {/* FORM SECTION */}
        <FormProvider methods={methods} onSubmit={handleSubmitForm}>
          <Grid container spacing={3}>
            <Grid size={{ md: 6, xs: 12 }}>
              <TextField fullWidth size="medium" name="first_name" label="First Name" />
            </Grid>

            <Grid size={{ md: 6, xs: 12 }}>
              <TextField fullWidth size="medium" name="last_name" label="Last Name" />
            </Grid>

            <Grid size={{ md: 6, xs: 12 }}>
              <TextField fullWidth name="email" type="email" label="Email" size="medium" />
            </Grid>

            <Grid size={{ md: 6, xs: 12 }}>
              <TextField fullWidth type="tel" size="medium" label="Phone" name="contact" />
            </Grid>

            <Grid size={{ md: 6, xs: 12 }}>
              <Autocomplete
                disablePortal
                size="medium"
                name="country"
                label="Country"
                placeholder="Select Country"
                options={countryList}
                getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
              />
            </Grid>

            <Grid size={{ md: 6, xs: 12 }}>
              <TextField fullWidth name="city" label="City" color="info" size="medium" />
            </Grid>

            <Grid size={12}>
              <Button type="submit" variant="contained" color="info" loading={isSubmitting}>
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </PageWrapper>
  );
}
