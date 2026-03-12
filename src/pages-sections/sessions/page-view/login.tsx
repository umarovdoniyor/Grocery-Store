"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// GLOBAL CUSTOM COMPONENTS
import { TextField, FormProvider } from "components/form-hook";
// LOCAL CUSTOM COMPONENTS
import Label from "../components/label";
import EyeToggleButton from "../components/eye-toggle-button";
// LOCAL CUSTOM HOOK
import usePasswordVisible from "../use-password-visible";
// AUTH CONTEXT
import { useAuth } from "contexts/AuthContext";

// LOGIN FORM FIELD VALIDATION SCHEMA
const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  identifier: yup.string().trim().required("Email, phone, or nickname is required")
});

export default function LoginPageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading } = useAuth();
  const { visiblePassword, togglePasswordVisible } = usePasswordVisible();
  const [error, setError] = useState<string | null>(null);

  const initialValues = { identifier: "", password: "" };

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
    const loginIdentifier = values.identifier.trim();
    const result = await login(loginIdentifier, values.password);

    if (result.success) {
      router.push(redirectPath);
    } else {
      const message = result.error || "Login failed";
      setError(message);

      if (/suspended/i.test(message)) {
        setFieldError("identifier", {
          type: "server",
          message: "This account is suspended"
        });
      } else if (/blocked/i.test(message)) {
        setFieldError("identifier", {
          type: "server",
          message: "This account is blocked"
        });
      } else {
        const genericMessage = "Invalid credentials. Please check your identifier and password.";
        setFieldError("identifier", { type: "server", message: genericMessage });
        setFieldError("password", { type: "server", message: genericMessage });
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

      <div className="mb-1">
        <Label>Email, Phone Number, or Nickname</Label>
        <TextField
          fullWidth
          name="identifier"
          type="text"
          size="medium"
          placeholder="example@mail.com, +1234567890, or nickname"
        />
      </div>

      <div className="mb-2">
        <Label>Password</Label>
        <TextField
          fullWidth
          size="medium"
          name="password"
          autoComplete="current-password"
          placeholder="*********"
          type={visiblePassword ? "text" : "password"}
          slotProps={{
            input: {
              endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
            }
          }}
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
        Login
      </Button>
    </FormProvider>
  );
}
