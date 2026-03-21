"use client";

import { useEffect, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Autocomplete, FormProvider, TextField } from "components/form-hook";
import countryList from "data/countryList";
import { useAuth } from "contexts/AuthContext";
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

type Props = {
  accentMain: string;
  accentDark: string;
};

export default function AccountSettingsFormSection({ accentMain, accentDark }: Props) {
  const { user, updateMemberProfile } = useAuth();

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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <Grid
        container
        spacing={3}
        sx={{
          "& .MuiInputLabel-root": {
            zIndex: 1,
            color: "#6B7280"
          },
          "& .MuiInputLabel-shrink": {
            px: 0.5,
            bgcolor: "#F8FAFC"
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#F8FAFC",
            "& fieldset": {
              borderColor: "#D1D5DB"
            },
            "&:hover fieldset": {
              borderColor: accentMain
            },
            "&.Mui-focused fieldset": {
              borderColor: accentMain
            }
          },
          "& .MuiInputBase-input": {
            color: "#1F2937"
          }
        }}
      >
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
          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{
              backgroundColor: accentMain,
              color: "#F8FAFC",
              "&:hover": {
                backgroundColor: accentDark
              }
            }}
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
