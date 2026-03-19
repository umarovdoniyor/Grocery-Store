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

const inputSx = {
  backgroundColor: "#FAF6EF",
  borderRadius: "4px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(43, 38, 34, 0.2)"
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(43, 38, 34, 0.4)"
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#A44A3F",
    borderWidth: "1px"
  }
};

const labelSx = {
  "& .MuiInputLabel-root": {
    color: "#8B6A4A",
    fontWeight: 600,
    fontSize: "0.875rem",
    zIndex: 1
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#A44A3F"
  }
};

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
        <Alert
          severity="error"
          sx={{
            mb: 2,
            backgroundColor: "rgba(164, 74, 63, 0.08)",
            color: "#A44A3F",
            border: "1px solid rgba(164, 74, 63, 0.25)",
            borderRadius: "4px",
            "& .MuiAlert-icon": { color: "#A44A3F" }
          }}
        >
          {submitError}
        </Alert>
      )}

      {submitSuccess && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            backgroundColor: "rgba(93, 107, 63, 0.08)",
            color: "#5D6B3F",
            border: "1px solid rgba(93, 107, 63, 0.25)",
            borderRadius: "4px",
            "& .MuiAlert-icon": { color: "#5D6B3F" }
          }}
        >
          {submitSuccess}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ md: 6, xs: 12 }}>
          <TextField
            fullWidth
            size="medium"
            name="name"
            label="Name"
            slotProps={{ input: { sx: inputSx } }}
            sx={labelSx}
          />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField
            fullWidth
            size="medium"
            name="address"
            label="Address Line"
            slotProps={{ input: { sx: inputSx } }}
            sx={labelSx}
          />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField
            fullWidth
            size="medium"
            label="Phone"
            name="contact"
            slotProps={{ input: { sx: inputSx } }}
            sx={labelSx}
          />
        </Grid>

        <Grid size={12}>
          <Button
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{
              backgroundColor: "#2B2622",
              color: "#F4EEE3",
              borderRadius: "4px",
              fontWeight: 600,
              textTransform: "none",
              letterSpacing: "0.02em",
              px: 4,
              boxShadow: "3px 3px 0px #A44A3F",
              transition: "background-color 180ms ease, box-shadow 180ms ease",
              "&:hover": {
                backgroundColor: "#A44A3F",
                boxShadow: "3px 3px 0px #2B2622"
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
