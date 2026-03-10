"use client";

import { useCallback, useEffect, useState } from "react";
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
import Link from "next/link";

const validationSchema = yup.object().shape({
  storeName: yup.string().required("Store name is required"),
  storeDescription: yup.string().required("Store description is required"),
  businessLicense: yup.string().required("Business license number is required")
});

export default function BecomeVendorPageView() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, applyVendor, getMyVendorApplication, refreshUser } =
    useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | null
  >(null);
  const [isCheckingApplication, setIsCheckingApplication] = useState(true);

  const methods = useForm({
    defaultValues: {
      storeName: "",
      storeDescription: "",
      businessLicense: ""
    },
    resolver: yupResolver(validationSchema)
  });

  const {
    handleSubmit,
    getValues,
    reset,
    formState: { isSubmitting }
  } = methods;

  const loadApplicationStatus = useCallback(async () => {
    setIsCheckingApplication(true);
    const result = await getMyVendorApplication();

    const application = result.application;
    if (result.success && application) {
      setApplicationStatus(application.status);
      reset({
        storeName: application.storeName || "",
        storeDescription: application.description || "",
        businessLicense: application.businessLicenseUrl || ""
      });

      if (application.status === "APPROVED") {
        await refreshUser();
        setSuccess("Application approved. Your account is being upgraded to vendor.");
      }
    } else {
      setApplicationStatus(null);
    }

    setIsCheckingApplication(false);
  }, [getMyVendorApplication, refreshUser, reset]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setIsCheckingApplication(false);
      return;
    }

    if (user?.role === "vendor") {
      router.replace("/vendor/dashboard");
      return;
    }

    loadApplicationStatus();
  }, [isAuthenticated, isLoading, loadApplicationStatus, router, user?.role]);

  const handleSubmitForm = handleSubmit(async (values) => {
    setError(null);
    setSuccess(null);

    const result = await applyVendor({
      storeName: values.storeName,
      description: values.storeDescription,
      businessLicenseUrl: values.businessLicense
    });

    if (result.success) {
      setApplicationStatus("PENDING");
      setSuccess("Application submitted successfully. Admin review is pending.");
    } else {
      setError(result.error || "Vendor application failed");
    }
  });

  if (!isLoading && !isAuthenticated) {
    return (
      <Box py={4}>
        <Card sx={{ maxWidth: 700, mx: "auto", p: 4 }}>
          <Typography variant="h4" fontWeight={700} mb={1}>
            Become a Vendor
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Please login first to submit your vendor application.
          </Alert>

          <Button LinkComponent={Link} href="/login?next=%2Fbecome-vendor" variant="contained">
            Login to Continue
          </Button>
        </Card>
      </Box>
    );
  }

  const submittedStoreName = getValues("storeName");
  const submittedStoreDescription = getValues("storeDescription");
  const submittedBusinessLicense = getValues("businessLicense");

  return (
    <Box py={4}>
      <Card sx={{ maxWidth: 700, mx: "auto", p: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Become a Vendor
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Join our marketplace and start selling your products
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {isCheckingApplication && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Checking your existing application...
          </Alert>
        )}

        {applicationStatus === "PENDING" ? (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Your application is under review. We will notify you once it is approved.
            </Alert>

            <Card variant="outlined" sx={{ p: 2.5, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                Submitted Details
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={0.75}>
                <strong>Store Name:</strong> {submittedStoreName || "-"}
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={0.75}>
                <strong>Description:</strong> {submittedStoreDescription || "-"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>License:</strong> {submittedBusinessLicense || "-"}
              </Typography>
            </Card>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button fullWidth variant="outlined" LinkComponent={Link} href="/profile">
                  Go to My Account
                </Button>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Button fullWidth variant="outlined" LinkComponent={Link} href="/products">
                  Browse Products
                </Button>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={loadApplicationStatus}
                  disabled={isCheckingApplication}
                >
                  Refresh Status
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <FormProvider methods={methods} onSubmit={handleSubmitForm}>
            {applicationStatus === "REJECTED" && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                Your previous application was rejected. Update details and submit again.
              </Alert>
            )}

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
              loading={isSubmitting || isCheckingApplication}
            >
              {applicationStatus === "REJECTED" ? "Resubmit Application" : "Submit Application"}
            </Button>
          </FormProvider>
        )}
      </Card>
    </Box>
  );
}
