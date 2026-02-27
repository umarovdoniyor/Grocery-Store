"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// GLOBAL CUSTOM COMPONENTS
import { TextField, FormProvider } from "components/form-hook";
// AUTH CONTEXT
import { useAuth } from "contexts/AuthContext";

const validationSchema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  re_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm password"),
  storeName: yup.string().required("Store name is required"),
  storeDescription: yup.string().required("Store description is required"),
  businessLicense: yup.string().required("Business license number is required")
});

export default function BecomeVendorPageView() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      re_password: "",
      storeName: "",
      storeDescription: "",
      businessLicense: ""
    },
    resolver: yupResolver(validationSchema)
  });

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const handleSubmitForm = handleSubmit(async (values) => {
    setError(null);
    const result = await registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
      role: "vendor",
      storeName: values.storeName,
      storeDescription: values.storeDescription,
      businessLicense: values.businessLicense
    });

    if (result.success) {
      router.push("/vendor/dashboard");
    } else {
      setError(result.error || "Vendor registration failed");
    }
  });

  return (
    <Box py={4}>
      <Card sx={{ maxWidth: 700, mx: "auto", p: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Become a Vendor
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Join our marketplace and start selling your products
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmitForm}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Typography variant="h6" mb={2}>
            Personal Information
          </Typography>

          <Grid container spacing={3} mb={3}>
            <Grid size={12}>
              <TextField fullWidth name="name" label="Full Name" placeholder="John Doe" />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                name="email"
                type="email"
                label="Email Address"
                placeholder="john@example.com"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="re_password"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" mb={2}>
            Store Information
          </Typography>

          <Grid container spacing={3} mb={3}>
            <Grid size={12}>
              <TextField
                fullWidth
                name="storeName"
                label="Store Name"
                placeholder="My Grocery Store"
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="storeDescription"
                label="Store Description"
                placeholder="Tell customers about your store..."
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                name="businessLicense"
                label="Business License Number"
                placeholder="BL-123456789"
              />
            </Grid>
          </Grid>

          <Button
            fullWidth
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            loading={isSubmitting}
          >
            Submit Application
          </Button>

          <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
            Already have an account?{" "}
            <Box
              component="a"
              href="/login"
              sx={{ color: "primary.main", textDecoration: "none", fontWeight: 600 }}
            >
              Login Here
            </Box>
          </Typography>
        </FormProvider>
      </Card>
    </Box>
  );
}
