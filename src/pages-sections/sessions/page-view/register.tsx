"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// GLOBAL CUSTOM COMPONENTS
import { Checkbox, TextField, FormProvider } from "components/form-hook";
// LOCAL CUSTOM COMPONENTS
import EyeToggleButton from "../components/eye-toggle-button";
// LOCAL CUSTOM HOOK
import Label from "../components/label";
import BoxLink from "../components/box-link";
import usePasswordVisible from "../use-password-visible";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";
// AUTH CONTEXT
import { useAuth } from "contexts/AuthContext";

// REGISTER FORM FIELD VALIDATION SCHEMA
const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .min(1, "First name is required")
    .required("First name is required"),
  lastName: yup.string().trim().min(1, "Last name is required").required("Last name is required"),
  nickname: yup
    .string()
    .trim()
    .min(3, "Nickname must be at least 3 characters")
    .required("Nickname is required"),
  email: yup.string().email("Invalid Email Address").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  phone: yup
    .string()
    .trim()
    .optional()
    .test(
      "is-international-phone",
      "Phone must be in international format, e.g. +1234567890",
      (value) => !value || /^\+[1-9]\d{7,14}$/.test(value)
    ),
  address: yup.string().trim().optional(),
  re_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please re-type password"),
  agreement: yup
    .bool()
    .test(
      "agreement",
      "You have to agree with our Terms and Conditions!",
      (value) => value === true
    )
    .required("You have to agree with our Terms and Conditions!")
});

export default function RegisterPageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const { visiblePassword, togglePasswordVisible } = usePasswordVisible();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const inputProps = {
    endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    re_password: "",
    agreement: false
  };

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  const {
    handleSubmit,
    setError: setFieldError,
    formState: { isSubmitting }
  } = methods;

  const sanitizeNextPath = (value?: string | null) => {
    if (!value) return "/";

    let candidate = value.trim();
    for (let i = 0; i < 3; i += 1) {
      if (!/%[0-9A-Fa-f]{2}/.test(candidate)) break;
      try {
        const decoded = decodeURIComponent(candidate);
        if (decoded === candidate) break;
        candidate = decoded;
      } catch {
        break;
      }
    }

    if (!candidate.startsWith("/") || candidate.startsWith("//")) return "/";
    const pathOnly = candidate.split("?")[0];
    if (pathOnly === "/login" || pathOnly === "/register" || pathOnly === "/reset-password") {
      return "/";
    }

    return candidate;
  };

  const nextParam = searchParams.get("next");
  const redirectPath = sanitizeNextPath(nextParam);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) router.replace(redirectPath);
  }, [isAuthenticated, isLoading, redirectPath, router]);

  const handleSubmitForm = handleSubmit(async (values) => {
    setError(null);
    setSuccessMessage(null);
    const result = await registerUser({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      nickname: values.nickname.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      phone: values.phone?.trim() || undefined,
      address: values.address?.trim() || undefined,
      role: "customer"
    });

    if (result.success) {
      setSuccessMessage("Account created successfully. Redirecting...");
      await new Promise((resolve) => setTimeout(resolve, 700));
      router.push(redirectPath);
    } else {
      const message = result.error || "Registration failed";
      setError(message);

      if (/nickname|taken/i.test(message)) {
        setFieldError("nickname", {
          type: "server",
          message: "This nickname is already taken"
        });
      }

      if (/phone|already exists|duplicate/i.test(message)) {
        setFieldError("phone", {
          type: "server",
          message: "This phone number is already in use"
        });
      }

      if (/email|already exists|duplicate|taken/i.test(message)) {
        setFieldError("email", {
          type: "server",
          message: "An account with this email already exists"
        });
      }
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <div className="mb-1">
        <Label>First Name</Label>
        <TextField fullWidth name="firstName" size="medium" placeholder="Ralph" />
      </div>

      <div className="mb-1">
        <Label>Last Name</Label>
        <TextField fullWidth name="lastName" size="medium" placeholder="Awards" />
      </div>

      <div className="mb-1">
        <Label>Nickname</Label>
        <TextField fullWidth name="nickname" size="medium" placeholder="ralph_awards" />
      </div>

      <div className="mb-1">
        <Label>Email Address</Label>
        <TextField
          fullWidth
          name="email"
          size="medium"
          type="email"
          placeholder="example@mail.com"
        />
      </div>

      <div className="mb-1">
        <Label>Phone Number (Optional)</Label>
        <TextField fullWidth name="phone" size="medium" placeholder="+1234567890" />
      </div>

      <div className="mb-1">
        <Label>Address (Optional)</Label>
        <TextField fullWidth name="address" size="medium" placeholder="Street, city, country" />
      </div>

      <div className="mb-1">
        <Label>Password</Label>
        <TextField
          fullWidth
          size="medium"
          name="password"
          placeholder="*********"
          type={visiblePassword ? "text" : "password"}
          slotProps={{ input: inputProps }}
        />
      </div>

      <div className="mb-1">
        <Label>Retype Password</Label>
        <TextField
          fullWidth
          size="medium"
          name="re_password"
          placeholder="*********"
          type={visiblePassword ? "text" : "password"}
          slotProps={{ input: inputProps }}
        />
      </div>

      <div className="agreement">
        <Checkbox
          name="agreement"
          size="small"
          color="secondary"
          label={
            <FlexBox flexWrap="wrap" alignItems="center" justifyContent="flex-start" gap={1}>
              <Box display={{ sm: "inline-block", xs: "none" }}>By signing up, you agree to</Box>
              <Box display={{ sm: "none", xs: "inline-block" }}>Accept Our</Box>
              <BoxLink title="Terms & Condition" href="/" />
            </FlexBox>
          }
        />
      </div>

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        loading={isSubmitting}
      >
        Create an Account
      </Button>
    </FormProvider>
  );
}
