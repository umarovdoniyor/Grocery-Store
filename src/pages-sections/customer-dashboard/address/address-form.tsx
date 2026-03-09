"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook";
// CUSTOM DATA MODEL
import Address from "models/Address.model";
import { useAuth } from "contexts/AuthContext";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  contact: yup.string().required("Contact is required")
});

// =============================================================
type Props = { address: Address };
// =============================================================

export default function AddressForm({ address }: Props) {
  const { updateMemberProfile } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const initialValues = {
    name: address.title || "",
    contact: address.phone || "",
    address: address.street || ""
  };

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const handleSubmitForm = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    const nameParts = values.name.trim().split(/\s+/);
    const firstName = nameParts[0] || values.name.trim();
    const lastName = nameParts.slice(1).join(" ") || "User";

    const response = await updateMemberProfile({
      firstName,
      lastName,
      phone: values.contact,
      address: values.address
    });

    if (!response.success) {
      setSubmitError(response.error || "Failed to update address.");
      return;
    }

    setSubmitSuccess("Address updated successfully.");
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {submitSuccess}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ md: 6, xs: 12 }}>
          <TextField fullWidth size="medium" name="name" label="Name" />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField fullWidth size="medium" name="address" label="Address Line" />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField fullWidth size="medium" label="Phone" name="contact" />
        </Grid>

        <Grid size={12}>
          <Button
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            loading={isSubmitting}
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
