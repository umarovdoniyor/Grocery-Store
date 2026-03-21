"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Resolver, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from "clsx";
// MUI
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField, Autocomplete, Checkbox } from "components/form-hook";
// DUMMY CUSTOM DATA
import countryList from "data/countryList";
import { validateCheckoutServer } from "utils/services/checkout-flow";
// STYLED COMPONENT
import { ButtonWrapper, CardRoot, FormWrapper } from "./styles";
import { useState } from "react";

// uncomment these fields below for from validation
const validationSchema = yup.object().shape({
  shipping_name: yup.string().required("Name is required"),
  shipping_email: yup.string().email("invalid email").required("Email is required"),
  shipping_contact: yup.string().required("Phone is required"),
  shipping_zip: yup.string().required("Zip is required"),
  shipping_country: yup.mixed().required("Country is required"),
  shipping_address1: yup.string().required("Address is required"),
  same_as_shipping: yup.boolean().optional(),
  billing_name: yup.string().optional(),
  billing_email: yup.string().optional(),
  billing_contact: yup.string().optional(),
  billing_zip: yup.string().optional(),
  billing_country: yup.object().optional(),
  billing_address1: yup.string().optional()
});

type FormValues = yup.InferType<typeof validationSchema>;

export default function CheckoutForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const initialValues: FormValues = {
    shipping_zip: "",
    shipping_name: "",
    shipping_email: "",
    shipping_contact: "",
    shipping_address1: "",
    shipping_country: { label: "United States", value: "US" },
    same_as_shipping: false,
    billing_zip: "",
    billing_name: "",
    billing_email: "",
    billing_contact: "",
    billing_address1: "",
    billing_country: { label: "United States", value: "US" }
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

  const sameAsShipping = useWatch({
    control,
    name: "same_as_shipping"
  });

  const handleSubmitForm = handleSubmit(async (values) => {
    setCheckoutError(null);

    const validationRes = await validateCheckoutServer();

    if (!validationRes.success || !validationRes.validation) {
      setCheckoutError(validationRes.error || "Unable to validate cart for checkout.");
      return;
    }

    if (!validationRes.validation.isValid) {
      const firstIssue = validationRes.validation.issues?.[0]?.message;
      setCheckoutError(firstIssue || "Cart validation failed. Please update your cart.");
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("checkout_shipping", JSON.stringify(values));
    }

    router.push("/payment");
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <CardRoot elevation={0}>
        <Typography variant="h5" sx={{ mb: 2, color: "#2F4022", fontWeight: 700 }}>
          {t("Shipping Address")}
        </Typography>

        <FormWrapper>
          <TextField size="medium" fullWidth label={t("Full Name")} name="shipping_name" />
          <TextField size="medium" fullWidth label={t("Phone Number")} name="shipping_contact" />
          <TextField
            fullWidth
            type="email"
            size="medium"
            label={t("Email Address")}
            name="shipping_email"
          />
          <TextField size="medium" fullWidth label={t("Company")} name="shipping_company" />
          <TextField size="medium" fullWidth label={t("Address 1")} name="shipping_address1" />
          <TextField size="medium" fullWidth label={t("Address 2")} name="shipping_address2" />
          <Autocomplete
            fullWidth
            size="medium"
            label={t("Country")}
            options={countryList}
            name="shipping_country"
            placeholder={t("Select Country")}
            getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
          />
          <TextField size="medium" fullWidth label={t("Zip Code")} name="shipping_zip" />
        </FormWrapper>
      </CardRoot>

      <CardRoot elevation={0}>
        <Typography variant="h5" sx={{ color: "#2F4022", fontWeight: 700 }}>
          {t("Billing Address")}
        </Typography>

        <Checkbox
          size="small"
          color="secondary"
          name="same_as_shipping"
          label={t("Same as shipping address")}
          className={clsx({ "mb-1": !sameAsShipping })}
        />

        {!sameAsShipping && (
          <FormWrapper>
            <TextField size="medium" fullWidth label={t("Full Name")} name="billing_name" />
            <TextField size="medium" fullWidth label={t("Phone Number")} name="billing_contact" />
            <TextField
              size="medium"
              fullWidth
              type="email"
              name="billing_email"
              label={t("Email Address")}
            />
            <TextField size="medium" fullWidth label={t("Company")} name="billing_company" />
            <TextField size="medium" fullWidth label={t("Address 1")} name="billing_address1" />
            <TextField size="medium" fullWidth label={t("Address 2")} name="billing_address2" />
            <Autocomplete
              size="medium"
              fullWidth
              label={t("Country")}
              options={countryList}
              name="billing_country"
              placeholder={t("Select Country")}
              getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
            />
            <TextField size="medium" fullWidth label={t("Zip Code")} name="billing_zip" />
          </FormWrapper>
        )}
      </CardRoot>

      <ButtonWrapper>
        {checkoutError && (
          <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
            {checkoutError}
          </Alert>
        )}

        <Button
          size="large"
          fullWidth
          href="/cart"
          variant="outlined"
          LinkComponent={Link}
          sx={{
            borderColor: "rgba(79,109,47,0.35)",
            color: "#446127",
            "&:hover": {
              borderColor: "#446127",
              backgroundColor: "rgba(79,109,47,0.08)"
            }
          }}
        >
          {t("Back to Cart")}
        </Button>

        <Button
          size="large"
          fullWidth
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{
            backgroundColor: "#5A7A30",
            "&:hover": {
              backgroundColor: "#446127"
            }
          }}
        >
          {t("Proceed to Payment")}
        </Button>
      </ButtonWrapper>
    </FormProvider>
  );
}
