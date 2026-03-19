"use client";

import { Controller, Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MuiTextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook";
// CUSTOM DATA MODEL
import User from "models/User.model";
import { useAuth } from "contexts/AuthContext";
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from "../../../../libs/sweetAlert";
import { useRouter } from "next/navigation";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("invalid email").required("Email is required"),
  contact: yup.string().required("Contact is required"),
  address: yup.string().defined(),
  birthOfDate: yup.date().nullable().notRequired()
});

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  address: string;
  birthOfDate: Date | null;
};

// ==============================================================
type Props = { user: User };
// ==============================================================

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

export default function ProfileEditForm({ user }: Props) {
  const router = useRouter();
  const { updateMemberProfile } = useAuth();

  const initialValues: FormValues = {
    email: user?.email || "",
    contact: user?.phone || "",
    address: user?.address || "",
    lastName: user?.name?.lastName || "",
    firstName: user?.name?.firstName || "",
    birthOfDate: user?.dateOfBirth ? new Date(user.dateOfBirth) : null
  };

  const methods = useForm<FormValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema) as Resolver<FormValues>
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const handleSubmitForm = handleSubmit(async (values) => {
    try {
      const { success, error } = await updateMemberProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email.trim().toLowerCase(),
        dob: values.birthOfDate ? values.birthOfDate.toISOString() : undefined,
        phone: values.contact,
        address: values.address
      });

      if (success) {
        sweetTopSmallSuccessAlert("Profile updated successfully!");
        router.push("/profile");
      } else {
        sweetMixinErrorAlert(error || "Failed to update profile");
      }
    } catch (error: any) {
      sweetMixinErrorAlert(error?.message || "An error occurred");
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <Grid container spacing={3}>
        <Grid size={{ md: 6, xs: 12 }}>
          <TextField
            size="medium"
            fullWidth
            name="firstName"
            label="First Name"
            slotProps={{ input: { sx: inputSx } }}
            sx={labelSx}
          />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField
            size="medium"
            fullWidth
            name="lastName"
            label="Last Name"
            slotProps={{ input: { sx: inputSx } }}
            sx={labelSx}
          />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField
            size="medium"
            fullWidth
            name="email"
            type="email"
            label="Email"
            slotProps={{ input: { sx: inputSx } }}
            sx={labelSx}
          />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField
            size="medium"
            fullWidth
            label="Phone"
            name="contact"
            slotProps={{ input: { sx: inputSx } }}
            sx={labelSx}
          />
        </Grid>

        <Grid size={12}>
          <TextField
            size="medium"
            fullWidth
            label="Address"
            name="address"
            slotProps={{ input: { sx: inputSx } }}
            sx={labelSx}
          />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <Controller
            name="birthOfDate"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                {...field}
                label="Birth Date"
                enableAccessibleFieldDOMStructure={false}
                slots={{ textField: MuiTextField }}
                slotProps={{
                  textField: {
                    sx: { mb: 1, ...labelSx },
                    size: "medium",
                    fullWidth: true,
                    error: Boolean(error),
                    helperText: error?.message || "",
                    InputProps: { sx: inputSx }
                  }
                }}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Button
            disableElevation
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
