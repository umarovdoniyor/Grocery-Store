"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook";
import { useAuth } from "contexts/AuthContext";
import { getMyVendorProfile, updateMyVendorProfile } from "../../../../libs/vendor";
import { toPublicImageUrl, uploadVendorImage } from "../../../../libs/upload";
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from "../../../../libs/sweetAlert";

const validationSchema = yup.object().shape({
  shopName: yup.string().required("Shop Name is required!"),
  shopPhone: yup.string().required("Shop Phone is required!"),
  category: yup.string().required("Category is required!"),
  description: yup.string().required("Description is required!"),
  shopAddress: yup.string().required("Shop Address is required!"),
  order: yup.number().required("Orders is required!"),
  coverImage: yup.string().optional()
});

type ShopSettingsFormValues = {
  order: number;
  category: string;
  shopName: string;
  shopPhone: string;
  shopAddress: string;
  description: string;
  coverImage?: string;
};

export default function SettingsForm() {
  const { user, updateMemberProfile } = useAuth();
  const [uploadingCover, setUploadingCover] = useState(false);
  const [shopApiNotice, setShopApiNotice] = useState<string | null>(null);

  const methods = useForm<ShopSettingsFormValues>({
    defaultValues: {
      order: 10,
      category: "fashion",
      shopName: user?.vendorProfile?.storeName || user?.name?.firstName || "",
      shopPhone: user?.phone || "",
      shopAddress: user?.address || "",
      description: user?.vendorProfile?.storeDescription || "",
      coverImage: ""
    },
    resolver: yupResolver(validationSchema) as Resolver<ShopSettingsFormValues>
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting }
  } = methods;

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

  const toImageSrc = (value?: string) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:")) {
      return value;
    }

    const base = getApiBaseUrl();
    if (!base) return value;
    return toPublicImageUrl(value, base);
  };

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      let storeName = user?.vendorProfile?.storeName || user?.name?.firstName || "";
      let description = user?.vendorProfile?.storeDescription || "";
      let category = user?.vendorProfile?.category || "fashion";
      let minimumOrder = user?.vendorProfile?.minimumOrderQty || 10;
      let coverImage = user?.vendorProfile?.coverImageUrl || "";

      const vendorProfileRes = await getMyVendorProfile();
      if (!cancelled && vendorProfileRes.success && vendorProfileRes.profile) {
        const profile = vendorProfileRes.profile;
        storeName = profile.storeName || storeName;
        description = profile.storeDescription || description;
        category = profile.category || category;
        minimumOrder = profile.minimumOrderQty || minimumOrder;
        coverImage = profile.coverImageUrl || coverImage;
      }

      if (cancelled) return;

      reset({
        order: minimumOrder,
        category,
        shopName: storeName,
        shopPhone: user?.phone || "",
        shopAddress: user?.address || "",
        description,
        coverImage
      });
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [
    reset,
    user?.address,
    user?.name?.firstName,
    user?.phone,
    user?.vendorProfile?.category,
    user?.vendorProfile?.coverImageUrl,
    user?.vendorProfile?.minimumOrderQty,
    user?.vendorProfile?.storeDescription,
    user?.vendorProfile?.storeName
  ]);

  const coverImage = watch("coverImage");

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || uploadingCover) return;

    setUploadingCover(true);
    setShopApiNotice(null);

    try {
      const uploadResult = await uploadVendorImage(file);
      if (!uploadResult.success || !uploadResult.path) {
        await sweetMixinErrorAlert(uploadResult.error || "Failed to upload shop cover image");
        return;
      }

      setValue("coverImage", uploadResult.path, { shouldDirty: true });
      await sweetTopSmallSuccessAlert("Shop cover image uploaded");
    } catch (error: any) {
      await sweetMixinErrorAlert(error?.message || "Failed to upload shop cover image");
    } finally {
      setUploadingCover(false);
      event.target.value = "";
    }
  };

  // FORM SUBMIT HANDLER
  const handleSubmitForm = handleSubmit(async (values) => {
    const memberResult = await updateMemberProfile({
      nickname: values.shopName,
      phone: values.shopPhone,
      address: values.shopAddress
    });

    if (!memberResult.success) {
      await sweetMixinErrorAlert(memberResult.error || "Failed to save member shop settings");
      return;
    }

    const vendorResult = await updateMyVendorProfile({
      storeName: values.shopName,
      storeDescription: values.description,
      category: values.category,
      minimumOrderQty: Number(values.order),
      coverImageUrl: values.coverImage || undefined
    });

    if (!vendorResult.success) {
      await sweetMixinErrorAlert(vendorResult.error || "Failed to save vendor shop profile");
      return;
    }

    setShopApiNotice("Shop profile settings saved to API.");
    await sweetTopSmallSuccessAlert("Shop settings saved");
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      {shopApiNotice && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {shopApiNotice}
        </Alert>
      )}

      <Stack spacing={3} mb={3}>
        <TextField color="info" size="medium" name="shopName" label="Shop Name *" />
        <TextField color="info" size="medium" name="shopPhone" label="Shop Phone" />
        <TextField
          select
          fullWidth
          color="info"
          size="medium"
          name="category"
          placeholder="Category"
          label="Select Category"
        >
          <MenuItem value="electronics">Electronics</MenuItem>
          <MenuItem value="fashion">Fashion</MenuItem>
          <MenuItem value="grocery">Grocery</MenuItem>
        </TextField>
        <TextField
          rows={6}
          multiline
          fullWidth
          color="info"
          size="medium"
          name="description"
          label="Description (optional)"
        />

        <TextField color="info" size="medium" name="shopAddress" label="Shop Address" />
        <TextField name="order" color="info" size="medium" type="number" label="Minimum Order *" />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
          <Button component="label" variant="outlined" color="info" disabled={uploadingCover}>
            {uploadingCover ? <CircularProgress size={18} /> : "Upload Shop Cover"}
            <input hidden type="file" accept="image/*" onChange={handleCoverUpload} />
          </Button>

          <TextField
            fullWidth
            color="info"
            size="medium"
            name="coverImage"
            label="Cover Image Path"
            placeholder="/uploads/vendor/..."
          />
        </Stack>

        {coverImage && (
          <Box
            component="img"
            src={toImageSrc(coverImage)}
            alt="Shop cover preview"
            sx={{ width: "100%", maxHeight: 200, borderRadius: 1, objectFit: "cover" }}
          />
        )}
      </Stack>

      <Button loading={isSubmitting} type="submit" color="info" variant="contained">
        Save Changes
      </Button>
    </FormProvider>
  );
}
